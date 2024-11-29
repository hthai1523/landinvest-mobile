import React, { useCallback, useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Divider } from '@rneui/themed';
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

import Map from '@/components/Map/Map';
import BottomSheet from '@/components/ui/BottomSheet';
import BottomSheetQuyHoach from '@/components/ui/BottomSheetQuyHoach';
import { CheckpointsIcon, DollarIcon, MapLocationIcon, RecyclebinIcon } from '@/assets/icons';
import Colors from '@/constants/Colors';
import useSearchStore from '@/store/searchStore';
import { LocationData } from '@/constants/interface';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const YEAR_QUY_HOACH = ['Quy Hoạch 2024', 'Quy hoạch 2030', 'Quy hoạch khác'];

const Page = () => {
    const [activeYear, setActiveYear] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [locationInfo, setLocationInfo] = useState<LocationData | null>(null);
    const { dismiss } = useBottomSheetModal();
    const sheetRef = useRef<BottomSheetModal>(null);
    const sheetQuyHoachRef = useRef<BottomSheetModal>(null);
    const progress = useSharedValue(1);
    const min = useSharedValue(0);
    const max = useSharedValue(1);

    const { lat, lon } = useSearchStore((state) => state);
    

    const openBottomSheet = useCallback(() => {
        sheetRef.current?.present();
    }, []);

    const openBottomSheetQuyHoach = useCallback(() => {
        sheetQuyHoachRef.current?.present();
    }, []);

    const handleBottomSheetQuyHoachDismiss = useCallback(() => {
        setActiveYear(0);
        sheetQuyHoachRef.current?.dismiss();
    }, []);

    const handleQuyHoach = useCallback(
        (index: number) => {
            setActiveYear(index);
            if (index === 2) {
                openBottomSheetQuyHoach();
            }
        },
        [openBottomSheetQuyHoach],
    );

    const renderYearButtons = useMemo(
        () =>
            YEAR_QUY_HOACH.map((item, index) => (
                <Button
                    key={index}
                    onPress={() => handleQuyHoach(index)}
                    buttonStyle={[styles.buttonYearStyle, activeYear == index && styles.activeYear]}
                >
                    <Text className={`${activeYear === index ? 'text-white' : 'text-[#333]'}`}>{item}</Text>
                </Button>
            )),
        [activeYear, handleQuyHoach],
    );

    const handleOpacityChange = useCallback((value: number) => {
        setOpacity(Number(value.toFixed(1)));
    }, []);

    return (
        <View className="flex-1 justify-center items-center relative">
            <StatusBar style="light" />
            <Map opacity={opacity} lat={lat} lon={lon} setLocationInfo={setLocationInfo} locationInfo={locationInfo} />
            <View className=" w-full absolute bottom-0 left-0 py-1" style={{ backgroundColor: Colors.primary.header }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2 ">
                    <View
                        className="h-full min-w-[300px] bg-[#D9D9D9] rounded-3xl flex flex-row items-center justify-center space-x-2 px-2">
                        <MapLocationIcon />
                        <Text className="flex-1 font-normal text-sm">
                            {locationInfo?.administrativeArea}, {locationInfo?.subAdministrativeArea}
                        </Text>
                    </View>
                    {renderYearButtons}
                    <Button onPress={openBottomSheet} buttonStyle={styles.buttonDollarStyle}>
                        <DollarIcon />
                        <Text className="mx-1 text-white">Hiển thị giá</Text>
                        <Feather name="chevron-down" size={18} color="#fff" />
                    </Button>
                </ScrollView>
            </View>

            <View className="absolute bottom-[115px] right-[-40px] rotate-[-90deg]">
                <Slider
                    progress={progress}
                    style={{ width: 120 }}
                    minimumValue={min}
                    maximumValue={max}
                    theme={{
                        disableMinTrackTintColor: '#fff',
                        maximumTrackTintColor: '#fff',
                        minimumTrackTintColor: Colors.primary.green,
                        cacheTrackTintColor: '#fff',
                        bubbleBackgroundColor: '#666',
                        heartbeatColor: '#999',
                    }}
                    onValueChange={handleOpacityChange}
                />
            </View>


            <BottomSheet dismiss={dismiss} ref={sheetRef} />
            <BottomSheetQuyHoach dismiss={handleBottomSheetQuyHoachDismiss} ref={sheetQuyHoachRef} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    }, // className="w-fit p-2 rounded-3xl text-center items-center"

    buttonYearStyle: {
        borderRadius: 24,
        backgroundColor: '#D9D9D9',
        color: '#333',
        height: '100%',
    },
    buttonSaveStyle: {
        backgroundColor: '#B74C00',
        flexDirection: 'row',
        textAlign: 'center',
        borderRadius: 24,
    },
    buttonDollarStyle: {
        backgroundColor: Colors.primary.green,
        flexDirection: 'row',
        textAlign: 'center',
        borderRadius: 24,
    },
    activeYear: {
        backgroundColor: Colors.primary.green,
        color: '#fff',
    },
});
export default Page;
