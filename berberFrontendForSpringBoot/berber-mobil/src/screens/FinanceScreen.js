import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Kasa</Text>
      <Text style={styles.headerTitle}>Finansal Durum</Text>

      <View style={styles.financeCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>₺</Text>
        </View>
        <View style={styles.financeTextGroup}>
          <Text style={styles.financeLabel}>Bugünkü Gelir</Text>
          <Text style={[styles.financeValue, { color: Colors.primary }]}>₺</Text>
        </View>
      </View>

      <View style={styles.financeCard}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.accentMuted }]}>
          <Text style={[styles.iconText, { color: Colors.accent }]}>₺</Text>
        </View>
        <View style={styles.financeTextGroup}>
          <Text style={styles.financeLabel}>Bekleyen Gelir</Text>
          <Text style={[styles.financeValue, { color: Colors.accent }]}>₺</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  eyebrow: {
    color: Colors.textFaint,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 24,
  },
  financeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },
  financeTextGroup: {
    flex: 1,
  },
  financeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 4,
  },
  financeValue: {
    fontSize: 22,
    fontWeight: "800",
  },
});