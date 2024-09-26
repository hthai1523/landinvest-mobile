import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Avatar } from '@rneui/themed';
import useAuthStore, { User } from '@/store/authStore';
import Colors from '@/constants/Colors';
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import TextInput from 'react-native-text-input-interactive';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '@/components/ui/Button';
import * as ImagePicker from 'expo-image-picker';
import { callLogout, ChangeAvatarUser, UpdateProfileUser } from '@/service';
import { router } from 'expo-router';

const Page = () => {
    const { user, updateUser } = useAuthStore((state) => ({
        user: state.user,
        updateUser: state.updateUser,
    }));

    const userId = useAuthStore.getState().userId;

    const [fullname, setFullname] = useState<string>(user?.FullName || '');
    const [phone, setPhone] = useState<string>(user?.Phone || '');
    const [selectedGender, setSelectedGender] = useState(user?.Gender || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const logout = useAuthStore.getState().logout;
    const clear = useAuthStore.getState().clearAuthState;

    const genderOptions = [
        { key: '1', value: 'Nam' },
        { key: '2', value: 'Nữ' },
        { key: '3', value: 'Khác' },
    ];

    const updateProfile = async () => {
        const profileData: Partial<User> = {
            FullName: fullname,
            Phone: phone,
            Gender: selectedGender,
        };

        try {
            await UpdateProfileUser(profileData);
            updateUser(profileData);
            Alert.alert('Cập nhật thông tin thành công');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                updateUser({ avatarLink: result.assets[0].uri });

                const formData = new FormData();
                const file = result.assets[0];
                const form = {
                    uri: file.uri,
                    type: file.type,
                    name: 'image.jpg',
                };

                formData.append('uploaded_image', form as any);
                if (userId) {
                    setIsLoading(true);
                    const data = await ChangeAvatarUser(userId, formData);
                    console.log(data)
                    if (data.Status === 200) {
                        Alert.alert('Thay đổi ảnh đại diện thành công');
                    } else {
                        Alert.alert('Thay đổi ảnh đại diện không thành công');
                    }
                }
            }
        } catch (error) {
            console.error('Error picking images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            if (res && res.data.logout === true) {
                Alert.alert('Đăng xuất thành công');
                logout();
                router.navigate('/(tabs)/');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Lỗi khi đăng xuất');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    className="space-y-4"
                    keyboardDismissMode="on-drag"
                >
                    <View className="w-full flex flex-row space-x-2">
                        <View style={styles.avatarContainer}>
                            {isLoading ? (
                                <ActivityIndicator size={30} />
                            ) : user?.avatarLink ? (
                                <Image source={{ uri: user?.avatarLink }} style={styles.avatar} />
                            ) : (
                                <Avatar
                                    size={128}
                                    rounded
                                    title={user?.Username.slice(0, 1).toUpperCase()}
                                    containerStyle={styles.avatar}
                                />
                            )}
                            <TouchableOpacity style={styles.buttonChangeAvatar} onPress={pickImage}>
                                <EvilIcons name="pencil" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="mt-3 space-y-2">
                            <Text className="text-white font-semibold text-base">Cập nhật ảnh đại diện</Text>
                            <Text className="text-[#f9f9f9] font-light">Tải ảnh dưới 2MB</Text>
                            <TouchableOpacity
                                className="flex flex-row items-center space-x-1 px-2 py-3 w-[70%] rounded-md border"
                                style={{ backgroundColor: Colors.primary.header }}
                                onPress={pickImage}
                            >
                                <MaterialCommunityIcons name="folder-image" size={24} color="white" />
                                <Text className="text-white font-normal">Tải ảnh lên</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Full Name */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Họ và Tên</Text>
                        <TextInput
                            placeholder="Họ và Tên"
                            value={fullname}
                            onChangeText={setFullname}
                            mainColor={Colors.primary.green}
                            style={styles.input}
                            textInputStyle={{ width: '100%' }}
                        />
                    </View>

                    {/* Phone Number */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Số điện thoại</Text>
                        <TextInput
                            placeholder="Số điện thoại"
                            value={phone}
                            onChangeText={setPhone}
                            mainColor={Colors.primary.green}
                            style={styles.input}
                            textInputStyle={{ width: '100%' }}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Gender Selection */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Giới tính</Text>
                        <SelectList
                            setSelected={setSelectedGender}
                            data={genderOptions}
                            save="value"
                            placeholder="Chọn giới tính"
                            search={false}
                            defaultOption={genderOptions.find((option) => option.value === user?.Gender)}
                            boxStyles={styles.selectBox}
                            dropdownStyles={styles.dropdown}
                        />
                    </View>

                    <CustomButton className="mt-4 py-3" title="Lưu thay đổi" onPress={updateProfile} />
                    <CustomButton className="mt-4 py-3" title="Đăng xuất" onPress={handleLogout} type="danger" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 12,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 128,
        height: 128,
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: '#212121',
        backgroundColor: Colors.primary.green,
    },
    buttonChangeAvatar: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary.header,
        borderRadius: 18,
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
    },
    input: {
        flex: 1,
    },
    selectBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderColor: Colors.primary.green,
    },
    dropdown: {
        backgroundColor: '#f5f5f5',
    },
});

export default Page;
