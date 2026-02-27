import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
} from "react-native";
import api from "./src/api";
import { useEffect, useState, useCallback } from "react";
import { berberId } from "./src/configId";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kullanıcı içeride mi?
  const [checkingAuth, setCheckingAuth] = useState(true); // Şu an kapıda biletini mi kontrol ediyoruz?

  const [appointments, setAppointments] = useState([]);
  const [netDailyRevenue, setNetDailyRevenue] = useState(0);
  const [pendingDailyRevenue, setPendingDailyRevenue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD" formatında bugünün tarihi

      // Randevuları ve günlük geliri aynı anda çekmek için Promise.all kullanıyoruz
      const [appointmentsResponse, netRevenueResponse, pendingRevenueResponse] =
        await Promise.all([
          api.get(`/barber/${berberId}/daily?fullDate=${today}`),
          api.get(
            `/barber/${berberId}/price?status=approved&fullDate=${today}`,
          ),
          api.get(`/barber/${berberId}/price?status=pending&fullDate=${today}`),
        ]);

      setAppointments(appointmentsResponse.data);
      setNetDailyRevenue(netRevenueResponse.data);
      setPendingDailyRevenue(pendingRevenueResponse.data);
    } catch (err) {
      console.log("Error fetching dashboard data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log("Dashboard verileri çekildi");
  console.log("Randevular:", appointments);
  console.log("Net Günlük Gelir:", netDailyRevenue);
  console.log("Bekleyen Günlük Gelir:", pendingDailyRevenue);

  const handleAccept = async (id) => {
    try {
      console.log(`Randevu ${id} onaylandı!`);

      const response = await api.patch(`/${id}`, {
        status: "approved",
      });

      if (response.status === 200) {
        setAppointments((prev) =>
          prev.map((appt) => (appt.id === id ? response.data : appt)),
        );
        setNetDailyRevenue((prev) => prev + response.data.totalPrice);
        setPendingDailyRevenue((prev) => prev - response.data.totalPrice);
      }
    } catch (err) {
      console.log("Onaylarken hata oluştu", err);
    }
  };

  const handleCancel = async (id) => {
    try {
      console.log(`Randevu ${id} iptal edildi!`);

      const response = await api.patch(`/${id}`, {
        status: "cancelled",
      });

      if (response.status === 200) {
        setAppointments((prev) =>
          prev.map((appt) => (appt.id === id ? response.data : appt)),
        );
        setPendingDailyRevenue((prev) => prev - response.data.totalPrice);
      }
    } catch (err) {
      console.log("İptal edilirken hata oluştu", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Günlük Gelir Bilgisi */}
        <Text style={styles.headerTitle}>Günlük Gelir</Text>
        <View style={styles.revenueContainer}>
          <View style={styles.revenueBox}>
            <Text style={styles.revenueLabel}>Net Gelir</Text>
            <Text style={styles.revenueValue}>{netDailyRevenue} ₺</Text>
          </View>
          <View style={styles.revenueBox}>
            <Text style={styles.revenueLabel}>Bekleyen Gelir</Text>
            <Text style={styles.revenueValue}>{pendingDailyRevenue} ₺</Text>
          </View>
        </View>
      </View>
      <Text style={styles.headerTitle}>Randevular</Text>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#27AE60"]}
            tintColor="#27AE60"
          />
        }
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Üst Kat: Bilgiler ve Fiyat */}
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.timeText}>⏰ {item.time}</Text>
              </View>
              <Text style={styles.priceText}>{item.totalPrice} ₺</Text>
            </View>

            {/* Alt Kat: Butonlar veya Durum Yazısı */}
            <View style={styles.buttonContainer}>
              {item.status === "pending" ? (
                <>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={styles.cancelButtonText}>İptal Et</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(item.id)}
                  >
                    <Text style={styles.buttonText}>Onayla</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.statusText}>
                  {item.status === "approved" && "✅ Onaylandı"}
                  {item.status === "cancelled" && "❌ İptal Edildi"}
                </Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  revenueBox: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27AE60",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    // flexDirection: 'row' buradan kalktı, kart artık dikey (column) diziliyor
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row", // Üst katı yan yana dizer
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495E",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27AE60",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16, // Araya çizgi çekmek için boşluk
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButtonText: {
    color: "#E74C3C",
    fontWeight: "bold",
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7F8C8D",
    fontStyle: "italic",
  },
});
