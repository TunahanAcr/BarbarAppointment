import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedEmail = await AsyncStorage.getItem("userEmail");

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    };
    loadUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (name.trim() === "" || email.trim() === "") {
      Alert.alert("Hata", "İsim ve e-posta boş bırakılamaz.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.put("/users/update", {
        name: name || undefined,
        email: email || undefined,
      });

      Alert.alert("Başarılı", "Profiliniz güncellendi.");

      await AsyncStorage.setItem("userName", response.data.user.name);
      await AsyncStorage.setItem("userEmail", response.data.user.email);
    } catch (error) {
      console.log("Profil Güncelleme Hatası:", error);
      Alert.alert(
        "Hata",
        error.response?.data?.message || "Güncelleme başarısız."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace("Login");
    } catch (err) {
      console.log("Silme Hatası", err);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Başlık */}
        <Text style={styles.title}>Profil Ayarları</Text>

        {/* Form Kutusu */}
        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ad Soyad"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#666"
          />

          {/* Güncelle Butonu */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Yükleniyor..." : "Güncelle"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#c0392b" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  content: {
    flex: 1,
    paddingHorizantal: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#c0392b",
    borderRadius: 8,
  },
  logoutText: {
    color: "#c0392b",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});
