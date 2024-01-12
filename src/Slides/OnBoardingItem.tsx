import { Image, ImageSourcePropType, StyleSheet, View, useWindowDimensions } from 'react-native';
import React from 'react';
import { QuickStartItem } from './Slides';
import { Text } from 'react-native-paper';

type OnboardingItemProps = {
    item: QuickStartItem;
    index: number;
};

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item, index }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width }]}>
            <Image
                source={item.image as ImageSourcePropType}
                style={[styles.image, { width, resizeMode: 'contain' }]}
            />
            <View style={{ flex: 0.3 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>

        </View>
    );
};

export default OnboardingItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',

    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        color: '#493d8a',
        textAlign: 'center'
    },
    description: {
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64
    }
})