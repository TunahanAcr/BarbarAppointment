import React from "react";
import {
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import MyInput from "../components/MyInput";
import MyButton from "../components/MyButton";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Başarılı", "Kayıt Oluşturuldu");

        navigation.navigate("Login");
      }
    } catch (err) {
      if (err.response) {
        // Sunucu cevap verdi ama 400/500 hatası

        // (İşte Joi mesajı burada)
        if (err.response.data.errors) {
          // Array olarak geliyor
          const errorMessages = err.response.data.errors;
          Alert.alert("Hata", errorMessages.join("\n"));
        }
        // Yoksa genel bir mesaj var mı
        else if (err.response.data.message) {
          Alert.alert("Hata", err.response.data.message);
        }
        // Hiçbiri yoksa genel hata
        else {
          Alert.alert("Hata", "Kayıt yapılamadı.");
        }
      } else if (err.request) {
        // Sunucuya hiç ulaşılamadı (İnternet/IP sorunu)
        Alert.alert("Hata", "Sunucuya bağlanılamadı.");
      } else {
        // Bilinmeyen bir hata
        Alert.alert("Hata", "Bilinmeyen bir hata oluştu.");
      }
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { justifyContent: "center", padding: 20 }]}
    >
      <Text style={styles.authTitle}>Kayıt Ol</Text>

      <MyInput placeholder="İsim" value={name} onChangeText={setName} />
      <MyInput placeholder="E-posta" value={email} onChangeText={setEmail} />
      <MyInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secure
      />

      <MyButton title="Kayıt Ol" onPress={handleRegister}></MyButton>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Zaten hesabın var mı?{" "}
          <Text style={{ color: "#f1c40f", fontWeight: "bold" }}>
            Giriş Yap
          </Text>
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
