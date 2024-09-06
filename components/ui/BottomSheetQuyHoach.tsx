import { View, Text, ScrollView, FlatList } from 'react-native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Checkbox from './Checkbox';
import useFilterStore from '@/store/filterStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useSearchStore from '@/store/searchStore';
import axios from 'axios';
import { QuyHoachResponse } from '@/constants/interface';
import QuyHoachSection from '../BottomSheetQuyHoach/QuyHoachSection';

export type Ref = BottomSheetModal;

const BottomSheetQuyHoach = forwardRef<Ref, { dismiss: () => void }>((props, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />,
        [],
    );

    const districtId = useSearchStore((state) => state.districtId);
    const [listQuyHoach, setListQuyHoach] = useState<QuyHoachResponse[]>([]);
    const [selectedIDQuyHoach, setSelectedIDQuyHoach] = useState<number[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get<QuyHoachResponse[]>(
                    `https://apilandinvest.gachmen.org/quyhoach1quan/${districtId}`,
                );
                setListQuyHoach(data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setListQuyHoach([]);
            }
        };

        fetchData();
    }, [districtId]);

    const handleChangeIDQuyHoach = useCallback((id: number) => {
        setSelectedIDQuyHoach((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }, []);

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={props.dismiss}
        >
            {listQuyHoach.length > 0 ? (
                <FlatList
                    data={listQuyHoach}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <QuyHoachSection
                            quyhoach={item}
                            checked={selectedIDQuyHoach.includes(item.id)}
                            onChange={() => handleChangeIDQuyHoach(item.id)}
                        />
                    )}
                    contentContainerStyle={{paddingHorizontal: 8, paddingTop: 12}}
                />
            ) : (
                <Text className='text-center mt-4'>Không có quy hoạch tại quận này</Text>
            )}
        </BottomSheetModal>
    );
});

export default BottomSheetQuyHoach;
