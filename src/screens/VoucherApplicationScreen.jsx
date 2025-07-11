import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import privateAxios from "../utils/axiosPrivate";
import { voucherEndpoints } from "../config/api";
import { useEffect, useState } from "react";



const VoucherApplicationScreen = ({ navigation, route }) => {
  const { selectedVoucher, selectedPaymentMethod } = route.params || {};
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    try {
      const {data} = await privateAxios.get(voucherEndpoints.list);
      console.log(data)
      setVouchers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch vouchers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSelectVoucher = (voucher) => {
    navigation.navigate("Cart", {
      selectedVoucher: voucher,
      selectedPaymentMethod,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00C897" />
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isSelected = selectedVoucher?._id === item._id;
            return (
              <TouchableOpacity
                style={[
                  styles.voucherItem,
                  isSelected && styles.voucherItemSelected,
                ]}
                onPress={() => handleSelectVoucher(item)}
              >
                <Text
                  style={[
                    styles.voucherCode,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.code}
                </Text>
                <Text
                  style={[
                    styles.voucherName,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.conditionText,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.minOrderValue
                    ? `Áp dụng cho đơn từ ${item.minOrderValue.toLocaleString()}đ`
                    : "Không yêu cầu giá trị tối thiểu"}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  voucherItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  voucherCode: { fontWeight: "bold", fontSize: 16, color: "#ef4444" },
  voucherName: { marginTop: 5, color: "#374151" },
  conditionText: { marginTop: 5, fontSize: 12, color: "#6b7280" },
  voucherItemSelected: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },

  voucherTextSelected: {
    color: "#fff",
  },
});

export default VoucherApplicationScreen;
