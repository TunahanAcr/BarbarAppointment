import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import api from "../../api";
import useAppointmentStore from "../store/useAppointmentStore";
import { useState } from "react";

export default function SummaryScreen({ navigation }) {
  // Zustanddan gelen veriyi karşılıyoruz
  const { barber, date, time, services, totalPrice, fullDate } =
    useAppointmentStore();

  const [isLoading, setIsLoading] = useState(false);

  //Randevuyu Kaydetme Fonskiyonu
  const handleConfirm = async () => {
    setIsLoading(true); // Yükleniyor durumunu başlat

    try {
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

      //2- API ye POST REQUEST
      const response = await api.post("/appointments", appointmentData);

      //3- Sonucu Kontrol Et
      if (response.status === 200 || response.status === 201) {
        //Gelen hhtp kodu 200-299 arasında mı diye bakar

        navigation.navigate("Success");
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
    } finally {
      setIsLoading(false); // Yükleniyor durumunu bitir
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevu Özeti</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* İşletme bilgisi */}
        <Text style={styles.sectionTitle}>İşletme</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{barber?.name}</Text>
          <Text style={styles.mutedText}>Aydın, Efeler</Text>
        </View>

        {/* Tarih ve Saat */}
        <Text style={styles.sectionTitle}>Zaman</Text>
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tarih:</Text>
            <Text style={styles.summaryValue}>{date} Kasım</Text>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.rowLabel}>Saat:</Text>
            <Text style={styles.summaryValue}>{time}</Text>
          </View>
        </View>

        {/* Seçilen Hizmetler */}
        <Text style={styles.sectionTitle}>Hizmetler</Text>
        <View style={styles.summaryCard}>
          {services.map((service, index) => (
            <View key={index} style={[styles.row, { marginBottom: 8 }]}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price} TL</Text>
            </View>
          ))}

          {/* Ayırıcı Çizgi */}
          <View style={styles.divider} />

          {/* Toplam Fiyat */}
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Toplam:</Text>
            <Text style={styles.totalValue}>{totalPrice} TL</Text>
          </View>
        </View>
      </ScrollView>

      {/* Onay Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isLoading && { opacity: 0.7 }, // Yüklenirken buton biraz soluklaşsın
          ]}
          activeOpacity={0.85}
          onPress={handleConfirm}
          disabled={isLoading} // Çark dönerken butona TIKLANAMAZ!
        >
          {isLoading ? (
            // Yüklenme anında yan yana dönen çark ve metin
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator
                size="small"
                color="Colors.white"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.confirmButtonText}>Randevu Alınıyor...</Text>
            </View>
          ) : (
            // Normal durumda sadece metin
            <Text style={styles.confirmButtonText}>Randevuyu Onayla</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 4,
  },
  backLink: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 25,
    marginBottom: 15,
  },
  title: {
    color: Colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 5,
  },
  mutedText: {
    color: Colors.textMuted,
  },
  rowLabel: {
    color: Colors.textMuted,
  },
  serviceName: {
    color: Colors.text,
  },
  servicePrice: {
    color: Colors.text,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  totalLabel: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  totalValue: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  // Alt Buton Stilleri
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  //Özet Ekranı Kart Stilleri
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "800",
  },
});
