import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../navigation/StackParamList';
import { Button } from 'react-native-paper';

const UserDetailScreen = ({ route, navigation }: { route: RouteProp<StackParamList, 'UserDetail'>, navigation: any }) => {
    const { user } = route.params;

    // Hàm xử lý khi nhấn nút "Quay lại"
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* Hiển thị hình ảnh người dùng */}
                <Image source={{ uri: user.avatar }} style={styles.avatar} />

                {/* Thông tin về người dùng */}
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
                {/* Thêm các thông tin khác về người dùng */}
            </View>

            {/* Nút quay lại */}
            <Button onPress={handleGoBack} mode="contained" style={styles.goBackButton}>
                Quay lại
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    goBackButton: {
        marginTop: 16,
    },
});

export default UserDetailScreen;
