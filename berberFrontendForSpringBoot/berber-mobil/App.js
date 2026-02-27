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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kullanıcı içeride mi?
  const [checkingAuth, setCheckingAuth] = useState(true); // Şu an kapıda biletini mi kontrol ediyoruz?  const [appointments, setAppointments] = useState([]);
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Main" component={HomePage} />
  </Stack.Navigator>;
  const [netDailyRevenue, setNetDailyRevenue] = useState(0);
  const [pendingDailyRevenue, setPendingDailyRevenue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={HomePage} />
    </Stack.Navigator>
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
