import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/ui/Button';

const NewPostLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerStyle: { backgroundColor: Colors.primary.header },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="flex flex-row items-center">
                            <Feather name="x" size={20} color="#d9d9d9" />
                        </TouchableOpacity>
                    ),
                    headerTitle: 'Tạo bài viết mới',
                    headerTitleStyle: { color: '#fff' },
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                    headerRight: () => <CustomButton title="Đăng bài" />,
                }}
            />
        </Stack>
    );
};

export default NewPostLayout;