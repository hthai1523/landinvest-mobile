import React, { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { TouchableOpacity, Text, StyleSheet, View, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import TextInput from 'react-native-text-input-interactive';
import Colors from '@/constants/Colors';
import CustomButton from '../ui/Button';
import { AuctionFormSchema } from '../Auction/AuctionsForm';

interface Option {
    key: number;
    value: string;
}

interface FormFieldAuctionProps {
    name: keyof AuctionFormSchema;
    label: string;
    type: 'text' | 'dropdown' | 'date';
    options?: Option[];
    onOptionSelect?: (value: string) => void;
    errors: any;
    control: any;
    className?: string;
    isNumeric?: boolean;
}

const FormFieldAuction: React.FC<FormFieldAuctionProps> = ({
    name,
    label,
    type,
    options,
    onOptionSelect,
    errors,
    control,
    className,
    isNumeric = false,
}) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const renderItem = useCallback(
        ({ item }: { item: Option }) => (
            <TouchableOpacity
                onPress={() => {
                    onOptionSelect?.(item.value);
                    setIsDropdownVisible(false);
                }}
            >
                <Text style={styles.listItem}>{item.value}</Text>
            </TouchableOpacity>
        ),
        [onOptionSelect],
    );

    return (
        <View className={'mb-3'}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        {type === 'text' && (
                            <TextInput
                                placeholder={label}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textInputStyle={{
                                    width: '100%',
                                    borderColor: errors[name] ? 'red' : Colors.primary.green,
                                    borderWidth: 1,
                                    borderRadius: 12,
                                    backgroundColor: '#fff',
                                    color: Colors.primary.green,
                                }}
                                keyboardType={isNumeric ? 'numeric' : 'default'}
                                mainColor={Colors.primary.green}
                                placeholderTextColor={Colors.primary.green}
                            />
                        )}
                        {type === 'dropdown' && (
                            <>
                                <TouchableOpacity
                                    onPress={() => setIsDropdownVisible(true)}
                                    style={[
                                        styles.inputContainer,
                                        {
                                            borderWidth: 1,
                                            borderColor: value ? Colors.primary.green : '#ccc',
                                        },
                                    ]}
                                >
                                    <Text style={{ color: Colors.primary.green, flex: 1 }}>
                                        {value || label}
                                    </Text>
                                    <Ionicons name="chevron-down" size={18} />
                                </TouchableOpacity>
                                <Modal visible={isDropdownVisible} transparent animationType="fade">
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalContent}>
                                            <TextInput
                                                placeholder="Tìm kiếm"
                                                value={searchQuery}
                                                onChangeText={setSearchQuery}
                                                style={styles.searchInput}
                                                placeholderTextColor={Colors.primary.green}
                                            />
                                            <FlatList
                                                data={options?.filter((item) =>
                                                    item.value
                                                        .toLowerCase()
                                                        .includes(searchQuery.toLowerCase()),
                                                )}
                                                renderItem={renderItem}
                                                keyExtractor={(item) => item.key.toString()}
                                                style={styles.flatList}
                                            />
                                            <CustomButton
                                                style={styles.closeButton}
                                                onPress={() => setIsDropdownVisible(false)}
                                                title="Đóng"
                                            />
                                        </View>
                                    </View>
                                </Modal>
                                {errors[name] && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {errors[name]?.message as string}
                                    </Text>
                                )}
                            </>
                        )}
                        {type === 'date' && (
                            <>
                                <TouchableOpacity
                                    onPress={() => setDatePickerVisible(true)}
                                    style={[
                                        styles.inputContainer,
                                        {
                                            borderWidth: 1,
                                            borderColor: value ? Colors.primary.green : '#ccc',
                                        },
                                    ]}
                                >
                                    <Text style={{ color: Colors.primary.green, flex: 1 }}>
                                        {value ? new Date(value).toLocaleDateString() : label}
                                    </Text>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color={Colors.primary.green}
                                    />
                                </TouchableOpacity>
                                {datePickerVisible && (
                                    <DateTimePicker
                                        value={value ? new Date(value) : new Date()}
                                        mode="date"
                                        display="inline"
                                        themeVariant="light"
                                        onChange={(event, selectedDate) => {
                                            setDatePickerVisible(false);
                                            if (event.type === 'set' && selectedDate) {
                                                onChange(selectedDate.toISOString());
                                            }
                                        }}
                                        style={styles.datePicker}
                                    />
                                )}
                            </>
                        )}
                        {errors[name] && (
                            <Text style={{ color: 'red', marginTop: 4 }}>
                                {errors[name]?.message as string}
                            </Text>
                        )}
                    </>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
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
        paddingHorizontal: 8,
        paddingVertical: 10,
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
    datePicker: {
        backgroundColor: '#fff',
        marginTop: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
});

export default FormFieldAuction;
