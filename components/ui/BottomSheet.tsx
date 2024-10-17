import { View, Text, ScrollView } from 'react-native';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Checkbox from './Checkbox';
import { filterByDate, filterByHouse, filterByLandArea, filterByPriceRange } from '@/constants/filter';
import useFilterStore from '@/store/filterStore';
import { Divider } from 'react-native-paper';

export type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref, { dismiss: () => void }>((props, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />,
        [],
    );
    const { house, date, priceRange, landArea, setFilter, getAllFilter } = useFilterStore((state) => ({
        house: state.house,
        date: state.date,
        priceRange: state.priceRange,
        landArea: state.landArea,
        setFilter: state.setFilters,
        getAllFilter: state.getAllFilters
    }));

    return (
        <BottomSheetModal backdropComponent={renderBackdrop} ref={ref} snapPoints={snapPoints} index={1}>
            <View className="w-full">
                <Text className="text-xl font-bold text-center">Bộ Lọc Giá</Text>
                <ScrollView className='mt-2 mb-5 space-y-3'>
                    <View className="flex flex-row ">
                        {/* <Checkbox title="Nhà bán" checked={checked} onChange={() => setChecked(!checked)} /> */}
                        {filterByHouse.map((item) => (
                            <View key={item.id} className="w-1/2 px-2">
                                {/* Wrap each checkbox in a container with padding */}
                                <Checkbox
                                    title={item.title}
                                    checked={house.includes(item.id)}
                                    onChange={() => setFilter('house', item.id)}
                                    color={true} // Use the color prop if needed
                                />
                            </View>
                        ))}
                    </View>
                    <View className="flex flex-row flex-wrap ">
                        {/* <Checkbox title="Nhà bán" checked={checked} onChange={() => setChecked(!checked)} /> */}
                        {filterByDate.map((item) => (
                            <View key={item.id} className="w-1/2 p-2">
                                {/* Wrap each checkbox in a container with padding */}
                                <Checkbox
                                    title={item.title}
                                    checked={date.includes(item.id)}
                                    onChange={() => setFilter('date', item.id)}
                                    // color={true} // Use the color prop if needed
                                />
                            </View>
                        ))}
                    </View>
                    <View className="flex flex-row flex-wrap ">
                        {/* <Checkbox title="Nhà bán" checked={checked} onChange={() => setChecked(!checked)} /> */}
                        {filterByPriceRange.map((item) => (
                            <View key={item.id} className="w-1/2 p-2">
                                {/* Wrap each checkbox in a container with padding */}
                                <Checkbox
                                    title={item.title}
                                    checked={priceRange.includes(item.id)}
                                    onChange={() => setFilter('priceRange', item.id)}
                                    // color={true} // Use the color prop if needed
                                />
                            </View>
                        ))}
                    </View>
                    <View className="flex flex-row flex-wrap ">
                        {/* <Checkbox title="Nhà bán" checked={checked} onChange={() => setChecked(!checked)} /> */}
                        {filterByLandArea.map((item) => (
                            <View key={item.id} className="w-1/2 p-2">
                                {/* Wrap each checkbox in a container with padding */}
                                <Checkbox
                                    title={item.title}
                                    checked={landArea.includes(item.id)}
                                    onChange={() => setFilter('landArea', item.id)}
                                    color={true} // Use the color prop if needed
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </BottomSheetModal>
    );
});

export default BottomSheet;
