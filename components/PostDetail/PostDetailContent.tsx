import React from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import { Post } from '@/constants/interface';
import { calcDate } from '@/functions/calcDate';
import CustomImage from '../ui/Image';

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

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16, marginBottom: 16 }}>
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
                showsVerticalScrollIndicator={false}
                snapToInterval={width}
                decelerationRate="fast"
            />
            
        </View>
    );
};

export default PostDetailContent;