import React from 'react';
import { View, Button, Alert, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { router, useSegments } from 'expo-router';
import ProfileContent from '@/components/Profile/ProfileContent';
import useAuthStore from '@/store/authStore';
import { callLogout } from '@/service';
import Colors from '@/constants/Colors';

export default function Profile() {
    const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
    const segments = useSegments();
    const { user } = useAuthStore.getState();

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            if (res && res.data.logout === true) {
                Alert.alert('Đăng xuất thành công');
                router.replace('/auth');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            // Show an error message or handle the error appropriately
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary.background }}>
            {true ? (
                <ProfileContent />
            ) : (
                <View className="items-center justify-center h-full space-y-3">
                    <Text className="text-white text-center font-bold">
                        Bạn cần Đăng nhập để xem thông tin bản thân
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(modals)/auth/')}
                        className={`bg-[${Colors.primary.green}] px-3 py-2 rounded`}
                    >
                        <Text className="text-white text-center font-bold">Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* <Button title="Logout" onPress={() => handleLogout()} /> */}
        </SafeAreaView>
    );
}
