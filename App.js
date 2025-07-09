import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigations/RootNavigation";
import { AuthProvider } from "./src/contexts/AuthContext";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
}
