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
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    useAnimatedRef,
    useScrollViewOffset,
    withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import CustomImage from '@/components/ui/Image';
import CustomButton from '@/components/ui/Button';
import PostProfileSection from '@/components/Profile/PostProfileSection';
import HotTagsContent from '@/components/Group/HotTagsContent';
import NewestPost from '@/components/Group/NewestPost';
import HotPostInDay from '@/components/Group/HotPostInDay';
import GroupPost from '@/components/Group/GroupPost';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('screen').width;

const Group = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabsRef = useRef<Array<View | null>>([]);
    const indicatorWidth = useSharedValue(0);
    const indicatorPosition = useSharedValue(0);

    const tabs = [
        { id: 0, title: 'Tin mới nhất' },
        { id: 1, title: 'Tin hot trong ngày' },
        { id: 2, title: 'Tất cả nhóm' },
    ];

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollHandler = useScrollViewOffset(scrollRef);

    const buttonToTopStyle = useAnimatedStyle(() => {
        return {
            opacity: scrollHandler.value > 600 ? withTiming(1) : withTiming(0),
        };
    });

    const scrollTop = () => {
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    };

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
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary.background }}>
            <ScrollView ref={scrollRef} className="space-y-5" contentContainerStyle={{ paddingVertical: 16 }}>
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
                            onLayout={(e) => (indicatorWidth.value = e.nativeEvent.layout.width)}
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
                    {activeTab === 0 && <NewestPost />}
                    {activeTab === 1 && <HotPostInDay />}
                    {activeTab === 2 && <GroupPost />}
                </View>

                {/* <View className='px-4'>
                    <HotTagsContent />
                </View> */}
            </ScrollView>

            <Animated.View style={[buttonToTopStyle, { position: 'absolute', bottom: 80, right: 20 }]}>
                <TouchableOpacity className="bg-white rounded-full p-2" onPress={scrollTop}>
                    <Ionicons name="chevron-up" size={24} color={Colors.primary.header} />
                </TouchableOpacity>
            </Animated.View>
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
