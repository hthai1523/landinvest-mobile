import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedSafeView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export { AnimatedScrollView, AnimatedSafeView, AnimatedTextInput, AnimatedTouchableOpacity, AnimatedBlurView };
