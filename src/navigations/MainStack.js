import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "../screens/ProductDetailScreen"; // đường dẫn đúng với bạn

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Detail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
