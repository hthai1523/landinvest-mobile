import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { GetListTags } from '@/service';
import { ListTag } from '@/constants/interface';

const HotTagsContent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listTag, setListTag] = useState<ListTag[]>([]);

    useEffect(() => {
        const fetchTag = async () => {
            const data = await GetListTags(1);
            if (data.status === 200) {
                setListTag(data.data.slice(0, 8)); // Fetch only top 8 tags
            } else {
                setListTag([])
            }
        };
        fetchTag();
    }, []);

    const renderTagItem = ({ item }: { item: ListTag }) => (
        <View className="flex-1 mx-2 min-h-[30px] bg-[#2C353D] rounded-md p-2">
            <Text className="font-semibold text-sm text-[#f7f7f7]">{item.Hastag.trim()}</Text>
            <Text className="font-light text-[10px] text-[#f7f7f7]">{item.count_number} bài đăng</Text>
        </View>
    );

    return (
        <View style={styles.shadow} className="bg-[#262D34] rounded-xl py-2">
            <Text className="text-white text-center font-semibold text-lg">Tags nổi bật</Text>
            <FlatList
                data={listTag}
                renderItem={renderTagItem}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                numColumns={2} 
                columnWrapperStyle={styles.row}
                contentContainerStyle={{paddingHorizontal: 8}}
                ListEmptyComponent={() => (
                    <ActivityIndicator size={30} style={{justifyContent: 'center', alignItems: 'center'}} />
                )}
            />
        </View>
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
    row: {
        justifyContent: 'space-between',
        marginVertical: 8,
    },
   
});

export default HotTagsContent;
