import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

export default function BarberCard({ barber, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Berber Resmi*/}
      <Image source={{ uri: barber.image }} style={styles.image} />

      {/* Bilgiler */}
      <View style={styles.infoContainer}>
        {/* Adı ve Rating Satırı */}
        <Text style={styles.name} numberOfLines={1}>
          {barber.name}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={13} color={Colors.primary} />
            <Text style={styles.rating}>{barber.rating}</Text>
          </View>
          {/* Konum Satırı */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {barber.location}
            </Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.textFaint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 92,
    height: 68,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 7,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  rating: {
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "800",
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 12,
    marginLeft: 3,
    flexShrink: 1,
  },
});