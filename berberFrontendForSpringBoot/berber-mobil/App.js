import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import api from "./src/api";
import { useEffect, useState } from "react";
import { berberId } from "./src/configId";

export default function App() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const getDailyAppointments = async () => {
      try {
        const response = await api.get(
          `/barber/${berberId}/daily?fullDate=${new Date().toISOString().split("T")[0]}`,
        );
        setAppointments([...response.data]);
        console.log("Onaylamadan önceki randevular:", appointments);
      } catch (err) {
        console.log(err);
      }
    };
    getDailyAppointments();
  }, []);

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
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = (id) => {
    console.log(`Randevu ${id} iptal edildi!`);
    api
      .patch(`/${id}`, {
        status: "cancelled",
      })
      .then((response) => {
        if (response.status === 200) {
          setAppointments((prev) =>
            prev.map((appt) => (appt.id === id ? response.data : appt)),
          );
        }
      });
  };
  console.log("Randevular:", appointments);
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Randevular</Text>
      <FlatList
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
