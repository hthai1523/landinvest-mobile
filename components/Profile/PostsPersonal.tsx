import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    FlatList,
} from 'react-native';
import { styled } from 'nativewind';
import PostProfileSection from './PostProfileSection';
import useAuthStore from '@/store/authStore';
import { GetUserPosted } from '@/service';
import { usePathname } from 'expo-router';
import { Post } from '@/constants/interface';
import Colors from '@/constants/Colors';
import CustomButton from '../ui/Button';
import { usePaginatedList } from '@/hooks/usePaginatedList';

const PostsPersonal = ({ userIdParams }: { userIdParams?: number }) => {
    const { userId: userIdFromStore } = useAuthStore.getState();

    const userId = userIdParams || userIdFromStore;

    const { dataList, isLoading, totalPage, page, flatListRef, handlePageChange, getVisiblePages } =
        usePaginatedList<Post>(() => GetUserPosted(userId, page), 1);

    return (
        <>
            {isLoading ? (
                <ActivityIndicator size={30} />
            ) : (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={dataList}
                        renderItem={({ item }) => <PostProfileSection post={item} />}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={1}
                        scrollEnabled={false}
                        contentContainerStyle={{ padding: 12 }}
                        ListEmptyComponent={() => <Text className='text-white text-center font-normal'>Người dùng chưa có bài viết nào</Text>}
                    />
                    {dataList.length > 0 && <View className="flex flex-row justify-center items-center space-x-2 my-2">
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
                            disabled={page === totalPage}
                            className={`${page === totalPage && 'bg-[#d9d9d9]'}`}
                            textClassName={`${page === totalPage && 'text-black'}`}
                        />
                    </View>}
                </>
            )}
        </>
    );
};

export default PostsPersonal;
