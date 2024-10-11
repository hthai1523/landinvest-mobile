import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/ui/Button';
import { usePostStore } from '@/store/postNewStore';
import { CreatePost, ViewlistPost } from '@/service';
import * as Location from 'expo-location';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { Post } from '@/constants/interface';

const NewPostLayout = () => {
    const { value, images, reset } = usePostStore();
    const [location, setLocation] = useState({ latitude: 105, longitude: 20 });
    const { setDataList } = usePaginatedList<Post>(ViewlistPost);

    const {id} = useLocalSearchParams<{id: string}>()
    
    const requestLocationPermission = useCallback(async () => {
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
    }, []);

    const centerToUserLocation = useCallback(async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        try {
            const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        } catch (error) {
            console.error('Error getting user location: ', error);
            Alert.alert('Lỗi', 'Không xác định được vị trí hiện tại của bạn.');
        }
    }, [requestLocationPermission]);

    useEffect(() => {
        centerToUserLocation();
    }, [centerToUserLocation]);

    console.log(value.title, value.content);

    const handleSubmit = useCallback(async () => {
        try {
            if (!value.title || !value.content) {
                Alert.alert('Vui lòng điền đủ nội dung trước khi đăng bài');
                return;
            }

            const params = {
                GroupID: +id || 22,
                Title: value.title,
                Content: value.content,
                PostLongitude: location.longitude,
                PostLatitude: location.latitude,
                Hastags: value.tags || [],
                Images: images || [],
            };

            const res = await CreatePost(params);
            if (res && res.length > 0) {
                console.log(res[0]);
                setDataList((prevDataList) => [res[0], ...prevDataList]);
                Alert.alert('Đăng bài thành công', 'Quay trở lại trang bài mới nhất', [
                    {
                        text: 'Ok',
                        onPress: () => {
                            reset();
                            router.back();
                        },
                    },
                ]);
            }
        } catch (error) {
            Alert.alert('Đăng bài thất bại, vui lòng thử lại');
            console.error(error);
        }
    }, [value, images, location, reset]);

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
