import React from 'react';
import { View, Button } from 'react-native';
import LoginForm from '../ui/LoginForm';
import SignUpForm from '../ui/SignUpForm';

export default function LoginSignup(onLogin: any) {
    const [isLoginView, setIsLoginView] = React.useState(false);

    return (
        <View>
            <Button
                title={isLoginView ? 'Switch to Signup' : 'Switch to Login'}
                onPress={() => setIsLoginView(!isLoginView)}
            />
            {isLoginView ? <LoginForm onLogin={onLogin} /> : <SignUpForm onSignup={onLogin} />}
        </View>
    );
}
