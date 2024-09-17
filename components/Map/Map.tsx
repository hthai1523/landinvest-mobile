import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Callout, MapPressEvent, Marker, UrlTile, Region, Polygon, Polyline } from 'react-native-maps';
import useSearchStore from '@/store/searchStore';
import axios from 'axios';
import removeAccents from 'remove-accents';
import { Divider } from '@rneui/themed';
import { LocationData } from '@/constants/interface';
import useMarkerStore from '@/store/quyhoachStore';
import selectFilteredMarkers from '@/store/filterSelectors';
import useFilterStore from '@/store/filterStore';
import CustomCalloutView from './CustomCalloutView';
import { CheckpointsIcon, RecyclebinIcon } from '@/assets/icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { calcArea } from '@/functions/calcArea';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheetAddLocation from '../ui/BottomSheetAddLocation';
import useAuthStore from '@/store/authStore';
import { router } from 'expo-router';

interface MapInterface {
    opacity: number;
    lat: number;
    lon: number;
    setLocationInfo: (data: LocationData) => void;
    locationInfo: LocationData | null;
}

const Map = ({ opacity, lat, lon, setLocationInfo, locationInfo }: MapInterface) => {
    const mapRef = useRef<MapView>(null);

    const { dismiss } = useBottomSheetModal();
    const sheetRef = useRef<BottomSheetModal>(null);
    
    const [districtName, setDistrictName] = useState<string>('');
    const [idDistrictForMarker, setIdDistrictForMarker] = useState<number | null>();
    const [polygon, setPolygon] = useState<{ latitude: number; longitude: number }[] | null>(null);
    const [selectedPolygon, setSelectedPolygon] = useState<{ latitude: number; longitude: number }[] | null>(null);
    const [selectedIDQuyHoach, setSelectedIDQuyHoach] = useState<number | null>(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
    const [isDraw, setIsDraw] = useState<boolean>(false);
    const [polygonArea, setPolygonArea] = useState<number | null>(null);
    const [latLon, setLatLon] = useState<{lat: number, lon: number}>()

    const listMarker = useMarkerStore((state) => state.listMarkers);
    const doSetDistrictId = useSearchStore((state) => state.doSetDistrictId);
    const selectedIdDistrict = useSearchStore((state) => state.districtId);
    const doSetListMarkers = useMarkerStore((state) => state.doSetListMarkers);
    const coordinates = useSearchStore((state) => state.coordinates);
    const isLoggedIn = useAuthStore((state) => state.isAuthenticated)
    const { getAllFilter } = useFilterStore((state) => ({
        getAllFilter: state.getAllFilters,
    }));
    let filters = getAllFilter();

    const [location, setLocation] = useState({
        latitude: 21.16972,
        longitude: 105.84944,
    });

    const [region, setRegion] = useState<Region>({
        latitude: 21.16972,
        longitude: 105.84944,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    const moveToLocation = useCallback(
        (latitude: number, longitude: number) => {
            if (mapRef.current) {
                mapRef.current.animateToRegion(
                    {
                        latitude,
                        longitude,
                        latitudeDelta: region.latitudeDelta,
                        longitudeDelta: region.longitudeDelta,
                    },
                    200,
                );
            }
        },
        [region.latitudeDelta, region.longitudeDelta],
    );

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền bị từ chối', 'Cần có quyền truy cập vị trí để căn giữa bản đồ vào vị trí của bạn.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    };

    const centerToUserLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude });
            moveToLocation(latitude, longitude); // Center the map
        } catch (error) {
            console.error('Error getting user location: ', error);
            Alert.alert('Lỗi', 'Không xác định được vị trí hiện tại của bạn.');
        }
    };
    const handleMapPress = useCallback(
        (e: MapPressEvent) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            
            if (isDraw) {
                setSelectedCoordinates((prevCoordinates = []) => {
                    if (!Array.isArray(prevCoordinates)) {
                        prevCoordinates = [];
                    }

                    if (prevCoordinates.length === 0) {
                        return [{ latitude, longitude }];
                    }

                    const isClosingPolygon =
                        prevCoordinates.length > 2 &&
                        Math.abs(prevCoordinates[0].latitude - latitude) < 0.0001 &&
                        Math.abs(prevCoordinates[0].longitude - longitude) < 0.0001;

                    if (isClosingPolygon) {
                        const closedPolygon = [...prevCoordinates, prevCoordinates[0]];
                        setSelectedPolygon(closedPolygon);
                        const area = calcArea(closedPolygon);
                        setPolygonArea(area);
                        return closedPolygon;
                    }

                    return [...prevCoordinates, { latitude, longitude }];
                });
            } else {
                const isNearFilteredMarker = filteredMarkers.some((marker) => {
                    return (
                        Math.abs(marker.latitude - latitude) < 0.0001 && Math.abs(marker.longitude - longitude) < 0.0001
                    );
                });

                if (!isNearFilteredMarker) {
                    setLatLon({ lat: latitude, lon: longitude })
                    setLocation({ latitude, longitude });
                    moveToLocation(latitude, longitude);
                }
            }
        },
        [isDraw, moveToLocation],
    );

    const handleRegionChange = useCallback((newRegion: Region) => {
        setRegion(newRegion);
        onMapMoveEnd(newRegion);
    }, []);

    useEffect(() => {
        const getData = async () => {
            if (mapRef.current) {
                try {
                    const data = await mapRef.current.addressForCoordinate(location);
                    if (data) {
                        setDistrictName(data.subAdministrativeArea || '');
                        setLocationInfo(data as LocationData); // Casting to LocationData interface
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                }
            }
        };

        getData();
    }, [location, setLocationInfo]);

    useEffect(() => {
        const getData = async () => {
            if (selectedIdDistrict) {
                try {
                    const { data } = await axios.get(
                        `https://apilandinvest.gachmen.org/quyhoach1quan/${selectedIdDistrict}`,
                    );
                    if (data && data.length > 0) {
                        setSelectedIDQuyHoach(data[0]?.id);
                    } else {
                        setSelectedIDQuyHoach(null);
                    }
                } catch (error) {
                    console.error('Error fetching district data:', error);
                }
            }
        };

        getData();
    }, [selectedIdDistrict]);

    useEffect(() => {
        const getData = async () => {
            try {
                if (!districtName) return;
                const apiName = removeAccents(districtName.toLowerCase());
                const { data } = await axios.get(`https://apilandinvest.gachmen.org/quyhoach/search/${apiName}`);
                doSetDistrictId(data.Posts[0].idDistrict);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, [districtName, doSetDistrictId]);

    useMemo(() => {
        if (lat !== 0 && lon !== 0) {
            setLocation({ latitude: lat, longitude: lon });
        }
    }, [lat, lon]);

    useEffect(() => {
        setPolygon(
            coordinates && coordinates.length > 0 && Array.isArray(coordinates[0])
                ? coordinates[0].map((coord: [number, number]) => ({
                      latitude: coord[1], // reverse order
                      longitude: coord[0],
                  }))
                : null,
        );
    }, [coordinates]);

    const filteredMarkers = useMemo(() => {
        return selectFilteredMarkers({ listMarker, filters });
    }, [listMarker, filters]);

    const onMapMoveEnd = async (newRegion: Region) => {
        const { latitude, longitude } = newRegion;
        if (mapRef.current) {
            try {
                const data = await mapRef.current.addressForCoordinate({ latitude, longitude });
                if (data) {
                    const districtName = data.subAdministrativeArea || '';
                    setLocationInfo(data as LocationData);
                    const apiName = removeAccents(districtName.toLowerCase());
                    const response = await axios.get(`https://apilandinvest.gachmen.org/quyhoach/search/${apiName}`);
                    const newDistrictId = response.data.Posts[0]?.idDistrict;
                    setIdDistrictForMarker(newDistrictId || null);
                } else {
                    console.log('No address found');
                }
            } catch (error) {
                console.error('Error fetching address or district ID:', error);
            }
        }
    };

    useEffect(() => {
        if (!idDistrictForMarker) return;

        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `https://apilandinvest.gachmen.org/api/location/list_info_by_district/${idDistrictForMarker}`,
                );
                doSetListMarkers(data.data || null);
            } catch (error) {
                console.error('Error fetching data:', error);
                doSetListMarkers(null);
            }
        };

        fetchData();
    }, [idDistrictForMarker]);

    const handleCheckPointsPress = () => {
        setIsDraw((prevIsDraw) => {
            if (!prevIsDraw) {
                setSelectedCoordinates([]);
                setSelectedPolygon(null);
                setPolygonArea(null);
            }
            return !prevIsDraw;
        });
    };

    const handleAddLocation = () => {
        if(isLoggedIn) {

            sheetRef.current?.present()
        } else {
            Alert.alert("Bạn cần đăng nhập để thêm mảnh đất muốn bán", "Chuyển đến trang đăng nhập", [
                {
                    text: 'Ok',
                    onPress: () => router.navigate('/(modals)/auth')
                }
            ])
        }
    }

    return (
        <>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                }}
                // showsUserLocation
                mapType="hybrid"
                ref={mapRef}
                onPress={handleMapPress}
                onRegionChangeComplete={handleRegionChange}
            >
                <Marker coordinate={location} title="Marker Title" description="Marker Description">
                    <Image
                        source={require('@/assets/images/marker.png')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </Marker>

                {filteredMarkers &&
                    filteredMarkers.length > 0 &&
                    filteredMarkers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title="Marker Title 1"
                            description="Marker Description"
                        >
                            <Image
                                source={require('@/assets/images/markerLocation.png')}
                                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                            />
                            <Callout>
                                <CustomCalloutView marker={marker} />
                            </Callout>
                        </Marker>
                    ))}

                {selectedCoordinates &&
                    selectedCoordinates.length > 0 &&
                    selectedCoordinates.map((marker, index) => (
                        <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} />
                    ))}

                {selectedIDQuyHoach && (
                    <UrlTile
                        urlTemplate={`https://apilandinvest.gachmen.org/get_api_quyhoach/${selectedIDQuyHoach}/{z}/{x}/{y}`}
                        maximumZ={22}
                        opacity={opacity}
                        zIndex={-2}
                    />
                )}

                {polygon && (
                    <Polygon
                        style={{ zIndex: 1 }}
                        coordinates={polygon}
                        strokeColor="rgba(0, 0, 255, 0.9)"
                        strokeWidth={3}
                        geodesic={true}
                    />
                )}
                {selectedCoordinates.length > 1 && (
                    <Polyline
                        coordinates={selectedCoordinates}
                        strokeColor="rgba(0, 0, 255, 0.9)" // Màu xanh dương
                        strokeWidth={3}
                    />
                )}

                {/* Hiển thị đa giác nếu đã vẽ xong */}
                {selectedPolygon && (
                    <Polygon
                        coordinates={selectedPolygon}
                        strokeColor="rgba(255, 0, 0, 0.9)" // Màu đỏ
                        strokeWidth={3}
                        fillColor="rgba(255, 182, 193, 0.5)" // Màu hồng nhạt có độ trong suốt
                    />
                )}
            </MapView>
            <View className={'flex flex-row items-center  space-x-2 p-1 absolute bottom-12 right-9'}>
                {polygonArea && (
                    <View className="bg-white p-2 rounded-md border">
                        <Text className="text-black text-sm font-medium">{polygonArea.toFixed(0)} m²</Text>
                    </View>
                )}
                <View className={'flex flex-row items-center bg-white rounded-md border  '}>
                    <TouchableOpacity
                        onPress={handleCheckPointsPress}
                        className={`py-1 px-2  ${isDraw && 'bg-[#d9d9d9]'}`}
                    >
                        <CheckpointsIcon />
                    </TouchableOpacity>

                    <Divider orientation="vertical" />
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCoordinates([]);
                            setSelectedPolygon(null);
                            setPolygonArea(null);
                            setIsDraw(false);
                        }}
                        className={'py-1 px-2'}
                    >
                        <RecyclebinIcon />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className={'p-2 bg-white rounded-full  border'} onPress={centerToUserLocation}>
                    <SimpleLineIcons name="cursor" size={20} color="black" />
                </TouchableOpacity>

                <TouchableOpacity className={'p-2 bg-white rounded-full  border'} onPress={handleAddLocation}>
                    <Feather name="plus" size={20} color="black" />
                </TouchableOpacity>
            </View>
            <BottomSheetAddLocation ref={sheetRef} dismiss={dismiss} lat={location.latitude} lon={location.longitude} />
        </>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

export default memo(Map);
