import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Dimensions,
    StyleSheet,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import CustomImage from '@/components/ui/Image';
import CustomButton from '@/components/ui/Button';
import PostProfileSection from '@/components/Profile/PostProfileSection';
import HotTagsContent from '@/components/Group/HotTagsContent';

const width = Dimensions.get('screen').width;

const Group = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabsRef = useRef<Array<View | null>>([]);
    const indicatorWidth = useSharedValue(0);
    const indicatorPosition = useSharedValue(0);

    const tabs = [
        { id: 0, title: 'Tin mới nhất' },
        { id: 1, title: 'Tin hot trong ngày' },
        { id: 2, title: 'Người theo dõi' },
    ];

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: indicatorWidth.value,
            transform: [{ translateX: indicatorPosition.value }],
        };
    });

    const handleTabPress = (index: number) => {
        setActiveTab(index);
        if (tabsRef.current[index]) {
            tabsRef.current[index].measure((x, y, width, height, pageX, pageY) => {
                indicatorWidth.value = withSpring(width);
                indicatorPosition.value = withSpring(pageX, { duration: 1200 });
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary.background, paddingVertical: 16 }}>
            <ScrollView className="space-y-5">
                <View className="flex flex-row items-center space-x-3 h-10 px-4">
                    <TouchableOpacity onPress={() => router.navigate('/profile')}>
                        <CustomImage
                            source={require('@/assets/images/avatar.png')}
                            className="w-10 h-full rounded-full bg-[#F9DFC0]"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(modals)/newPost')}
                        className="bg-[#262D34] rounded-lg flex-1 h-full"
                    >
                        <Text className="p-2 font-light text-sm text-[#d9d9d9]">Bạn đang nghĩ gì</Text>
                    </TouchableOpacity>
                    <CustomButton type="primary" title="Đăng bài" className="h-full p-3" />
                </View>
                <View className="flex flex-row items-center justify-between">
                    {tabs.map((tab, index) => (
                        <Pressable
                            key={tab.id}
                            onPress={() => handleTabPress(index)}
                            className="px-3 py-2"
                            ref={(el) => (tabsRef.current[index] = el)}
                        >
                            <Text
                                className={`text-white font-medium text-sm ${
                                    activeTab === index ? 'opacity-100' : 'opacity-50'
                                }`}
                            >
                                {tab.title}
                            </Text>
                        </Pressable>
                    ))}
                    <Animated.View style={[styles.indicator, animatedStyles]} />
                </View>
                <View className="px-2">
                    <PostProfileSection />
                    <PostProfileSection />
                    <PostProfileSection />
                    <PostProfileSection />
                </View>

                <View className='px-4'>
                    <HotTagsContent />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    indicator: {
        height: 4,
        backgroundColor: Colors.primary.green,
        position: 'absolute',
        bottom: 0,
    },
});

export default Group;
