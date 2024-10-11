import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import React, { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { AnimatedTextInput, AnimatedTouchableOpacity } from '@/components/ui/AnimatedComponents';
import { useDebounce } from 'use-debounce';
import Animated, { FadeInRight, FadeOutRight, LinearTransition } from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { CreateComment } from '@/service';
import CustomImage from '@/components/ui/Image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator } from 'react-native';
import useAuthStore from '@/store/authStore';
import { Comment } from '@/constants/interface';

interface NewCommentProps {
    postId: string;
    setCommentResponse: (commnet: Comment) => void;
}

const NewComment = forwardRef<TextInput, NewCommentProps>(({ postId, setCommentResponse }, ref) => {
    const [comment, setComment] = useState<string>('');
    const [commentDebounce] = useDebounce(comment, 500);
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
    const isLoggedIn = useAuthStore.getState().isAuthenticated;

    const submitComment = useCallback(async () => {
        if (!isLoggedIn) {
            Alert.alert('Bạn phải đăng nhập để bình luận');
            return;
        }
        try {
            setIsLoadingPost(true);
            console.log(postId, comment, images);
            if (postId && comment) {
                const res = await CreateComment(postId, comment, images);
                if (res.Status === 200) {
                    setCommentResponse(res.data);
                    console.log(res.data);
                    setComment('');
                    setImages([]);
                }
            } else {
                Alert.alert("Vui lòng nhập nội dung bình luận")
            }
        } catch (error) {
            Alert.alert('Bình luận không thành công vui lòng thử lại');
        } finally {
            setIsLoadingPost(false);
        }
    }, [commentDebounce]);

    const pickImages = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                setIsLoading(true);
                const base64Images: string[] = await Promise.all(
                    result.assets.map(async (asset) => {
                        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        return `${base64}`;
                    }),
                );
                setImages(base64Images);
            }
        } catch (error) {
            console.error('Error picking images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = useCallback((index: number) => setImages((images) => images.filter((_, i) => i !== index)), []);

    const renderImages = (item: string, index: number) => (
        <Animated.View layout={LinearTransition.springify().damping(80).stiffness(200)}>
            <CustomImage
                source={{ uri: `data:image/jpeg;base64,${item}` }}
                resizeMode="cover"
                className="w-20 h-20 rounded-md"
            />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 10,
                    padding: 5,
                }}
                onPress={() => removeImage(index)}
            >
                <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView className="bg-[#f9f9f9] rounded ">
            {isLoading ? (
                <ActivityIndicator size={30} />
            ) : (
                <FlatList
                    data={images}
                    renderItem={({ item, index }) => renderImages(item, index)}
                    contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 4 }}
                    ItemSeparatorComponent={() => <View className="w-2 h-1 bg-transparent" />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            )}
            <Animated.View
                layout={LinearTransition.duration(300).springify().damping(80).stiffness(200)}
                className="flex flex-row items-center space-x-2 "
            >
                <AnimatedTextInput
                    ref={ref}
                    className="bg-transparent px-2 py-3 flex-1"
                    placeholder="Thêm comment"
                    value={comment}
                    onChangeText={setComment}
                    numberOfLines={5}
                />
                <AnimatedTouchableOpacity onPress={pickImages} className="p-2 ">
                    <Ionicons name="image" size={30} color="#1E90FF" />
                </AnimatedTouchableOpacity>

                {(comment || images.length > 0) &&
                    (isLoadingPost ? (
                        <ActivityIndicator size={30} />
                    ) : (
                        <AnimatedTouchableOpacity
                            className="p-2 "
                            onPress={submitComment}
                            entering={FadeInRight.duration(300).springify()}
                            exiting={FadeOutRight.duration(300).springify()}
                        >
                            <Feather name="send" size={24} color={Colors.primary.green} />
                        </AnimatedTouchableOpacity>
                    ))}
            </Animated.View>
        </SafeAreaView>
    );
});

export default NewComment;
