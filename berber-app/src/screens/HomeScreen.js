import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppointmentStore from "../store/useAppointmentStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import axios from "axios";
import color from "../constants/color";
import BarberCard from "../components/BarberCard";

const SearchBar = ({ searchText, onSearch }) => (
  <View style={styles.searchContainer}>
    <Ionicons
      name="search"
      size={20}
      color="#888"
      style={{ marginRight: 10 }}
    />
    <TextInput
      placeholder="Berver veya hizmet ara"
      placeholderTextColor="#666"
      style={styles.searchInput}
      value={searchText}
      onChangeText={onSearch}

      // Kullanıcı Yazar(onChangeText)
      // Child yukarı haber verir(onSearch)
      // Parent veriyi kaydeder(setSearchText)
      // Parent yeni veriyi Child'a geri gönderir(value={searchText})
    />

    {/* Çarpı ikonu Yazı varsa göster, basınca temizle */}
    {searchText.length > 0 && (
      <Ionicons
        name="close-circle"
        size={20}
        color="#888"
        onPress={() => onSearch("")} //Temizle
      />
    )}
  </View>
);

const CampaignHeader = () => (
  <View>
    <Text style={styles.sectionTitle}>Kampanyalar</Text>

    <View style={styles.card}>
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
    <Text style={styles.sectionTitle}>Popüler Berberler</Text>
  </View>
);

export default function HomeScreen({ navigation, route }) {
  const [userName, setUserName] = useState("Misafir");

  // Verileri dizide tutcaz
  const [barbers, setBarbers] = useState([]); //Ekranda görünen liste
  const [allBarbers, setAllBarbers] = useState([]); // Depo
  const [searchText, setSearchText] = useState(""); // Arama kutusu

  const [loading, setLoading] = useState(true);

  const setStoreBarber = useAppointmentStore((state) => state.setBarber);

  //Kullanıcı adını hafızadan çeken fonksiyon
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        }
      } catch (err) {
        console.log("İsim okunamadı");
      }
    };

    //Sayfa her açıldığında çalıştır
    const unsubscribe = navigation.addListener("focus", () => {
      loadUser();
    });

    //İlk açılışta çalışsın
    loadUser();

    return unsubscribe;
  }, [navigation]);

  //Uygulama açılınca verileri çek
  useEffect(() => {
    //İptal kontrolcüsü
    const controller = new AbortController();

    const fetchBarbers = async () => {
      try {
        //İstek atılırken iptal sinyali de gönderilir
        //Böylece "iptal et" dediğimizde bu istek durur
        const response = await api.get("/barbers", {
          signal: controller.signal,
        });
        setBarbers(response.data);
        setAllBarbers(response.data);
        console.log(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("İstek iptal edildi");
        } else {
          console.error("Berberler çekilemedi:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();

    //Sayfa kapanırken iptal et
    return () => {
      controller.abort(); //Bileti iptal et
    };
  }, []);

  const handleSearch = (text) => {
    setSearchText(text); //Yazılanı state'e kaydet

    // Kutu boşsa
    if (text === "") {
      setBarbers(allBarbers);
      return;
    }

    const filteredList = allBarbers.filter((barber) => {
      const query = text.toLowerCase();
      const barberName = barber.name.toLowerCase();

      if (barberName.includes(query)) return true;

      const serviceMatch = barber.services?.some((service) =>
        service.name.toLowerCase().includes(query)
      );

      if (serviceMatch) return true;

      return false;
    });

    setBarbers(filteredList);
  };

  const renderBarberItem = ({ item }) => {
    return (
      <BarberCard
        barber={item}
        onPress={() => {
          setStoreBarber(item);
          navigation.navigate("Detail", { barber: item });
        }}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#f1c40f" />
        <Text style={{ color: "white", marginTop: 10 }}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light-content" />

      {/* Header Kısmı */}
      {/* Ana kapsayıcı: Satır (row) olarak dizecek ve iki uca yaslayacak */}
      <View style={styles.header}>
        {/* Başlık ve Alt Başlık */}
        <View>
          <Text style={styles.title}>Berber App</Text>
          {/* Dinamik isim veya Misafir */}
          <Text style={styles.subtitle}>Hoş geldin, {userName}</Text>
        </View>
      </View>

      <SearchBar searchText={searchText} onSearch={handleSearch} />
      {/* --- HEADER SONU --- */}
      {/* Bölüm 1: Kampanyalar */}

      {/* İçerik Kısmı */}
      <FlatList
        data={barbers} // Veri Kaynağı
        renderItem={renderBarberItem} //Her Satırda Ne Basılacak
        ListHeaderComponent={<CampaignHeader />}
        ListEmptyComponent={
          <Text style={styles.sectionTitle}> Hiçbir Berber Bulunamadı</Text>
        }
        keyExtractor={(item) => item._id} // Benzersiz Anahtar
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    padddingVertical: 20, // bir sikim değişmiyor
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizantal: 20,
  },
  sectionTitle: {
    color: color.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    color: color.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  listContent: {
    padding: 10,
    paddingBottom: 25,
  },

  //Kampanya Kartı Stilleri
  card: {
    backgroundColor: color.cardBg,
    borderRadius: 15,
    overflow: "hidden", //içindeki resmin köşelerden taşmasını önler
    marginBottom: 10,
  },
  imagePlaceHolder: {
    height: 120,
    backgroundColor: "#333333",
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
    color: "#ccc",
    marginTop: 5,
  },

  //Berber Kartı Stilleri
  campaignImage: {
    width: "100%",
    height: 150,
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
  //Arama Çubuğu
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
});
