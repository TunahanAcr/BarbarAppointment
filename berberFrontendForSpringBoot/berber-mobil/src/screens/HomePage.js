import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../constants/colors";
import { useAppointments } from "../hooks/useAppointments";
import { SwipeableAppointmentCard } from "../constants/SwipeableAppointmentCard";

const { width } = Dimensions.get("window");

const STATUS_META = {
  approved: { label: "Onaylandı", color: Colors.primary, bg: Colors.primaryMuted },
  cancelled: { label: "İptal Edildi", color: Colors.error, bg: Colors.errorMuted },
  pending: { label: "Onay Bekliyor", color: Colors.accent, bg: Colors.accentMuted },
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const {
    appointments,
    netDailyRevenue,
    pendingDailyRevenue,
    refreshing,
    refetch,
    handleAccept,
    handleCancel,
    removingItemId,
    setRemovingItemId,
    invalidateDashboard,
  } = useAppointments(today, true);

  const onRefresh = () => {
    invalidateDashboard();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Üst Kısım: Karşılama ve Özet */}
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>İyi çalışmalar,</Text>
        <Text style={styles.userNameText}>Usta</Text>
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

      <Text style={styles.sectionLabel}>Bugünkü Randevular</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>📅</Text>
            </View>
            <Text style={styles.emptyText}>
              Bugün için henüz bir randevu bulunmamaktadır.
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const status = STATUS_META[item.status] ?? STATUS_META.pending;
          return (
            <SwipeableAppointmentCard
              isRemoving={item.id === removingItemId}
              onAnimationComplete={() => {
                setRemovingItemId(null);
                invalidateDashboard(); // Animasyon tamamlandıktan sonra veriyi yenile
              }}
            >
              <View
                style={[
                  styles.appointmentCard,
                  { borderLeftColor: status.color },
                ]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(item.userName)}
                  </Text>
                </View>

                <View style={styles.customerInfo}>
                  <Text style={styles.customerName} numberOfLines={1}>
                    {item.userName}
                  </Text>
                  <View
                    style={[styles.statusPill, { backgroundColor: status.bg }]}
                  >
                    <View
                      style={[styles.statusDot, { backgroundColor: status.color }]}
                    />
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Text style={styles.priceText}>{item.totalPrice} ₺</Text>
                </View>

                {/* Sadece beklemedeyse butonları göster */}
                {item.status === "pending" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.cancelButton}
                      onPress={() => handleCancel(item.id)}
                    >
                      <Text style={styles.cancelIcon}>✕</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.confirmButton}
                      onPress={() => handleAccept(item.id)}
                    >
                      <Text style={styles.buttonText}>Onayla</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </SwipeableAppointmentCard>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🌌 Ana Ekran: Derinlik ve Odaklanma
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // 📈 Başlık ve Özet Alanı
  headerSection: {
    marginBottom: 26,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  userNameText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 4,
  },

  // 💳 Özet Kartları (Gelir/Randevu Sayısı)
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  statCard: {
    backgroundColor: Colors.surface,
    width: width / 2 - 30,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    color: Colors.primary,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 8,
  },

  sectionLabel: {
    color: Colors.textFaint,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 14,
  },

  // 🗓️ Randevu Kartı: Profesyonel Liste
  appointmentCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timeBlock: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  timeText: {
    color: Colors.text,
    fontWeight: "800",
    fontSize: 15,
  },
  priceText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  // ✅ Aksiyon Butonları (Kazanç Odaklı)
  actionButtons: {
    flexDirection: "row",
    marginLeft: 10,
    gap: 6,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 10,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.errorMuted,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: "800",
    fontSize: 12,
  },
  cancelIcon: {
    color: Colors.error,
    fontWeight: "800",
    fontSize: 13,
  },

  // ⭘ Boş Durum
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    fontSize: 24,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 15,
    paddingHorizontal: 40,
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