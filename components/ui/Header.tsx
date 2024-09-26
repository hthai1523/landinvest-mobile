import { Image, Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { Link, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';

export function Header() {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const [isProfileRoute, setIsProfileRoute] = useState(false);
    const isLoggedIn = useAuthStore.getState().isAuthenticated;

    useEffect(() => {
        setIsProfileRoute(segments.join('/') === '(tabs)/profile');
    }, [segments]);

    return (
        <SafeAreaView
            className={`flex flex-row justify-between items-center`}
            style={{
                paddingTop: insets.top,
                paddingBottom: 8,
                paddingHorizontal: 12,
                backgroundColor: Colors.primary.header,
            }}
        >
            <Pressable style={{ marginBottom: 4 }} onPress={() => router.navigate('/(tabs)/')}>
                <Image source={require('@/assets/images/logo.png')} />
            </Pressable>

            {isProfileRoute && isLoggedIn ? (
                <TouchableOpacity
                    className={`bg-[${Colors.primary.green}] px-3 py-2 rounded`}
                    onPress={() => router.push('/(modals)/setting')}
                >
                    <Octicons name="gear" size={20} color="#fff" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    className={`bg-[${Colors.primary.green}] px-3 py-2 rounded`}
                    onPress={() => router.push('/(modals)/search')}
                >
                    <Octicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}
