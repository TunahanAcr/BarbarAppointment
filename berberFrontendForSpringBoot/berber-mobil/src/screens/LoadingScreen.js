import { View, Text } from "react-native";
export default function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
      }}
    >
      <Text>Giriş Durumu Kontrol Ediliyor...</Text>
    </View>
  );
}
