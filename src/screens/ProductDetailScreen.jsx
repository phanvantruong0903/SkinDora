import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, ShoppingCart, Heart, Search } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import useFetch from "../hooks/common/useFetch";
import usePost from "../hooks/common/usePost";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const { id } = route.params || {};
  const [filteredRating, setFilteredRating] = useState(null);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    average: 0,
    grouped: {},
  });

  const {
    data: product,
    loading: loadingProduct,
    error: productError,
    refetch: refetchProduct,
  } = useFetch(`/products/${id}`, true, true);

  const {
    data: reviews = [],
    loading: loadingReviews,
    refetch: refetchReviews,
    setData: setReviews,
  } = useFetch(
    `/review/${id}/review`,
    true,
    true,
    filteredRating ? { rating: filteredRating } : null,
    (res) => {
      if (!Array.isArray(res.data)) return;
      setReviews(res.data);
      if (filteredRating === null) {
        setReviewStats({
          total: res.total || 0,
          average: res.average || 0,
          grouped: res.grouped || {},
        });
      }
    }
  );

  const { post: addToWishlist, loading: wishlistLoading } = usePost(
    "/users/addToWishList"
  );

  const images = [product?.image_on_list, product?.hover_image_on_list].filter(
    Boolean
  );

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (images.length > 1) {
        index = (index + 1) % images.length;
        scrollRef.current?.scrollTo({ x: width * index, animated: true });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const handleAddToWishList = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        Toast.show({
          type: "info",
          text1: "Bạn cần đăng nhập để yêu thích sản phẩm",
        });
        return;
      }

      await addToWishlist({ productId: [id] });
      Toast.show({
        type: "success",
        text1: "Đã thêm vào danh sách yêu thích",
        visibilityTime: 2000,
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1:
          err?.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        visibilityTime: 2000,
      });
    }
  };

  if (loadingProduct) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  if (productError || !product) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={refetchProduct} style={{ marginTop: 12 }}>
          <Text style={{ color: "#00C897" }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity>
          <ShoppingCart size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search bar bên trong ScrollView */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchInput}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Search size={18} color="#888" />
              <Text style={[styles.searchText, { marginLeft: 8 }]}>
                Tìm kiếm sản phẩm hoặc cửa hàng...
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {images.map((img, idx) => (
            <View key={idx} style={styles.productImage}>
              <Image
                source={{ uri: img }}
                style={styles.carouselImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>{product.name_on_list}</Text>
            <TouchableOpacity
              onPress={handleAddToWishList}
              disabled={wishlistLoading}
            >
              <Heart size={22} color={wishlistLoading ? "#ccc" : "#999"} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>
            {product.substance || "acetylsalicylic acid."}
          </Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>
            {Number(product.price_on_list).toLocaleString("vi-VN")} ₫
          </Text>

          <View style={styles.row}>
            {reviewStats.total === 0 ? (
              <Text style={styles.ratingCount}>Chưa có đánh giá nào</Text>
            ) : (
              <View style={styles.row}>
                <Text style={styles.ratingText}>
                  {reviewStats.average.toFixed(1)} ★
                </Text>
                <Text style={styles.ratingCount}>
                  ({reviewStats.total} đánh giá)
                </Text>
              </View>
            )}
          </View>

          {/* Grouped rating filter */}
          {Object.keys(reviewStats.grouped || {}).length > 0 && (
            <View style={{ marginTop: 12 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => {
                    setFilteredRating(star);
                    refetchReviews();
                  }}
                  style={styles.groupedRow}
                >
                  <Text style={{ color: "#666" }}>{star} ★</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {reviewStats.grouped[star] || 0}
                  </Text>
                </TouchableOpacity>
              ))}
              {filteredRating && (
                <TouchableOpacity
                  onPress={() => {
                    setFilteredRating(null);
                    refetchReviews();
                  }}
                >
                  <Text style={{ color: "#00C897", marginTop: 8 }}>
                    Xóa lọc ({filteredRating} ★)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Stock */}
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Còn hàng</Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Đánh giá sản phẩm
          </Text>
          {loadingReviews ? (
            <ActivityIndicator size="small" color="#00C897" />
          ) : reviews.length === 0 ? (
            <Text style={{ marginBottom: 20 }}>Chưa có đánh giá nào.</Text>
          ) : (
            reviews.map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <Text style={{ fontWeight: "bold" }}>{review.rating} ★</Text>
                <Text style={{ color: "#333", marginTop: 4 }}>
                  {review.comment}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    marginTop: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    fontSize: 16,
  },
  searchText: {
    fontSize: 16,
    color: "#999",
  },
  carousel: { marginTop: 16 },
  productImage: {
    width,
    height: 300,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: { width: "90%", height: "90%", borderRadius: 12 },
  infoContainer: { padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "600", flex: 1, marginRight: 10 },
  subText: { fontSize: 14, color: "#666", marginBottom: 4 },
  category: {
    fontSize: 14,
    color: "#00C897",
    fontWeight: "500",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 12,
  },
  ratingText: { fontWeight: "500", color: "#FFD700" },
  ratingCount: { color: "#999" },
  stockBadge: {
    backgroundColor: "#E6F9F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  stockText: { color: "#00C897", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  groupedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
});
