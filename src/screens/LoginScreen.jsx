import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Sau khi login thành công thì RootNavigator sẽ tự redirect sang MainTabs
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1 }}
      />
      <Button title="Đăng nhập" onPress={handleLogin} />

      <Text
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Register")}
      >
        Chưa có tài khoản? Đăng ký
      </Text>
    </View>
  );
}
