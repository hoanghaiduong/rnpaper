import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import Slides from "../Slides/Slides";
import OnboardingItem from "../Slides/OnBoardingItem";
import Paginator from "../Slides/Paginator";
import NextButton from "../Slides/NextButton";

const OnBoardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const slidesRef = useRef<FlatList>(null)
    const scrollX = useRef(new Animated.Value(0)).current;
    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index)
    }).current
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const scrollTo = (): void => {
        if (currentIndex < Slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
        else {
            console.log("last index is " + currentIndex)
            navigation.navigate('SignIn')
        }
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={Slides}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id.toString()}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                x: scrollX
                            }
                        }
                    }], { useNativeDriver: false })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    renderItem={({ item }) => <OnboardingItem item={item} index={currentIndex} />}
                    ref={slidesRef}
                />
            </View>
            <Paginator data={Slides} scrollX={scrollX} />
            <NextButton iconName={currentIndex < Slides.length - 1 ? "arrow-right" : "check"} color={currentIndex < Slides.length - 1 ? "#F4338F" : "#29e345"} scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / Slides.length)} />

        </View>
    );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
