import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppointmentStore from "../store/useAppointmentStore";

import api from "../../api";

export default function ServiceScreen({ navigation, route }) {
  //1- Önceki sayfadan gelen veriyi karşılıyoruz

  const barber = useAppointmentStore((state) => state.barber);
  const selectedServices = useAppointmentStore((state) => state.services);
  const totalPrice = useAppointmentStore((state) => state.totalPrice);
  const toggleService = useAppointmentStore((state) => state.toggleService);

  //2-Bu kısımda birden fazla şey seçebileceğilimiz için dizi kullanıyoruz
  const [services, setServices] = React.useState([]); //Veritabanından gelen bilgiler için
  const [loading, setLoading] = React.useState(true);

  //3- Sayfa açılınca API den hizmetleri çek
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!barber) return navigation.goBack(); //Berber seçilmediyse geri dön
        const response = await api.get(`/barbers/${barber._id}`);
        setServices(response.data);
      } catch (err) {
        console.error("Hizmetler çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [barber]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{barber?.name}</Text>
        {/* Berber ismi clearAppointmentten dolayı hata vermesin diye varsa bas diyoruz*/}
      </View>

      {/* Hizmet Listesi */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="f1c40f"
          style={{ marginTop: 50 }}
        ></ActivityIndicator>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Hizmetler</Text>

          {services.map((service) => {
            const isSelected = selectedServices.some(
              (s) => s._id === service._id
            );

            return (
              <TouchableOpacity
                key={service._id}
                onPress={() => toggleService(service)} //Fonksiyonu tetikle
                style={[
                  styles.serviceCard,
                  isSelected && styles.selectedServiceCard,
                ]}
              >
                {/* Sol taraf isim ve süre */}
                <View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>
                    {" "}
                    {service.duration}
                  </Text>
                </View>

                {/* Sağ taraf fiyat ve + ikonu */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.servicePrice}>{service.price} TL</Text>
                  {/* Seçiliyse Tik Değilse Artı Gösterir */}
                  <View
                    style={[
                      styles.addButton,
                      isSelected && { backgroundColor: "green" },
                    ]}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {isSelected ? "✓" : "+"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* Listenin altı butonun altında kalmasın diye boşluk */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Alt Kısım Toplam Fiyat ve Onay Butonu */}
      {/* En az 1 hizmet seçiliyse göster */}
      {selectedServices.length > 0 && (
        <View style={styles.footer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#888" }}>Toplam Tutar:</Text>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {totalPrice} TL
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Summary");
            }}
          >
            <Text style={styles.buttonText}>Sepeti Onayla</Text>
          </TouchableOpacity>
        </View>
      )}
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

  //Kampanya Kartı Stilleri

  //Berber Kartı Stilleri

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

  //Hizmet Kartları
  serviceCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedServiceCard: {
    borderColor: "green",
    backgroundColor: "#252525",
  },
  serviceName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceDuration: {
    color: "#888",
    marginTop: 4,
    fontSize: 12,
  },
  servicePrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
});
