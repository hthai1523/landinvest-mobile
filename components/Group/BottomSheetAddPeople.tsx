import { View, Platform, FlatList, Text } from 'react-native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { SearchBar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { SearchUserInvite } from '@/service';
import AvatarUser from '../ui/AvatarUser';
import { TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { router } from 'expo-router';

export type Ref = BottomSheetModal;

const BottomSheetAddPeople = forwardRef<Ref, { dismiss: () => void }>((props, ref) => {
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
        ),
        [],
    );

    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<
        {
            avatar: string;
            idUser: number;
            username: string;
        }[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [debouncedSearch] = useDebounce(search, 500);

    const updateSearch = (value: string) => {
        setSearch(value);
    };

    useEffect(() => {
        const getUserInvite = async () => {
            try {
                setIsLoading(true);
                if (!debouncedSearch) {
                    setSearchResult([]);
                    return;
                }
                const data = await SearchUserInvite(debouncedSearch);
                data && data.data && data.data.length > 0 && setSearchResult(data.data);
            } catch (error) {
                setSearchResult([]);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserInvite();
    }, [debouncedSearch]);

    const renderUser = (item: { avatar: string; idUser: number; username: string }) => {
        return (
            <View className="flex flex-row items-center justify-between">
                <TouchableOpacity onPress={() => {router.navigate(`/listing/profileUser/${item.idUser}`); props.dismiss()}} className="flex flex-row flex-1 items-center">
                    <AvatarUser avatarLink={item.avatar} fullName={item.username} />
                    <Text className='ml-2 font-normal text-base'>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="">
                    <Text className='text-base font-bold text-blue-500'>Mời</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleResetSearch = () => {
        setSearch('');
        setSearchResult([]);
    };

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={props.dismiss}
        >
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
                clearIcon={<Ionicons name="close-circle-outline" size={24} color={'#333'} />}
                showLoading={isLoading}
                showCancel={false}
                onClear={() => handleResetSearch()}
                onCancel={() => handleResetSearch()}
            />

            <FlatList
                data={searchResult}
                renderItem={({ item }) => renderUser(item)}
                contentContainerStyle={{ padding: 12 }}
                ListEmptyComponent={() => (
                    <Text className="text-center mt-2">Tìm kiếm người muốn thêm vào group</Text>
                )}
                ItemSeparatorComponent={() => <Divider horizontalInset={true}  style={{marginVertical: 12}} />}
                keyboardDismissMode="on-drag"
            />
        </BottomSheetModal>
    );
});

export default BottomSheetAddPeople;
