import { View, Text, ScrollView, Platform } from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { TinhQuyHoach } from '@/constants/interface';
import { TreeView, type TreeNode, type TreeViewRef } from 'react-native-tree-multi-select';
import { SearchBar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import useQuyHoachStore from '@/store/quyhoachStore';
import { getBoundingBoxCenterFromString } from '@/functions/getBoundingBoxCenterFromString';

export type Ref = BottomSheetModal;

const BottomSheetQuyHoach = forwardRef<Ref, { dismiss: () => void }>((props, ref) => {
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
        ),
        [],
    );

    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const treeViewRef = React.useRef<TreeViewRef | null>(null);
    const [search, setSearch] = useState<string>('');
    const [listQuyHoach, setListQuyHoach] = useState<TinhQuyHoach[]>([]);
    const updateSearch = (value: string) => {
        setSearch(value);
        treeViewRef.current?.setSearchText(value, ['name']);
    };

    const doSetListIdQuyHoach = useQuyHoachStore.getState().doSetListIdQuyHoach;
    const doSetBoundingboxQuyHoach = useQuyHoachStore.getState().doSetBoundingboxQuyHoach;
    const listIdQuyHoach = useQuyHoachStore.getState().listIdQuyHoach;

    const preselectedIds = useMemo(() => [...listIdQuyHoach], [listIdQuyHoach]);

    useEffect(() => {
        const fetchQuyHoach = async () => {
            try {
                const response = await axios.get(
                    'https://api.quyhoach.xyz/sap_xep_tinh_quan_huyen',
                );
                const data = response.data; 
                if (Array.isArray(data) && data.length > 1) {
                    setListQuyHoach(data[1]);
                } 
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuyHoach();
    }, []);

    const dataSource = useMemo(() => {
        return listQuyHoach.map((tinh: any) => ({
            name: tinh.name_tinh,
            id: `province-${tinh.id_tinh}`,
            children: tinh.quan_huyen_1_tinh.map((huyen: any) => ({
                name: huyen.name_huyen,
                id: `district-${huyen.id_huyen}`,
                children: huyen.quyhoach.map((quyhoach: any) => ({
                    id: `plan-${quyhoach.id_quyhoach}`,
                    name: quyhoach.description,
                })),
            })),
        }));
    }, [listQuyHoach]);

    useEffect(() => {
        setTreeData(dataSource.slice(16, 26));
    }, [dataSource]);

    const handleSelect = async (checkedKeysValue: string[]) => {
        if (!Array.isArray(checkedKeysValue)) return;
        console.log('checkedkeyvalue', checkedKeysValue);   
        doSetListIdQuyHoach(checkedKeysValue);    

        // const districtIds = checkedKeysValue
        // .filter((key) => key?.startsWith('district-'))
        // .map((key) => key?.split('-')[1])
        // .filter((id) => id != null);


        // if (districtIds.length > 0) {
        //     const id = districtIds[districtIds.length - 1];

        //     try {
        //         const { data } = await axios.get(
        //             `https://api.quyhoach.xyz/quyhoach1quan/${id}`,
        //         );
        //         const { centerLatitude, centerLongitude } = getBoundingBoxCenterFromString(
        //             data[0]?.boundingbox,
        //         );
        //        doSetBoundingboxQuyHoach(centerLatitude, centerLongitude)
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    };

    const handleResetSearch = () => {
        setSearch('');
        setTreeData(dataSource);
    };

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={props.dismiss}
            enableContentPanningGesture={false}
        >
            <ScrollView className="flex-1">
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <SearchBar
                            placeholder="Tìm kiếm..."
                            onChangeText={updateSearch}
                            value={search}
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderBottomColor: 'transparent',
                                borderTopColor: 'transparent',
                            }}
                            inputContainerStyle={{
                                backgroundColor: '#f0f0f0',
                            }}
                            inputStyle={{
                                color: '#333',
                            }}
                            searchIcon={<Ionicons name="search-outline" size={20} />}
                            platform={Platform.OS === 'ios' ? 'ios' : 'android'}
                            clearIcon={
                                <Ionicons name="close-circle-outline" size={24} color={'#333'} />
                            }
                            showCancel={false}
                            onClear={() => handleResetSearch()}
                            onCancel={() => handleResetSearch()}
                        />
                        <TreeView
                            ref={treeViewRef}
                            data={treeData}
                            onCheck={handleSelect}
                        />
                    </>
                )}
            </ScrollView>
        </BottomSheetModal>
    );
});

export default memo(BottomSheetQuyHoach);
