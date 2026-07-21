import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../constants/colors";
import api from "../../api";

const STATUS_META = {
  approved: { label: "Onaylandı", color: Colors.primary, bg: Colors.primaryMuted },
  cancelled: { label: "İptal Edildi", color: Colors.error, bg: Colors.errorMuted },
  pending: { label: "Onay Bekleniyor", color: Colors.accent, bg: Colors.accentMuted },
};

export default function AppointmentScreen({ navigation }) {
  const [appointments, setAppointmets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false); //Aşağı çekip yenileme

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  //Gelecekteki randevular
  const upcoming = appointments.filter((app) => {
    if (!app.fullDate) return false;
    return new Date(app.fullDate) >= now;
  });

  //Geçmiş randevular
  const past = appointments.filter((app) => {
    if (!app.fullDate) return false;
    return new Date(app.fullDate) < now;
  });

  React.useEffect(() => {
    fetchAppointments();

    //Sayfaya her geri döndüğümde yüklesin diye
    const unsubcribe = navigation.addListener("focus", () => {
      fetchAppointments();
    });
    return unsubcribe;
  }, [navigation]);

  //Aşağı çekince yenileme
  const onFresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/my-appointments");
      setAppointmets(response.data);
      console.log(
        "🔍 GELEN RANDEVU VERİSİ:",
        JSON.stringify(response.data, null, 2),
      );
    } catch (err) {
      console.error("Randevular Çekilemedi", err);
    } finally {
      //Veri geldiğinde Loading ve Refreshing işlemlerini durdurur
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      Alert.alert(
        "Randevu iptali",
        "Bu randevuyu iptal etmek istediğinize emin misiniz?",
        [
          { text: "Vazgeç", style: "cancel" },
          {
            text: "Evet, İptal Et",
            style: "destructive",
            onPress: async () => {
              const response = await api.put(
                `/appointments/cancel/${appointmentId}`,
              );
              if (response.status === 200 || response.status === 201) {
                alert("Randevu iptal edildi");
                fetchAppointments(); //Yenilenmiş Liste
              } else {
                alert("Bir Hata oluştu");
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderStatus = (item) => {
    const meta = STATUS_META[item.status];
    if (!meta) return null;

    return (
      <View style={styles.statusGroup}>
        <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[styles.statusText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>

        {item.status === "approved" && (
          <TouchableOpacity
            onPress={() => handleCancel(item._id)}
            style={styles.cancelButton}
            activeOpacity={0.75}
          >
            <Text style={styles.cancelButtonText}>İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // --- KART TASARIMI (Kod tekrarını önlemek için) ---
  const renderAppointmentItem = (item) => {
    const meta = STATUS_META[item.status];
    return (
      <View
        key={item._id}
        style={[
          styles.appointmentCard,
          meta && { borderLeftColor: meta.color },
        ]}
      >
        {/* Üst Kısım: Berber Adı ve Tarih */}
        <View style={styles.row}>
          <Text style={styles.appBarberName}>{item.barberName}</Text>
          <Text style={styles.appDate}>
            {item.date} - {item.time}
          </Text>
        </View>

        {/* Orta Kısım: Hizmetler */}
        <View style={{ marginTop: 10 }}>
          {item.services.map((service, index) => (
            <Text key={index} style={styles.appServiceText}>
              • {service.name}
            </Text>
          ))}
        </View>

        {/* Alt Kısım: Fiyat ve Durum */}
        <View style={[styles.row, styles.footerRow]}>
          <Text style={styles.appPrice}>{item.totalPrice} TL</Text>

          {renderStatus(item)}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("HomeTab")}>
          <Text style={styles.backLink}>← Ana Sayfa</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevularım</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onFresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Gelecek Randevular</Text>
            {upcoming.length === 0 ? (
              <Text style={styles.emptyText}>Gelecek randevunuz yok</Text>
            ) : (
              upcoming.map((item) => renderAppointmentItem(item))
            )}

            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Geçmiş Randevular</Text>
            {past.length === 0 ? (
              <Text style={styles.emptyText}>Geçmiş randevunuz yok</Text>
            ) : (
              past.map((item) => renderAppointmentItem(item))
            )}
          </>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
  },
  backLink: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginTop: 10,
  },
  emptyText: {
    color: Colors.textFaint,
    fontStyle: "italic",
    marginBottom: 10,
  },
  // Kart Stilleri
  appointmentCard: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  appBarberName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  appDate: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  appServiceText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 2,
  },
  footerRow: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  appPrice: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 4,
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
  cancelButton: {
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: "800",
  },
});