import React from 'react';
import {
    TouchableOpacity,
    Text,
    TouchableOpacityProps,
    StyleProp,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    type?: 'primary' | 'danger' | 'secondary';
    className?: string;
    textClassName?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    type = 'primary',
    className = '',
    textClassName = '',
    style,
    textStyle,
    isLoading = false,
    ...props
}) => {
    let backgroundColor;
    let borderColor = 'transparent';
    let color = '#fff';

    switch (type) {
        case 'danger':
            backgroundColor = Colors.primary.danger;
            break;
        case 'secondary':
            backgroundColor = '#fff';
            borderColor = Colors.primary.green;
            color = Colors.primary.green;
            break;
        default:
            backgroundColor = Colors.primary.green;
    }

    return (
        <TouchableOpacity
            style={[{ backgroundColor, borderColor, borderWidth: type === 'secondary' ? 1 : 0 }, style]}
            className={`px-3 py-2 rounded ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={type === 'primary' ? "#fff" : ''} size={30} />
            ) : (
                <Text
                    style={[textStyle, { color }]}
                    className={`text-center font-bold ${textClassName} ${
                        type === 'secondary' ? 'text-primary' : 'text-white'
                    }`}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
