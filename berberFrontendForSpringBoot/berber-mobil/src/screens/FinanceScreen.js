import { View, Text } from "react-native";
export default function FinanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Finansal Durum</Text>
      <View style={styles.financeCard}>
        <Text style={styles.financeLabel}>Bugünkü Gelir:</Text>
        <Text style={styles.financeValue}>₺</Text>
      </View>
      <View style={styles.financeCard}>
        <Text style={styles.financeLabel}>Bekleyen Gelir:</Text>
        <Text style={styles.financeValue}>₺</Text>
      </View>
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
  financeCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  financeLabel: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  financeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27AE60",
  },
};
