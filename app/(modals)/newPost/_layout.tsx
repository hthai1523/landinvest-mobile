import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router, Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/ui/Button';
import { usePostStore } from '@/store/postNewStore';
import { CreatePost } from '@/service';
import * as Location from 'expo-location';

const NewPostLayout = () => {
    const { value, images, setValue, setImages } = usePostStore();
    const [location, setLocation] = useState<{ latitude: number; longitude: number }>({ latitude: 105, longitude: 20 });
    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền bị từ chối', 'Cần có quyền truy cập vị trí để căn giữa bản đồ vào vị trí của bạn.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    };

    const centerToUserLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude });
        } catch (error) {
            console.error('Error getting user location: ', error);
            Alert.alert('Lỗi', 'Không xác định được vị trí hiện tại của bạn.');
        }
    };
    console.log(value.title, value.content)
    const handleSubmit = useCallback(async () => {
        try {
            // if (value.title && value.content) {
                const params = {
                    GroupID: 2,
                    Title: value.title,
                    Content: value.content,
                    HasTags: value.tags || [],
                    PostLongitude: 10,
                    PostLatitude: 100,
                    Images: images || [],
                };

                console.log(params)
                const res = await CreatePost(params);
                if (res && res.length > 0) {
                    router.push('/(tabs)/group');

                    // Alert.alert('Đăng bài thành công', 'Quay trở lại trang bài mới nhất', [
                    //     {
                    //         text: 'Hủy',
                    //         style: 'cancel',
                    //     },
                    //     {
                    //         text: 'Ok',
                    //         onPress: () => router.push('/(tabs)/group'),
                    //     },
                    // ]);
                }
            // } else {
            //     Alert.alert("Vui lòng điền đủ thông tin trước khi đăng bài")
            // }
        } catch (error) {
            Alert.alert('Đăng bài thất bại, vui lòng thử lại');
            console.log(error)
        }
    }, []);
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
                    headerRight: () => <CustomButton onPress={handleSubmit} title="Đăng bài" />,
                }}
            />
        </Stack>
    );
};

export default NewPostLayout;
