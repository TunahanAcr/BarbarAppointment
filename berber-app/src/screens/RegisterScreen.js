import React from "react";
import {
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";

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

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      ></TextInput>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      ></TextInput>

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      ></TextInput>

      <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
        <Text style={styles.authButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>

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
  input: {
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  authButton: {
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
