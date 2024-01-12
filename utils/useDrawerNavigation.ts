import { NavigationProp, useNavigation } from "@react-navigation/native"

export const useDrawerNavigation = () => {
    return useNavigation<NavigationProp<any>>();
}