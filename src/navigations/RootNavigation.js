import { useAuthContext } from "../contexts/AuthContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import LoadingScreen from "../screens/LoadingScreen"; // 👈 màn hình chờ lúc check token

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  return <MainTabs />; 
}
