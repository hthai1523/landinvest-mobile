import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';

import { MenuProvider } from 'react-native-popup-menu';
import { PaperProvider } from 'react-native-paper';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
});

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
                <BottomSheetModalProvider>
                    <MenuProvider>
                        <SafeAreaProvider>
                            <Stack
                                screenOptions={{
                                    contentStyle: { backgroundColor: Colors.primary.background },
                                }}
                            >
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{
                                        headerShown: false,
                                        headerBlurEffect: 'regular',
                                        headerTransparent: true,
                                    }}
                                />
                                <Stack.Screen
                                    name="(modals)/auth"
                                    options={{ headerShown: false, presentation: 'card' }}
                                />
                                <Stack.Screen
                                    name="(modals)/search"
                                    options={{ presentation: 'card', headerShown: false }}
                                />
                                <Stack.Screen
                                    name="(modals)/setting"
                                    options={{ presentation: 'card', headerShown: false }}
                                />
                                <Stack.Screen
                                    name="(modals)/newPost"
                                    options={{ presentation: 'card', headerShown: false }}
                                />
                                <Stack.Screen
                                    name="(modals)/preview"
                                    options={{ presentation: 'card', headerShown: false }}
                                />
                                <Stack.Screen
                                    name="(modals)/groupSetting"
                                    options={{ presentation: 'card', headerShown: false }}
                                />
                                <Stack.Screen
                                    name="listing/post/[id]"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="listing/group/[id]"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="listing/profileUser/[id]"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="listing/auction/[id]"
                                    options={{ headerShown: false }}
                                />
                            </Stack>
                        </SafeAreaProvider>
                    </MenuProvider>
                </BottomSheetModalProvider>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
