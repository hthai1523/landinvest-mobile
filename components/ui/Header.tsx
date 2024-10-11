import { Image, Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { Link, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';

export function Header() {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const [isProfileRoute, setIsProfileRoute] = useState(false);
    const [isGroupRoute, setIsGroupRoute] = useState(false);
    const isLoggedIn = useAuthStore.getState().isAuthenticated;

    useEffect(() => {
        setIsProfileRoute(segments.join('/') === '(tabs)/profile');
        setIsGroupRoute(segments.join('/') === '(tabs)/group');
    }, [segments]);

    const RenderRightButtons = () => {
        if (!isLoggedIn) {
            return (
                <TouchableOpacity
                    className={`bg-[${Colors.primary.green}] px-3 py-2 rounded mr-3`}
                    onPress={() => router.push('/(modals)/search')}
                >
                    <Octicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            );
        }

        if (isProfileRoute) {
            return (
                <TouchableOpacity
                    className={`bg-[${Colors.primary.green}] px-3 py-2 rounded mr-3`}
                    onPress={() => router.push('/(modals)/setting')}
                >
                    <Octicons name="gear" size={20} color="#fff" />
                </TouchableOpacity>
            );
        }

        if (isGroupRoute) {
            return (
                <TouchableOpacity
                    className={`bg-[${Colors.primary.green}] px-3 py-2 rounded mr-3`}
                    onPress={() => router.push('/(modals)/groupSetting')}
                >
                    <Octicons name="gear" size={20} color="#fff" />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                className={`bg-[${Colors.primary.green}] px-3 py-2 rounded mr-3`}
                onPress={() => router.push('/(modals)/search')}
            >
                <Octicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView
            className=""
            style={{
                paddingTop: insets.top,
                paddingBottom: 8,
                paddingHorizontal: 16, 
                backgroundColor: Colors.primary.header,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Pressable style={{ marginBottom: 4, marginLeft: 12}} onPress={() => router.navigate('/(tabs)/')}>
                <Image source={require('@/assets/images/logo.png')} />
            </Pressable>

            <RenderRightButtons />
        </SafeAreaView>
    );
}
