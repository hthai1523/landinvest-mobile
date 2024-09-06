import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
// import {useHeaderHeight} from '@react-navigation/elements'
export function Header() {
    const insets = useSafeAreaInsets();
    // const headerHeight = useHeaderHeight();

    return (
        <View
            className={`flex flex-row justify-between items-center p-1 `}
            style={{
                paddingTop: insets.top,
                backgroundColor: Colors.primary.header,
            }}
        >
            <View>
                <Image source={require('@/assets/images/logo.png')} />
            </View>
            <TouchableOpacity
                className={`bg-[${Colors.primary.green}] px-3 py-2 rounded`}
                onPress={() => router.push('/(modals)/search')}
            >
                <Octicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
