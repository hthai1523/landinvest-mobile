import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const LayoutSetting = () => {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: Colors.primary.background },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    presentation: 'card',
                    headerTitle: 'Các Box Group',
                    headerLargeTitle: true,
                    headerStyle: { backgroundColor: Colors.primary.header },
                    headerTintColor: '#d9d9d9',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="flex flex-row items-center">
                            <Feather name="chevron-left" size={20} color="#d9d9d9" />
                            <Text className="text-[#d9d9d9] ml-1 text-sm font-semibold">Quay Lại</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
};

export default LayoutSetting;
