import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import Colors from '@/constants/Colors';
import { Hammer } from '@/assets/icons';
import AuctionsForm from '@/components/Auction/AuctionsForm';
import { BlurView } from 'expo-blur';

const Auction = () => {
    const [isBlur, setIsBlur] = useState<boolean>(false);

    const setIsBackDrop = (params: boolean) => {
        setIsBlur(params);
    };

    console.log(isBlur);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}

        >
            <ScrollView
                contentContainerStyle={{ padding: 12 }}
                style={{ flex: 1, backgroundColor: Colors.primary.background }}
                keyboardDismissMode="on-drag"
            >
                {isBlur && (
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
                )}
                <View
                    className="flex flex-row items-center justify-center p-2 rounded-[20px] mb-3"
                    style={{ backgroundColor: Colors.primary.header }}
                >
                    <Hammer />
                    <Text className="font-semibold text-2xl text-[#B7A800] ml-2">
                        THÔNG BÁO ĐẤU GIÁ
                    </Text>
                </View>
                <AuctionsForm setIsBackDrop={setIsBackDrop} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Auction;
