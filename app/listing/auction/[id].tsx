import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import CustomButton from '@/components/ui/Button';
import AvatarUser from '@/components/ui/AvatarUser';
import Colors from '@/constants/Colors';
import { AuctionDetailResponse, AuctionResponse } from '@/constants/interface';
import { fetchAuctionInfor } from '@/service';

const HEADER_SCROLL_TO_HEIGHT = 70;

const Auction = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);
    const insets = useSafeAreaInsets();

    const [auctionDetail, setAuctionDetail] = useState<AuctionDetailResponse>();

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [10, HEADER_SCROLL_TO_HEIGHT],
            ['transparent', Colors.primary.header],
        );
        return { backgroundColor };
    });

    const headerBackTitleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [10, HEADER_SCROLL_TO_HEIGHT],
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    useEffect(() => {
        const fetchAuctionDetail = async () => {
            const data = await fetchAuctionInfor(id);
            console.log('data', data);
            data && setAuctionDetail(data);
        };

        fetchAuctionDetail();
    }, [id]);

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <StatusBar style="dark" />
            <Animated.View
                style={[
                    headerAnimatedStyle,
                    {
                        position: 'absolute',
                        paddingTop: insets.top,
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        height: 72,
                    },
                ]}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="chevron-left" size={28} color={'#fff'} />
                    </TouchableOpacity>
                    <Animated.Text
                        style={[headerBackTitleAnimatedStyle, styles.backTitle]}
                        numberOfLines={1}
                    >
                        {auctionDetail?.AuctionAddress}
                    </Animated.Text>
                </View>
            </Animated.View>
            <Animated.ScrollView
                ref={scrollRef}
                onScroll={scrollHandler}
                contentContainerStyle={{ paddingVertical: 72, paddingHorizontal: 12 }}
            >
                <Text className="text-lg font-bold text-white pb-2">Chi tiết đấu giá</Text>
                <View className="flex " style={{}}>
                    <Text className="text-sm text-white pb-2">{auctionDetail?.Title}</Text>

                    <View className="bg-white p-1 rounded mb-2">
                        <Text className="text-sm">Ghi chú: {auctionDetail?.Note}</Text>
                        <Text className="text-sm">Lần đăng: Lần 1</Text>
                        <Text className="text-sm">Giá tiền: {auctionDetail?.DepositPrice}</Text>
                        <Text className="text-sm">
                            Ngày đăng công khai:{' '}
                            {auctionDetail?.EventSchedule &&
                                new Date(auctionDetail.EventSchedule).toLocaleString('vi-VN')}
                        </Text>
                    </View>

                    <Text className="text-[#8E9295] font-bold text-sm pb-2">
                        Thông tin người có tài sản
                    </Text>

                    <View className="pb-4 pl-3 ">
                        <Text className="text-white text-sm font-light">
                            Tên người có tài sản: 
                        </Text>
                        <Text className="uppercase font-semibold text-base text-white pb-3">
                            {auctionDetail?.NamePropertyOwner}
                        </Text>
                        <Text className="text-white text-sm font-light">Địa chỉ: </Text>
                        <Text className=" font-semibold text-base text-white">
                            {auctionDetail?.AddressPropertyOwner}
                        </Text>
                    </View>

                    <Text className="text-[#8E9295] font-bold text-sm pb-3">
                        Thông tin đơn vị tổ chức đấu giá
                    </Text>

                    <View className="pb-4 pl-3">
                        <Text className="text-white text-sm font-light">
                            Tên đơn vị tổ chức đấu giá:  
                        </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.NameAuctionHouse}
                        </Text>
                        <Text className="text-white text-sm font-light">Địa chỉ: </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.AuctionAddress}
                        </Text>
                        <Text className="text-sm font-light text-white">
                            Số điện thoại:{' '}
                            <Text className="font-bold text-sm">
                                {auctionDetail?.PhoneNumberAuctionHouse}
                            </Text>
                        </Text>
                    </View>

                    <Text className="text-[#8E9295] font-bold text-sm pb-3">
                        Thông tin việc đấu giá
                    </Text>

                    <View className="pb-4 pl-3 ">
                        <Text className="text-white text-sm  font-light">
                            Địa điểm tổ chức cuộc đấu giá:
                        </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.AddressAuctionHouse}
                        </Text>
                        <Text className="text-white text-sm font-light">
                            Thời gian bắt đầu đăng ký tham gia đấu giá: 
                        </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.RegistrationStartTime &&
                                new Date(auctionDetail.RegistrationStartTime).toLocaleString(
                                    'vi-VN',
                                )}
                        </Text>

                        <Text className="text-white text-sm font-light">
                            Thời gian Kết Thúc đăng ký tham gia đấu giá: 
                        </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.RegistrationEndTime &&
                                new Date(auctionDetail.RegistrationEndTime).toLocaleString('vi-VN')}
                        </Text>
                        <Text className="text-white text-sm font-light">
                            Địa điểm, điều kiện, cách thức đăng ký: 
                        </Text>
                        <Text className=" font-semibold text-base text-white pb-3">
                            {auctionDetail?.Description}
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    backTitle: {
        marginLeft: 12,
        color: '#fff',
        width: '90%',
    },
    detailContainer: {
        padding: 12,
    },
    title: {
        color: '#f9f9f9',
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        color: '#adadad',
        fontSize: 14,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    joinButton: {
        flex: 1,
        marginRight: 6,
        backgroundColor: '#DEE0E7',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    inviteButton: {
        flex: 1,
        marginLeft: 6,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    thoughtSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    inputButton: {
        flex: 1,
        backgroundColor: '#262D34',
        borderRadius: 8,
        padding: 12,
        marginLeft: 12,
    },
    inputText: {
        color: '#d9d9d9',
        fontSize: 14,
    },
});

export default Auction;
