import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import useAppointmentStore from "../store/useAppointmentStore";

export default function SummaryScreen({ navigation }) {
  // Zustanddan gelen veriyi karşılıyoruz
  const {
    barber,
    date,
    time,
    services,
    totalPrice,
    clearAppointment,
    fullDate,
  } = useAppointmentStore();

  //Randevuyu Kaydetme Fonskiyonu
  const handleConfirm = async () => {
    try {
      console.log("Fonksiyon Çalıştı");
      //1- Gönderilecek veriyi paketle
      const cleanServices = services.map((service) => ({
        name: service.name,
        duration: service.duration,
        _id: service._id,
      }));
      //Gönderilecek Paket Backend Şemasına Uygun
      const appointmentData = {
        barberId: barber._id, //Zustand dan alınıyor
        barberName: barber.name, //Zustand dan alınıyor
        date: date, //Zustand dan alınıyor
        time: time, //Zustand dan alınıyor
        services: cleanServices,
        fullDate: fullDate, //Zustand dan alınıyor
      };

      console.log("Gönderilen Randevu Verisi:", appointmentData);

      //2- API ye POST REQUEST
      const response = await api.post("/appointments", appointmentData);

      console.log("Randevu Oluşturma Cevabı:", response.data);
      //3- Sonucu Kontrol Et
      if (response.status === 200 || response.status === 201) {
        //Gelen hhtp kodu 200-299 arasında mı diye bakar
        Alert.alert("Başarılı! 🎉", "Randevunuz oluşturuldu.", [
          {
            text: "Tamam",
            onPress: () => {
              navigation.reset({ index: 0, routes: [{ name: "Main" }] });
              clearAppointment();
            },
          },
        ]);
        navigation.replace("Main");
      }
    } catch (err) {
      // 4. Hata Yönetimi (Dizi/String fark etmez, patlamaz)
      console.log("HATA DETAYI:", err);
      // Gelen hatayı ne olursa olsun string'e çevirir
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Hata oluştu";
      Alert.alert("Hata", String(msg));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevu Özeti</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* İşletme bilgisi */}
        <Text style={styles.sectionTitle}>İşletme</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{barber?.name}</Text>
          <Text style={{ color: "#888" }}>Aydın, Efeler</Text>
        </View>

        {/* Tarih ve Saat */}
        <Text style={styles.sectionTitle}>Zaman</Text>
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={{ color: "#ccc" }}>Tarih:</Text>
            <Text style={styles.summaryValue}>{date} Kasım</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={{ color: "#ccc" }}>Saat:</Text>
            <Text style={styles.summaryValue}>{time}</Text>
          </View>
        </View>

        {/* Seçilen Hizmetler */}
        <Text style={styles.sectionTitle}>Hizmetler</Text>
        <View style={styles.summaryCard}>
          {services.map((service, index) => (
            <View key={index} style={[styles.row, { marginBottom: 8 }]}>
              <Text style={{ color: "white" }}>{service.name}</Text>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {service.price} TL
              </Text>
            </View>
          ))}

          {/* Ayırıcı Çizgi */}
          <View
            style={{ height: 1, backgroundColor: "#333", marginVertical: 10 }}
          ></View>

          {/* Toplam Fiyat */}
          <View style={styles.row}>
            <Text style={{ color: "#ccc", fontSize: 16 }}>Toplam:</Text>
            <Text
              style={{ color: "#f1c40f", fontSize: 20, fontWeight: "bold" }}
            >
              {totalPrice} TL
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Onay Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Randevuyu Onayla</Text>
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
  // Alt Buton Stilleri
  footer: {
    padding: 20,
    borderTopWidth: 1, //anlamadım
    borderTopColor: "#333", //anlamadım
  },
  //Özet Ekranı Kart Stilleri
  summaryCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  summaryTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  summaryValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#f1c40f",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});
