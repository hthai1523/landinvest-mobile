import { View, Platform, FlatList, Text } from 'react-native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { SearchBar } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import { SearchUserInvite } from '@/service';

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
            avatarLink: string;
            idUser: number;
            username: string;
        }[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [debouncedSearch] = useDebounce(search, 500);

    const updateSearch = (value: string) => {
        setSearch(value);
    };

    useEffect(() => {
        const getUserInvite = async () => {
            try {
                setIsLoading(true)
                if (!debouncedSearch) {
                    setSearchResult([]);
                    return;
                }
                const data = await SearchUserInvite(debouncedSearch);
                data && data.data && data.data.length > 0 && setSearchResult(data.data);
            } catch (error) {
                setSearchResult([])
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        };

        getUserInvite()
    }, [debouncedSearch]);

    return (
        <BottomSheetModal
            backdropComponent={renderBackdrop}
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={props.dismiss}
        >
            <FlatList
                data={searchResult}
                renderItem={({ item }) => <Text>{item.username}</Text>}
                contentContainerStyle={{ padding: 12 }}
                ListHeaderComponent={() => (
                    <SearchBar 
                        placeholder="Tìm kiếm..."
                        // onChangeText={updateSearch}
                        // value={search}
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
                        clearIcon={<Ionicons name="close-circle" size={24} color={'#333'} />}
                        showLoading={isLoading}
                    />
                )}
                ListEmptyComponent={() => (
                    <Text className="text-center mt-2">Tìm kiếm người muốn thêm vào group</Text>
                )}
            />
        </BottomSheetModal>
    );
});

export default BottomSheetAddPeople;
