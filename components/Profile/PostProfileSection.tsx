import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';

const PostProfileSection = () => {
    return (
        <>
            <TouchableOpacity style={styles.shadow} className="flex-row bg-[#262D34] p-2 rounded-xl shadow-md my-2">
                <Image source={require('@/assets/images/quyhoach.png')} className="w-16 h-full rounded-md mr-2" />
                <View className="flex-1 justify-start space-y-1">
                    <Text className="text-white font-semibold text-sm" numberOfLines={1} ellipsizeMode="tail">
                        [Nổi bật] Tư vấn - Trao đổi - Chia sẻ tư vấn thiết kế, thi công
                    </Text>
                    <View className="flex flex-row space-x-2 overflow-hidden">
                        <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View>
                        <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View>
                        <View className="bg-[#2C353D] w-fit p-1 rounded-md">
                            <Text>#HaNoi</Text>
                        </View>
                    </View>
                    <View className="flex flex-row items-center space-x-2">
                        <Image
                            source={require('@/assets/images/avatar.png')}
                            className="w-8 h-8 rounded-lg border border-[#EA942C] bg-[#F9DFC0]"
                        />
                        <View>
                            <Text className="text-white font-semibold text-sm ">Thai Hoang </Text>
                            <Text className="text-white text-xs font-thin">3 tuần trước</Text>
                        </View>
                    </View>
                </View>
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
