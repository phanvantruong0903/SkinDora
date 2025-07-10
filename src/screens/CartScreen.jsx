import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCart } from "../hooks/useCart";
import BulkActionsBar from "../components/BulkActionsBar";
import ProductInCart from "../components/ProductInCart";

const paymentLabelStyles = {
  cod: { color: "#4b5563", textAlign: "right" },
  momo: { color: "#ec4899", textAlign: "right" },
  zalo: { color: "#008fe5", textAlign: "right" },
  bank: { color: "#10b981", textAlign: "right" },
};

const paymentLabelMap = {
  cod: "Thanh toán khi nhận hàng",
  momo: "Ví Momo",
  zalo: "Ví ZaloPay",
  bank: "Chuyển khoản ngân hàng",
};

const CartScreen = ({ navigation, route }) => {
  const [selectProductIds, setSelectProductIds] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(undefined);

  const { cart, updateProductQuantityInCart, removeFromCart } = useCart();

  const { selectedVoucher, selectedPaymentMethod: paymentFromRoute } =
    route.params || {};

  useEffect(() => {
    if (selectedVoucher) setAppliedVoucher(selectedVoucher);
  }, [selectedVoucher]);

  useEffect(() => {
    if (paymentFromRoute) setSelectedPaymentMethod(paymentFromRoute);
  }, [paymentFromRoute]);

  const total = useMemo(() => {
    return Array.isArray(cart.Products)
      ? cart.Products?.reduce((sum, item) => sum + item.unitPrice * item.Quantity, 0)
      : 0;
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (
      appliedVoucher.minTotalApplicable &&
      total < appliedVoucher.minTotalApplicable
    )
      return 0;

    let discount = 0;
    if (appliedVoucher.discountType === "FIXED") {
      discount = appliedVoucher.discountAmount;
    }
    if (appliedVoucher.discountType === "PERCENTAGE") {
      discount = (total * appliedVoucher.discountAmount) / 100;
    }
    if (appliedVoucher.maxDiscountAmount) {
      return Math.min(discount, appliedVoucher.maxDiscountAmount);
    }
    return discount;
  }, [appliedVoucher, total]);

  const finalPrice = total - discountAmount;

  const updateQuantity = async (id, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    await updateProductQuantityInCart(id, newQuantity);
  };

  const handleDelete = async (ids) => {
    await Promise.all(ids.map((id) => removeFromCart(id)));
    setSelectProductIds([]);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận",
      `Xóa ${selectProductIds.length} sản phẩm khỏi giỏ hàng?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDelete(selectProductIds),
        },
      ]
    );
  };

  const toggleSelect = (id) => {
    setSelectProductIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  useFocusEffect(
    useCallback(() => {
      setSelectProductIds([]);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectProductIds.length > 0 && (
        <BulkActionsBar
          products={cart.Products}
          setSelected={setSelectProductIds}
          confirmDelete={confirmDelete}
        />
      )}
      <FlatList
        data={cart.Products}
        keyExtractor={(item) => item.ProductID}
        renderItem={({ item }) => (
          <ProductInCart
            item={item}
            selected={selectProductIds}
            onPress={() =>
              selectProductIds.length
                ? toggleSelect(item.ProductID)
                : navigation.navigate("Detail", { id: item.ProductID })
            }
            updateQuantity={updateQuantity}
            toggleSelect={toggleSelect}
          />
        )}
      />
      <View style={styles.stickyFooter}>
        <View style={[styles.voucherSection, styles.stickyFooterSection]}>
          <Text style={styles.label}>Skindora Voucher:</Text>
          <TouchableOpacity
            style={[styles.selectedSection]}
            onPress={() =>
              navigation.navigate("VoucherApplication", {
                selectedVoucher: appliedVoucher,
                selectedPaymentMethod,
              })
            }
          >
            <Text
              numberOfLines={1}
              style={[
                styles.notSelectedText,
                appliedVoucher && styles.selectedVoucher,
              ]}
            >
              {appliedVoucher ? appliedVoucher.code : "Chọn hoặc nhập mã"}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        <View style={[styles.stickyFooterSection]}>
          <Text style={styles.label}>Phương thức thanh toán:</Text>
          <TouchableOpacity
            style={[styles.selectedSection]}
            onPress={() =>
              navigation.navigate("PaymentMethod", {
                selectedVoucher: appliedVoucher,
                selectedPaymentMethod,
              })
            }
          >
            <Text
              numberOfLines={1}
              style={[
                styles.notSelectedText,
                selectedPaymentMethod &&
                  paymentLabelStyles[selectedPaymentMethod],
              ]}
            >
              {selectedPaymentMethod
                ? paymentLabelMap[selectedPaymentMethod] ||
                  selectedPaymentMethod
                : "Chọn phương thức thanh toán"}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        <View style={[styles.checkoutSection]}>
          <View style={styles.totalPrice}>
            <Text style={styles.totalText}>
              Tổng: {total.toLocaleString()} đ
            </Text>
            {appliedVoucher && (
              <Text style={styles.discountText}>
                (Giảm {discountAmount.toLocaleString()}đ)
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>
              Mua Hàng ({Array.isArray(cart.Products) ? cart.Products?.length : 0})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  stickyFooter: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  stickyFooterSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
  },
  voucherSection: {},
  label: { fontSize: 14, color: "#333" },
  selectedSection: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notSelectedText: {
    width: 130,
    flexWrap: "nowrap",
    color: "#ccc",
  },
  selectedVoucher: {
    color: "rgb(0, 200, 151)",
    textAlign: "right",
  },
  checkoutSection: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  totalPrice: {
    marginRight: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  discountText: {
    color: "#10b981",
    fontSize: 12,
    textAlign: "right",
  },
  checkoutBtn: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
});

export default CartScreen;
