import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Post } from '@/constants/interface';
import CustomImage from '../ui/Image';
import { calcDate } from '@/functions/calcDate';
import { router } from 'expo-router';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';

const PostProfileSection = ({ post }: { post: Post }) => {

    // const getUser = async (userId : string) => {
    //     const data = await 
    // }

    return (
        <>
            <TouchableOpacity onPress={() => router.navigate(`/listing/post/${post?.PostID}`)} style={styles.shadow} className="flex-row bg-[#262D34] p-2 rounded-xl mb-4">
                <View className="flex-1 justify-start space-y-1">
                    <Text className="text-white font-semibold text-sm" numberOfLines={1} ellipsizeMode="tail">
                        {post?.Title || '[Nổi bật] Tư vấn - Trao đổi - Chia sẻ tư vấn thiết kế, thi công'}
                    </Text>
                    <View className="flex flex-row space-x-2 overflow-hidden">
                        {/* <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View>
                        <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View>
                        <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View> */}
                        {post &&
                            post?.Hastags.length > 0 &&
                            post.Hastags.map((item, index) => (
                                <View key={index} className="bg-[#2C353D] w-fit p-1 rounded-md">
                                    <Text className='text-xs font-light text-[#f7f7f7]'>{item}</Text>
                                </View>
                            ))}
                    </View>
                    
                    <View className="flex flex-row items-center space-x-2">
                        {post.avatarLink ? (
                            <CustomImage
                            source={{uri: post.avatarLink}}
                            className="w-8 h-8 rounded-lg border border-[#EA942C] bg-[#F9DFC0]"
                        />
                        ) : (
                            <Avatar
                                title={post.FullName ? post.FullName.slice(0,1) : "T"}
                                containerStyle={{backgroundColor: Colors.primary.green, borderRadius: 8, width: 32, height: 32}}
                            />
                        )}
                        <View>
                            <Text className="text-white font-semibold text-sm ">{post.FullName || post.Username}</Text>
                            <Text className="text-white text-xs font-thin">{calcDate(post?.PostTime)}</Text>
                        </View>
                    </View>
                </View>
                {post && post?.Images.length > 0 && (
                    <CustomImage source={post.Images[0]} className="w-16 h-full rounded-md mr-2" />
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
export default PostProfileSection;
