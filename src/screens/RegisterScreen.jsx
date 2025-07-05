import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { login } = useAuthContext(); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      // Gửi request đăng ký
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!res.ok) throw new Error("Đăng ký thất bại");

      // Nếu backend tự login trả access_token → gọi login luôn
      await login({ email, password });
    } catch (err) {
      Alert.alert("Đăng ký thất bại", err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Họ và tên</Text>
      <TextInput
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />

      <Text>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />

      <Text>Mật khẩu</Text>
      <TextInput
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />

      <Text>Nhập lại mật khẩu</Text>
      <TextInput
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />

      <Button title="Đăng ký" onPress={handleRegister} />

      <Text
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Login")}
      >
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
}
