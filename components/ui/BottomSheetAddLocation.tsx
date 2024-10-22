import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
} from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomButton from './Button';
import { DollarIcon } from '@/assets/icons';
import TextInput from 'react-native-text-input-interactive';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import CustomImage from './Image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AnimatedTouchableOpacity } from './AnimatedComponents';
import Colors from '@/constants/Colors';
import { useDebouncedCallback } from 'use-debounce';
import Checkbox from './Checkbox';
import { filterByHouse } from '@/constants/filter';
import useAuthStore from '@/store/authStore';
import { router } from 'expo-router';
import { AddNewLocation } from '@/service';
import { PayloadNewLocation } from '@/constants/interface';
import useSearchStore from '@/store/searchStore';

interface BottomSheetAddLocationProps {
    dismiss: () => void;
    lat: number | undefined;
    lon: number | undefined;
}

const addLocationFormSchema = z.object({
    price: z.number({
        invalid_type_error: 'Giá tiền phải là 1 số',
        required_error: 'Giá tiền là bắt buộc',
    }),
    dienTich: z.number({
        invalid_type_error: 'Diện tích phải là 1 số',
        required_error: 'Diện tích là bắt buộc',
    }),
    houseType: z.string({
        required_error: 'Loại nhà là bắt buộc',
    }),
    description: z.string().optional(),
    images: z.array(z.string()),
});

type AddLocationFormSchema = z.infer<typeof addLocationFormSchema>;

export type Ref = BottomSheetModal;

const width = Dimensions.get('screen').width - 24;

const BottomSheetAddLocation = forwardRef<Ref, BottomSheetAddLocationProps>(({ dismiss, lat, lon }, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />,
        [],
    );

    const userId = useAuthStore.getState().userId;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AddLocationFormSchema>({
        resolver: zodResolver(addLocationFormSchema),
        mode: 'onBlur',
        defaultValues: {
            images: [],
        },
    });

    const [images, setImages] = useState<string[]>([]);
    const [imageLink, setImageLink] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const selectedIdDistrict = useSearchStore((state) => state.districtId);
    const pickImage = async () => {
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
                        return base64;
                    }),
                );
                console.log(base64Images)
                setImages((prevImages) => [...prevImages, ...base64Images]);
                setValue('images', [...images, ...base64Images]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = useCallback((index: number) => {
        setImages((prevImages) => {
            const newImages = prevImages.filter((_, i) => i !== index);
            setValue('images', newImages);
            return newImages;
        });
    }, []);

    const renderImages = (item: string, index: number) => {
        const isBase64 = item.length > 100
        const imageSource = isBase64 ? { uri: `data:image/jpeg;base64,${item}` } : { uri: item };

        return (
            <AnimatedTouchableOpacity
                onPress={() => {
                    isBase64 ||
                        router.navigate({
                            pathname: '/(modals)/preview',
                            params: { image: item },
                        });
                }}
                layout={LinearTransition.springify().damping(80).stiffness(200)}
                key={index}
            >
                <CustomImage source={imageSource} resizeMode="cover" className="w-20 h-20 rounded-md" />
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
            </AnimatedTouchableOpacity>
        );
    };


    const onsubmit = async (data: AddLocationFormSchema) => {
        if (!selectedIdDistrict || !lat || !lon) {
            Alert.alert('Vui lòng chọn địa điểm');
            return;
        }
        if (!userId) {
            Alert.alert('Vui lòng đăng nhập');
            return;
        }
        const payload: PayloadNewLocation = {
            idUser: userId,
            imageLink: images,
            description: data.description,
            longitude: lon,
            latitude: lat,
            priceOnM2: data.price,
            idDistrict: selectedIdDistrict,
            area: data.dienTich,
            typeArea: data.houseType,
        };

        try {
            setIsLoadingSubmit(true);
            const response = await AddNewLocation(payload);
            console.log(response);
            if (response) {
                Alert.alert('Thêm mảnh đất thành công');
            }
        } catch (error) {
            Alert.alert('Thêm mảnh đất thất bại');
            console.error(error);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    const isValidImageLink = async (link: string): Promise<boolean> => {
        try {
            const response = await fetch(link, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            return response.ok && !!contentType && contentType.startsWith('image/');
        } catch (error) {
            return false;
        }
    };

    const handleSubmitImage = async (text: string) => {
        if (await isValidImageLink(text)) {
            setImages((prev) => {
                const newImages = [...prev, text];
                setValue('images', newImages);
                return newImages;
            });
            setImageLink('');
        } else {
            Alert.alert('Thông báo', 'Vui lòng nhập đường link hình ảnh hợp lệ.');
        }
    };

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={2}
            onDismiss={dismiss}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    className="space-y-3"
                    keyboardShouldPersistTaps="handled"
                >
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

                    <View className="flex flex-row items-center space-x-1 mb-3">
                        <View style={{ flex: 1, position: 'relative' }}>
                            <TextInput
                                placeholder="Nhập link ảnh"
                                textInputStyle={{
                                    width: '100%',
                                }}
                                mainColor={Colors.primary.green}
                                placeholderTextColor={Colors.primary.green}
                                onChangeText={setImageLink}
                                value={imageLink}
                            />
                            {imageLink === '' && (
                                <AnimatedTouchableOpacity
                                    onPress={pickImage}
                                    entering={FadeIn.duration(300)}
                                    exiting={FadeOut.duration(300)}
                                    className="absolute top-0 right-0 h-full justify-center mr-1"
                                >
                                    <Ionicons name="image" size={30} color={Colors.primary.green} />
                                </AnimatedTouchableOpacity>
                            )}
                        </View>
                        <CustomButton
                            onPress={() => handleSubmitImage(imageLink)}
                            title="Tải ảnh"
                            className="py-4 rounded-md"
                            type="secondary"
                        />
                    </View>

                    <Controller
                        control={control}
                        name="price"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <View className="bg-[#3e6b00] rounded-md mb-2 pr-2 flex flex-row items-center">
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            placeholder="Giá tiền"
                                            placeholderTextColor={'white'}
                                            textInputStyle={{
                                                backgroundColor: 'transparent',
                                                width: '100%',
                                                color: 'white',
                                                borderWidth: 0,
                                            }}
                                            onBlur={onBlur}
                                            onChangeText={(text) => onChange(Number(text))}
                                            keyboardType="numeric"
                                            value={value?.toString()}
                                        />
                                    </View>
                                    <DollarIcon />
                                </View>
                                {errors.price && (
                                    <Text style={{ color: 'red', marginVertical: 8 }}>{errors.price?.message}</Text>
                                )}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="dienTich"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <View className="bg-[#3e6b00] rounded-md pr-2 flex flex-row items-center">
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            placeholder="Diện tích"
                                            placeholderTextColor={'white'}
                                            textInputStyle={{
                                                backgroundColor: 'transparent',
                                                width: '100%',
                                                color: 'white',
                                                borderWidth: 0,
                                            }}
                                            onBlur={onBlur}
                                            onChangeText={(text) => onChange(Number(text))}
                                            keyboardType="numeric"
                                            value={value?.toString()}
                                        />
                                    </View>
                                    <MaterialIcons name="landslide" size={22} color="white" />
                                </View>
                                {errors.dienTich && (
                                    <Text style={{ color: 'red', marginVertical: 8 }}>{errors.dienTich?.message}</Text>
                                )}
                            </>
                        )}
                    />

                    <View className="bg-[#C9C9C9] py-2 px-4 rounded-md">
                        <Text className="font-normal text-base">Kinh tuyến: {lat}</Text>
                    </View>

                    <View className="bg-[#C9C9C9] py-2 px-4 rounded-md">
                        <Text className="font-normal text-base">Vĩ tuyến: {lon}</Text>
                    </View>

                    <Controller
                        control={control}
                        name="houseType"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <FlatList
                                    data={filterByHouse}
                                    renderItem={({ item, index }) => (
                                        <View
                                            style={{
                                                width: '50%',
                                                paddingLeft: index % 2 === 0 ? 0 : 4,
                                                paddingRight: index % 2 === 0 ? 4 : 0,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Checkbox
                                                title={item.title}
                                                checked={value === item.title}
                                                onChange={() => {
                                                    onChange(item.title);
                                                }}
                                                color
                                            />
                                        </View>
                                    )}
                                    numColumns={2}
                                    keyExtractor={(item) => item.id.toString()}
                                    scrollEnabled={false}
                                    contentContainerStyle={{ width: '100%', paddingVertical: 4, marginTop: 8 }}
                                />
                                {errors.houseType && (
                                    <Text style={{ color: 'red', marginVertical: 8 }}>{errors.houseType?.message}</Text>
                                )}
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder="Mô tả"
                                multiline
                                numberOfLines={10}
                                className="font-normal text-sm"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textInputStyle={{
                                    width: '100%',
                                }}
                                mainColor={Colors.primary.green}
                                placeholderTextColor={Colors.primary.green}
                            />
                        )}
                    />

                    <CustomButton
                        isLoading={isLoadingSubmit}
                        title="Đăng bài"
                        onPress={handleSubmit(onsubmit)}
                        className="py-3"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </BottomSheetModal>
    );
});

export default BottomSheetAddLocation;
