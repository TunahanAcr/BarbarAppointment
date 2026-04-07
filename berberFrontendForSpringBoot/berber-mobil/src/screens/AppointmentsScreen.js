import { View, Text } from "react-native";

export default function AppointmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Randevular</Text>
      <Text>Güncellenecek</Text>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
};
