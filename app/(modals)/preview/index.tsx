import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

const Page = () => {
    const { image } = useLocalSearchParams<{ image: string }>();
    console.log(image)
    return (
        <SafeAreaView className="flex-1 relative">
            <StatusBar hidden />
            <TouchableOpacity onPress={() => router.back()} className="flex flex-row items-center absolute top-5 left-2 z-50">
                <Feather name="chevron-left" size={20} />
                <Text className='font-normal text-sm'>Quay lại</Text>
            </TouchableOpacity>
            <WebView
                style={{ flex: 1 }}
                source={{ uri: `https://web-view360-image.vercel.app/?image=${image}` }}
                renderLoading={() => <ActivityIndicator size={30} />}
            />
        </SafeAreaView>
    );
};

export default Page;
