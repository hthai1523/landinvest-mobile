import { View, Text, ScrollView, Dimensions, TextInput } from 'react-native';
import React, { forwardRef, useMemo, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { ListMarker } from '@/constants/interface';
import { formatToVND } from '@/functions/formatVND';
import { calcDate } from '@/functions/calcDate';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';
import useSearchStore from '@/store/searchStore';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomButton from './Button';
import { DollarIcon } from '@/assets/icons';
// import Image360Viewer from '@hauvo/react-native-360-image-viewer'

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
    checkbox: z.boolean({
        required_error: 'Loại đất bán là bắt buộc',
    }),
});
type AddLocationFormSchema = z.infer<typeof addLocationFormSchema>;

export type Ref = BottomSheetModal;
const BottomSheetAddLocation = forwardRef<Ref, BottomSheetAddLocationProps>(({ dismiss, lat, lon }, ref) => {
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />,
        [],
    );
    const districtId = useSearchStore((state) => state.districtId);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddLocationFormSchema>({
        resolver: zodResolver(addLocationFormSchema),
        mode: 'onBlur',
    });
    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={dismiss}
        >
            <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16 }} className="space-y-3">
                <View className="flex flex-row items-center space-x-1">
                    <TextInput
                        placeholder="Nhập link ảnh"
                        className="border border-[#d9d9d9] rounded-md px-2 py-3 flex-1"
                    />
                    <CustomButton title="Tải ảnh" className="py-3 rounded-md" type="secondary" />
                </View>
                <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <View className="bg-[#3e6b00] p-2 rounded-md mb-2 flex flex-row items-center justify-between">
                                <TextInput
                                    placeholder="Giá tiền"
                                    placeholderTextColor={'white'}
                                    style={{ color: 'white', flex: 1 }} // Style text to be visible on the background
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text ||"0")}
                                    value={formatToVND(value.toString()) || ""}
                                    keyboardType="numeric" // Ensure numeric input
                                />
                                <DollarIcon />
                            </View>
                            {errors.price && <Text style={{ color: 'red' }}>{errors.price?.message}</Text>}
                        </>
                    )}
                />
            </ScrollView>
        </BottomSheetModal>
    );
});

export default BottomSheetAddLocation;
