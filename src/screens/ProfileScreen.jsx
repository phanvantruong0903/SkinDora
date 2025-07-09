import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  LogOut,
  Lock,
  ShoppingBag,
  LogIn,
  UserPlus,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/common/useFetch";
import { clearTokens, getRefreshToken } from "../utils/tokenStorage";
import usePost from "../hooks/common/usePost";

const defaultAvatar =
  "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const { data: user, setData: setUser } = useFetch("/users/me", true, false);
  const { post: postLogout } = usePost("/users/logout");

  const handleLogout = async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await postLogout({ refresh_token: refreshToken });
      }

      await clearTokens();
      setUser(null);
      alert("Đăng xuất thành công!");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err?.response?.data || err.message);
      alert("Đăng xuất thất bại!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#B197FC" }}>
      <StatusBar backgroundColor="#B197FC" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerRow}>
            <Image
              source={{ uri: user?.avatar || defaultAvatar }}
              style={styles.avatar}
            />
            <View style={styles.headerRight}>
              <Text style={styles.name}>
                {user
                  ? `Xin chào, ${user.first_name} ${user.last_name}`
                  : "Xin chào, Khách"}
              </Text>
              {!user && (
                <View style={styles.authButtons}>
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <LogIn size={16} color="#fff" />
                    <Text style={styles.authButtonText}>Đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.authButton, styles.registerButton]}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <UserPlus size={16} color="#000" />
                    <Text style={[styles.authButtonText, { color: "#000" }]}>
                      Đăng ký
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Option
            label="Thông tin cá nhân"
            icon={<User size={20} color="#333" />}
            onPress={() => navigation.navigate("UserProfile")}
          />
          <Option
            label="Đơn hàng"
            icon={<ShoppingBag size={20} color="#333" />}
            onPress={() => navigation.navigate("Orders")}
          />
          <Option
            label="Danh sách yêu thích"
            icon={<ShoppingBag size={20} color="#333" />}
            onPress={() => navigation.navigate("Favorite")}
          />
          <Option
            label="Đổi mật khẩu"
            icon={<Lock size={20} color="#333" />}
            onPress={() => navigation.navigate("ChangePassword")}
          />
          {user && (
            <Option
              label="Đăng xuất"
              icon={<LogOut size={20} color="#E53935" />}
              onPress={handleLogout}
              isLogout
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function Option({ label, icon, onPress, isLogout }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        {icon}
        <Text style={[styles.optionLabel, isLogout && { color: "#E53935" }]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: "#B197FC",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ddd",
  },
  headerRight: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },
  authButtons: {
    flexDirection: "row",
    gap: 10,
  },
  authButton: {
    flexDirection: "row",
    backgroundColor: "#00C897",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
});
