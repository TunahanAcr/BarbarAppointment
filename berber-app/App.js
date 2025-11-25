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
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Navigasyon Yığını Oluşturma
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={("left", "right")}>
      <StatusBar style="light" />

      {/* Header Kısmı */}
      <View style={styles.header}>
        <Text style={styles.title}>Berber App</Text>
        <Text style={styles.subtitle}>Welcome to the Berber App!</Text>
      </View>

      {/* İçerik Kısmı */}
      <ScrollView style={styles.content}>
        {/* Bölüm 1: Kampanyalar */}
        <Text style={styles.sectionTitle}>Kampanyalar</Text>

        {/* Kampanya Kartı */}
        <View style={styles.card}>
          {/* Resim yerine şimdilik gri kutu */}
          <View style={styles.imagePlaceHolder} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Yaz Fırsatı</Text>
            <Text style={styles.cardSubTitle}>
              Tüm saç kesimlerinde %20 indirim
            </Text>
          </View>
        </View>
        {/* Bölüm 2: Berberler */}
        <Text style={styles.sectionTitle}>Popüler Berberler</Text>

        {/* Tıklanabilir Kart (TouchableOpacitiy) */}
        {/* onPress olunca "Detail" sayfasına gidecek */}
        {/*Berber Kartı */}
        <TouchableOpacity
          style={styles.berberCard}
          onPress={() => navigation.navigate("Detail")}
        >
          <View style={styles.berberImagePlaceHolder} />
          <View style={styles.berberInfo}>
            <Text style={styles.berberName}>Barbar King</Text>
            <Text style={styles.berberLocation}>Aydın, Merkez</Text>
            <Text style={styles.berberRating}>⭐ 4.8</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.berberCard}>
          <View style={styles.berberImagePlaceHolder} />
          <View style={styles.berberInfo}>
            <Text style={styles.berberName}>Barber King</Text>
            <Text style={styles.berberLocation}>Aydın, Merkez</Text>
            <Text style={styles.berberRating}>⭐ 4.5</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailScreen({ navigation }) {
  // Tarih ve Saat Seçimi için State Değişkenleri
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);

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
    "09.00",
    "10.00",
    "11.00",
    "12.00",
    "13.00",
    "14.00",
    "15.00",
    "16.00",
    "17.00",
    "18.00",
    "19.00",
  ];
  return (
    <SafeAreaView
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
      edges={("left", "right")}
    >
      {/* Üst başlık ve geri butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>←Geri</Text>
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
          {times.map((time, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
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
          onPress={() =>
            navigation.navigate("Service", {
              selectedDate: selectedDate,
              selectedTime: selectedTime, // Tarih ve zaman bilgisini sonraki sayfaya geçtik
            })
          }
        >
          <Text style={styles.buttonText}>Hizmet Seçimine Geç</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ServiceScreen({ navigation, route }) {
  // Önceki sayfadan gelen veriyi karşılıyoruz
  const { selectedDate, selectedTime } = route.params;

  //Bu kısımda birden fazla şey seçebileceğilimiz için dizi kullanıyoruz

  const [selectedServices, setSelectedServices] = React.useState([]);
  //Fake hizmet verisi
  const services = [
    { id: 1, name: "Saç Kesimi", price: 50, duration: 30 },
    { id: 2, name: "Sakal Tıraşı", price: 30, duration: 15 },
    { id: 3, name: "Ağda", price: 40, duration: 20 },
    { id: 4, name: "Saç Boyama", price: 100, duration: 60 },
    { id: 5, name: "Masaj", price: 70, duration: 45 },
    { id: 6, name: "Yüz Bakımı", price: 80, duration: 50 },
  ];

  const toggleService = (serviceId) => {
    // Bu hizmet zaten seçili mi kontrol et
    if (selectedServices.includes(serviceId)) {
      // EVET Seçili filter ile o id hariç diğerleini al
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      // Hayır seçili değil ekle
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Toplam Fiyatı Hesapla
  const totalPrice = services
    .filter((service) => selectedServices.includes(service.id))
    .reduce((total, service) => total + service.price, 0);
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Hizmet Seçimi</Text>
      </View>

      {/* Hizmet Listesi */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Hizmetler</Text>

        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id); // Bu hizmet seçili mi

          return (
            <TouchableOpacity
              key={service.id}
              onPress={() => toggleService(service.id)} //Fonksiyonu tetikle
              style={[
                styles.serviceCard,
                isSelected && styles.selectedServiceCard,
              ]}
            >
              {/* Sol taraf isim ve süre */}
              <View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}> {service.duration}</Text>
              </View>

              {/* Sağ taraf fiyat ve + ikonu */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.servicePrice}>{service.price}</Text>
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
              const selectedServicesDetails = services.filter((service) =>
                selectedServices.includes(service.id)
              );
              navigation.navigate("Summary", {
                date: selectedDate,
                time: selectedTime,
                services: selectedServicesDetails, //Hizmet listesini geçtik
                totalPrice: totalPrice, // Fiyat bilgisini geçtik
              });
            }}
          >
            <Text style={styles.buttonText}>Sepeti Onayla</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function SummaryScreen({ route, navigation }) {
  //Üstten gelen veriyi karşılıyoruz
  const { date, time, services, totalPrice } = route.params;

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
          <Text style={styles.summaryTitle}>Makas Berber</Text>
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
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => alert("Randevunuz Başarıyla Alındı")}
        >
          <Text style={styles.confirmButtonText}>Randevuyu Onayla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Ana Uygulama Bileşeni
export default function App() {
  return (
    // SafeAreaProvider telefona göre gerekli hesaplamaları yapar çentiğini vs. bu bilgileri sağlar
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Default gelen beyaz ekranı kaldırır */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Uygulama Açılınca Görünecek Ekran */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Diğer Sayfalar */}
          <Stack.Screen name="Detail" component={DetailScreen} />

          <Stack.Screen name="Service" component={ServiceScreen} />

          <Stack.Screen name="Summary" component={SummaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* SafeAreaView çentik ve yuvarlak köşeleri hesaba katarak içeriği güvenli bir alanda tutar */}
    </SafeAreaProvider>
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
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    overflow: "hidden", //içindeki resmin köşelerden taşmasını önler
    marginBottom: 10,
  },
  imagePlaceHolder: {
    height: 120,
    backgroundColor: "333333",
  },
  cardInfo: {
    padding: 15,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubTitle: {
    color: "#aaaaaa",
    marginTop: 5,
  },

  //Berber Kartı Stilleri
  berberCard: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center", //Dikeyde Ortalama
  },
  berberImagePlaceHolder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#333333",
  },
  berberInfo: {
    marginLeft: 15,
    flex: 1,
  },
  berberName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  berberLocation: {
    color: "#888888",
    fontSize: 14,
    marginTop: 2,
  },
  berberRating: {
    color: "#f1c40f",
    marginTop: 2,
    fontWeight: "bold",
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
