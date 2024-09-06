import React from 'react';
import { View, Button, Alert } from 'react-native';
import { router, useSegments } from 'expo-router';
import ProfileContent from '@/components/Profile/ProfileContent';
import useAuthStore from '@/store/authStore';
import { callLogout } from '@/service';

export default function Profile() {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated)
  const segments = useSegments();
  const {user} = useAuthStore.getState()

  // React.useEffect(() => {
  //   // Kiểm tra trạng thái đăng nhập ở đây (ví dụ: từ AsyncStorage hoặc context)
  //   // Nếu chưa đăng nhập, chuyển hướng đến trang auth
  //   if (!isLoggedIn && !segments.includes('auth')) {
  //     router.replace('/auth');
  //   }
  // }, [isLoggedIn]);

  // if (!isLoggedIn) {
  //   return null; // hoặc có thể hiển thị một loading spinner
  // }

  const handleLogout = async () => {
    try {
      const res = await callLogout()
      if(res && res.data.logout === true) {
        Alert.alert("Đăng xuất thành công")
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Show an error message or handle the error appropriately
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfileContent />
      {/* <Button title="Logout" onPress={() => handleLogout()} /> */}
    </View>
  );
}