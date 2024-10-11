import { ScrollView, Image, View, Text, Pressable, Dimensions, StyleSheet, Alert, FlatList } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

import useAuthStore from '@/store/authStore';
import { Avatar } from '@rneui/themed';
import { Post, UserInfor } from '@/constants/interface';
import { useLocalSearchParams } from 'expo-router';
import { GetUserInfo, GetUserPosted } from '@/service';
import { StatusBar } from 'expo-status-bar';
import CustomImage from '@/components/ui/Image';
import PostProfileSection from '@/components/Profile/PostProfileSection';
import PostsPersonal from '@/components/Profile/PostsPersonal';
import PostsReaded from '@/components/Profile/PostsReaded';

const { width } = Dimensions.get('window');

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState(0);
    const translateX = useSharedValue(0);
    const contentTranslateX = useSharedValue(0);

    const [user, setUser] = useState<UserInfor>();
    const [userPosted, setUserPosted] = useState<Post[]>([]);

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

    useEffect(() => {
        const fetchUserInfor = async () => {
            try {
                const data = await GetUserInfo(id);
                setUser(data);
            } catch (error) {
                Alert.alert('Tìm kiếm người dùng thất bại', 'Vui lòng thử lại');
            }
        };

        fetchUserInfor();
    }, [id]);

    const RenderPostSectionProfile = () => {
        if (activeTab === 0) {
            return <PostsPersonal userIdParams={parseInt(id)} />;
        }
        if (activeTab === 1) {
            return <PostsReaded />;
        }
    };

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 12}}>
            <StatusBar style="dark" />
            <View className="relative">
                <Image source={require('@/assets/images/backgroundImage.png')} className="h-52 bg-[#d9d9d9]" />
                {user?.avatarLink ? (
                    <CustomImage
                        source={{ uri: user.avatarLink }}
                        className="w-36 h-36 rounded-full absolute -bottom-9 left-2 border-2 border-[#212121]"
                        sharedTransitionTag={`avatar-${user.userId}`}
                    />
                ) : (
                    <Avatar
                        size={144}
                        rounded
                        title={user?.FullName.slice(0, 1).toLocaleUpperCase()}
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
                        <Text style={[styles.text, activeTab === 1 && styles.activeText]}>Bài viết đã chia sẻ</Text>
                    </Pressable>
                    <Animated.View style={[styles.indicator, indicatorStyle]} />
                </View>
                <RenderPostSectionProfile />
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

    content: {
        width: width,
    },
});

export default Page;
