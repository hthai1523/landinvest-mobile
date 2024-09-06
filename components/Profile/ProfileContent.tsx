import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Button } from '@rneui/themed'
import { router } from 'expo-router'

const ProfileContent = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Button onPress={() => router.push('/(modals)/auth')}>Đăng nhập</Button>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileContent