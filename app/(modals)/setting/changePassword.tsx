import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from 'react-native-text-input-interactive';
import CustomButton from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For eye icon
import { ChangePassword } from '@/service';

// Define Zod schema for password validation
const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự'),
        newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
        confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
        path: ['confirmPassword'], // error path
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePasswordUser = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            const res = await ChangePassword({ password: data.currentPassword, newPassword: data.confirmPassword });
            if (res) {
                Alert.alert('Mật khẩu đã được đổi thành công');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Nhập đúng mật khẩu hiện tại')
        }
    };

    const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
        setter(!currentState);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardDismissMode="on-drag" className='space-y-4'>
                    {/* Current Password */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Mật khẩu hiện tại</Text>
                        <View style={styles.passwordContainer}>
                            <Controller
                                control={control}
                                name="currentPassword"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Mật khẩu hiện tại"
                                        value={value}
                                        onChangeText={onChange}
                                        mainColor={Colors.primary.green}
                                        style={styles.input}
                                        textInputStyle={{ width: '100%' }}
                                        secureTextEntry={!isCurrentPasswordVisible}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => toggleVisibility(setIsCurrentPasswordVisible, isCurrentPasswordVisible)}
                            >
                                <MaterialCommunityIcons
                                    name={isCurrentPasswordVisible ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="grey"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.currentPassword && (
                            <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
                        )}
                    </View>

                    {/* New Password */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Mật khẩu mới</Text>
                        <View style={styles.passwordContainer}>
                            <Controller
                                control={control}
                                name="newPassword"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Mật khẩu mới"
                                        value={value}
                                        onChangeText={onChange}
                                        mainColor={Colors.primary.green}
                                        style={styles.input}
                                        textInputStyle={{ width: '100%' }}
                                        secureTextEntry={!isNewPasswordVisible}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => toggleVisibility(setIsNewPasswordVisible, isNewPasswordVisible)}
                            >
                                <MaterialCommunityIcons
                                    name={isNewPasswordVisible ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="grey"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}
                    </View>

                    {/* Confirm Password */}
                    <View>
                        <Text className="text-[#d9d9d9] mb-2">Xác nhận mật khẩu</Text>
                        <View style={styles.passwordContainer}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Xác nhận mật khẩu"
                                        value={value}
                                        onChangeText={onChange}
                                        mainColor={Colors.primary.green}
                                        style={styles.input}
                                        textInputStyle={{ width: '100%' }}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => toggleVisibility(setIsConfirmPasswordVisible, isConfirmPasswordVisible)}
                            >
                                <MaterialCommunityIcons
                                    name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="grey"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                        )}
                    </View>

                    {/* Submit Button */}
                    <CustomButton className="mt-4 py-3" title="Đổi mật khẩu" onPress={handleSubmit(onSubmit)} />
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
    input: {
        flex: 1,
    },
    passwordContainer: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default ChangePasswordUser;
