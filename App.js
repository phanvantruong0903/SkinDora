import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigations/RootNavigation";
import { AuthProvider } from "./src/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
