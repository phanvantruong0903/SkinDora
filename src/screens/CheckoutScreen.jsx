import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import privateAxios from "../utils/axiosPrivate";
import { DiscountType } from "../constants/enum";
import RecipientInfoSection from "../components/RecipientInfoSection";

const paymentLabelMap = {
  cod: "Thanh toán khi nhận hàng",
  vnpay: "Ví VNPAY",
  zalopay: "Ví ZaloPay",
};

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { cart, selectedVoucher, selectedPaymentMethod } = route.params || {};
  const [appliedPaymentMethod, setAppliedPaymentMethod] = useState(
    selectedPaymentMethod || undefined
  );

  if (!cart) {
    console.error("CheckoutScreen: cart is undefined");
    return (
      <View>
        <Text>Lỗi: Không có thông tin giỏ hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Text>Quay lại giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = cart.TotalPrice;

  const discountAmount = (() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.minOrderValue && total < selectedVoucher.minOrderValue)
      return 0;

    let discount = 0;
    if (selectedVoucher.discountType === DiscountType.FIXED) {
      discount = selectedVoucher.discountValue;
    } else if (selectedVoucher.discountType === DiscountType.PERCENTAGE) {
      discount = (total * selectedVoucher.discountValue) / 100;
    }

    return selectedVoucher.maxDiscountAmount
      ? Math.min(discount, selectedVoucher.maxDiscountAmount)
      : discount;
  })();

  const finalTotal = total - discountAmount;

  const handleOrder = async () => {
    try {
      const payload = {
        voucherCode: selectedVoucher?.code,
        PaymentMethod: appliedPaymentMethod,
        ShipAddress: user.location,
      };

      await privateAxios.post("/orders/checkout", payload);

      Alert.alert("Thành công", "Đơn hàng đã được tạo!");
      navigation.navigate("OrderSuccessScreen");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedPaymentMethod !== undefined) {
        setAppliedPaymentMethod(selectedPaymentMethod);
      }
    }, [route.params, setAppliedPaymentMethod])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Thông tin người nhận */}
      <RecipientInfoSection />

      {/* Danh sách sản phẩm */}
      <View style={styles.section}>
        {cart.Products.map((item, index) => (
          <View
            key={item.ProductID}
            style={[
              styles.productRow,
              index !== cart.Products.length - 1 && styles.productRowBorder,
            ]}
          >
            <Image source={{ uri: item.Image }} style={styles.productImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.productName}>{item.Name}</Text>
              <View style={styles.productDetailWrapper}>
                <Text style={styles.productDetailText}>x{item.Quantity}</Text>
                <Text style={styles.productDetailText}>
                  {item.PricePerUnit.toLocaleString()} đ
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Tổng ({cart.Products.reduce((sum, p) => sum + p.Quantity, 0)} sản
            phẩm):
          </Text>
          <Text style={styles.summaryText}>
            {cart.TotalPrice.toLocaleString()} đ
          </Text>
        </View>
      </View>

      {/* Voucher */}
      <TouchableOpacity
        style={styles.section}
        onPress={() =>
          navigation.navigate("VoucherApplication", {
            selectedVoucher,
            selectedPaymentMethod: appliedPaymentMethod,
            cart,
          })
        }
      >
        <Text style={styles.label}>Mã giảm giá:</Text>
        <Text style={styles.voucherText}>
          {selectedVoucher?.code || "Chọn hoặc nhập mã"}
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Phương thức thanh toán:</Text>
        <View style={styles.paymentOptionsContainer}>
          {["cod", "vnpay", "zalopay"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                appliedPaymentMethod === method &&
                  styles.paymentOptionSelected,
              ]}
              onPress={() => setAppliedPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.paymentOptionText,
                  appliedPaymentMethod === method &&
                    styles.paymentOptionTextSelected,
                ]}
              >
                {paymentLabelMap[method]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tổng tiền */}
      <View style={styles.section}>
        <Text style={styles.totalText}>Tổng: {total.toLocaleString()} đ</Text>
        {discountAmount > 0 && (
          <Text style={styles.discountText}>
            Giảm: {discountAmount.toLocaleString()} đ
          </Text>
        )}
        <Text style={styles.finalText}>
          Thanh toán: {finalTotal.toLocaleString()} đ
        </Text>
      </View>

      {/* Nút đặt hàng */}
      <TouchableOpacity style={styles.checkoutBtn} onPress={handleOrder}>
        <Text style={styles.checkoutText}>Đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  recipientSection: {
    padding: 16,
    backgroundColor: "#fef2f2",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  recipientName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  recipientAddress: { fontSize: 14, color: "#666" },

  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: "#eee",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  productDetailWrapper: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productDetailText: {
    fontSize: 13,
    color: "#666",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  productQuantity: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: { fontSize: 14, fontWeight: "500", color: "#333" },
  productDetails: { fontSize: 13, color: "#666", marginTop: 4 },
  productTotal: { fontSize: 13, color: "#e11d48", marginTop: 4 },

  voucherText: { fontSize: 14, color: "#10b981", marginTop: 4 },
  paymentOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },

  paymentOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },

  paymentOptionSelected: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },

  paymentOptionText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },

  paymentOptionTextSelected: {
    color: "#059669",
    fontWeight: "bold",
  },

  totalText: { fontSize: 16, color: "#444" },
  discountText: { fontSize: 14, color: "#10b981" },
  finalText: { fontSize: 18, fontWeight: "bold", color: "#e11d48" },

  checkoutBtn: {
    backgroundColor: "#e11d48",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
