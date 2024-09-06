import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { QuyHoachResponse } from '@/constants/interface'
import Colors from '@/constants/Colors'


interface QuyHoachSection {
    quyhoach: QuyHoachResponse
    onChange: () => void
    checked: boolean
}

const QuyHoachSection = ({quyhoach, onChange, checked}:QuyHoachSection) => {
  return (
    <TouchableOpacity style={styles.container} className={`flex flex-row items-center pr-3 h-20 rounded ${checked ? `bg-[${Colors.primary.green}]` : 'bg-white'}`} onPress={onChange}>
        <Image source={require("@/assets/images/quyhoach.png")} className='h-full w-20 bg-contain' />
        <Text className={`flex-1 ml-2 ${checked ? `text-white` : 'text-black'} font-normal text-base`}>{quyhoach.description}</Text>
    </TouchableOpacity>
  )
}

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

export default QuyHoachSection