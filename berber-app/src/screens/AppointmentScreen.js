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
      setLoading(false);
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
        ) : appointments.length === 0 ? (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
            Henüz randevunuz yok.
          </Text>
        ) : (
          //Listelemeye Başlıyoruz
          appointments.map((item) => (
            <View key={item._id} style={styles.appointmentCard}>
              {/* ÜSt Kısım: Berber Adı ve Tarih */}
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
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: "#333",
                    padding: 10,
                  },
                ]}
              >
                <Text style={styles.appPrice}>{item.totalPrice} TL</Text>

                {/* Koşullu Render */}
                {item.status === "cancelled" ? (
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    İPTAL EDİLDİ
                  </Text>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        marginRight: 10,
                      }}
                    >
                      Onaylandı
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleCancel(item._id)}
                      style={{
                        backgroundColor: "#c0392b",
                        padding: 8,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        İptal Et
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
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
    paddingVertical: 5,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizantal: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    marginTop: 5,
  },
  //Randevularım Ekranı Stilleri
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
});
