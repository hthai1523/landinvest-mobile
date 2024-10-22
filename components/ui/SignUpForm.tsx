import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rneui/themed';
import Colors from '@/constants/Colors';
import { signUpFormSchema, SignUpFormSchema } from '@/constants/FormSchema';
import TextInput from 'react-native-text-input-interactive';
import { useNetInfo } from '@react-native-community/netinfo';
import { callRegister } from '@/service';
import * as Location from 'expo-location';

const SignUpForm = ({ onChangeForm }: { onChangeForm: () => void }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
        mode: 'onBlur',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [location, setLocation] = useState({ latitude: 105, longitude: 20 });

    const requestLocationPermission = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Quyền bị từ chối',
                    'Cần có quyền truy cập vị trí để căn giữa bản đồ vào vị trí của bạn.',
                );
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    }, []);

    const centerToUserLocation = useCallback(async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        } catch (error) {
            console.error('Error getting user location: ', error);
            Alert.alert('Lỗi', 'Không xác định được vị trí hiện tại của bạn.');
        }
    }, [requestLocationPermission]);

    useEffect(() => {
        centerToUserLocation();
    }, [centerToUserLocation]);
    const onSubmit = async (data: SignUpFormSchema) => {
        console.log(data);
        try {
            setIsLoading(true);
            const state = useNetInfo();
            if (state.isConnected && state.details) {
                const ipAddress: string = state.details.ipAddress;
                const res = await callRegister(
                    data.userName,
                    data.name,
                    data.password,
                    location.latitude,
                    location.longitude,
                    ipAddress,
                    data.email,
                );

                if (res && res.message.include('Email or UserName is already taken')) {
                    Alert.alert(
                        'Email này đã được sử dụng trước đó',
                        'Vui lòng sử dụng email khác',
                    );
                } else {
                    Alert.alert('Đăng ký thành công', 'Kiểm tra email để hoàn tất đăng ký');
                    onChangeForm();
                }
            }
        } catch (error) {}
    };

    const renderInput = (
        name: keyof SignUpFormSchema,
        placeholder: string,
        options: any = {},
        delay: number,
    ) => (
        <Animated.View entering={FadeInDown.delay(delay).duration(1000).springify()}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            placeholder={placeholder}
                            textInputStyle={{
                                width: '100%',
                                borderColor: errors[name] ? 'red' : Colors.primary.green,
                                borderWidth: 1,
                                borderRadius: 12,
                            }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value as string}
                            mainColor={Colors.primary.green}
                            placeholderTextColor={Colors.primary.green}
                            {...options}
                        />
                        {errors[name] && (
                            <Text style={{ color: 'red' }}>{errors[name]?.message}</Text>
                        )}
                    </View>
                )}
            />
        </Animated.View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
            <StatusBar style="light" />
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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View className="p-4 justify-center flex-1">
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
                        Đăng ký
                    </Animated.Text>

                    <Animated.View entering={FadeInDown.duration(1000).springify()}>
                        {renderInput('userName', 'Tên đăng nhập', {}, 200)}
                        {renderInput('name', 'Họ và tên', { autoCapitalize: 'words' }, 200)}
                        {renderInput(
                            'email',
                            'Email',
                            { keyboardType: 'email-address', autoCapitalize: 'none' },
                            400,
                        )}
                        {renderInput('password', 'Mật khẩu', { secureTextEntry: true }, 600)}
                        {renderInput(
                            'passwordConfirmation',
                            'Xác nhận mật khẩu',
                            { secureTextEntry: true },
                            800,
                        )}
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()}>
                        <Button
                            buttonStyle={{
                                backgroundColor: Colors.primary.green,
                                borderRadius: 12,
                                marginTop: 20,
                                marginBottom: 10,
                            }}
                            title="Đăng ký"
                            onPress={handleSubmit(onSubmit)}
                        />
                    </Animated.View>
                    <Animated.Text
                        entering={FadeInDown.delay(1200).duration(1000).springify()}
                        className="text-white font-medium text-sm text-center"
                    >
                        Bạn đã có tài khoản?{' '}
                        <Text
                            onPress={() => onChangeForm()}
                            style={{ fontWeight: '700', fontSize: 14, color: Colors.primary.green }}
                        >
                            Đăng Nhập
                        </Text>
                    </Animated.Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpForm;
