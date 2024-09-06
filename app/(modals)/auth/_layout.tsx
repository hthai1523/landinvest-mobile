import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'

const LayoutAuth = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
    </Stack>
  )
}

export default LayoutAuth