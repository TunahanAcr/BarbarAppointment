import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAppointmentStore from "../store/useAppointmentStore";
import { Colors } from "../constants/colors";

export default function SuccessScreen({ navigation }) {
  // Verileri route yerine global state'ten çekiyoruz
  const { barber, date, time, clearAppointment } = useAppointmentStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. SADECE NAVIGATE YAPMIYORUZ! Navigasyon geçmişini (stack) tamamen siliyoruz.
      // Bu sayede arkada açık kalan AppointmentScreen tamamen yok ediliyor (unmount)
      // ve kullanıcı geri tuşuna basıp tekrar Başarı veya Randevu ekranına dönemiyor.
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }], // Anasayfanın adı "Main" ise böyle kalacak
      });

      // 2. Sayfa geçiş animasyonunun tamamlanması için ufak bir pay bırakıyoruz (500ms)
      // Sonra arkadan sessizce Zustand verilerini siliyoruz.
      setTimeout(() => {
        clearAppointment();
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={56} color={Colors.background} />
        </View>

        <Text style={styles.title}>Harika!</Text>
        <Text style={styles.subtitle}>Randevunuz başarıyla oluşturuldu.</Text>

        <View style={styles.detailsBox}>
          <Text style={styles.detailText}>
            ✂️ Berber: <Text style={styles.boldText}>{barber?.name}</Text>
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
        activeOpacity={0.85}
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
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 28,
  },
  detailsBox: {
    backgroundColor: Colors.surfaceElevated,
    width: "100%",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailText: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "800",
    color: Colors.text,
  },
  homeButton: {
    marginTop: 36,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "800",
  },
});
