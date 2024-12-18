import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Colors from '@/constants/Colors';
import { Organization } from '@/constants/interface';
import { fetchAllProvince, fetchOrganization } from '@/service';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from 'react-native-text-input-interactive';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import FormFieldAuction from '../ui/FormFieldAuction';

const auctionFormSchema = z.object({
    tenTaiSan: z.string({
        required_error: 'Tên tài sản là bắt buộc',
    }),
    toChucDGTS: z.string({
        required_error: 'Tên tổ chức đấu giá tài sản là bắt buộc',
    }),

    tuNgay: z
        .string({
            required_error: 'Ngày là bắt buộc',
        })
        .refine((date) => !isNaN(new Date(date).getTime()), {
            message: 'Ngày không hợp lệ',
        }),
    denNgay: z
        .string({
            required_error: 'Ngày là bắt buộc',
        })
        .refine((date) => !isNaN(new Date(date).getTime()), {
            message: 'Ngày không hợp lệ',
        }),
    tinhThanhPho: z.string({
        required_error: 'Tên tỉnh thành phố là bắt buộc',
    }),
    // quanHuyen: z.string({
    //     required_error: 'Tên quận huyện là bắt buộc',
    // }),
    tuGia: z
        .string({
            required_error: 'Giá là bắt buộc',
            invalid_type_error: 'Giá phải là 1 số',
        })
        .min(0, 'Giá phải lớn hơn 0'),
    denGia: z
        .string({
            required_error: 'Giá là bắt buộc',
            invalid_type_error: 'Giá phải là 1 số',
        })
        .min(0, 'Giá phải lớn hơn 0'),
});

export type AuctionFormSchema = z.infer<typeof auctionFormSchema>;
interface TransformedOrganization {
    key: number;
    value: string;
}

interface IProps {
    setIsBackDrop: (value: boolean) => void;
    onSubmitFilter: (value: AuctionFormSchema) => void;
}

const AuctionsForm = ({ setIsBackDrop, onSubmitFilter }: IProps) => {
    const [listOrganizer, setListOrganizer] = useState<{ key: number; value: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isDropdownProvinceVisible, setIsDropdownProvinceVisible] = useState(false);

    const [listProvince, setListProvince] = useState<
        { TenTinhThanhPho: string; TinhThanhPhoID: number }[]
    >([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AuctionFormSchema>({
        resolver: zodResolver(auctionFormSchema),
        mode: 'onBlur',
    });

    const getListOrganization = useCallback(async () => {
        try {
            const data = await fetchOrganization();
            if (data?.message?.length) {
                const transformedData = data.message.map((org: Organization) => ({
                    key: org.id,
                    value: org.name,
                }));
                setListOrganizer(transformedData);
            }
        } catch (error) {
            Alert.alert('Lỗi khi lấy các tổ chức');
        }
    }, []);

    const getListProvince = useCallback(async () => {
        try {
            const data = await fetchAllProvince();
            setListProvince(data);
        } catch (error) {
            Alert.alert('Lỗi khi lấy tỉnh, thành phố');
        }
    }, []);

    useEffect(() => {
        getListOrganization();
        getListProvince();
    }, []);

    const filteredOrganizers = useMemo(() => {
        return listOrganizer.filter((org) =>
            org.value.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [listOrganizer, searchQuery]);

    const filteredProvinces = useMemo(() => {
        if (searchQuery) {
            return listProvince.filter((item) =>
                item.TenTinhThanhPho.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }
        return listProvince;
    }, [listProvince, searchQuery]);

    const renderItem = useCallback(
        ({ item, onChange }: { item: TransformedOrganization; onChange: any }) => (
            <TouchableOpacity
                onPress={() => {
                    // setSearchQuery(item.value);
                    onChange(item.value);
                    setIsDropdownVisible(false);
                    setIsBackDrop(false);
                }}
            >
                <Text style={styles.listItem}>{item.value}</Text>
            </TouchableOpacity>
        ),
        [],
    );
    const renderProvinceItem = useCallback(
        ({
            item,
            onChange,
        }: {
            item: { TenTinhThanhPho: string; TinhThanhPhoID: number };
            onChange: any;
        }) => (
            <TouchableOpacity
                onPress={() => {
                    // setSearchQuery(item.TinhThanhPhoID.toString());
                    onChange(item.TenTinhThanhPho);
                    setIsDropdownProvinceVisible(false);
                    setIsBackDrop(false);
                }}
            >
                <Text style={styles.listItem}>{item.TenTinhThanhPho}</Text>
            </TouchableOpacity>
        ),
        [],
    );

    const ErrorMessage = ({ message }: { message: string }) => (
        <Text style={styles.errorText}>{message}</Text>
    );

    const onSubmit = async (data: AuctionFormSchema) => {
        // onSubmitFilter(data)
        console.log('hello');
        console.log('data', data);
    };

    return (
        <View className="p-3 rounded-[20px]" style={{ backgroundColor: Colors.primary.header }}>
         
                <FormFieldAuction
                    label="Tên tài sản"
                    control={control}
                    name="tenTaiSan"
                    errors={errors}
                    type="text"
                />
                <View className="mb-3">
                    <Controller
                        control={control}
                        name="toChucDGTS"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsDropdownVisible(true);
                                        setIsBackDrop(true);
                                    }}
                                    style={[
                                        styles.inputContainer,
                                        {
                                            borderWidth: 1,
                                            borderColor: value && Colors.primary.green,
                                        },
                                    ]}
                                    className="px-2 py-4 bg-white rounded-xl w-full"
                                >
                                    <Text style={{ color: Colors.primary.green, flex: 1 }}>
                                        {value || 'Chọn tổ chức ĐGTS'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                                        <Ionicons name="chevron-down" size={18} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {isDropdownVisible && (
                                    <Modal
                                        isVisible={isDropdownVisible}
                                        onBackdropPress={() => setIsDropdownVisible(false)}
                                        backdropOpacity={0}
                                        backdropColor="transparent"
                                        animationIn="fadeIn"
                                        animationOut="fadeOut"
                                        animationInTiming={300}
                                        animationOutTiming={300}
                                        useNativeDriver={true}
                                        hideModalContentWhileAnimating={true}
                                        style={{ margin: 0, justifyContent: 'flex-end' }}
                                    >
                                        <View style={styles.modalContainer}>
                                            <View style={styles.modalContent}>
                                                <TextInput
                                                    placeholder="Tìm kiếm tổ chức"
                                                    value={searchQuery}
                                                    onChangeText={setSearchQuery}
                                                    textInputStyle={styles.searchInput}
                                                    mainColor={Colors.primary.green}
                                                    placeholderTextColor={Colors.primary.green}
                                                />
                                                <FlatList
                                                    data={filteredOrganizers}
                                                    renderItem={({ item }) =>
                                                        renderItem({ item, onChange })
                                                    }
                                                    keyExtractor={(item) => item.key.toString()}
                                                    style={styles.flatList}
                                                />
                                                <CustomButton
                                                    style={styles.closeButton}
                                                    onPress={() => {
                                                        setIsDropdownVisible(false);
                                                        setIsBackDrop(false);
                                                    }}
                                                    title="Đóng"
                                                />
                                            </View>
                                        </View>
                                    </Modal>
                                )}
                                {errors.toChucDGTS && (
                                    <ErrorMessage message={errors.toChucDGTS.message || ''} />
                                )}
                            </>
                        )}
                    />
                </View>
                {/* tu ngay */}
                {/* <View>
                    <Controller
                        control={control}
                        name="tuNgay"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        toggleDatePicker('tuNgay');
                                        onBlur();
                                    }}
                                    style={[
                                        styles.inputContainer,
                                        {
                                            borderWidth: 1,
                                            borderColor: value ? Colors.primary.green : '#ccc',
                                        },
                                    ]}
                                    className="px-2 py-4 bg-white rounded-xl w-full"
                                >
                                    <Text
                                        style={{
                                            color: Colors.primary.green,
                                            flex: 1,
                                        }}
                                    >
                                        {value ? formatDate(new Date(value)) : 'Từ ngày'}
                                    </Text>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color={Colors.primary.green}
                                    />
                                </TouchableOpacity>
    
                                {datePickerVisibility.tuNgay && (
                                    <DateTimePicker
                                        value={value ? new Date(value) : new Date()}
                                        mode="date"
                                        display="inline"
                                        themeVariant="light"
                                        onChange={(event, selectedDate) => {
                                            toggleDatePicker('tuNgay');
                                            if (event.type === 'set' && selectedDate) {
                                                onChange(selectedDate.toISOString());
                                            }
                                        }}
                                        style={{
                                            backgroundColor: '#fff',
                                            marginTop: 4,
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                        }}
                                    />
                                )}
    
                                {errors.tuNgay && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {errors.tuNgay.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </View> */}
                <FormFieldAuction
                    label="Từ ngày"
                    control={control}
                    name="tuNgay"
                    errors={errors}
                    type="date"
                />
                {/* den ngay */}
                <FormFieldAuction
                    label="Đến ngày"
                    control={control}
                    name="denNgay"
                    errors={errors}
                    type="date"
                />
                {/* tu gia */}
                <FormFieldAuction
                    label="Giá khởi điểm từ"
                    name="tuGia"
                    errors={errors}
                    control={control}
                    type="text"
                    isNumeric
                />
                {/* den gia */}
                <FormFieldAuction
                    name="denGia"
                    control={control}
                    errors={errors}
                    label="Giá khởi điểm đến"
                    type="text"
                    isNumeric
                />
                <View className="mb-3">
                    <Controller
                        control={control}
                        name="tinhThanhPho"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsDropdownProvinceVisible(true);
                                        setIsBackDrop(true);
                                    }}
                                    style={[
                                        styles.inputContainer,
                                        {
                                            borderWidth: 1,
                                            borderColor: value && Colors.primary.green,
                                        },
                                    ]}
                                    className="px-2 py-4 bg-white rounded-xl w-full"
                                >
                                    <Text style={{ color: Colors.primary.green, flex: 1 }}>
                                        {value || 'Chọn tỉnh, thành phố'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setIsDropdownVisible(true)}>
                                        <Ionicons name="chevron-down" size={18} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {isDropdownProvinceVisible && (
                                    <Modal
                                        isVisible={isDropdownProvinceVisible}
                                        onBackdropPress={() => setIsDropdownProvinceVisible(false)}
                                        backdropOpacity={0}
                                        backdropColor="transparent"
                                        animationIn="fadeIn"
                                        animationOut="fadeOut"
                                        animationInTiming={300}
                                        animationOutTiming={300}
                                        useNativeDriver={true}
                                        hideModalContentWhileAnimating={true}
                                        style={{ margin: 0, justifyContent: 'flex-end' }}
                                    >
                                        <View style={styles.modalContainer}>
                                            <View style={styles.modalContent}>
                                                <TextInput
                                                    placeholder="Tìm kiếm tên tỉnh thành phố"
                                                    value={searchQuery}
                                                    onChangeText={setSearchQuery}
                                                    textInputStyle={styles.searchInput}
                                                    mainColor={Colors.primary.green}
                                                    placeholderTextColor={Colors.primary.green}
                                                />
                                                <FlatList
                                                    data={filteredProvinces}
                                                    renderItem={({ item }) =>
                                                        renderProvinceItem({ item, onChange })
                                                    }
                                                    keyExtractor={(item) =>
                                                        item.TinhThanhPhoID.toString()
                                                    }
                                                    style={styles.flatList}
                                                />
                                                <CustomButton
                                                    style={styles.closeButton}
                                                    onPress={() => {
                                                        setIsDropdownProvinceVisible(false);
                                                        setIsBackDrop(false);
                                                    }}
                                                    title="Đóng"
                                                />
                                            </View>
                                        </View>
                                    </Modal>
                                )}
                                {errors.tinhThanhPho && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {errors.tinhThanhPho.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </View>

                <CustomButton title="Tìm kiếm" onPress={handleSubmit(onSubmitFilter)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.primary.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: Colors.primary.green,
        borderWidth: 1,
        borderRadius: 12,
        paddingRight: 40,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    searchInput: {
        width: '100%',
        borderColor: Colors.primary.green,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
    },
    flatList: {
        maxHeight: 300,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary.green,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: Colors.primary.green,
        borderRadius: 12,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    selectBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderColor: Colors.primary.green,
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    dropdown: {
        backgroundColor: '#f5f5f5',
    },
});

export default AuctionsForm;
