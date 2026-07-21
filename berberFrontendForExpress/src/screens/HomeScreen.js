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
import { Colors } from "../constants/colors";
import BarberCard from "../components/BarberCard";

const SearchBar = ({ searchText, onSearch }) => (
  <View style={styles.searchContainer}>
    <Ionicons
      name="search"
      size={20}
      color={Colors.textMuted}
      style={{ marginRight: 10 }}
    />
    <TextInput
      placeholder="Berber veya hizmet ara"
      placeholderTextColor={Colors.textFaint}
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
        color={Colors.textMuted}
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
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />

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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Hiçbir berber bulunamadı</Text>
          </View>
        }
        keyExtractor={(item) => item._id} // Benzersiz Anahtar
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 5,
  },
  listContent: {
    padding: 10,
    paddingBottom: 25,
  },
  loadingText: {
    color: Colors.textMuted,
    marginTop: 10,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textFaint,
    fontSize: 15,
    fontStyle: "italic",
  },

  //Kampanya Kartı Stilleri
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden", //içindeki resmin köşelerden taşmasını önler
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardInfo: {
    padding: 15,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubTitle: {
    color: Colors.textMuted,
    marginTop: 5,
  },
  campaignImage: {
    width: "100%",
    height: 150,
  },

  //Arama Çubuğu
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
});