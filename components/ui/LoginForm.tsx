import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rneui/themed';
import Colors from '@/constants/Colors';
import { z } from 'zod';
import { callLogin } from '@/service';
import useAuthStore from '@/store/authStore';

import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';

// Định nghĩa lại schema chỉ với email và password
const loginFormSchema = z.object({
    userName: z
        .string({
            invalid_type_error: 'Tên đăng nhập phải là một chuỗi',
            required_error: 'Tên đăng nhập là bắt buộc',
        })
        .min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự')
        .max(100, 'Tên đăng nhập không được vượt quá 100 ký tự'),
    password: z
        .string({
            invalid_type_error: 'Mật khẩu phải là một chuỗi',
            required_error: 'Mật khẩu là bắt buộc',
        })
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

const LoginForm = ({ onChangeForm }: { onChangeForm: () => void }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormSchema) => {
        const { userName, password } = data;

        try {
            const state = await NetInfo.fetch();

            if (state.isConnected && state.details) {
                const ipAddress: string = state.details.ipAddress;
                const res = await callLogin(userName, password, ipAddress);
                const { access_token, UserID, userData, refreshtoken } = res.data;
                if (res.data && res.data.access_token) {
                    useAuthStore.getState().login(userData, access_token, refreshtoken, UserID);
                    console.log(res.data);
                    Alert.alert('Thành công', 'Đăng nhập thành công!');
                    router.replace('/(tabs)/');
                }
            } else {
                Alert.alert('Không có kết nối Internet');
            }
        } catch (error) {
            Alert.alert('Gặp lỗi trong quá trình đăng nhập');
        }
    };

    // useEffect(() => {
    //     getIpAddress()
    //     }, []);

    // const getIpAddress = async () => {
    //     try {
    //       const state = await NetInfo.fetch();

    //       if (state.isConnected && state.details) {
    //         const ipAddress = state.details.ipAddress;
    //         console.log('IP Address:', ipAddress);
    //       } else {
    //         console.log('Not connected to the internet');
    //       }
    //     } catch (error) {
    //       console.error('Error getting IP address:', error);
    //     }
    //   };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 12,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                }}
            >
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    style={{ height: 350, width: 90 }}
                    source={require('@/assets/images/Layer0.png')}
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    style={{ height: 250, width: 65 }}
                    source={require('@/assets/images/Layer2.png')}
                />
                <Animated.Image
                    entering={FadeInUp.delay(600).duration(1000).springify()}
                    style={{ height: 224, width: 65 }}
                    source={require('@/assets/images/Layer1.png')}
                />
            </View>

            {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
                <View style={{ padding: 16, justifyContent: 'center', flex: 1 }}>
                    <Animated.Text
                        entering={FadeInDown.duration(1000).springify()}
                        style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 24,
                            textAlign: 'center',
                            marginBottom: 20,
                        }}
                    >
                        Đăng nhập
                    </Animated.Text>

                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
                        <Controller
                            control={control}
                            name="userName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ marginBottom: 10 }}>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor="gray"
                                        style={{
                                            borderColor: errors.userName ? 'red' : 'gray',
                                            borderWidth: 1,
                                            padding: 10,
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            borderRadius: 12,
                                        }}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {errors.userName && <Text style={{ color: 'red' }}>{errors.userName.message}</Text>}
                                </View>
                            )}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ marginBottom: 20 }}>
                                    <TextInput
                                        placeholder="Mật khẩu"
                                        placeholderTextColor="gray"
                                        style={{
                                            borderColor: errors.password ? 'red' : 'gray',
                                            borderWidth: 1,
                                            padding: 10,
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            borderRadius: 12,
                                        }}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry
                                    />
                                    {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
                                </View>
                            )}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
                        <Button
                            buttonStyle={{ backgroundColor: Colors.primary.green, borderRadius: 12, marginBottom: 10 }}
                            title="Đăng nhập"
                            onPress={handleSubmit(onSubmit)}
                            // loading={true}
                            // disabled={true}
                        />
                    </Animated.View>
                    <Animated.Text
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="text-white font-medium text-sm text-center"
                    >
                        Bạn chưa có tài khoản?{' '}
                        <Text
                            onPress={() => onChangeForm()}
                            style={{ fontWeight: '700', fontSize: 14, color: Colors.primary.green }}
                        >
                            Đăng ký
                        </Text>
                    </Animated.Text>
                </View>
            {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
    );
};

export default LoginForm;
