import { SafeAreaView } from "react-native-safe-area-context";
import ProductListScreen from "./ProductListScreen";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { useCallback } from "react";

export default function HomeScreen() {
  const route = useRoute();
  const search = route.params?.search || "";
  // Build logout tạm để test login,register
  // const {logout} = useAuth()

  // useFocusEffect(
  //   useCallback(()=> {
  //     logout()
  //   }, [])
  // )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <ProductListScreen searchFromParam={search} />
    </SafeAreaView>
  );
}
