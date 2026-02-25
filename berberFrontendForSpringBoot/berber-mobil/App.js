import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import api from "./src/api";
import { useEffect, useState } from "react";
import { berberId } from "./src/configId";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  console.log(`/barber/${berberId}/daily?fullDate=2026-01-13`);
  useEffect(() => {
    const getDailyAppointments = async () => {
      try {
        const response = await api.get(
          `/barber/${berberId}/daily?fullDate=2026-01-13`,
        );
        setAppointments(response.data);
        console.log(appointments);
      } catch (err) {
        console.log(err);
      }
    };
    getDailyAppointments();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
