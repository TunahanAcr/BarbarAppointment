import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api";
import { useEffect, useState, useCallback } from "react";
import { berberId } from "../configId";
import { Colors } from "../constants/colors";
import { Dimensions } from "react-native";
import { useAppointments } from "../hooks/useAppointments";

const { width } = Dimensions.get("window");

export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const {
    appointments,
    netDailyRevenue,
    pendingDailyRevenue,
    refreshing,
    fetchDashboardData,
    handleAccept,
    handleCancel,
  } = useAppointments(today);

  const onRefresh = () => {
    fetchDashboardData(today);
  };

  return (
    <View style={styles.container}>
      {/* Üst Kısım: Karşılama ve Özet */}
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>İyi çalışmalar,</Text>
        <Text style={styles.userNameText}> "Usta"</Text>
      </View>

      {/* Günlük Gelir Kartları (Winner Stats) */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Net Gelir</Text>
          <Text style={styles.statValue}>{netDailyRevenue} ₺</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.accent }]}>
          <Text style={styles.statLabel}>Bekleyen</Text>
          <Text style={[styles.statValue, { color: Colors.accent }]}>
            {pendingDailyRevenue} ₺
          </Text>
        </View>
      </View>

      <Text style={[styles.statLabel, { marginBottom: 15, fontSize: 14 }]}>
        Bugünkü Randevular
      </Text>

      {appointments.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ textAlign: "center", color: Colors.textMuted }}>
            Bugün için henüz bir randevu bulunmamaktadır.
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.appointmentCard,
                // Duruma göre sol şerit rengini dinamik değiştiriyoruz 🎨
                {
                  borderLeftColor:
                    item.status === "approved"
                      ? Colors.primary
                      : item.status === "cancelled"
                        ? Colors.error
                        : Colors.accent,
                },
              ]}
            >
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.userName}</Text>
                <Text style={styles.serviceType}>
                  {item.status === "approved"
                    ? "✅ Onaylandı"
                    : item.status === "cancelled"
                      ? "❌ İptal Edildi"
                      : "⏳ Onay Bekliyor"}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={[styles.statLabel, { marginTop: 4 }]}>
                  {item.totalPrice} ₺
                </Text>
              </View>

              {/* Sadece beklemedeyse butonları göster */}
              {item.status === "pending" && (
                <View style={[styles.actionButtons, { marginLeft: 15 }]}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={[styles.buttonText, { color: Colors.error }]}>
                      ❌
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleAccept(item.id)}
                  >
                    <Text style={styles.buttonText}>Onayla</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // 🌌 Ana Ekran: Derinlik ve Odaklanma
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 📈 Başlık ve Özet Alanı
  headerSection: {
    marginBottom: 25,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontFamily: "System", // Varsa özel fontun buraya
  },
  userNameText: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 4,
  },

  // 💳 Özet Kartları (Gelir/Randevu Sayısı)
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: Colors.surface,
    width: width / 2 - 30,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    // Hafif gölge (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Gölge (Android)
    elevation: 8,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    color: Colors.primary, // Kazancı simgeleyen yeşil 🟢
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },

  // 🗓️ Randevu Kartı: Profesyonel Liste
  appointmentCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent, // Bekleyen randevular için Amber sarısı
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  serviceType: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  timeText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 15,
  },

  // ✅ Aksiyon Butonları (Kazanç Odaklı)
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  confirmButton: {
    backgroundColor: Colors.primary, // Zümrüt Yeşili (Psikolojik ödül)
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },

  // 🚪 Çıkış ve Yan Butonlar
  secondaryButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 15,
  },
  secondaryButtonText: {
    color: Colors.textMuted,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
