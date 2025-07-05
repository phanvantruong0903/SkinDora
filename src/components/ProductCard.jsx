import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

const ProductCard = ({ product, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image_on_list }} style={styles.image} />
      <Text style={styles.name}>{product.name_on_list}</Text>
      <Text style={styles.engName}>{product.engName_on_list}</Text>
      <Text style={styles.price}>{product.price_on_list}₫</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    height: 180,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  engName: {
    color: "#666",
  },
  price: {
    marginTop: 4,
    color: "#e91e63",
    fontWeight: "bold",
  },
});

export default ProductCard;
