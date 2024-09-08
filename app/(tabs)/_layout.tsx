import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AuctionIcon, NotifyIcon } from '@/assets/icons';
import { Header } from '@/components/ui/Header';
import Colors from '@/constants/Colors';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const TabLayout = () => {
    const { width: screenWidth } = useWindowDimensions();
    const tabCount = 5;
    const tabWidth = screenWidth / tabCount;
    const routes = ['/', '/notify', '/group', '/auction', '/profile'];
    const pathname = usePathname();

    const indicatorPosition = useSharedValue(0);

    const updateIndicator = useCallback(
        (index: number) => {
            indicatorPosition.value = withTiming(index * tabWidth, { duration: 200 });
        },
        [tabWidth],
    );

    useEffect(() => {
        const currentIndex = routes.indexOf(pathname);
        if (currentIndex !== -1) {
            updateIndicator(currentIndex);
        }
    }, [pathname, routes, updateIndicator]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorPosition.value }],
        width: tabWidth,
    }));

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
                {['index', 'notify', 'group', 'auction', 'profile'].map((screen, index) => (
                    <Tabs.Screen
                        key={screen}
                        name={screen}
                        options={{
                            title: '',
                            tabBarIcon: ({ color, size, focused }) => (
                                <View
                                    className={`${
                                        focused ? `bg-[#4caf50] rounded-md` : ''
                                    } flex items-center justify-center`}
                                    style={{ width: tabWidth, height: size + 10 }}
                                >
                                    {screen === 'index' && <Octicons name="home" size={size} color={color} />}
                                    {screen === 'notify' && <NotifyIcon />}
                                    {screen === 'group' && (
                                        <MaterialCommunityIcons
                                            name="account-group-outline"
                                            size={size}
                                            color={color}
                                        />
                                    )}
                                    {screen === 'auction' && <AuctionIcon />}
                                    {screen === 'profile' && <FontAwesome5 name="user" size={size} color={color} />}
                                </View>
                            ),
                        }}
                    />
                ))}
            </Tabs>

            <Animated.View style={[styles.indicator, indicatorStyle]} />
        </>
    );
};

const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        top: -5,
        height: 4,
        backgroundColor: '#4caf50',
    },
});

export default TabLayout;
