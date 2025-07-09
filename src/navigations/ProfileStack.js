import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import WishlistScreen from "../screens/WishListScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Thông tin cá nhân", headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: "Hồ sơ người dùng" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Đăng nhập" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Đổi mật khẩu" }}
      />
      <Stack.Screen
        name="Favorite"
        component={WishlistScreen}
        options={{ title: "Danh sách yêu thích" }}
      />
      <Stack.Screen
        name="Orders"
        component={ChangePasswordScreen}
        options={{ title: "Đơn hàng của bạn" }}
      />
    </Stack.Navigator>
  );
}
