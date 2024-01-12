import React, { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { List, Text, TextInput, Button, FAB, Searchbar, Avatar } from 'react-native-paper';

import { Device } from '../types';
import axiosInstance from '../../utils/axiosInstance';

const DevicesScreen = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [deviceDescription, setDeviceDescription] = useState('');
    const [deviceStatus, setDeviceStatus] = useState('Active'); // Assume status is a dropdown, you can customize this
    const [deviceImage, setDeviceImage] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [isRefreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDevices();
        setRefreshing(false);
    }, []);
    React.useEffect(() => {
        fetchDevices();  // Gọi hàm fetchDevices khi component được mount

    }, []);
    const resetForm = () => {
        setDeviceName('');
        setDeviceDescription('');
        setDeviceStatus('Active');
        setDeviceImage('');
    };

    const fetchDevices = async () => {
        try {
            const response = await axiosInstance.get('devices');
            setDevices(response.data);
            setFilteredDevices(response.data);

        } catch (error) {
            console.error('Error fetching devices:', error);

        }
    };
    const searchDevices = (text: string, data: Device[]) => {
        const filteredData = data.filter(
            (device) =>
                device.name.toLowerCase().includes(text.toLowerCase()) ||
                device.description.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredDevices(filteredData);
    };

    const addDevice = async () => {
        try {

            const newDevice: Device = {
                id: String(devices.length + 1),
                name: deviceName,
                description: deviceDescription,
                status: deviceStatus,
                createdDate: new Date().toISOString(),
                image: deviceImage,
            };

            await axiosInstance.post('devices', newDevice);

            fetchDevices();

            toggleModal();
            resetForm();
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };
    const toggleEditModal = (device: Device) => {
        setSelectedDevice(device);
        setDeviceName(device.name);
        setDeviceDescription(device.description);
        setDeviceStatus(device.status);
        setDeviceImage(device.image);
        toggleModal();

    };
    const toggleModal = () => {

        setModalVisible(!isModalVisible);
        if (isModalVisible) {
            resetForm();
            setSelectedDevice(null);
        }
    };

    const editDevice = async () => {
        if (!selectedDevice) return;

        try {
            const updatedDevice: Device = {
                ...selectedDevice,
                name: deviceName,
                description: deviceDescription,
                status: deviceStatus,
                image: deviceImage,
            };

            await axiosInstance.put(`devices/${selectedDevice.id}`, updatedDevice);

            fetchDevices();

            toggleEditModal(selectedDevice);
        } catch (error) {
            console.error('Error editing device:', error);
        }
    };


    const deleteDevice = async (id: string) => {
        try {
            await axiosInstance.delete(`devices/${id}`);
            fetchDevices();
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Devices List</Text>
            <Searchbar
                placeholder="Search"
                onChangeText={(value) => {
                    setSearchQuery(value);
                    searchDevices(value, devices);
                }}
                value={searchQuery}
            />
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleEditModal(item)}>
                        <View style={styles.listItem}>
                            <Avatar.Image source={{ uri: item.image }} size={120} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                            <FAB icon="delete-outline" mode='flat' onPress={() => deleteDevice(item.id)} />

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
                Add Device
            </Button>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>    {selectedDevice !== null ? `Edit Device ${selectedDevice.id}` : "Add Device"}</Text>
                        <TextInput
                            label="Device Name"
                            value={deviceName}
                            onChangeText={(text) => setDeviceName(text)}
                            style={styles.input}
                        />
                        <TextInput
                            label="Device Description"
                            value={deviceDescription}
                            onChangeText={(text) => setDeviceDescription(text)}
                            style={styles.input}
                        />
                        {/* Assuming status is a dropdown, you can customize this */}
                        <TextInput
                            label="Device Status"
                            value={deviceStatus}
                            onChangeText={(text) => setDeviceStatus(text)}
                            style={styles.input}
                        />
                        <TextInput
                            label="Device Image URL"
                            value={deviceImage}
                            onChangeText={(text) => setDeviceImage(text)}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={selectedDevice !== null ? editDevice : addDevice} style={styles.addButtonInModal}>
                            {selectedDevice !== null ? "Save changes" : "Add Device"}
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

export default DevicesScreen;
