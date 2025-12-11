import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

export default function MyButton({ title, onPress, loading, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading} // Buton yükleniyorsa tıklanamasın
    >
      {loading ? (
        <ActivityIndicator color="black" /> // Yükleniyorsa yükleme göstergesi göster
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
});
