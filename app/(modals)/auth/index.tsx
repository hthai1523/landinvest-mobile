import React, { useState } from 'react';
import { View, Button, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import LoginForm from '@/components/ui/LoginForm';
import SignUpForm from '@/components/ui/SignUpForm';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Auth = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
            <StatusBar style="light" />
            <TouchableOpacity onPress={() => router.back()} style={{position: 'absolute', top: insets.top, zIndex: 9999}} className='flex flex-row items-center'>
                <Ionicons name="chevron-back" color={'#fff'} size={24} />
                <Text className='text-white font-normal'>Quay lại</Text>
            </TouchableOpacity>
            {isLoginView ? (
                <LoginForm onChangeForm={() => setIsLoginView(false)} />
            ) : (
                <SignUpForm onChangeForm={() => setIsLoginView(true)} />
            )}
        </SafeAreaView>
    );
};

export default Auth;
