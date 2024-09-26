import { ScrollView, Image, View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import PostsPersonal from './PostsPersonal';
import PostsReaded from './PostsReaded';
import { callLogout } from '@/service';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import CustomImage from '../ui/Image';
import CustomButton from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '@/store/authStore';
import { Avatar } from '@rneui/themed';

const { width } = Dimensions.get('window');

const ProfileContent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const translateX = useSharedValue(0);
    const contentTranslateX = useSharedValue(0);

    const { user, logout } = useAuthStore.getState();

    const handlePress = (index: number) => {
        setActiveTab(index);
        translateX.value = withSpring(index * (width / 2), { duration: 1200 });
        contentTranslateX.value = withSpring(-index * width, { duration: 1200 });
    };

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const contentStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: contentTranslateX.value }],
        };
    });

    const RenderPosts = () => {
        if (activeTab === 0) {
            return <PostsPersonal />;
        }
        if (activeTab === 1) {
            return <PostsReaded />;
        }
    };

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            if (res && res.data.logout === true) {
                Alert.alert('Đăng xuất thành công');
                logout();
                router.navigate('/(tabs)/');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            // Show an error message or handle the error appropriately
            Alert.alert('Lỗi khi đăng xuất');
        }
    };

    return (
        <ScrollView>
            <View className="relative">
                <Image
                    // source={require('@/assets/images/User.jpg')}
                    className="h-52 bg-[#d9d9d9]"
                />
                {user?.avatarLink ? (
                    <Image
                        source={{ uri: user.avatarLink }}
                        className="w-36 h-36 rounded-full absolute -bottom-9 left-2 border-2 border-[#212121]"
                    />
                ) : (
                    <Avatar
                        size={144}
                        rounded
                        title={user?.Username.slice(0, 1).toLocaleUpperCase()}
                        containerStyle={{
                            backgroundColor: Colors.primary.green,
                            position: 'absolute',
                            bottom: -36,
                            left: 8,
                        }}
                    />
                )}
            </View>
            <View className="mt-14 space-y-4">
                <View className="px-4 flex flex-row items-end justify-between">
                    <View className="space-y-2">
                        <Text className="text-white font-bold text-2xl">{user?.FullName}</Text>
                        <Text className="text-white text-sm">Email: {user?.Email}</Text>
                        {user?.Phone && <Text className="text-white text-sm">Sđt: {user.Phone}</Text>}
                    </View>
                    {/* <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color="#d9d9d9" />
                    </TouchableOpacity> */}
                    {/* <CustomButton title="Đăng xuất" onPress={handleLogout} type="danger" /> */}
                </View>
                <View style={styles.tabContainer}>
                    <Pressable style={styles.tab} onPress={() => handlePress(0)}>
                        <Text style={[styles.text, activeTab === 0 && styles.activeText]}>Bài viết cá nhân</Text>
                    </Pressable>
                    <Pressable style={styles.tab} onPress={() => handlePress(1)}>
                        <Text style={[styles.text, activeTab === 1 && styles.activeText]}>Bài viết đã xem</Text>
                    </Pressable>
                    <Animated.View style={[styles.indicator, indicatorStyle]} />
                </View>
                <Animated.View style={[styles.contentContainer, contentStyle]}>
                    <View style={styles.content}>
                        <PostsPersonal />
                    </View>
                    <View style={styles.content}>
                        <PostsReaded />
                    </View>
                </Animated.View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
    },
    tab: {
        width: '50%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
        opacity: 0.5,
    },
    activeText: {
        fontWeight: 'bold',
        opacity: 1,
    },
    indicator: {
        height: 4,
        width: '50%',
        backgroundColor: Colors.primary.green,
        position: 'absolute',
        bottom: 0,
    },
    contentContainer: {
        flexDirection: 'row',
        width: '200%', // 2 tabs, mỗi tab chiếm 100% width
    },
    content: {
        width: width,
    },
});

export default ProfileContent;
