import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import { PlaceResult } from '@/constants/interface';
import { LinearProgress } from '@rneui/themed';
import useSearchStore from '@/store/searchStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Map from '@/components/Map/Map';
import MapPreview from '@/components/Map/MapPreview';
import Modal from 'react-native-modal';
import { BlurView } from 'expo-blur';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const params = {
    format: 'json',
    addressdetails: '1',
    polygon_geojson: '1',
};

const Search = () => {
    const searchValue = useSearchStore((state) => state.searchQuery);
    const resetSearch = useSearchStore((state) => state.resetSearch);
    const doSetSearchResult = useSearchStore((state) => state.doSetSearchResult);

    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<PlaceResult[]>([]);
    const [previewItem, setPreviewItem] = useState<PlaceResult | null>(null);

    useEffect(() => {
        const handleGetData = async () => {
            if (searchValue) {
                try {
                    setIsLoading(true);
                    const { data } = await axios.get(
                        `${NOMINATIM_BASE_URL}${new URLSearchParams({
                            ...params,
                            q: searchValue,
                        }).toString()}`,
                    );

                    const filteredData = data.filter((item: PlaceResult) => item.geojson?.type === 'Polygon');
                    setSearchResult(filteredData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResult([]);
            }
        };

        handleGetData();
    }, [searchValue]);

    const handleResultPress = useCallback(
        (result: PlaceResult) => {
            doSetSearchResult({
                lat: result?.lat,
                lon: result?.lon,
                boundingbox: result?.boundingbox,
                coordinates: result?.geojson.coordinates,
                districtId: null,
                searchQuery: '',
            });
            router.push('/(tabs)');
            resetSearch();
        },
        [doSetSearchResult],
    );

    const handleLongPress = useCallback((item: PlaceResult) => {
        setPreviewItem(item);
    }, []);

    const closePreview = () => {
        setPreviewItem(null);
    };
    const renderSearchResult = useCallback(
        ({ item }: { item: PlaceResult }) => (
            <TouchableOpacity
                className="py-3 px-6 mx-2 mt-2 rounded flex flex-row items-center space-x-2"
                style={{ backgroundColor: Colors.primary.header }}
                onPress={() => handleResultPress(item)}
                onLongPress={() => handleLongPress(item)}
                delayLongPress={500}
            >
                <Feather name="map-pin" size={20} color="#fff" />
                <Text className="text-white">{item.display_name}</Text>
            </TouchableOpacity>
        ),
        [handleResultPress],
    );

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: Colors.primary.background }}>
            <Stack.Screen
                options={{
                    headerBackTitle: 'Quay lại',
                }}
            />
            <View>
                {isLoading ? (
                    <LinearProgress
                        color={Colors.primary.green}
                        style={{ position: 'absolute', top: 0 }}
                        variant="indeterminate"
                    />
                ) : (
                    <FlatList
                        data={searchResult}
                        renderItem={renderSearchResult}
                        keyExtractor={(item, index) => `${item.place_id}-${index}`}
                        style={{ paddingTop: 8, height: '100%' }}
                        keyboardDismissMode="on-drag"
                        ListEmptyComponent={
                            searchResult && searchResult.length > 0 ? (
                                <Text style={{ textAlign: 'center', color: '#fff' }}>No results found</Text>
                            ) : null
                        }
                    />
                )}
            </View>

            {previewItem && (
                <>
                    <BlurView
                        intensity={20}
                        tint="regular"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                        }}
                    />
                    <Modal
                        hasBackdrop={true}
                        backdropOpacity={0}
                        hideModalContentWhileAnimating={true}
                        animationIn={'fadeInUp'}
                        animationOut={'fadeOutDown'}
                        useNativeDriverForBackdrop={true}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        // backdropTransitionInTiming={1}
                        // backdropTransitionOutTiming={1}
                        isVisible={true}
                        onBackdropPress={closePreview}
                    >
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 5,
                                borderRadius: 10,
                                width: '100%',
                                height: '50%',
                            }}
                        >
                            <MapPreview
                                opacity={1}
                                lat={previewItem.lat}
                                lon={previewItem.lon}
                                coordinates={previewItem.geojson?.coordinates}
                            />
                        </View>
                    </Modal>
                </>
            )}
        </SafeAreaView>
    );
};

export default Search;
