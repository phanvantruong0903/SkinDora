import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  useEffect(() => {
    const setFakeToken = async () => {
      await SecureStore.setItemAsync(
        "accessToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg0ZWEwMmE0ODdjZjc3MmVkMTRkMWQzIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJpYXQiOjE3NTIwNzQ4MjcsImV4cCI6MTc1MjA3NjYyN30.1uu8OrcB31uCmZ_4rfm1olQk-bHG4-6iTSe7xgEyNjY"
      );
      await SecureStore.setItemAsync(
        "refreshToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg0ZWEwMmE0ODdjZjc3MmVkMTRkMWQzIiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoxLCJpYXQiOjE3NTIwNzI3MDYsImV4cCI6MTc1MjY3NzUwNn0.SBN4mbqD-7BrMvw51ghgrQCScHYnyYwWYG0WUqcNNKo"
      );
    };

    setFakeToken();
  }, []);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
}
