import { View, StyleSheet, Image, Text } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Callout, MapPressEvent, Marker, UrlTile, Region, Polygon } from 'react-native-maps';
import axios from 'axios';
import removeAccents from 'remove-accents';
import { LocationData, PlaceResult } from '@/constants/interface';
import CustomCalloutView from './CustomCalloutView';

interface MapInterface {
  opacity: number;
  lat: number;
  lon: number;
  coordinates: PlaceResult['geojson']['coordinates'];
}

const MapPreview = ({ opacity, lat, lon, coordinates }: MapInterface) => {
  const mapRef = useRef<MapView>(null);
  
  const [districtName, setDistrictName] = useState<string>('');
  const [polygon, setPolygon] = useState<{ latitude: number; longitude: number }[] | null>(null);
  const [selectedIDQuyHoach, setSelectedIDQuyHoach] = useState<number | null>(null);
  const [selectedIdDistrict, setSelectedIdDistrict] = useState<number | null>(null);

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
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (mapRef.current) {
        try {
          const data = await mapRef.current.addressForCoordinate(location);
          if (data) {
            setDistrictName(data.subAdministrativeArea || '');
          } else {
            console.log('No address found');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      }
    };

    getData();
  }, [location]);

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
        setSelectedIdDistrict(data.Posts[0].idDistrict);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [districtName]);

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

      {selectedIDQuyHoach && (
        <UrlTile
          urlTemplate={`https://apilandinvest.gachmen.org/get_api_quyhoach/${selectedIDQuyHoach}/{z}/{x}/{y}`}
          maximumZ={22}
          opacity={opacity}
        />
      )}

      {polygon && (
        <Polygon
          coordinates={polygon}
          strokeColor="rgba(0, 0, 255, 0.9)"
          strokeWidth={3}
          geodesic={true}
          zIndex={1} // Make sure the polygon has a higher zIndex
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});

export default memo(MapPreview);