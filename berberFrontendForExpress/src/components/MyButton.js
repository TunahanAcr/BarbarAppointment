import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../constants/colors";

export default function MyButton({ title, onPress, loading, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading} // Buton yükleniyorsa tıklanamasın
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={Colors.background} /> // Yükleniyorsa yükleme göstergesi göster
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: Colors.background,
    fontWeight: "800",
    fontSize: 17,
  },
});