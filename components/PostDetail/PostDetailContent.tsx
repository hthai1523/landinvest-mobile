import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Post } from '@/constants/interface';
import { calcDate } from '@/functions/calcDate';
import CustomImage from '../ui/Image';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import CommentPost from './CommentPost';
import { Divider } from '@rneui/themed';
import { FlatList } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const PostDetailContent = ({ postDetail }: { postDetail: Post | undefined }) => {
    const renderImage = ({ item }: { item: string }) => (
        <CustomImage 
            className='mb-3'
            source={{ uri: item }} 
            style={{ width, height: undefined, aspectRatio: 1 }}
            resizeMode="contain"
        />
    );

    const FooterButtons = () => (
        <View className='h-14 flex flex-row items-center justify-around px-4 border-t border-gray-700'>
            <TouchableOpacity className='flex flex-row items-center'>
                <AntDesign name="like2" size={24} color="white" />
                <Text className='ml-2 text-white'>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row items-center'>
                <Ionicons name="chatbubble-outline" size={24} color="white" />
                <Text className='ml-2 text-white'>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex flex-row items-center'>
                <FontAwesome name="share" size={24} color="white" />
                <Text className='ml-2 text-white'>Share</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28 }}>
                    {postDetail?.Title}
                </Text>
                <Text style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>
                    {calcDate(postDetail?.PostTime) || ''}
                </Text>
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 16 }}>
                    {postDetail?.Content}
                </Text>
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
            {/* {postDetail && <CommentPost idPost={postDetail.PostID}/>} */}
        </View>
    );
};

export default PostDetailContent;