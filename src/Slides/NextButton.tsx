import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Svg, { G, Circle } from "react-native-svg";
import { Icon } from "react-native-paper";

const NextButton: React.FC<{ percentage: number, iconName: string, color: string, scrollTo: () => void }> = ({ percentage, iconName, color, scrollTo }) => {
    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);
    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener(
            (value) => {
                const strokeDashoffset =
                    circumference - (circumference * value.value) / 100;

                if (progressRef?.current) {
                    progressRef.current.setNativeProps({
                        strokeDashoffset,
                    });
                }
            },

        ), [percentage];

        return () => {
            progressAnimation.removeAllListeners();
        }
    }, []);
    const animation = (toValue: number) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation={"-90"} origin={center}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#E6E7E8"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <Circle
                        ref={progressRef}
                        stroke={color}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (circumference * 60) / 100}
                        fill="transparent"
                    />
                </G>
            </Svg>
         
            <TouchableOpacity onPress={scrollTo} style={[styles.button, { backgroundColor: color }]} activeOpacity={0.6}>
                <Icon source={iconName} size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default NextButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        position: "absolute",
        //F4338F
        borderRadius: 100,
        padding: 20,
    },
});
