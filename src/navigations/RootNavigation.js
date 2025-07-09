import MainTabs from "./MainTabs";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import { useAuth } from "../hooks/useAuth";

export default function RootNavigator() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return accessToken ? <MainTabs /> : <LoginScreen />;
}
