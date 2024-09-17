import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ViewStyle,
    Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import CustomImage from '@/components/ui/Image';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { usePostStore } from '@/store/postNewStore';

const { width } = Dimensions.get('window');
const imageMargin = 5;

const Page = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['10%', '50%'], []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTag, setCurrentTag] = useState('#'); // Current tag being typed

    const { value, images, setValue, addImage, removeImage, addTag, removeTag } = usePostStore();

    const handleSheetChanges = (index: number) => {
        setIsExpanded(index > 0);
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                const base64Images: string[] = await Promise.all(
                    result.assets.map(async (asset) => {
                        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        return `data:image/jpeg;base64,${base64}`;
                    }),
                );

                base64Images.forEach((image) => addImage(image));
            }
        } catch (error) {
            console.error('Error picking images:', error);
        }
    };

    const handleTagInput = (text: string) => {
        // Check if space is pressed
        if (text.endsWith(' ')) {
            const newTag = currentTag.trim();
            if (newTag.length > 1) {
                addTag(newTag); // Add the tag to store
            }
            setCurrentTag('#'); // Reset current tag to start with #
        } else {
            setCurrentTag(text); // Update tag input
        }
    };

    const handleInputChange = (name: keyof typeof value, text: string) => {
        setValue({
            ...value,
            [name]: text,
        });
    };

    const handleRemoveTag = (index: number) => {
        Alert.alert('Xóa tag này', '', [
            {
                text: 'Ok',
                onPress: () => removeTag(index),
            },
            {
                text: 'Hủy',
                style: 'cancel',
            },
        ]);
    };

    const deleteImage = (index: number) => {
        removeImage(index);
    };

    const renderTags = useCallback(() => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} className='space-x-1'>
                {value.tags.map((tag, index) => (
                    <TouchableOpacity
                        onLongPress={() => handleRemoveTag(index)}
                        delayLongPress={300}
                        key={index}
                        style={{
                            backgroundColor: Colors.primary.background,
                            borderRadius: 20,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text style={{ color: 'white' }}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }, [value.tags]);

    const renderImages = () => {
        const imageCount = images.length;
        let imageStyle: ViewStyle;
        let containerStyle: ViewStyle;

        if (imageCount === 1) {
            imageStyle = { width: width - 20, height: width - 20, marginBottom: imageMargin };
            containerStyle = { flexDirection: 'column' };
        } else if (imageCount === 2) {
            imageStyle = { width: (width - 25) / 2, height: (width - 25) / 2, marginBottom: imageMargin };
            containerStyle = { flexDirection: 'row', justifyContent: 'space-between' };
        } else {
            const imageSize = (width - imageMargin * 4) / 3;
            imageStyle = { width: imageSize, height: imageSize, marginBottom: imageMargin };
            containerStyle = { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' };
        }

        return (
            <View style={containerStyle}>
                {images.map((image, index) => (
                    <View key={index} style={[imageStyle, { position: 'relative' }]}>
                        <CustomImage source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 10,
                                padding: 5,
                            }}
                            onPress={() => deleteImage(index)}
                        >
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
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
                    <View
                        style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 10 }}
                        className="space-y-3"
                    >
                        <TextInput
                            autoFocus
                            placeholder="Tiêu đề"
                            placeholderTextColor="#c9c9c9"
                            className="text-black font-bold text-base"
                            value={value.title}
                            onChangeText={(text) => handleInputChange('title', text)}
                        />

                        {/* Tag Input */}
                        <TextInput
                            placeholder="Tags"
                            placeholderTextColor="#c9c9c9"
                            className="font-medium text-sm"
                            value={currentTag}
                            onChangeText={handleTagInput}
                        />

                        {renderTags()}

                        <TextInput
                            placeholder="Bạn muốn đăng gì?"
                            placeholderTextColor="#c9c9c9"
                            multiline
                            numberOfLines={10}
                            className="font-normal text-sm"
                            value={value.content}
                            onChangeText={(text) => handleInputChange('content', text)}
                        />
                        {renderImages()}
                    </View>
                </ScrollView>

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
