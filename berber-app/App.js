import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Ekran Bileşenlerini İçe Aktarma
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppointmentScreen from "./src/screens/AppointmentScreen";
import SummaryScreen from "./src/screens/SummaryScreen";
import ServiceScreen from "./src/screens/ServiceScreen";
import DetailScreen from "./src/screens/DetailScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";

// Navigasyon Yığını Oluşturma
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, //Her sekmenin kendi headerı olmasın
        tabBarStyle: {
          backgroundColor: "#121212", //Alt bar rengi
          borderTopColor: "#333", // Üst sınır rengi
        },
        tabBarActiveTintColor: "#f1c40f", //Seçili sekme rengi
        tabBarInactiveTintColor: "gray", //Seçili olmayan sekme rengi

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AppointmentsTab") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Ana Sayfa" }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentScreen}
        options={{ title: "Randevularım" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profilim" }}
      />
    </Tab.Navigator>
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
          <Stack.Screen name="Main" component={MainTabs} />

          {/* Diğer Sayfalar */}
          <Stack.Screen name="Detail" component={DetailScreen} />

          <Stack.Screen name="Service" component={ServiceScreen} />

          <Stack.Screen name="Summary" component={SummaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* SafeAreaView çentik ve yuvarlak köşeleri hesaba katarak içeriği güvenli bir alanda tutar */}
    </SafeAreaProvider>
  );
}
