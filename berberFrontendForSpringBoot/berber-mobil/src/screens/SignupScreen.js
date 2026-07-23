import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import api from "../api";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSignup = async () => {
    try {
      const response = await api.post("/signup", {
        name: name,
        email: email,
        password: password,
        inviteCode: inviteCode,
        role: "User",
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Başarılı", "Kayıt Oluşturuldu");
        navigation.navigate("Login"); // Kayıt başarılıysa giriş ekranına yönlendir
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>✂️</Text>
        </View>
        <Text style={styles.title}>Hesap Oluştur</Text>
        <Text style={styles.subtitle}>Birkaç saniyede kaydını tamamla</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Adınız"
          placeholderTextColor={Colors.textFaint}
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Dükkan Kodu"
          placeholderTextColor={Colors.textFaint}
          value={inviteCode}
          onChangeText={setInviteCode}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Kayıt Ol</Text>
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
