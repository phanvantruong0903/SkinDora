import { useAuthContext } from "../contexts/AuthContext";
import LoadingScreen from "../screens/LoadingScreen";
import MainStack from "./MainStack";

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  return <MainStack />; 
}
