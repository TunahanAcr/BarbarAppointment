import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";
import api from "../../api";
import MyInput from "../components/MyInput";
import MyButton from "../components/MyButton";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(true);

  //OTO-LOGİN CHECK
  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userName = await AsyncStorage.getItem("userName");

        //Local Storage da token mevcutsa içeri al
        if (token) {
          const decodedToken = jwtDecode(token);

          //decodedToken.exp The finish time of the token in ms form
          //Date.now() is ms form so we divede with 1000
          const currentTime = Date.now() / 1000;
          console.log("Token Expiration Time:", decodedToken.exp);
          console.log("Current Time:", currentTime);

          if (decodedToken.exp < currentTime) {
            //The time is over
            console.log("Exiting");
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userEmail");

            setCheckingAuth(false);
          } else {
            navigation.replace("Main", { userName: userName });
          }
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.log("Token bulunamadı");
        setCheckingAuth(false);
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

        navigation.replace("Main", { userName: response.data.user.name });
      } else {
        Alert.alert("Hata", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Sunucu cevap verdi ama 400/500 hatası (İşte Joi mesajı burada)
        console.log("Sunucu Hatası:", error.response.data);
        Alert.alert(
          "Giriş Yapılamadı",
          error.response.data.message || "Bilgilerinizi kontrol edin.",
        );
      } else if (error.request) {
        // Sunucuya hiç ulaşılamadı (İnternet/IP sorunu)
        Alert.alert("Bağlantı Hatası", "Sunucuya bağlanılamıyor.");
      } else {
        console.log("Hata:", error.message);
      }
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>✂️</Text>
        </View>
        <Text style={styles.authTitle}>Giriş Yap</Text>
        <Text style={styles.authSubtitle}>
          Randevu almak için hesabına gir
        </Text>
      </View>

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
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Hesabın yok mu?{" "}
          <Text style={styles.registerTextAccent}>Kayıt Ol</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    paddingHorizontal: 24,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
  },
  //Auth Stilleri
  authTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
  registerLink: {
    marginTop: 22,
  },
  registerText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
  },
  registerTextAccent: {
    color: Colors.primary,
    fontWeight: "800",
  },
});