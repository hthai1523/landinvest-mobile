import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { ListMarker } from '@/constants/interface';
import { formatToVND } from '@/functions/formatVND';
import CustomButton from '../ui/Button';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheetCallout from '../ui/BottomSheetCallout';

const CustomCalloutView = ({ marker }: { marker: ListMarker }) => {
    const { dismiss } = useBottomSheetModal();
    const sheetRef = useRef<BottomSheetModal>(null);

    const openBottomSheet = useCallback(() => {
        sheetRef.current?.present();
    }, []);
    return (
        <>
            <View className="w-40 h-fit p-2 space-y-2">
                <Text className="text-base font-bold">{marker?.description || 'No description'}</Text>
                <Text className="">Giá/m²: {formatToVND(marker?.priceOnM2) || 'No description'}</Text>
                <CustomButton onPress={openBottomSheet} title="Xem chi tiết" />
            </View>
            <BottomSheetCallout dismiss={dismiss} ref={sheetRef} marker={marker} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150, // Adjust the width as needed
        padding: 8,
        // backgroundColor: 'white',
    },
});

export default CustomCalloutView;
