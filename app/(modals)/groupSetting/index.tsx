import { View, SafeAreaView, FlatList, Text, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { BoxInterface } from '@/constants/interface';
import { ViewlistBox, ViewlistGroup } from '@/service'; // Assuming ViewlistGroup is in the same service file
import { Avatar, ListItem } from '@rneui/themed';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

interface GroupInterface {
    BoxID: number;
    CreateAt: string;
    GroupID: number;
    GroupName: string;
    UserID: number;
    avatarLink: string;
}

const Page = () => {
    const [listBox, setListBox] = useState<BoxInterface[]>([]);
    const [expandedBoxes, setExpandedBoxes] = useState<number[]>([]); 
    const [groupData, setGroupData] = useState<{ [key: number]: GroupInterface[] }>({});
    const [refreshing, setRefreshing] = useState(false);
const [isLoading, setIsLoading] = useState<boolean>(false)
    const getListBox = async () => {
        try {
            setIsLoading(true)
            const data = await ViewlistBox();
            if (data) {
                setListBox(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await getListBox();
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        getListBox();
    }, []);

    const getGroup = useCallback(async (boxId: number) => {
        try {
            const groups = await ViewlistGroup(boxId);
            setGroupData((prev) => ({
                ...prev,
                [boxId]: groups,
            }));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handlePress = async (boxId: number) => {
        if (!expandedBoxes.includes(boxId)) {
            await getGroup(boxId);
        }
        setExpandedBoxes(
            (prevExpanded) =>
                prevExpanded.includes(boxId)
                    ? prevExpanded.filter((id) => id !== boxId) // Collapse if already expanded
                    : [...prevExpanded, boxId], // Expand the box
        );
    };

    const renderGroups = (boxId: number) => {
        const groups = groupData[boxId] || [];
        return groups.map((group) => (
            <ListItem
                onPress={() =>
                    router.navigate({
                        pathname: '/listing/group/[id]',
                        params: {
                            id: group.GroupID,
                        },
                    })
                }
                key={group.GroupID}
                containerStyle={{ backgroundColor: '#f9f9f9' }}
            >
                <Avatar
                    rounded
                    source={{
                        uri: group.avatarLink,
                    }}
                />
                <ListItem.Content>
                    <ListItem.Title>{group.GroupName}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        ));
    };

    const renderListBox = (item: BoxInterface) => {
        const isExpanded = expandedBoxes.includes(item.BoxID);

        return (
            <ListItem.Accordion
                bottomDivider
                content={
                    <ListItem.Content>
                        <ListItem.Title style={{ color: '#fff', fontWeight: '600' }}>{item.BoxName}</ListItem.Title>
                        <ListItem.Subtitle style={{ color: '#fff', fontWeight: '400' }}>
                            {item.Description.trim()}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                }
                isExpanded={isExpanded}
                onPress={() => handlePress(item.BoxID)}
                containerStyle={{ backgroundColor: 'transparent' }}
                icon={<Feather name={'chevron-down'} size={24} color="#fff" />}
            >
                {isExpanded && renderGroups(item.BoxID)}
            </ListItem.Accordion>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
           {
            isLoading ? (
                <ActivityIndicator size={30} />
            ) : (
                <FlatList
                data={listBox}
                renderItem={({ item }) => renderListBox(item)}
                keyExtractor={(item) => item.BoxID.toString()}  
                contentContainerStyle={{ padding: 12 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                refreshControl={<RefreshControl tintColor={Colors.primary.green} colors={[Colors.primary.green]} refreshing={refreshing} onRefresh={onRefresh} />}
            />
            )
           }
        </SafeAreaView>
    );
};

export default Page;
