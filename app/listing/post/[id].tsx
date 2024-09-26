import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    FlatList,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FetchPostById, IsUserLikePost, LikePost, ListUserLike, numberInteractions } from '@/service';
import { NumberInteractions, Post, UserLikePost } from '@/constants/interface';
import CustomImage from '@/components/ui/Image';
import { AntDesign, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
    useAnimatedRef,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
    runOnJS,
    withTiming,
    useDerivedValue,
    FadeInRight,
    FadeOutRight,
} from 'react-native-reanimated';
import PostDetailContent from '@/components/PostDetail/PostDetailContent';
import { StatusBar } from 'expo-status-bar';
import { calcDate } from '@/functions/calcDate';
import { ScrollView } from 'react-native-gesture-handler';
import CommentPost from '@/components/PostDetail/CommentPost';
import useAuthStore from '@/store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import {
    AnimatedSafeView,
    AnimatedScrollView,
    AnimatedTextInput,
    AnimatedTouchableOpacity,
} from '@/components/ui/AnimatedComponents';
import { useDebounce } from 'use-debounce';
import NewComment from '@/components/Group/Post/NewComment';
// import {} from '@react-navigation/native-stack'

const width = Dimensions.get('window').width;
const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [postDetail, setPostDetail] = useState<Post>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusBarHidden, setStatusBarHidden] = useState(false);
    const [numberInteraction, setNumberInteraction] = useState<NumberInteractions>();
    const [listLike, setlistLike] = useState<UserLikePost[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [commentResponse, setCommentResponse] = useState<Comment | undefined>();
    const insets = useSafeAreaInsets();
    const commentInputRef = useRef<TextInput>(null);

    // Adjust these values based on your design preferences
    const HEADER_HEIGHT_EXPANDED = 85 + insets.top;
    const HEADER_HEIGHT_COLLAPSED = 40 + insets.top;
    const SCROLL_THRESHOLD = 30;

    const userId = useAuthStore.getState().userId;
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);

    const toggleCommentInput = () => {
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            runOnJS(setStatusBarHidden)(event.contentOffset.y > 0);
        },
    });

    const progress = useDerivedValue(() =>
        interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, 1], Extrapolation.CLAMP),
    );

    const height = useDerivedValue(() =>
        interpolate(progress.value, [0, 1], [HEADER_HEIGHT_EXPANDED, HEADER_HEIGHT_COLLAPSED], Extrapolation.CLAMP),
    );

    const paddingTop = useDerivedValue(() =>
        interpolate(progress.value, [0, 1], [insets.top + 20, insets.top], Extrapolation.CLAMP),
    );

    const animatedHeaderStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value),
        paddingTop: withTiming(paddingTop.value),
        borderBottomWidth: 1,
        borderBottomColor: `rgba(55, 65, 81, ${progress.value})`,
    }));

    const animatedLeftStyle = useAnimatedStyle(() => ({
        opacity: withTiming(1 - progress.value),
    }));

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: withTiming(progress.value),
    }));

    console.log(id);

    useEffect(() => {
        const fetchPost = async (id: string) => {
            try {
                setIsLoading(true);
                const data = await FetchPostById(id);
                const res = await numberInteractions(id);
                if (userId) {
                    const isLike = await IsUserLikePost(userId, id);

                    console.log('da like', isLike);
                    setIsLiked(isLike.liked);
                }
                if (res) {
                    setNumberInteraction(res);
                    setPostDetail(data[0]);
                }
            } catch (error) {
                Alert.alert('Lỗi khi tải bài viết');
                router.back();
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost(id);
    }, [id]);

    const fetchNumberLike = useCallback(async () => {
        const res = await numberInteractions(id);
        setNumberInteraction(res);
    }, []);

    const handleLikePost = useCallback(async () => {
        if (userId) {
            const { data } = await LikePost(userId, id);
            await fetchNumberLike();
            // console.log(res)
            if (data.message === 'Unlike successful') {
                setIsLiked(false);
            } else setIsLiked(true)
        } else {
            Alert.alert('Vui lòng đăng nhập để like bài viết này', 'Ok', [
                {
                    text: 'Đăng nhập',
                    onPress: () => router.push('/(modals)/auth'),
                },
            ]);
        }
    }, []);

    const renderImage = ({ item }: { item: string }) => (
        <CustomImage
            className="mb-3"
            source={{ uri: item }}
            style={{ width, height: undefined, aspectRatio: 1 }}
            resizeMode="contain"
        />
    );

    const FooterButtons = () => (
        <>
            <View className="flex flex-row items-center justify-between px-3">
                <TouchableOpacity>
                    <Text className=" font-light text-xs text-gray-400 underline ">
                        {numberInteraction?.TotalLike} người thích
                    </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center space-x-2">
                    <Text className=" font-light text-xs text-gray-400 underline ">
                        {postDetail && postDetail?.view} lượt xem
                    </Text>
                    <Text className="font-light text-xs text-gray-400 underline">
                        {numberInteraction?.TotalShare} chia sẻ
                    </Text>
                </View>
            </View>

            <View className="h-14 flex flex-row items-center justify-around px-3 border-b border-gray-700">
                <TouchableOpacity onPress={handleLikePost} className="flex flex-row items-center ">
                    <AntDesign name={isLiked ? 'like1' : 'like2'} size={24} color="white" />
                    <Text className="ml-2 text-white">Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCommentInput} className="flex flex-row items-center">
                    <Ionicons name="chatbubble-outline" size={24} color="white" />
                    <Text className="ml-2 text-white">Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-row items-center">
                    <FontAwesome name="share" size={24} color="white" />
                    <Text className="ml-2 text-white">Share</Text>
                </TouchableOpacity>
            </View>
        </>
    );
    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary.background }}>
            <StatusBar animated hidden={statusBarHidden} style="light" hideTransitionAnimation="fade" />

            {/* header */}
            <AnimatedSafeView
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        backgroundColor: Colors.primary.header,
                    },
                    animatedHeaderStyle,
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ zIndex: 1 }}>
                        <Ionicons name="chevron-back" size={20} color={'#fff'} />
                    </TouchableOpacity>
                    <AnimatedTouchableOpacity
                        // onPress={() => router.pus}
                        style={[animatedLeftStyle, { flexDirection: 'row', alignItems: 'center', marginLeft: 8 }]}
                    >
                        <CustomImage
                            source={require('@/assets/images/avatar.png')}
                            style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#F9DFC0' }}
                        />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                            {postDetail?.FullName || 'Thai Hoang'}
                        </Text>
                    </AnimatedTouchableOpacity>
                    <Animated.Text
                        style={[
                            animatedTitleStyle,
                            {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 18,
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {postDetail?.FullName || 'Hoang Thai'}'s post
                    </Animated.Text>
                </View>
            </AnimatedSafeView>

            <AnimatedScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode={'on-drag'}
            >
                <View style={{ paddingTop: 16 }} />
                {/* <PostDetailContent postDetail={postDetail} /> */}
                <View style={{ paddingHorizontal: 12, marginBottom: 16 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28 }}>{postDetail?.Title}</Text>
                    <Text style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>
                        {calcDate(postDetail?.PostTime) || ''}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 16, marginTop: 16 }}>{postDetail?.Content}</Text>
                </View>
                <FlatList
                    data={postDetail?.Images}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    // showsVerticalScrollIndicator={true}
                    // snapToInterval={width}
                    // decelerationRate="fast"
                    ListFooterComponent={FooterButtons}
                />
                <CommentPost idPost={id} commentNew={commentResponse} />
            </AnimatedScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <NewComment ref={commentInputRef} postId={id} setCommentResponse={setCommentResponse} />
            </KeyboardAvoidingView>
        </View>
    );
};

export default Page;
