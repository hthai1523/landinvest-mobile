import { View, Text, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ViewlistComment } from '@/service';
import CustomImage from '../ui/Image';
import { calcDate } from '@/functions/calcDate';
import { Comment } from '@/constants/interface';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

const CommentPost = ({ idPost, commentNew }: { idPost: string, commentNew: Comment | null }) => {
    const [comment, setComment] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchCommentPost = async (idPost: string) => {
        setIsLoading(true);
        try {
            const res = await ViewlistComment(idPost);
            setComment(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommentPost(idPost);
    }, [idPost]);

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
            <View className="flex-row bg-[#262D34] p-3 rounded-xl shadow-lg flex-wrap">
                {item.Avatar ? (
                    <CustomImage
                        source={item.Avatar}
                        className="w-10 h-10 rounded-full bg-[#F9DFC0]"
                    />
                ) : (
                    <Avatar
                        title={item.FullName.slice(0, 1)}
                        size={40}
                        containerStyle={{ borderRadius: 9999, backgroundColor: Colors.primary.green }}
                    />
                )}
                <View className="ml-3 flex-1">
                    <Text className="text-white font-bold text-base">{item.FullName}</Text>
                    <Text className="text-white text-sm mt-1 mb-2">{item.Content}</Text>
                   
                    {item.CmtPhoto && (
                        <View className="items-start justify-center w-full">
                            {renderImages(item.CmtPhoto)}
                        </View>
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
            </View>
        );
    };

    const combinedComments = commentNew ? [commentNew, ...comment] : comment;

    return (
        <FlatList
            data={combinedComments}
            renderItem={renderPost}
            keyExtractor={(item) => item.CommentID.toString()}
            ListEmptyComponent={() => <Text className="text-gray-400 text-xs text-center">Chưa có comment</Text>}
            scrollEnabled={false}
            contentContainerStyle={{ padding: 12 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
        />
    );
};

export default CommentPost;