import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { NumberInteractions, Post } from '@/constants/interface';
import CustomImage from '../ui/Image';
import { calcDate } from '@/functions/calcDate';
import { router } from 'expo-router';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';
import { numberInteractions } from '@/service';
import millify from 'millify';

const PostProfileSection = ({ post }: { post: Post }) => {
    const [numberInteraction, setNumberInteraction] = useState<NumberInteractions>();
    // const getUser = async (userId : string) => {
    //     const data = await
    // }\

    useEffect(() => {
        const fetchNumberInteraction = async () => {
            try {
                const res = await numberInteractions(post.PostID);
                setNumberInteraction(res);
            } catch (error) {
                console.log("loi", post.PostID);
            }
        };

        fetchNumberInteraction();
    }, [post.PostID]);

    return (
        <>
            <TouchableOpacity
                onPress={() => router.push(`/listing/post/${post?.PostID}`)}
                style={styles.shadow}
                className="flex-row bg-[#262D34] p-2 rounded-xl mb-4"
            >
                <View className="flex-1 justify-start space-y-1">
                    <Text className="text-white font-semibold text-sm" numberOfLines={1} ellipsizeMode="tail">
                        {post?.Title || '[Nổi bật] Tư vấn - Trao đổi - Chia sẻ tư vấn thiết kế, thi công'}
                    </Text>
                    <View className="flex flex-row space-x-2 overflow-hidden">
                        {post && post.Hastags && post?.Hastags.length > 0 &&
                            post.Hastags.map((item, index) => (
                                <View key={index} className="bg-[#2C353D] w-fit p-1 rounded-md">
                                    <Text className="text-xs font-light text-[#f7f7f7]">{item}</Text>
                                </View>
                            ))}
                    </View>

                    <View className="flex flex-row items-center space-x-2">
                        <View className="bg-[#2c353d] p-1 rounded-md">
                            <Text className="text-[#C5D0E6] font-normal text-[10px]">
                                {millify(numberInteraction?.TotalLike ?? 0)} Like
                            </Text>
                        </View>
                        <View className="bg-[#2c353d] p-1 rounded-md">
                            <Text className="text-[#C5D0E6] font-normal text-[10px]">
                                {numberInteraction?.TotalComment ?? 0} Bình luận
                            </Text>
                        </View>
                        <View className="bg-[#2c353d] p-1 rounded-md">
                            <Text className="text-[#C5D0E6] font-normal text-[10px]">
                                {numberInteraction?.TotalShare ?? 0} Share
                            </Text>
                        </View>
                        <View className="bg-[#2c353d] p-1 rounded-md">
                            <Text className="text-[#C5D0E6] font-normal text-[10px]">{millify(post.timeView)} Xem</Text>
                        </View>
                    </View>

                    <View className="flex flex-row items-center space-x-2">
                        {post.avatarLink ? (
                            <CustomImage
                                source={{ uri: post.avatarLink }}
                                className="w-10 h-10 rounded-lg border border-[#EA942C] bg-[#F9DFC0]"
                            />
                        ) : (
                            <Avatar
                                title={post.FullName ? post.FullName.slice(0, 1) : 'T'}
                                containerStyle={{
                                    backgroundColor: Colors.primary.green,
                                    borderRadius: 8,
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        )}
                        <View>
                            <Text className="text-white font-semibold text-sm ">{post.FullName || post.Username}</Text>
                            <Text className="text-white text-xs font-thin">{calcDate(post?.PostTime)}</Text>
                        </View>
                    </View>
                </View>
                {post && post.Images && post?.Images.length > 0 && (
                    <CustomImage source={post.Images[0]} className="w-20 h-full rounded-md mr-2" />
                )}
            </TouchableOpacity>
        </>
    );
};
const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        elevation: 10,
    },
});
export default memo(PostProfileSection);
