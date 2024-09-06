import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AuctionIcon, NotifyIcon } from '@/assets/icons';
import { Header } from '@/components/ui/Header';
import Colors from '@/constants/Colors';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
    return (
        <>
            <StatusBar style="light" />

            <Tabs
                screenOptions={{
                    header: () => <Header />,
                    tabBarStyle: {
                        backgroundColor: Colors.primary.header,
                        borderTopColor: Colors.primary.header,
                    },
                    tabBarActiveTintColor: '#fff',
                    tabBarInactiveTintColor: '#fff',
                    tabBarLabel: () => null,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View
                                className={`${
                                    focused ? `bg-[#4caf50] rounded-md` : ''
                                } flex items-center justify-center`}
                                style={{ width: size + 10, height: size + 10 }}
                            >
                                <Octicons name="home" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="notify"
                    options={{
                        title: '',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View
                                className={`${
                                    focused ? `bg-[#4caf50] rounded-md` : ''
                                } flex items-center justify-center`}
                                style={{ width: size + 10, height: size + 10 }}
                            >
                                <NotifyIcon />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="group"
                    options={{
                        title: '',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View
                                className={`${
                                    focused ? `bg-[#4caf50] rounded-md` : ''
                                } flex items-center justify-center`}
                                style={{ width: size + 10, height: size + 10 }}
                            >
                                <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="auction"
                    options={{
                        title: '',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View
                                className={`${
                                    focused ? `bg-[#4caf50] rounded-md` : ''
                                } flex items-center justify-center`}
                                style={{ width: size + 10, height: size + 10 }}
                            >
                                <AuctionIcon />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: '',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View
                                className={`${
                                    focused ? `bg-[#4caf50] rounded-md` : ''
                                } flex items-center justify-center`}
                                style={{ width: size + 10, height: size + 10 }}
                            >
                                <FontAwesome5 name="user" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#1e1e1e',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        // width: 40,
        // height: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff6600',
    },
    searchButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
