import { View, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import PostProfileSection from '../Profile/PostProfileSection';
import { ViewlistPost } from '@/service';
import CustomButton from '../ui/Button';
import Colors from '@/constants/Colors';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { Post } from '@/constants/interface';
import { useLocalSearchParams } from 'expo-router';

const NewestPost = ({newestPost}: {newestPost: any}) => {
    const { dataList, isLoading, totalPage, page, flatListRef, handlePageChange, getVisiblePages } =
        usePaginatedList<Post>(ViewlistPost);

    return (
        <>
            {isLoading ? (
                <ActivityIndicator size={30} />
            ) : (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={newestPost ? [newestPost, dataList] : dataList}
                        renderItem={({ item }) => <PostProfileSection post={item} />}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={1}
                        scrollEnabled={false}
                        contentContainerStyle={{ padding: 12 }}
                    />
                    <View className="flex flex-row justify-center items-center space-x-2 mt-2">
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
                                className={`bg-[${pageNum === page ? Colors.primary.green : '#d9d9d9'}]`}
                            />
                        ))}

                        <CustomButton
                            title="Trang tiếp"
                            onPress={() => handlePageChange(page + 1)}
                            disabled={page === totalPage}
                            className={`${page === totalPage && 'bg-[#d9d9d9]'}`}
                            textClassName={`${page === totalPage && 'text-black'}`}
                        />
                    </View>
                </>
            )}
        </>
    );
};

export default NewestPost;
