import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppointmentStore from "../store/useAppointmentStore";
import { Colors } from "../constants/colors";

import api from "../../api";

export default function ServiceScreen({ navigation }) {
  const cartBarber = useAppointmentStore((state) => state.cartBarber);
  const clearCart = useAppointmentStore((state) => state.clearCart);

  const barber = useAppointmentStore((state) => state.barber);
  const selectedServices = useAppointmentStore((state) => state.services);
  const totalPrice = useAppointmentStore((state) => state.totalPrice);
  const toggleService = useAppointmentStore((state) => state.toggleService);

  //2-Bu kısımda birden fazla şey seçebileceğilimiz için dizi kullanıyoruz
  const [services, setServices] = useState([]); //Veritabanından gelen bilgiler için
  const [loading, setLoading] = useState(true);

  //3- Sayfa açılınca API den hizmetleri çek
  useEffect(() => {
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

  const handleServicePress = (service) => {
    //Hizmet seçiliyse çıkar
    const isSelected = selectedServices.some((s) => s._id === service._id);
    if (isSelected) {
      toggleService(service, barber);
      return;
    }

    //Sepette bir hizmet varsa yeni eklenen hizmet farklı bir berbere aitse uyarı ver
    if (selectedServices.length > 0 && cartBarber?._id !== barber._id) {
      Alert.alert(
        "Farklı Berber!",
        `Sepetinizde ${cartBarber.name} berberine ait işlemler var. Temizleyip ${barber.name} ile devam edilsin mi?`,
        [
          { text: "Vazgeç", style: "cancel" },
          {
            text: "Temizle ve Ekle",
            style: "destructive",
            onPress: () => {
              clearCart(); //Önce temizle
              toggleService(service, barber); //Sonra yenisini ekle
            },
          },
        ]
      );
      return;
    }

    toggleService(service, barber); // Her şey yolundaysa direkt ekle
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{barber?.name}</Text>
        {/* Berber ismi clearAppointmentten dolayı hata vermesin diye varsa bas diyoruz*/}
      </View>

      {/* Hizmet Listesi */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 50 }}
        ></ActivityIndicator>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Hizmetler</Text>

          {services.map((service) => {
            const isSelected = selectedServices.some(
              (s) => s._id === service._id
            );

            return (
              <TouchableOpacity
                key={service._id}
                onPress={() => handleServicePress(service)} //Fonksiyonu tetikle
                activeOpacity={0.8}
                style={[
                  styles.serviceCard,
                  isSelected && styles.selectedServiceCard,
                ]}
              >
                {/* Sol taraf isim ve süre */}
                <View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>
                    {service.duration}
                  </Text>
                </View>

                {/* Sağ taraf fiyat ve + ikonu */}
                <View style={styles.priceRow}>
                  <Text style={styles.servicePrice}>{service.price} TL</Text>
                  {/* Seçiliyse Tik Değilse Artı Gösterir */}
                  <View
                    style={[
                      styles.addButton,
                      isSelected && styles.addButtonSelected,
                    ]}
                  >
                    <Text style={styles.addButtonText}>
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
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Toplam Tutar:</Text>
            <Text style={styles.totalValue}>{totalPrice} TL</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
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
    marginTop: 15,
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

  // Alt Buton Stilleri
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: Colors.surfaceElevated,
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: "800",
    fontSize: 16,
  },

  //Hizmet Kartları
  serviceCard: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedServiceCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  serviceName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  serviceDuration: {
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 15,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addButtonText: {
    color: Colors.text,
    fontWeight: "800",
  },
});