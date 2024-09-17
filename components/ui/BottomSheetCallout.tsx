import { View, Text, ScrollView, Dimensions } from 'react-native';
import React, { forwardRef, useMemo, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { ListMarker } from '@/constants/interface';
import { formatToVND } from '@/functions/formatVND';
import { calcDate } from '@/functions/calcDate';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';
// import Image360Viewer from '@hauvo/react-native-360-image-viewer'

interface BottomSheetCalloutProps {
    dismiss: () => void;
    marker: ListMarker;
}

export type Ref = BottomSheetModal;
const { width, height } = Dimensions.get('screen');
const BottomSheetCallout = forwardRef<Ref, BottomSheetCalloutProps>(({ dismiss, marker }, ref) => {
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />,
        [],
    );

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={dismiss}
        >
            <ScrollView contentContainerStyle={{ padding: 16 }} className="space-y-2">
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-lg font-bold">{marker.description || 'No description'}</Text>
                    <Avatar size={32} rounded title="T" containerStyle={{ backgroundColor: Colors.primary.green }} />
                </View>
                <Text>Loại tài sản: {marker?.typeArea}</Text>
                <Text>Giá/m²: {formatToVND(marker.priceOnM2)}</Text>
                <Text>Ngày đăng: {calcDate(marker?.addAt)}</Text>
                <Text>Diện tích: {marker?.area} m²</Text>
                <View className="flex-1">
                    {/* <Image360Viewer srcset={[marker.imageLink[0]]} width={width} height={height} /> */}
                </View>
            </ScrollView>
        </BottomSheetModal>
    );
});

export default BottomSheetCallout;
