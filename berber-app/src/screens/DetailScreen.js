import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  useState,
  Image,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";
import useAppointmentStore from "../store/useAppointmentStore";

export default function DetailScreen({ navigation, route }) {
  const barber = useAppointmentStore((state) => state.barber);
  const setDateTime = useAppointmentStore((state) => state.setDateTime);
  // Tarih ve Saat Seçimi için State Değişkenleri
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);

  //Dolu saatleri tutacak
  const [bookedTimes, setBookedTimes] = React.useState([]);

  //Test için sabit tarih ve saatler
  const days = [
    { id: 1, name: "Pzt", day: "24" },
    { id: 2, name: "Sal", day: "25" },
    { id: 3, name: "Çar", day: "26" },
    { id: 4, name: "Per", day: "27" },
    { id: 5, name: "Cum", day: "28" },
    { id: 6, name: "Cmt", day: "29" },
  ];

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  React.useEffect(() => {
    if (selectedDate) {
      chechkAvailability();
    }
  }, [selectedDate]); //SelectedDate değiştikçe
  const chechkAvailability = async () => {
    try {
      const selectedDateObject = days.find((d) => d.id === selectedDate);

      //Eğer seçili bir gün yoksa hata almamak için işlem yapmıyoruz
      if (!selectedDateObject) return;

      const formattedDate = `${selectedDateObject.day} ${selectedDateObject.name}`;

      const response = await api.post("/appointments/availability", {
        barberId: barber._id,
        date: formattedDate,
      });

      setBookedTimes(response.data);
    } catch (err) {
      console.error("Müsaitlik Hatası", err);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst başlık ve geri butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}> Oluştur</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Tarih Seçimi */}
        <Text style={styles.sectionTitle}>Tarih Seçin</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.id}
              onPress={() => setSelectedDate(day.id)}
              style={[
                styles.dateCard,
                selectedDate === day.id && styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.id && styles.selectedText,
                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.id && styles.selectedText,
                ]}
              >
                {day.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Saat Seçimi */}
        <Text style={styles.sectionTitle}>Saat Seçin</Text>
        <View style={styles.timeContainer}>
          {times.map((time, index) => {
            //1. Bu saat dolu mu?
            const isBooked = bookedTimes.includes(time);
            return (
              <TouchableOpacity
                key={index}
                disabled={isBooked}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeCard,
                  selectedTime === time && styles.selectedCard,
                  //Eğer doluysa gri ve sönük
                  isBooked && { backgroundColor: "#333", opacity: 0.5 },
                ]}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedText,
                    //Doluysa üstünü çiz
                    isBooked && {
                      textDecorationLine: "line-through",
                      color: "#555",
                    },
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Randevu Oluştur Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!selectedDate || !selectedTime) && styles.disabledButton,
          ]}
          disabled={!selectedDate || !selectedTime}
          onPress={() => {
            //1- ID si seçili olan gün objesini buluyoruz
            const selectedDayObject = days.find((d) => d.id === selectedDate);
            //2- Tarih metni oluşturuyoruz
            const formattedDate = `${selectedDayObject.day} ${selectedDayObject.name}`;

            //3- Zustand a tarih ve saati setliyoruz
            setDateTime(formattedDate, selectedTime);

            navigation.navigate("Service");
          }}
        >
          <Text style={styles.buttonText}>Hizmet Seçimine Geç</Text>
        </TouchableOpacity>
      </View>
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
    padddingVertical: 20,
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
  // Tarih Seçim Stilleri
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedCard: {
    backgroundColor: "#ffffff",
  },
  dateText: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },
  selectedText: {
    color: "#000000",
  },
  // Saat Seçim Stilleri
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between,",
  },
  timeCard: {
    width: "30%", // Her Bir time cartı Ekranın %30'unu kaplar
    paddingVertical: 15,
    marginRight: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  timeText: {
    color: "#ccc",
    fontWeight: "bold",
  },
  // Alt Buton Stilleri
  footer: {
    padding: 20,
    borderTopWidth: 1, //anlamadım
    borderTopColor: "#333", //anlamadım
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
    opacity: 0.7,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
