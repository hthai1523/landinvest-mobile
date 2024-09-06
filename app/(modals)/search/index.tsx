import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import { PlaceResult } from '@/constants/interface';
import { LinearProgress } from '@rneui/themed';
import useSearchStore from '@/store/searchStore';
import ContextMenu from "react-native-context-menu-view";

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

    useEffect(() => {
        resetSearch();
    }, [resetSearch]);

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
        },
        [doSetSearchResult],
    );

    const handleLongPress = useCallback(() => {
      console.log("hello")
    }, [handleResultPress]);

    const renderSearchResult = useCallback(
        ({ item }: { item: PlaceResult }) => (
            <ContextMenu
                actions={[{ title: 'Title 1' }, { title: 'Title 2' }]}
                onPress={(e) => {
                    console.warn(`Pressed ${e.nativeEvent.name} at index ${e.nativeEvent.index}`);
                }}
            >
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => handleResultPress(item)}
            >
                <Feather name="map-pin" size={20} color="#fff" />
                    <Text style={{ color: '#fff', marginLeft: 8 }}>{item.display_name}</Text>
            </TouchableOpacity>
            </ContextMenu>
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
                        renderItem={renderSearchResult }
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
        </SafeAreaView>
    );
};

export default Search;
