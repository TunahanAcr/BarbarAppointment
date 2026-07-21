import { useState, useContext } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { Colors } from "../constants/colors";

import api from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifre giriniz");
      return;
    }
    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });
      if (response.status === 200 || response.status === 201) {
        await AsyncStorage.setItem("userName", response.data.name);
        await AsyncStorage.setItem("userEmail", response.data.email);

        login({ email: response.data.email, name: response.data.name });
        Alert.alert("Başarılı", "Giriş Yapıldı");
      }
    } catch (error) {
      console.error("Giriş sırasında hata oluştu:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>✂️</Text>
        </View>
        <Text style={styles.title}>BerberApp</Text>
        <Text style={styles.subtitle}>Yönetim paneline giriş yapın</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor={Colors.textFaint}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={Colors.textFaint}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 17,
    fontWeight: "800",
  },
});