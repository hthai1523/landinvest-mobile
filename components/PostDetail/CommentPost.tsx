import { View, Text, FlatList, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DeleteComment, ViewlistComment } from '@/service';
import CustomImage from '../ui/Image';
import { calcDate } from '@/functions/calcDate';
import { Comment } from '@/constants/interface';
import { Avatar, Divider } from '@rneui/themed';
import Colors from '@/constants/Colors';
import AvatarUser from '../ui/AvatarUser';
import { router } from 'expo-router';
import { Menu, MenuOption, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import useAuthStore from '@/store/authStore';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const CommentPost = ({
    idPost,
    commentNew,
    setIsMenuOpen,
}: {
    idPost: string;
    commentNew: Comment | null | undefined;
    setIsMenuOpen: (a: boolean) => void;
}) => {
    const [comment, setComment] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(10);

    const userId = useAuthStore.getState().userId;

    const fetchCommentPost = useCallback(
        async (idPost: string) => {
            setIsLoading(true);
            try {
                const res = await ViewlistComment(idPost, page);
                if (res.status === 200) {
                    setComment((prev) => [...prev, ...res.data]);
                    setTotalPage(Math.ceil(res.numberPage));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        },
        [page],
    );

    useEffect(() => {
        fetchCommentPost(idPost);
    }, [idPost, page]);

    const handleRemoveComment = useCallback(async (commentId: string) => {
        try {
            setIsLoadingDelete(true);
            const { data } = await DeleteComment(commentId);
            if (data.status === 200) {
                Alert.alert('Đã xóa comment này');
                setComment((prevComments) =>
                    prevComments.filter((comment) => comment.CommentID.toString() !== commentId),
                );
            }
        } catch (error) {
            Alert.alert('Xóa comment thất bại');
        } finally {
            setIsLoadingDelete(false);
        }
    }, []);

    const renderImages = (imageUri: string) => {
        const imageWidth = screenWidth * 0.9;
        const imageHeight = imageWidth * 0.75;

        return (
            <CustomImage
                source={{ uri: imageUri }}
                className="rounded-lg mt-2 max-w-full max-h-[300px]"
                style={{ width: imageWidth, height: imageHeight }}
                resizeMode="cover"
            />
        );
    };

    const renderPost = ({ item }: { item: Comment }) => {
        return (
            <Animated.View
                exiting={FadeOutLeft.delay(300).duration(300).springify()}
                entering={FadeInRight.duration(300).springify()}
                className="flex-row bg-[#262D34] p-3 rounded-xl shadow-lg flex-wrap relative"
            >
                <AvatarUser avatarLink={item.Avatar} fullName={item.FullName} />
                <View className="ml-3 flex-1">
                    <TouchableOpacity onPress={() => router.navigate(`/listing/profileUser/${item.UserID}`)}>
                        <Text className="text-white font-bold text-base">{item.FullName}</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-sm mt-1 mb-2">{item.Content}</Text>

                    {item.CmtPhoto && (
                        <View className="items-start justify-center w-full">{renderImages(item.CmtPhoto)}</View>
                    )}

                    <View className="mt-2">
                        <Text className="text-xs text-gray-400">Đăng vào: {calcDate(item.CommentTime)}</Text>
                        {item.CommentUpdateTime && (
                            <Text className="text-xs text-gray-400">
                                Chỉnh sửa vào: {calcDate(item.CommentUpdateTime)}
                            </Text>
                        )}
                    </View>
                </View>
                {userId && parseInt(userId) === item.UserID && (
                    <Menu onOpen={() => setIsMenuOpen(true)} onClose={() => setIsMenuOpen(false)}>
                        <MenuTrigger>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </MenuTrigger>
                        <MenuOptions
                            optionsContainerStyle={{
                                borderRadius: 10,
                            }}
                        >
                            <MenuOption
                                onSelect={() => alert(`You clicked `)}
                                customStyles={{
                                    optionWrapper: {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 10,
                                    },
                                }}
                            >
                                <Text>Sửa</Text>
                                <MaterialIcons name="auto-fix-high" size={24} color="black" />
                            </MenuOption>
                            <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 5 }} />
                            <MenuOption
                                onSelect={() => handleRemoveComment(item.CommentID.toString())}
                                customStyles={{
                                    optionWrapper: {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 10,
                                    },
                                }}
                            >
                                <Text className="text-red-400">Xóa</Text>
                                <Feather name="trash-2" size={24} color="#f87171" />
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                )}
            </Animated.View>
        );
    };

    const handleLoadMore = useCallback(() => {
        if (page < totalPage) {
            setPage((prevPage) => prevPage + 1);
        }
    }, []);

    const renderFooter = () => {
        return <ActivityIndicator size={30} />;
    };

    const combinedComments = commentNew ? [commentNew, ...comment] : comment;

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={combinedComments}
                renderItem={renderPost}
                keyExtractor={(item, index) => item.CommentID.toString() + index}
                ListEmptyComponent={() => <Text className="text-gray-400 text-xs text-center">Chưa có comment</Text>}
                scrollEnabled={false}
                contentContainerStyle={{ padding: 12 }}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

export default CommentPost;
