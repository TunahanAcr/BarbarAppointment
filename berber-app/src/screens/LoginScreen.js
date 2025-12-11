import React from "react";
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import MyInput from "../components/MyInput";
import MyButton from "../components/MyButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  //OTO-LOGİN CHECK
  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userName = await AsyncStorage.getItem("userName");

        //Local Storage da token mevcutsa içeri al
        if (token) {
          navigation.replace("Main", { userName: userName });
        }
      } catch (err) {
        console.log("Token bulunamadı");
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200 || response.status === 201) {
        //Giriş yapıldığında tokeni locale gömüyoruz
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("userName", response.data.user.name);
        await AsyncStorage.setItem("userEmail", response.data.user.email);

        console.log("Giriş başarılı", response.data);

        navigation.navigate("Main", { userName: response.data.user.name });
      } else {
        Alert.alert("Hata", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Sunucu cevap verdi ama 400/500 hatası (İşte Joi mesajı burada)
        console.log("Sunucu Hatası:", error.response.data);
        Alert.alert(
          "Giriş Yapılamadı",
          error.response.data.message || "Bilgilerinizi kontrol edin."
        );
      } else if (error.request) {
        // Sunucuya hiç ulaşılamadı (İnternet/IP sorunu)
        Alert.alert("Bağlantı Hatası", "Sunucuya bağlanılamıyor.");
      } else {
        console.log("Hata:", error.message);
      }
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { justifyContent: "center", padding: 20 }]}
    >
      <Text style={styles.authTitle}>Giriş Yap</Text>

      {/* Email kutusu */}
      <MyInput
        label="E-posta"
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
      />

      {/* Şifre Kutusu */}
      <MyInput
        label="Şifre"
        placeholder="******"
        value={password}
        onChangeText={setPassword}
        secure // secure={true} demek
      />

      <MyButton title="Giriş Yap" onPress={handleLogin} />

      {/* Kayıt Ol Linki */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Hesabın yok mu?{" "}
          <Text style={{ color: "#f1c40f", fontWeight: "bold" }}>Kayıt Ol</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  //Auth Stilleri
  authTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
});
