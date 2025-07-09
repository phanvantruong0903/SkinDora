import MainTabs from "./MainTabs";
import LoadingScreen from "../screens/LoadingScreen";
import { useAuth } from "../hooks/useAuth";
import AuthStack from "./AuthStack";

export default function RootNavigator() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return accessToken ? <MainTabs /> : <AuthStack />;
}
