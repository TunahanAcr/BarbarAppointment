import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppointmentStore from "../store/useAppointmentStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import axios from "axios";
import color from "../constants/color";

export default function HomeScreen({ navigation, route }) {
  const [userName, setUserName] = React.useState("Misafir");
  // Verileri dizide tutcaz
  const [barbers, setBarbers] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const setStoreBarber = useAppointmentStore((state) => state.setBarber);

  const { clearAppointment } = useAppointmentStore();

  React.useEffect(() => {
    //Kullanıcı adını hafızadan çeken fonksiyon
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
  React.useEffect(() => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

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
      {/* --- HEADER SONU --- */}

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
            onPress={() => {
              //Randevu bilgisini temizle
              clearAppointment();
              //Zustand ile seçili berberi ayarla
              setStoreBarber({ _id: berber._id, name: berber.name });
              navigation.navigate("Detail");
            }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
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
    color: color.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  title: {
    color: color.textPrimary,
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
    color: "#aaaaaa",
    marginTop: 5,
  },

  //Berber Kartı Stilleri
  berberCard: {
    flexDirection: "row",
    backgroundColor: color.cardBg,
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
});
