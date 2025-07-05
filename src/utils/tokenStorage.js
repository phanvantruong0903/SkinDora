import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => AsyncStorage.getItem("accessToken");
export const getRefreshToken = () => AsyncStorage.getItem("refreshToken");
export const clearTokens = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
};
