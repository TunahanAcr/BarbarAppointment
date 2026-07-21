import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Giriş Durumu Kontrol Ediliyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 16,
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
});