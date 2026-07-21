import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext"; // Path'i kontrol et
import { Colors } from "../constants/colors";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function ProfileScreen() {
  // 🗝️ Havuzdan logout fonksiyonunu ve kullanıcı bilgisini alalım
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet, Çık",
          onPress: () => logout(), // 👈 Context'teki logout'u tetikler
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
      </View>

      <Text style={styles.welcomeText}>Hoş geldin, {user?.name}!</Text>
      {user?.email && <Text style={styles.emailText}>{user.email}</Text>}

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.85}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Güvenli Çıkış</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 26,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  emailText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: "800",
    fontSize: 16,
  },
});