import { View, Text, ScrollView, FlatList, Platform } from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import Checkbox from './Checkbox';
import useFilterStore from '@/store/filterStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useSearchStore from '@/store/searchStore';
import axios from 'axios';
import { QuyHoachResponse } from '@/constants/interface';
import QuyHoachSection from '../BottomSheetQuyHoach/QuyHoachSection';
import { fetchAllProvince, fetchDistrictsByProvinces } from '@/service';
import TreeSelector from './TreeSelector';
import { TreeDataTypes, TreeSelect } from 'react-native-tree-selection';
import { TreeView, type TreeNode, type TreeViewRef } from 'react-native-tree-multi-select';
import { SearchBar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { getBoundingBoxCenterFromString } from '@/functions/getBoundingBoxCenterFromString';
import { router, useLocalSearchParams } from 'expo-router';

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
    const [originalTreeData, setOriginalTreeData] = useState<TreeNode[]>([]);
    const treeViewRef = React.useRef<TreeViewRef | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [debouncedSearch] = useDebounce(search, 500);

    const updateSearch = (value: string) => {
        setSearch(value);
        treeViewRef.current?.setSearchText(value, ['name']);
    };

    const { quyhoach, vitri } = useLocalSearchParams<{
        quyhoach?: string;
        vitri?: string;
    }>();

    const expandNodes = (idsToExpand: string[]) => treeViewRef.current?.expandNodes?.(idsToExpand);

    useEffect(() => {
        fetchProvinces();
        if (quyhoach) {
            const quyhoachKeys = quyhoach.split(',').map((id) => `plan-${id}`);
            setCheckedKeys(quyhoachKeys);
        }
    }, []);

    // console.log("checkedKeys", checkedKeys);

    const fetchProvinces = async () => {
        try {
            setLoading(true);
            const provinces = await fetchAllProvince();
            const provincesData = await Promise.all(
                provinces.map(async (province) => {
                    const districts = await fetchDistricts(province.TinhThanhPhoID);
                    if (districts.length > 0) {
                        return {
                            name: province.TenTinhThanhPho,
                            id: `province-${province.TinhThanhPhoID}`,
                            children: districts,
                        };
                    }
                    return null;
                }),
            );
            const filteredProvincesData = provincesData.filter((province) => province !== null);
            setTreeData(filteredProvincesData);
            setOriginalTreeData(filteredProvincesData);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const fetchDistricts = async (provinceId: number) => {
        try {
            const districts = await fetchDistrictsByProvinces(provinceId);
            const districtDataWithPlanning = await Promise.all(
                districts.map(async (district) => {
                    const planningData = await fetchPlanningData(district.DistrictID);
                    if (planningData.length > 0) {
                        return {
                            name: district.DistrictName,
                            id: `district-${district.DistrictID}`,
                            children: planningData,
                        };
                    }
                    return null;
                }),
            );
            return districtDataWithPlanning.filter((district) => district !== null);
        } catch (error) {
            return [];
        }
    };

    const fetchPlanningData = async (districtId: number) => {
        try {
            const { data } = await axios.get<QuyHoachResponse[]>(
                `https://apilandinvest.gachmen.org/quyhoach1quan/${districtId}`,
            );
            if (Array.isArray(data) && data.length > 0) {
                return data.map((plan) => ({
                    name: plan.description,
                    id: `plan-${plan.id}`,
                }));
            }
            return [];
        } catch (error) {
            // console.error('Error fetching planning data:', error);
            return [];
        }
    };

    const handleSelect = useCallback(async (checkedKeysValue: string[]) => {
        if (!Array.isArray(checkedKeysValue)) return;
        console.log('checkedkeyvalue', checkedKeysValue);

        const quyhoachIds = checkedKeysValue
            .filter((key) => key?.startsWith('plan-'))
            .map((key) => key?.split('-')[1])
            .filter((id) => id != null);
        const districtIds = checkedKeysValue
            .filter((key) => key?.startsWith('district-'))
            .map((key) => key?.split('-')[1])
            .filter((id) => id != null);

        if (districtIds.length > 0 && quyhoachIds.length > 0) {
            const id = districtIds[districtIds.length - 1];

            try {
                const { data } = await axios.get(
                    `https://apilandinvest.gachmen.org/quyhoach1quan/${id}`,
                );
                const { centerLatitude, centerLongitude } = getBoundingBoxCenterFromString(
                    data[0]?.boundingbox,
                );
                router.push({
                    pathname: '/(tabs)/',
                    params: {
                        quyhoach: quyhoachIds.toString(),
                        vitri: `${centerLatitude},${centerLongitude}`,
                    },
                });
            } catch (error) {}
        }
    }, []);

    const handleResetSearch = () => {
        setSearch('');
        setTreeData(originalTreeData);
    };

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={props.dismiss}
        >
            <View className="flex-1">
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    // <TreeSelector treeData={treeData} onSelect={handleSelect} />
                    // <TreeSelect
                    //     data={treeData}
                    //     childKey="data"
                    //     titleKey="title"
                    //     onCheckBoxPress={(item) => console.log(item)}
                    //     parentTextStyles={{ color: '#000' }}
                    //     leftIconStyles={{ tintColor: '#000' }}
                    //     rightIconStyles={{ tintColor: '#000' }}
                    //     parentContainerStyles={{
                    //         backgroundColor: 'transparent',
                    //         width: '100%',
                    //         flexDirection: 'row',
                    //     }}
                    //     childContainerStyles={{
                    //         backgroundColor: 'transparent',
                    //         width: '100%',
                    //         flexDirection: 'row',
                    //     }}
                    //     childTextStyles={{ color: '#000' }}
                    // />
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
                            // showLoading={isLoading}
                            showCancel={false}
                            onClear={() => handleResetSearch()}
                            onCancel={() => handleResetSearch()}
                        />
                        <TreeView
                            ref={treeViewRef}
                            data={treeData}
                            onCheck={(key) => handleSelect(key)}
                            preselectedIds={['plan-64']}
                        />
                    </>
                )}
            </View>
        </BottomSheetModal>
    );
});

export default memo(BottomSheetQuyHoach);
