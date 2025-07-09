import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      const userInfo = await SecureStore.getItemAsync("userInfo"); 
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("userInfo");
    setUser(null);
    Alert.alert("Thông báo", "Đăng xuất thành công!");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chào bạn!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ccc" }]}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào, {user.name || "Người dùng"}!</Text>

      <Option
        label="Thông tin cá nhân"
        onPress={() => navigation.navigate("ProfileInfo")}
      />
      <Option label="Đơn hàng" onPress={() => navigation.navigate("Orders")} />
      <Option
        label="Đổi mật khẩu"
        onPress={() => navigation.navigate("ChangePassword")}
      />
      <Option label="Đăng xuất" onPress={handleLogout} />
    </View>
  );
}

function Option({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#00C897",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16 },
});
