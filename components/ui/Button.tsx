import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  type?: 'primary' | 'danger';
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, type = 'primary', className = '', textClassName = '', style, textStyle, ...props }) => {
  const backgroundColor = type === 'danger' ? Colors.primary.danger : Colors.primary.green;

  return (
    <TouchableOpacity style={[{ backgroundColor }, style]} className={`px-3 py-2 rounded ${className}`} {...props}>
      <Text style={textStyle} className={`text-white text-center font-bold ${textClassName}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;