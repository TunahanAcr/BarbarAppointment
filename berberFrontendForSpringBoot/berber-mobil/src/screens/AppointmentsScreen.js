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
import AsyncStorage from "@react-native-async-storage/async-storage";


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

export default function AppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dates, setDates] = useState([]);
  const [berberId, setBerberId] = useState(null);

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
    refetch,
    handleAccept,
    handleCancel,
    invalidateDashboard,
  } = useAppointments(selectedDate);

  const onRefresh = () => {
    invalidateDashboard();
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
          contentContainerStyle={styles.dateStripContent}
          renderItem={({ item }) => {
            const isSelected = item === selectedDate;
            const dateObj = new Date(item);
            return (
              <TouchableOpacity
                activeOpacity={0.8}
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
          <View>
            <Text style={styles.listEyebrow}>Randevular</Text>
            <Text style={styles.listTitle}>
              {new Date(selectedDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>
          <View style={styles.miniStats}>
            <Text style={styles.miniStatLabel}>Net Kazanç</Text>
            <Text style={styles.miniStatText}>{netDailyRevenue}₺</Text>
          </View>
        </View>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
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
                <Text style={styles.emptyIcon}>✂️</Text>
              </View>
              <Text style={styles.emptyText}>
                Seçili gün için randevu pladdnı bulunmamaktadır.
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const status = STATUS_META[item.status] ?? STATUS_META.pending;
            return (
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
            );
          }}
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
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  dateStripContent: {
    paddingHorizontal: 14,
  },
  dateCard: {
    width: 58,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
  },
  selectedDateCard: {
    backgroundColor: Colors.primary,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  dayName: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  dateNumber: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 3,
  },
  selectedText: {
    color: Colors.background,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.background,
    marginTop: 5,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 22,
  },
  listEyebrow: {
    color: Colors.textFaint,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.text,
  },
  miniStats: {
    alignItems: "flex-end",
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniStatLabel: {
    color: Colors.textFaint,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  miniStatText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 15,
    marginTop: 2,
  },
  appointmentCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
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
    fontSize: 15,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    fontSize: 26,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 15,
    paddingHorizontal: 40,
  },
});