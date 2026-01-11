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

import api from "../../api";

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
        JSON.stringify(response.data, null, 2)
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
                `/appointments/cancel/${appointmentId}`
              );
              if (response.status === 200 || response.status === 201) {
                alert("Randevu iptal edildi");
                fetchAppointments(); //Yenilenmiş Liste
              } else {
                alert("Bir Hata oluştu");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
    }
  };
  // --- KART TASARIMI (Kod tekrarını önlemek için) ---
  const renderAppointmentItem = (item) => (
    <View key={item._id} style={styles.appointmentCard}>
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

        {item.status === "cancelled" ? (
          <Text style={{ color: "red", fontWeight: "bold" }}>İPTAL EDİLDİ</Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.statusText}>Onaylandı</Text>

            {/* Sadece GELECEK randevular iptal edilebilir olsun istersek buraya kontrol koyabiliriz */}
            <TouchableOpacity
              onPress={() => handleCancel(item._id)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={{ color: "white", fontSize: 18 }}>← Ana Sayfa</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevularım</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onFresh}
            tintColor="#fff"
          />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#f1c40f"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Gelecek Randevular</Text>
            {upcoming.length === 0 ? (
              <Text style={styles.emptyText}>Gelecek Randevunuz Yok</Text>
            ) : (
              upcoming.map((item) => renderAppointmentItem(item))
            )}

            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Geçmiş Randevular</Text>
            {past.length === 0 ? (
              <Text style={styles.emptyText}>Geçmiş Randevunuz Yok</Text>
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
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20, // Yazım hatası düzeltildi: paddingHorizantal -> paddingHorizontal
  },
  sectionTitle: {
    color: "#f1c40f", // Sarı renk başlıklar
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 10,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    marginBottom: 10,
  },
  // Kart Stilleri
  appointmentCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#f1c40f",
  },
  appBarberName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  appDate: {
    color: "#ccc",
    fontSize: 14,
  },
  appServiceText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  footerRow: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  appPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    color: "green",
    fontWeight: "bold",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
