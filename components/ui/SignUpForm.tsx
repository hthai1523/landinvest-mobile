import React from 'react';
import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rneui/themed';
import Colors from '@/constants/Colors';
import { signUpFormSchema, SignUpFormSchema } from '@/constants/FormSchema';

const SignUpForm = ({onChangeForm} : {onChangeForm: () => void}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: SignUpFormSchema) => {
        Alert.alert('Đăng ký', 'Đang xử lý yêu cầu đăng ký của bạn...');
        // Xử lý đăng ký ở đây, ví dụ: registerUser(data);
    };

    const renderInput = (name: keyof SignUpFormSchema, placeholder: string, options: any = {}, delay:number) => (
       <Animated.View entering={FadeInDown.delay(delay).duration(1000).springify()} >
          <Controller
              control={control}
              name={name}
              render={({ field: { onChange, onBlur, value } }) => (
                  <View style={{ marginBottom: 10 }}>
                      <TextInput
                          placeholder={placeholder}
                          placeholderTextColor="gray"
                          style={{
                              borderColor: errors[name] ? 'red' : 'gray',
                              borderWidth: 1,
                              padding: 10,
                              backgroundColor: '#fff',
                              color: '#000',
                              borderRadius: 12,
                          }}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value as string}
                          {...options}
                      />
                      {errors[name] && <Text style={{ color: 'red' }}>{errors[name]?.message}</Text>}
                  </View>
              )}
          />
       </Animated.View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
            <StatusBar style="light" />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View className='p-4 justify-center flex-1'>
                    <Animated.Text  entering={FadeInDown.duration(1000).springify()} style={{ color: 'white', fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Đăng ký</Animated.Text>

                    <Animated.View entering={FadeInDown.duration(1000).springify()}>
                        {renderInput('name', 'Tên', { autoCapitalize: 'words' }, 200)}
                        {renderInput('email', 'Email', { keyboardType: 'email-address', autoCapitalize: 'none' }, 400)}
                        {renderInput('password', 'Mật khẩu', { secureTextEntry: true }, 600)}
                        {renderInput('passwordConfirmation', 'Xác nhận mật khẩu', { secureTextEntry: true }, 800)}
                    </Animated.View>

                    <Animated.View  entering={FadeInDown.delay(1000).duration(1000).springify()}>
                      <Button
                          buttonStyle={{ backgroundColor: Colors.primary.green, borderRadius: 12, marginTop: 20, marginBottom: 10 }}
                          title="Đăng ký"
                          onPress={handleSubmit(onSubmit)}
                      />
                    </Animated.View>
                    <Animated.Text  entering={FadeInDown.delay(1200).duration(1000).springify()} className='text-white font-medium text-sm text-center'>
                        Bạn đã có tài khoản? <Text onPress={() => onChangeForm()} style={{ fontWeight: '700', fontSize: 14 ,color: Colors.primary.green }}>Đăng Nhập</Text>
                    </Animated.Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpForm;