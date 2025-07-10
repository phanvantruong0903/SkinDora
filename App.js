import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigations/RootNavigation";
import { AuthProvider } from "./src/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { CartProvider } from "./src/contexts/CartContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
}
