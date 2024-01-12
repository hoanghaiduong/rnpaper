import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator, userNameValidator } from '../core/utils';
import { CURRENT_USER, Navigation, User } from '../types';
import { Text } from 'react-native-paper';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
    const [userName, setUserName] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    const _onLoginPressed = () => {
        const userNameError = userNameValidator(userName.value);
        const passwordError = passwordValidator(password.value);

        if (userNameError || passwordError) {
            setUserName({ ...userName, error: userNameError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        axiosInstance.get('users').then((res) => {
            const user = res.data.find((user: User) => user.username === userName.value && user.password === password.value)
            if (user) {
                Alert.alert("Đăng nhập thành công", "Đang chuyển hướng...", [
                    {
                        text: 'OK',
                        onPress: async () => {
                            await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user))
                            navigation.navigate("Root");
                        }
                    }
                ], { cancelable: false })
            }
            else {
                Alert.alert("Đăng nhập thất bại", "Tài khoản hoặc mật khẩu không đúng!")
            }
            // navigation.navigate('Root');
        }).catch((error) => { });

    };

    return (
        <Background>
            <BackButton goBack={() => navigation.navigate('Onboarding')} />

            <Logo />

            <Header>Welcome back.</Header>

            <TextInput
                label="Tài khoản"
                returnKeyType="next"
                value={userName.value}
                onChangeText={text => setUserName({ value: text, error: '' })}
                error={!!userName.error}
                errorText={userName.error}

            />

            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                    <Text style={styles.label}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>

            <Button mode="contained-tonal" onPress={_onLoginPressed}>
                Login
            </Button>

            <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(LoginScreen);
