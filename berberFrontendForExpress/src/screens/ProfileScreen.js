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
import { Colors } from "../constants/colors";
import api from "../../api";
import useAppointmentStore from "../store/useAppointmentStore";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

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
      useAppointmentStore.getState().clearAppointment(); // Çıkışta randevu bilgisini temizle
      navigation.replace("Login");
    } catch (err) {
      console.log("Silme Hatası", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık */}
        <Text style={styles.title}>Profil Ayarları</Text>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          </View>
        </View>

        {/* Form Kutusu */}
        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ad Soyad"
            placeholderTextColor={Colors.textFaint}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.textFaint}
          />

          {/* Güncelle Butonu */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleUpdateProfile}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Yükleniyor..." : "Güncelle"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.textMuted,
    marginBottom: 8,
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    color: Colors.text,
    padding: 13,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "800",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 10,
    backgroundColor: Colors.errorMuted,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: "800",
    marginLeft: 10,
    fontSize: 16,
  },
});