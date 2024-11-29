import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    CheckUserJoinGroup,
    GetGroupDetail,
    GetPostByGroupId,
    JoinGroup,
    LeaveGroup,
} from '@/service';
import { Group, Post } from '@/constants/interface';
import PostProfileSection from '@/components/Profile/PostProfileSection';
import Colors from '@/constants/Colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomImage from '@/components/ui/Image';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useScrollViewOffset,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { AnimatedSafeView, AnimatedTouchableOpacity } from '@/components/ui/AnimatedComponents';
import { calcDate } from '@/functions/calcDate';
import CustomButton from '@/components/ui/Button';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import useAuthStore from '@/store/authStore';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import GroupBottomSheet from '@/components/Group/GroupBottomSheet';
import BottomSheetAddPeople from '@/components/Group/BottomSheetAddPeople';
import AvatarUser from '@/components/ui/AvatarUser';

const HEADER_IMAGE_HEIGHT = 208;

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [groupDetail, setGroupDetail] = useState<Group | undefined>();
    const [isJoinGroup, setIsJoinGroup] = useState<boolean>(false);
    const [isLoadingJoinGroup, setIsLoadingJoinGroup] = useState<boolean>(false);

    const scrollRef = useAnimatedRef<Animated.FlatList<Post>>();
    const scrollY = useSharedValue(0);
    const { dismiss } = useBottomSheetModal();
    const sheetRef = useRef<BottomSheetModal>(null);
    const sheetAddPeopleRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const userId = useAuthStore.getState().userId;
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const user = useAuthStore.getState().user;

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [80, HEADER_IMAGE_HEIGHT],
            ['transparent', Colors.primary.header],
        );

        return {
            backgroundColor: backgroundColor,
        };
    });

    const headerBackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(scrollY.value, [0, HEADER_IMAGE_HEIGHT], ['#fff', '#000']);

        return {
            color: color,
        };
    });
    const headerBackTitleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [80, HEADER_IMAGE_HEIGHT],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            opacity: opacity,
        };
    });

    const handleToNewPost = () => {
        if (isAuthenticated) {
            router.navigate({
                pathname: '/(modals)/newPost/',
                params: {
                    id: id
                }
            });
        } else {
            Alert.alert('Bạn phải đăng nhập để đăng bài');
        }
    };

    useEffect(() => {
        const getGroup = async () => {
            const data = await GetGroupDetail(Number(id));
            if (userId) {
                const isJoin = await CheckUserJoinGroup(+userId, +id);
                if (isJoin.message.includes('The user has joined the group.')) {
                    setIsJoinGroup(true);
                }
            }
            data && setGroupDetail(data);
        };

        getGroup();
    }, [id, userId]);

    const { dataList, isLoading, totalPage, page, flatListRef, handlePageChange, getVisiblePages } =
        usePaginatedList<Post>(() => GetPostByGroupId(id, page), 1);

    const joinGroup = async () => {
        try {
            if (isJoinGroup === false && userId && isAuthenticated) {
                setIsLoadingJoinGroup(true);
                const data = await JoinGroup(+userId, +id);
                data.message.includes('Join group successful') && setIsJoinGroup(true);
            }

            if(isJoinGroup === false && isAuthenticated === false ) {
                Alert.alert('Phải đăng nhập để vào group', "", [
                    {
                        text: "Ok",
                        onPress: () => router.navigate('/(modals)/auth/')
                    }
                ]);
            }
            sheetRef.current?.present()
        } catch (error) {
            Alert.alert('Tham gia group thất bại');
        } finally {
            setIsLoadingJoinGroup(false);
        }
    };

    const onLeaveGroup = async () => {
        try {
            if (isJoinGroup && userId) {
                setIsLoadingJoinGroup(true);
                const data = await LeaveGroup(+userId, +id);
                data.message.includes('Leave group successful') && setIsJoinGroup(false);
            } else {
                sheetRef.current?.dismiss();
            }
        } catch (error) {
            Alert.alert('Rời group thất bại');
        } finally {
            setIsLoadingJoinGroup(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            {/* header */}
            <AnimatedSafeView
                style={[
                    headerAnimatedStyle,
                    {
                        position: 'absolute',
                        paddingTop: insets.top,
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        height: 72
                    },
                ]}
            >
                <View className="p-3 flex flex-row items-center space-x-2">
                    <AnimatedTouchableOpacity onPress={() => router.back()}>
                        <Feather name="chevron-left" size={28} color={'#fff'} />
                    </AnimatedTouchableOpacity>
                    <Animated.Text style={[headerBackTitleAnimatedStyle, styles.backTitile]}>
                        {groupDetail?.GroupName}
                    </Animated.Text>
                </View>
            </AnimatedSafeView>

            <Animated.FlatList
                data={dataList}
                ref={scrollRef}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                renderItem={({ item }) => <PostProfileSection post={item} />}
                keyExtractor={(item, index) => item.PostID.toString() + index}
                contentContainerStyle={{ padding: 12 }}
                ListEmptyComponent={() => (
                    <Text className="text-center text-white">Hiện tại chưa có bài viết nào</Text>
                )}
                ListFooterComponent={() =>
                    dataList.length > 0 && (
                        <View className="flex flex-row justify-center items-center space-x-2 my-2">
                            <CustomButton
                                disabled={page <= 1}
                                onPress={() => handlePageChange(page - 1)}
                                title="Trang trước"
                                className={`${page <= 1 && 'bg-[#d9d9d9]'}`}
                                textClassName={`${page <= 1 && 'text-black'}`}
                            />

                            {getVisiblePages().map((pageNum) => (
                                <CustomButton
                                    title={pageNum.toString()}
                                    key={pageNum}
                                    onPress={() => handlePageChange(pageNum)}
                                    className={`bg-[${
                                        pageNum === page ? Colors.primary.green : '#d9d9d9'
                                    }]`}
                                />
                            ))}

                            <CustomButton
                                title="Trang tiếp"
                                onPress={() => handlePageChange(page + 1)}
                                className={`${page === totalPage && 'bg-[#d9d9d9]'}`}
                                textClassName={`${page === totalPage && 'text-black'}`}
                                disabled={page === totalPage}
                            />
                        </View>
                    )
                }
                ListHeaderComponentStyle={{
                    marginTop: -12,
                    marginHorizontal: -12,
                    marginBottom: 12,
                }}
                ListHeaderComponent={() => (
                    <>
                        <View
                            className=""
                            style={{ position: 'relative', height: HEADER_IMAGE_HEIGHT }}
                        >
                            <Image
                                source={require('@/assets/images/backgroundImage.png')}
                                style={{ height: '100%' }}
                                resizeMode='cover'
                            />
                        </View>
                        <View className="mx-3 mt-3 space-y-3">
                            <Text className="text-[#f9f9f9] font-bold text-lg">
                                {groupDetail?.GroupName}
                            </Text>
                            <Text className="text-[#adadad] font-normal text-sm">
                                Được tạo vào: {calcDate(groupDetail?.CreateAt)}
                            </Text>

                            <View className="flex flex-row items-center justify-center space-x-3 w-full">
                                <TouchableOpacity
                                    onPress={joinGroup}
                                    className="rounded-md bg-[#DEE0E7] flex-1 py-2 flex flex-row items-center justify-center space-x-2"
                                    disabled={isLoadingJoinGroup}
                                >
                                    {isLoadingJoinGroup ? (
                                        <ActivityIndicator />
                                    ) : (
                                        <>
                                            <Text>{isJoinGroup ? 'Đã tham gia' : 'Tham gia'}</Text>
                                            {isJoinGroup && (
                                                <Feather
                                                    name="chevron-down"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                            )}
                                        </>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="rounded-md flex-1 py-2 flex flex-row items-center justify-center space-x-2"
                                    style={{ backgroundColor: Colors.primary.green }}
                                    onPress={() => {
                                        isJoinGroup
                                            ? sheetAddPeopleRef.current?.present()
                                            : Alert.alert('Bạn phải tham gia group trước');
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="account-group-outline"
                                        size={20}
                                        color={'#fff'}
                                    />
                                    <Text className="text-white">Mời</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex flex-row items-center space-x-3 h-10">
                                <TouchableOpacity onPress={() => router.navigate('/profile')}>
                                    {isAuthenticated && user?.avatarLink ? (
                                        <AvatarUser avatarLink={user.avatarLink} />
                                    ) : (
                                        <AvatarUser
                                            avatarLink={require('@/assets/images/avatar.png')}
                                        />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleToNewPost}
                                    className="bg-[#262D34] rounded-lg flex-1 h-full"
                                >
                                    <Text className="p-2 font-light text-sm text-[#d9d9d9]">
                                        Bạn đang nghĩ gì
                                    </Text>
                                </TouchableOpacity>
                                {/* <CustomButton type="primary" title="Đăng bài" className="h-full p-3" /> */}
                            </View>
                        </View>
                        <GroupBottomSheet
                            ref={sheetRef}
                            dismiss={dismiss}
                            onLeaveGroup={onLeaveGroup}
                        />
                        <BottomSheetAddPeople ref={sheetAddPeopleRef} dismiss={dismiss} />
                    </>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    backTitile: {
        color: '#fff',
    },
});

export default Page;
