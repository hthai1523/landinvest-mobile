import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import CustomImage from '@/components/ui/Image';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using expo or react-native-vector-icons
import * as ImagePicker from 'expo-image-picker';

const Page = () => {
    const bottomSheetRef = useRef(null);

    // Snap points for bottom sheet
    const snapPoints = useMemo(() => ['10%', '50%'], []);

    // State to track the expanded/collapsed status of the bottom sheet
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSheetChanges = (index: number) => {
        setIsExpanded(index > 0);
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16,9],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            console.log(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.primary.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                >
                    <View className="flex flex-row items-center space-x-2 p-2">
                        <CustomImage
                            source={require('@/assets/images/avatar.png')}
                            className="w-10 h-10 rounded-full bg-[#F9DFC0]"
                        />
                        <Text className="text-white text-base font-semibold">Hoàng Tiến Thái</Text>
                    </View>
                    <View className="flex-1">
                        <TextInput
                            placeholder="Bạn muốn đăng gì?"
                            placeholderTextColor="#c9c9c9"
                            multiline
                            autoFocus
                            numberOfLines={10}
                            style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 10 }}
                        />
                    </View>
                </ScrollView>

                {/* Bottom Sheet */}
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={0}
                    onChange={handleSheetChanges}
                    backgroundStyle={{
                        backgroundColor: '#262D34',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 5,
                            height: -7,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: isExpanded ? 'column' : 'row',
                            justifyContent: 'space-around',
                            alignItems: isExpanded ? 'flex-start' : 'center',
                        }}
                        className={`${isExpanded && 'space-y-3'} px-3`}
                    >
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{ flexDirection: isExpanded ? 'row' : 'column', alignItems: 'center' }}
                        >
                            <Ionicons name="image" size={30} color="#1E90FF" />
                            {isExpanded && <Text className="text-white font-medium text-base ml-2">Ảnh</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: isExpanded ? 'row' : 'column', alignItems: 'center' }}
                        >
                            <Ionicons name="camera" size={30} color="#32CD32" />
                            {isExpanded && <Text className="text-white font-medium text-base ml-2">Vị trí</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: isExpanded ? 'row' : 'column', alignItems: 'center' }}
                        >
                            <Ionicons name="videocam" size={30} color="#FFA500" />
                            {isExpanded && <Text className="text-white font-medium text-base ml-2">Video</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: isExpanded ? 'row' : 'column', alignItems: 'center' }}
                        >
                            <Ionicons name="document" size={30} color="#ADADAD" />
                            {isExpanded && <Text className="text-white font-medium text-base ml-2">Tài liệu</Text>}
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Page;
