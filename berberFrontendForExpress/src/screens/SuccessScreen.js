import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAppointmentStore from "../store/useAppointmentStore";

export default function SuccessScreen({ navigation }) {
  // Verileri route yerine global state'ten çekiyoruz
  const { barber, date, time } = useAppointmentStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Main");
      // İstersen burada Zustand içindeki randevu verilerini temizleyen bir fonksiyon da çağırabilirsin
      // clearAppointmentDetails();
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color="#fff" />
        </View>

        <Text style={styles.title}>Harika!</Text>
        <Text style={styles.subtitle}>Randevunuz başarıyla oluşturuldu.</Text>

        <View style={styles.detailsBox}>
          <Text style={styles.detailText}>
            ✂️ Berber: <Text style={styles.boldText}>{barber.name}</Text>
          </Text>
          <Text style={styles.detailText}>
            📅 Tarih: <Text style={styles.boldText}>{date}</Text>
          </Text>
          <Text style={styles.detailText}>
            ⏰ Saat: <Text style={styles.boldText}>{time}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.homeButtonText}>Anasayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5", // Arka plan (açık gri)
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Android gölgesi
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10b981", // Tatlı bir zümrüt yeşili
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  detailsBox: {
    backgroundColor: "#f9fafb",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detailText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
    color: "#111827",
  },
  homeButton: {
    marginTop: 40,
    backgroundColor: "#111827", // Koyu renk şık buton
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
