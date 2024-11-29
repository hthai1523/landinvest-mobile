import {
    View,
    Text,
    ScrollView,
    Dimensions,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { ListMarker } from '@/constants/interface';
import { formatToVND } from '@/functions/formatVND';
import { calcDate } from '@/functions/calcDate';
import { Avatar } from '@rneui/themed';
import Colors from '@/constants/Colors';
import CustomImage from './Image';
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import { Link, router } from 'expo-router';

interface BottomSheetCalloutProps {
    dismiss: () => void;
    marker: ListMarker;
}

export type Ref = BottomSheetModal;
const { width, height } = Dimensions.get('screen');
const BottomSheetCallout = forwardRef<Ref, BottomSheetCalloutProps>(({ dismiss, marker }, ref) => {
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
        ),
        [],
    );

    return (
        <>
            <BottomSheetModal
                backdropComponent={renderBackdrop}
                ref={ref}
                snapPoints={snapPoints}
                index={1}
                onDismiss={dismiss}
                enableContentPanningGesture={false}
            >
                <ScrollView className="space-y-2" scrollEnabled={true}>
                    <View className="px-4 space-y-2">
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-lg font-bold">
                                {marker.description || 'No description'}
                            </Text>
                            <Avatar
                                size={32}
                                rounded
                                title="T"
                                containerStyle={{ backgroundColor: Colors.primary.green }}
                            />
                        </View>
                        <Text>Loại tài sản: {marker?.typeArea}</Text>
                        <Text>Giá/m²: {formatToVND(marker.priceOnM2)}</Text>
                        <Text>Ngày đăng: {calcDate(marker?.addAt)}</Text>
                        <Text>Diện tích: {marker?.area} m²</Text>
                    </View>
                    {/* <Image360Viewer srcset={[marker.imageLink[0]]} width={width} height={height} /> */}
                    <FlatList
                        data={marker.imageLink}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    router.navigate({
                                        pathname: '/(modals)/preview',
                                        params: { image: item.imageLink },
                                    });
                                    dismiss();
                                }}
                            >
                                <CustomImage
                                    style={{ height: 300, width: width }}
                                    resizeMode="cover"
                                    source={{ uri: item.imageLink }}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View className="w-1 h-3" />}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
            </BottomSheetModal>
            {/* {previewItem && (
                <Modal
                    hasBackdrop={true}
                    backdropOpacity={0}
                    hideModalContentWhileAnimating={true}
                    animationIn={'fadeInUp'}
                    animationOut={'fadeOutDown'}
                    useNativeDriverForBackdrop={true}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    // backdropTransitionInTiming={1}
                    // backdropTransitionOutTiming={1}
                    isVisible={true}
                    onBackdropPress={() => setPreviewItem(false)}
                    // style={{width: width, height: height}}
                >
                    <WebView
                        style={{ width: width, height: height }}
                        source={{ uri: 'https://web-view360-image.vercel.app/?image=https://i.imgur.com/cZPgkcT.jpeg' }}
                        renderLoading={() => <ActivityIndicator size={30} />}
                    />
                </Modal>
            )} */}
        </>
    );
});

export default BottomSheetCallout;
