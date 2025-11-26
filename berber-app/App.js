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
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Navigasyon Yığını Oluşturma
const Stack = createNativeStackNavigator();

//Login Ekranı
function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      const API_URL = "http://192.168.244.111:5000/api/auth/login";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Giriş başarılı", data);

        navigation.navigate("Home", { userName: data.user.name });
      } else {
        Alert.alert("Hata", data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Sunucuya Bağlanılamadı");
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { justifyContent: "center", padding: 20 }]}
    >
      <Text style={styles.authTitle}>Giriş Yap</Text>

      {/* Email kutusu */}
      <TextInput
        style={styles.input}
        placeholder="E-posta Adresi"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      ></TextInput>

      {/* Şifre Kutusu */}
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      ></TextInput>

      {/* Giriş Butonu */}
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.authButtonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Kayıt Ol Linki */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Hesabın yok mu?{" "}
          <Text style={{ color: "#f1c40f", fontWeight: "bold" }}>Kayıt Ol</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//Register Sayfası
function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const handleRegister = async () => {
    try {
      const API_URL = "http://192.168.244.111:5000/api/auth/register";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Kayıt Oluşturuldu");

        navigation.navigate("Login");
      } else {
        Alert.alert("Hata", data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Sunucuya Bağlanılamadı");
    }
  };
  return (
    <SafeAreaView
      style={([styles.container], { justifyContent: "center", padding: 20 })}
    >
      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      ></TextInput>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      ></TextInput>

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      ></TextInput>

      <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
        <Text style={styles.authButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Zaten hesabın var mı?{" "}
          <Text style={{ color: "#f1c40f", fontWeight: "bold" }}>
            Giriş Yap
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation, route }) {
  const userName = route.params?.userName || "Misafir";
  // Verileri dizide tutcaz
  const [barbers, setBarbers] = React.useState([]);

  //Uygulama açılınca verileri çek
  React.useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const API_URL = "http://192.168.244.111:5000/api/barbers";

        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("Veriler geldi");
        setBarbers(data);
      } catch (err) {
        console.error("Hata:", err);
      }
    };
    fetchBarbers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header Kısmı */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.title}>Berber App</Text>
            <Text style={styles.subtitle}>
              Welcome to the Berber App! {userName}
            </Text>
          </View>

          {/* Randevularım Butonu */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Appointments")}
            style={{ backgroundColor: "#333", padding: 8, borderRadius: 8 }}
          >
            <Text style={{ fontSize: 20 }}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* İçerik Kısmı */}
      <ScrollView style={styles.content}>
        {/* Bölüm 1: Kampanyalar */}
        <Text style={styles.sectionTitle}>Kampanyalar</Text>
        {/* Kampanya Kartı */}
        <View style={styles.card}>
          {/* Resim yerine şimdilik gri kutu */}
          <Image
            style={styles.campaignImage}
            source={{
              uri: "https://images.unsplash.com/photo-1542992015-4a0b729b1385?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
          ></Image>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Yaz Fırsatı</Text>
            <Text style={styles.cardSubTitle}>
              Tüm saç kesimlerinde %50 indirim
            </Text>
          </View>
        </View>
        {/* Bölüm 2: Berberler */}
        <Text style={styles.sectionTitle}>Popüler Berberler</Text>
        {/* Tıklanabilir Kart (TouchableOpacitiy) */}
        {/* onPress olunca "Detail" sayfasına gidecek */}
        {/*Berber Kartı */}
        {/* Veritabanından dönen listeyi dön */}
        {barbers.map((berber) => (
          <TouchableOpacity
            key={berber._id} //MongoDb den gelen uniqueID
            style={styles.berberCard}
            onPress={() =>
              navigation.navigate("Detail", {
                barberId: berber._id,
                barberName: berber.name,
              })
            }
          >
            {/* Eğer resim varsa göster, yoksa gri box */}
            {berber.image ? (
              <Image
                source={{ uri: berber.image }}
                style={[styles.berberImage]}
              ></Image>
            ) : (
              <View style={styles.berberImagePlaceHolder}></View>
            )}
            <View style={styles.berberInfo}>
              <Text style={styles.berberName}>{berber.name}</Text>
              <Text style={styles.berberLocation}>{berber.location}</Text>
              <Text style={styles.berberRating}>{berber.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailScreen({ navigation, route }) {
  const { barberId, barberName } = route.params;
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

      const API_URL =
        "http://192.168.244.111:5000/api/appointments/availability";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: barberId,
          date: formattedDate,
        }),
      });
      const data = await response.json();
      console.log("Dolu Saatler:", data);
      setBookedTimes(data);
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

            navigation.navigate("Service", {
              barberId: barberId,
              barberName: barberName,
              selectedDate: formattedDate,
              selectedTime: selectedTime, // Tarih ve zaman bilgisini sonraki sayfaya geçtik
            });
          }}
        >
          <Text style={styles.buttonText}>Hizmet Seçimine Geç</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ServiceScreen({ navigation, route }) {
  //1- Önceki sayfadan gelen veriyi karşılıyoruz
  const { barberId, barberName, selectedDate, selectedTime } = route.params;

  //2-Bu kısımda birden fazla şey seçebileceğilimiz için dizi kullanıyoruz
  const [services, setServices] = React.useState([]); //Veritabanından gelen bilgiler için
  const [selectedServices, setSelectedServices] = React.useState([]);

  //3- Sayfa açılınca API den hizmetleri çek
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = `http://192.168.244.111:5000/api/barbers/${barberId}`;
        const response = await fetch(API_URL);
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Hizmetler çekilemedi:", err);
      }
    };
    fetchServices();
  }, [barberId]); //Berber id si her değiştiğinde 1 kez çalışır

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

  //5- Toplam Fiyatı Hesapla
  const totalPrice = services
    .filter((service) => selectedServices.includes(service._id))
    .reduce((total, service) => total + service.price, 0);
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "white", fontSize: 18 }}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{barberName}</Text>
      </View>

      {/* Hizmet Listesi */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Hizmetler</Text>

        {services.map((service) => {
          const isSelected = selectedServices.includes(service._id); // Bu hizmet seçili mi

          return (
            <TouchableOpacity
              key={service._id}
              onPress={() => toggleService(service._id)} //Fonksiyonu tetikle
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
                selectedServices.includes(service._id)
              );
              navigation.navigate("Summary", {
                barberName: barberName,
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
  const { barberName, date, time, services, totalPrice } = route.params;

  //Randevuyu Kaydetme Fonskiyonu
  const handleConfirm = async () => {
    try {
      //Gönderilecek Paket Backend Şemasına Uygun
      const appointmentData = {
        barberName: barberName,
        date: date, //Seçilen Günün ID'si
        time: time,
        services: services,
        totalPrice: totalPrice,
      };

      //2- API ye POST REQUEST
      const API_URL = "http://192.168.244.111:5000/api/appointments";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //Ben sana JSON gönderiyorum demek
        },
        body: JSON.stringify(appointmentData), //Veriyi stringe çevirip iletir
      });

      //3- Sonucu Kontrol Et
      if (response.ok) {
        //Gelen hhtp kodu 200-299 arasında mı diye bakar
        alert("Randevunuz Başarıyla Alındı");
        navigation.navigate("Home");
      } else {
        alert("Bir Hata Meydana Geldi");
      }
    } catch (err) {
      console.error("Bağlantı Hatası", err);
      alert("Sunucuya Bağlanılamadı");
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
          <Text style={styles.summaryTitle}>{barberName}</Text>
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

function AppointmentScreen({ navigation }) {
  const [appointments, setAppointmets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const API_URL =
        "http://192.168.244.111:5000/api/appointments/Ahmet Yılmaz";
      const response = await fetch(API_URL);
      const data = await response.json();
      setAppointmets(data);
      setLoading(false);
    } catch (err) {
      console.error("Randevular Çekilemedi", err);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={{ color: "white", fontSize: 18 }}>← Ana Sayfa</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Randevularım</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            Yükleniyor...
          </Text>
        ) : appointments.length === 0 ? (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
            Henüz randevunuz yok.
          </Text>
        ) : (
          //Listelemeye Başlıyoruz
          appointments.map((item) => (
            <View key={item._id} style={styles.appointmentCard}>
              {/* ÜSt Kısım: Berber Adı ve Tarih */}
              <View style={styles.row}>
                <Text style={styles.appBarberName}>{item.barberName}</Text>
                <Text style={styles.appDate}>
                  {item.date} - {item.time}
                </Text>
              </View>

              {/* Orta Kısım: Hizmetler */}
              <View style={{ marginTop: 10 }}>
                {item.services.map((service, index) => (
                  <Text key={index} style={styles.appServiceText}>
                    • {service.name}
                  </Text>
                ))}
              </View>

              {/* Alt Kısım: Fiyat ve Durum */}
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: "#333",
                    padding: 10,
                  },
                ]}
              >
                <Text style={styles.appPrice}>{item.totalPrice} TL</Text>
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  Onaylandı
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Uygulama Açılınca Görünecek Ekran */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Diğer Sayfalar */}
          <Stack.Screen name="Detail" component={DetailScreen} />

          <Stack.Screen name="Service" component={ServiceScreen} />

          <Stack.Screen name="Summary" component={SummaryScreen} />

          <Stack.Screen
            name="Appointments"
            component={AppointmentScreen}
          ></Stack.Screen>
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
  campaignImage: {
    width: "100%",
    height: 150,
  },
  berberImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
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
  //Randevularım Ekranı Stilleri
  appointmentCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#f1c40f",
  },
  appBarberName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  appDate: {
    color: "#ccc",
    fontSize: 14,
  },
  appServiceText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  appPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  //Auth Stilleri
  authTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  authButton: {
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
