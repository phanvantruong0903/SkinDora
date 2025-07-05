import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: product.main_images_detail?.[0] || product.image_on_list,
        }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>{product.productName_detail}</Text>
      <Text style={styles.subtitle}>{product.engName_detail}</Text>

      <Text style={styles.section}>Mô tả:</Text>
      <Text>{product.description_detail?.plainText}</Text>

      <Text style={styles.section}>Thành phần:</Text>
      <Text>{product.ingredients_detail?.plainText}</Text>

      <Text style={styles.section}>Hướng dẫn sử dụng:</Text>
      <Text>{product.guide_detail?.plainText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  section: {
    fontWeight: "600",
    marginTop: 10,
  },
});
