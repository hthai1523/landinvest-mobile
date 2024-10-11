import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Group, Post } from '@/constants/interface';
import CustomImage from '../ui/Image';
import { calcDate } from '@/functions/calcDate';
import { router } from 'expo-router';

const GroupPostSection = ({ group }: { group: Group | null }) => {
    return (
        <>
            <TouchableOpacity onPress={() => router.navigate({
                pathname: '/listing/group/[id]',
                params: {
                    id: group?.GroupID.toString()
                }
            })} style={styles.shadow} className="flex-row bg-[#262D34] p-2  rounded-xl shadow-md mb-2">
                <View className="flex-1 justify-start space-y-1">
                    <Text className="text-white font-semibold text-sm" numberOfLines={1} ellipsizeMode="tail">
                        {group?.GroupName || '[Nổi bật] Tư vấn - Trao đổi - Chia sẻ tư vấn thiết kế, thi công'}
                    </Text>

                    {/* <View className="flex flex-row items-center space-x-2">
                        <Image
                            source={require('@/assets/images/avatar.png')}
                            className="w-8 h-8 rounded-lg border border-[#EA942C] bg-[#F9DFC0]"
                        />
                        <View>
                            <Text className="text-white font-semibold text-sm ">Thai Hoang </Text>
                            </View>
                            </View> */}
                    <Text className="text-white text-xs font-thin">{calcDate(group?.CreateAt)}</Text>
                </View>
                {group && <CustomImage source={group.avatarLink} className="w-16 h-full rounded-md mr-2" />}
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
export default GroupPostSection;
