import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import {
    emailValidator,
    passwordValidator,
    userNameValidator,
    ComparePasswordValidator,
    RepeatPasswordValidator
} from '../core/utils';
import axios from 'axios';

type Props = {
    navigation: Navigation;
};

const SignUpScreen = ({ navigation }: Props) => {
    const [username, setUserName] = useState({ value: '', error: '' });
    const [phone, setPhone] = useState({ value: '', error: '' });
    const [fullname, setfullName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [rePassword, setRePassword] = useState({ value: '', error: '' });

    const _onSignUpPressed = () => {
        const usernameError = userNameValidator(username.value);
        const repeatPasswordError = RepeatPasswordValidator(rePassword.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const comparePasswordError = ComparePasswordValidator(password.value, rePassword.value);
        if (passwordError || usernameError || repeatPasswordError || comparePasswordError) {
            //emailError ||  setEmail({ ...email, error: emailError });

            setPassword({ ...password, error: passwordError });
            setUserName({ ...username, error: usernameError });
            setRePassword({ ...rePassword, error: repeatPasswordError || comparePasswordError });

            return;
        }
        axios({
            method: 'POST',
            url: 'https://659d3eec633f9aee7909027e.mockapi.io/api/v1/users',
            data: {
                username: username.value,
                password: password.value,
                phone: phone.value,
                email: email.value,
                fullName: fullname.value
            }
        }).then((success) => {
            console.log(success.statusText)
            if (success.status === 200 || success.status === 201) {
                Alert.alert("Đăng ký thành công !", "Vui lòng đăng nhập bằng tài khoản", [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate("SignIn"),

                    },

                ],
                    { cancelable: false })
            }

        }).catch(() => {

        })

    };

    return (
        <ScrollView>
            <Background>
                <BackButton goBack={() => navigation.navigate('SignIn')} />

                <Logo />

                <Header>Create Account</Header>

                <TextInput
                    label="Họ Tên"
                    returnKeyType="next"
                    value={fullname.value}
                    onChangeText={text => setfullName({ value: text, error: '' })}
                    error={!!fullname.error}
                    errorText={fullname.error}
                />
                <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={text => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />

                <TextInput
                    label="SDT"
                    returnKeyType="next"
                    value={phone.value}
                    onChangeText={text => setPhone({ value: text, error: '' })}
                    error={!!phone.error}
                    errorText={phone.error}
                />
                <TextInput
                    label="Tài khoản"
                    returnKeyType="next"
                    value={username.value}
                    onChangeText={text => setUserName({ value: text, error: '' })}
                    error={!!username.error}
                    errorText={username.error}
                />


                <TextInput
                    label="Mật khẩu"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry
                />
                <TextInput
                    label="Nhập lại mật khẩu"
                    returnKeyType="done"
                    value={rePassword.value}
                    onChangeText={text => setRePassword({ value: text, error: '' })}
                    error={!!rePassword.error}
                    errorText={rePassword.error}
                    secureTextEntry
                />
                <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
                    Sign Up
                </Button>

                <View style={styles.row}>
                    <Text style={styles.label}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(SignUpScreen);
