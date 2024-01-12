import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Text } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CURRENT_USER, User } from '../types'

const HomeScreen = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Retrieve the currentUser from AsyncStorage
                const storedUser = await AsyncStorage.getItem(CURRENT_USER);

                // If storedUser is not null, parse it from JSON
                if (storedUser) {
                    const parsedUser: User = JSON.parse(storedUser);
                    setCurrentUser(parsedUser);
                }
            } catch (error) {
                console.error('Error fetching currentUser from AsyncStorage:', error);
            }
        };

        // Call the fetchCurrentUser function when the component mounts
        fetchCurrentUser();
    }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                {currentUser && (
                    <View style={styles.userInfoContainer}>
                        <Avatar.Image size={150} source={{ uri: currentUser.avatar }} />
                        <Text style={styles.title}>UserName: <Text >{currentUser.username}</Text></Text>
                        <Text style={styles.title}>Email: <Text >{currentUser.email}</Text></Text>
                        <Text style={styles.title}>Phone: <Text >{currentUser.phone}</Text></Text>
                        <Text style={styles.title}>Full Name: <Text >{currentUser.fullName}</Text></Text>
                    </View>
                )}

                <Button mode="contained" onPress={() => console.log('Button pressed')}>
                    Press me
                </Button>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    userInfoContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,

    },

})
