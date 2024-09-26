import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedSafeView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export { AnimatedScrollView, AnimatedSafeView, AnimatedTextInput, AnimatedTouchableOpacity };
