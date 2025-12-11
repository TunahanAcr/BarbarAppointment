import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import color from "../constants/color";

export default function BarberCard({ barber, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Berber Resmi*/}
      <Image source={{ uri: barber.image }} style={styles.image} />

      {/* Bilgiler */}
      <View style={styles.infoContainer}>
        {/* Adı ve Rating Satırı */}
        <Text style={styles.name}>{barber.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={styles.rating}>{barber.rating}</Text>
          </View>
          {/* Konum Satırı */}
          <Text style={styles.location}>{barber.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: color.cardBg,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center", //Dikeyde Ortalama
    //Hafif Gölge
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 65,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  rating: {
    color: "#f1c40f",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  location: {
    color: "#888",
    fontSize: 13,
    flex: 1,
  },
});
