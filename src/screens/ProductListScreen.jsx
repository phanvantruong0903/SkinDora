import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/common/useFetch";
import { productEndpoints } from "../config/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "OTC Medicine",
  "Vitamins",
  "Supplements",
  "Eye Care",
  "Baby Care",
];

export default function ProductListScreen() {
  const navigation = useNavigation();
  const { data, loading, error } = useFetch(productEndpoints.list, true, true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  if (error) return <Text style={styles.errorText}>Lỗi rồi 😢</Text>;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for medicines or stores..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ marginVertical: 10, height: 50 }}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item && styles.categoryItemSelected,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Product Grid */}
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("Detail", { product: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    margin: 12,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    fontSize: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 36,
  },
  categoryItemSelected: {
    backgroundColor: "#00C897",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    marginTop: 100,
    color: "red",
    fontSize: 16,
  },
});
