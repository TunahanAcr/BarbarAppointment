import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Colors } from "../constants/colors";
import { useAppointments } from "../hooks/useAppointments";

const { width } = Dimensions.get("window");

export default function AppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dates, setDates] = useState([]);

  // 🗓️ 14 Günlük Şerit Hazırlığı
  useEffect(() => {
    const tempDates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      tempDates.push(date.toISOString().split("T")[0]);
    }
    setDates(tempDates);
  }, []);

  const {
    appointments,
    netDailyRevenue,
    refreshing,
    fetchDashboardData,
    handleAccept,
    handleCancel,
  } = useAppointments(selectedDate);

  const onRefresh = () => {
    fetchDashboardData(selectedDate);
  };

  return (
    <View style={styles.container}>
      {/* 📅 Tarih Şeridi */}
      <View style={styles.dateStrip}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = item === selectedDate;
            const dateObj = new Date(item);
            return (
              <TouchableOpacity
                onPress={() => setSelectedDate(item)}
                style={[styles.dateCard, isSelected && styles.selectedDateCard]}
              >
                <Text
                  style={[styles.dayName, isSelected && styles.selectedText]}
                >
                  {
                    ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"][
                      dateObj.getDay()
                    ]
                  }
                </Text>
                <Text
                  style={[styles.dateNumber, isSelected && styles.selectedText]}
                >
                  {dateObj.getDate()}
                </Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 📜 Randevu Listesi Bölümü */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {new Date(selectedDate).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
            })}
          </Text>
          <View style={styles.miniStats}>
            <Text style={styles.miniStatText}>Net: {netDailyRevenue}₺</Text>
          </View>
        </View>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          // Boş liste kontrolü FlatList içinde daha şık durur
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Seçili gün için randevu planı bulunmamaktadır.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              style={[
                styles.appointmentCard,
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
                <Text style={styles.statLabel}>{item.totalPrice} ₺</Text>
              </View>

              {item.status === "pending" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={styles.buttonIcon}>❌</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dateStrip: {
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  dateCard: {
    width: 60,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    borderRadius: 12,
  },
  selectedDateCard: {
    backgroundColor: Colors.primary,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dayName: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  dateNumber: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  selectedText: {
    color: Colors.white,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
    marginTop: 4,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  miniStats: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniStatText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 13,
  },
  appointmentCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    // Gölge
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  serviceType: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  timeText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 15,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: 15,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  buttonIcon: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 15,
  },
});
