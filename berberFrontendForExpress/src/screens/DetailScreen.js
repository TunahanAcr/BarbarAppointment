import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import useAppointmentStore from "../store/useAppointmentStore";
import getNextDays from "../utils/date";
import getTimes from "../utils/time";

export default function DetailScreen({ navigation }) {
  const barber = useAppointmentStore((state) => state.barber);
  const setDateTime = useAppointmentStore((state) => state.setDateTime);
  // Tarih ve Saat Seçimi için State Değişkenleri
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  //Dolu saatleri tutacak
  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    //Gelecek 14 günü alır
    const upcomingDays = getNextDays(14);
    setDays(upcomingDays);

    //Saatleri alır
    const generatedTimes = getTimes(8, 20, 30); //9-20 arası 30 dakikalık
    setTimes(generatedTimes);
  }, []); //Sadece bir kez çalışır

  useEffect(() => {
    if (selectedDate !== null) {
      chechkAvailability();
    }
  }, [selectedDate]); //SelectedDate değiştikçe

  const chechkAvailability = async () => {
    try {
      const selectedDateObject = days.find((d) => d.id === selectedDate);

      //Eğer seçili bir gün yoksa hata almamak için işlem yapmıyoruz
      if (!selectedDateObject) return;

      const formattedDate = `${selectedDateObject.day} ${selectedDateObject.name}`;

      console.log("📡 Backend'e sorulan tarih:", formattedDate); // Giden veriyi gör

      const response = await api.post("/appointments/availability", {
        barberId: barber._id,
        date: formattedDate,
      });

      console.log("📩 Backend'den gelen dolu saatler:", response.data); // GELEN CEVABI GÖR!

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
            // 0 indexi gelince patlamasın diye null kontrolü
            (selectedDate === null || !selectedTime) && styles.disabledButton,
          ]}
          // 0 indexi gelince patlamasın diye null kontrolü
          disabled={selectedDate === null || !selectedTime}
          onPress={() => {
            //1- ID si seçili olan gün objesini buluyoruz
            const selectedDayObject = days.find((d) => d.id === selectedDate);
            //2- Tarih metni oluşturuyoruz
            const formattedDate = `${selectedDayObject.day} ${selectedDayObject.name}`;

            //3- Zustand a tarih ve saati setliyoruz
            setDateTime(
              formattedDate,
              selectedTime,
              selectedDayObject.fullDate
            );

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
    paddingVertical: 0,
    marginBottom: 10,
  },
  content: {
    flex: 1,
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
