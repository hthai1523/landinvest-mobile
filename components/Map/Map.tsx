import { View, StyleSheet, Image, Text } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Callout, MapPressEvent, Marker, UrlTile, Region, Polygon } from 'react-native-maps';
import useSearchStore from '@/store/searchStore';
import axios from 'axios';
import removeAccents from 'remove-accents';
import { Badge } from '@rneui/themed';
import { LocationData } from '@/constants/interface';
import useMarkerStore from '@/store/quyhoachStore';
import selectFilteredMarkers from '@/store/filterSelectors';
import useFilterStore from '@/store/filterStore';
import CustomCalloutView from './CustomCalloutView';

interface MapInterface {
    opacity: number;
    lat: number;
    lon: number;
    setLocationInfo: (data: LocationData) => void;
    locationInfo: LocationData | null;
}

const Map = ({ opacity, lat, lon, setLocationInfo, locationInfo }: MapInterface) => {
    const mapRef = useRef<MapView>(null);
    const [districtName, setDistrictName] = useState<string>('');
    const [idDistrictForMarker, setIdDistrictForMarker] = useState<number | null>();
    const [polygon, setPolygon] = useState<{ latitude: number; longitude: number }[] | null>(null);
    const [selectedIDQuyHoach, setSelectedIDQuyHoach] = useState<number | null>(null);
    const listMarker = useMarkerStore((state) => state.listMarkers);
    const doSetDistrictId = useSearchStore((state) => state.doSetDistrictId);
    const selectedIdDistrict = useSearchStore((state) => state.districtId);
    const doSetListMarkers = useMarkerStore((state) => state.doSetListMarkers);
    const coordinates = useSearchStore((state) => state.coordinates);
    const getAllFilter = useFilterStore((state) => state.getAllFilters);

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

    const handleMapPress = useCallback(
        (e: MapPressEvent) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setLocation({ latitude, longitude });
            moveToLocation(latitude, longitude);
        },
        [moveToLocation],
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
                    } else {
                        console.log('No address found');
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

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            }}
            showsUserLocation
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

            {selectedIDQuyHoach && (
                <UrlTile
                    urlTemplate={`https://apilandinvest.gachmen.org/get_api_quyhoach/${selectedIDQuyHoach}/{z}/{x}/{y}`}
                    maximumZ={22}
                    opacity={opacity}
                />
            )}

            {polygon && (
                <Polygon style={{zIndex: 99999}} coordinates={polygon} strokeColor="rgba(0, 0, 255, 0.9)" strokeWidth={3} geodesic={true} />
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

export default memo(Map);
