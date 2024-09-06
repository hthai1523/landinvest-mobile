import React, { useState } from 'react';
import { View, Button, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import LoginForm from '@/components/ui/LoginForm';
import SignUpForm from '@/components/ui/SignUpForm';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

const Auth = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <StatusBar hidden />
            {isLoginView ? (
                <LoginForm onChangeForm={() => setIsLoginView(false)} />
            ) : (
                <SignUpForm onChangeForm={() => setIsLoginView(true)} />
            )}
        </SafeAreaView>
    );
}


export default Auth;