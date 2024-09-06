import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';

interface CheckboxInterface {
    checked: boolean;
    onChange: () => void;
    title: string;
    color?: boolean
}

const Checkbox = ({ checked = false, onChange, title, color }: CheckboxInterface) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onChange} className={`flex flex-row items-center w-full p-2 rounded ${checked ? (color ? 'bg-[#B74C00]' : `bg-[${Colors.primary.green}]`) : 'bg-[#d9d9d9]'}`}>
            <MaterialCommunityIcons
                name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={checked ? 'white' : 'black'}
            />
            <Text className={`${checked && 'text-white'} ml-1 font-normal`}>{title}</Text> 
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
      shadowColor: "#000",
      shadowOffset: {
        width: 3,
        height: 5,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
  
      elevation: 10,
    }
  })
  

export default Checkbox;
