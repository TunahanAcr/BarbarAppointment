import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext"; // Path'i kontrol et

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
      <Text style={styles.welcomeText}>Hoş geldin, {user?.name}!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
