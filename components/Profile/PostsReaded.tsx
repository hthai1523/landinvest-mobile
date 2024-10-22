import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostProfileSection from './PostProfileSection';
import useAuthStore from '@/store/authStore';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { Post } from '@/constants/interface';
import { GetUserViewed } from '@/service';

const PostsReaded = () => {
    const { userId } = useAuthStore.getState();
    const [posts, setPosts] = useState<Post[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const getViewed = async () => {
            try {
                if (userId) {
                    setIsLoading(true);
                    const data = await GetUserViewed(+userId);
                    setPosts(data.data);
                }
            } catch (error) {
                Alert.alert('Lấy bài viết đã xem thất bại');
            } finally {
                setIsLoading(false);
            }
        };

        getViewed();
    }, []);

    return isLoading ? (
        <ActivityIndicator size={30} />
    ) : (
        <FlatList
            data={posts}
            renderItem={({ item }) => <PostProfileSection post={item} />}
            keyExtractor={(item, index) => item.PostID.toString() + index}
            scrollEnabled={false}
        />
    );
};

export default PostsReaded;
