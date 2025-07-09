import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import useFetch from "../hooks/common/useFetch";
import { useNavigation } from "@react-navigation/native";
import axiosPublic from "../utils/axiosPublic";
import LoadingScreen from "./LoadingScreen";

export default function WishlistScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const {
    data: wishlistData,
    loading: loadingIds,
    error,
  } = useFetch("/users/getWishList", true, false);

  useEffect(() => {
    let isMounted = true;

    const fetchAllProductDetails = async () => {
      setLoadingProducts(true);
      try {
        const fetches = wishlistData.map((id) =>
          axiosPublic.get(`/products/${id}`)
        );
        const results = await Promise.all(fetches);

        const clean = results.map((res) => res.data?.result).filter(Boolean);
        if (isMounted) setProducts(clean);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (Array.isArray(wishlistData) && wishlistData.length > 0 && !loadingIds) {
      fetchAllProductDetails();
    } else if (!loadingIds) {
      setProducts([]);
      setLoadingProducts(false);
    }

    return () => {
      isMounted = false;
    };
  }, [wishlistData, loadingIds]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { id: item._id })}
    >
      <Image source={{ uri: item.image_on_list }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name_on_list}
        </Text>
        <Text style={styles.price}>
          {Number(item.price_on_list).toLocaleString("vi-VN")} ₫
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loadingIds || loadingProducts) {
    return (
      <View style={styles.center}>
        <LoadingScreen />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#666" }}>Chưa có sản phẩm yêu thích.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    color: "#e91e63",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
