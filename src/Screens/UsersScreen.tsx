import React, { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { List, Text, TextInput, Button, FAB, Searchbar, Avatar } from 'react-native-paper';

import { User } from '../types';
import axiosInstance from '../../utils/axiosInstance';

const UsersScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState<User>({
        avatar: '',
        email: '',
        fullName: '',
        password: '',
        phone: '',
        username: ''
    });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isRefreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers();
        setRefreshing(false);
    }, []);

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setFormData({
            avatar: '',
            email: '',
            fullName: '',
            password: '',
            phone: '',
            username: ''
        });
    };

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching Users:', error);
        }
    };

    const searchUsers = (text: string, data: User[]) => {
        const filteredData = data.filter(
            (user) =>
                user.username.toLowerCase().includes(text.toLowerCase()) ||
                user.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filteredData);
    };

    const addUser = async () => {
        try {
            const newUser: User = {
                id: String(users.length + 1),
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                avatar: formData.avatar,
            };

            await axiosInstance.post('users', newUser);

            fetchUsers();

            toggleModal();
            resetForm();
        } catch (error) {
            console.error('Error adding User:', error);
        }
    };

    const toggleEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            password: user.password,
            phone: user.phone,
            avatar: user.avatar,
        });
        toggleModal();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        if (isModalVisible) {
            resetForm();
            setSelectedUser(null);
        }
    };

    const editUser = async () => {
        if (!selectedUser) return;

        try {
            const updatedUser: User = {
                ...selectedUser,
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                avatar: formData.avatar,
            };

            await axiosInstance.put(`users/${selectedUser.id}`, updatedUser);

            fetchUsers();

            toggleEditModal(selectedUser);
        } catch (error) {
            console.error('Error editing User:', error);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await axiosInstance.delete(`users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting User:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Users List</Text>
            <Searchbar
                placeholder="Search"
                onChangeText={(value) => {
                    setSearchQuery(value);
                    searchUsers(value, users);
                }}
                value={searchQuery}
            />
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleEditModal(item)}>
                        <View style={styles.listItem}>
                            <Avatar.Image source={{ uri: item.avatar }} size={120} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.username}</Text>
                                <Text style={styles.description}>{item.fullName}</Text>
                                <Text style={styles.description}>{item.email}</Text>
                                <Text style={styles.description}>{item.password}</Text>

                            </View>
                            <FAB icon="delete-outline" mode='flat' onPress={() => deleteUser(item.id)} />
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={onRefresh}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            <Button mode="contained" onPress={toggleModal} style={styles.addButtonInModal}>
                Add User
            </Button>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>
                            {selectedUser !== null ? `Edit User ${selectedUser.id}` : "Add User"}
                        </Text>
                        <TextInput
                            label="User Name"
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="Full Name"
                            value={formData.fullName}
                            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="Password"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="Phone"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="User Image URL"
                            value={formData.avatar}
                            onChangeText={(text) => setFormData({ ...formData, avatar: text })}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={selectedUser !== null ? editUser : addUser} style={styles.addButtonInModal}>
                            {selectedUser !== null ? "Save changes" : "Add User"}
                        </Button>
                        <Button mode="outlined" onPress={toggleModal} style={styles.cancelButtonInModal}>
                            Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    textContainer: {
        marginLeft: 16,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    addButtonInModal: {
        marginTop: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: '80%',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    cancelButtonInModal: {
        marginTop: 8,
        borderColor: 'blue',
    },
});

export default UsersScreen;
