import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { memo, useCallback } from 'react';
import { router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import useSearchStore from '@/store/searchStore';

import { useDebouncedCallback } from 'use-debounce';
const SearchLayout = () => {
    const doSearch = useSearchStore((state) => state.doSearch);

    const debouncedSearch = useDebouncedCallback((value) => {
        doSearch(value);
    }, 300);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Tìm kiếm địa điểm',
                    headerLargeTitle: Platform.OS === 'ios' ? true : false,
                    headerTintColor: '#d9d9d9',
                    headerStyle: {
                        backgroundColor: Colors.primary.header,
                    },
                    headerTitleAlign: 'center',
                    headerTransparent: true,
                    headerBlurEffect: 'regular',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex flex-row items-center"
                        >
                            <Feather name="chevron-left" size={20} color="#d9d9d9" />
                            <Text className="text-[#d9d9d9] ml-1 text-sm font-bold">Quay Lại</Text>
                        </TouchableOpacity>
                    ),
                    headerSearchBarOptions: {
                        placeholder: 'Tìm kiếm',
                        autoFocus: true,
                        barTintColor: '#d9d9d9',
                        // tintColor: '#d9d9d9',
                        cancelButtonText: 'Hủy',
                        onCancelButtonPress: () => doSearch(''),
                        onChangeText: (e) => debouncedSearch(e.nativeEvent.text),
                        headerIconColor: '#fff',
                    },
                }}
            />
        </Stack>
    );
};

export default memo(SearchLayout);
