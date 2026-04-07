import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import HomePage from "./src/screens/HomePage";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppointmentsScreen from "./src/screens/AppointmentsScreen";
import FinanceScreen from "./src/screens/FinanceScreen";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Ionicons } from "@expo/vector-icons"; // İkonlar için

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Ana Sayfa") iconName = "home";
          else if (route.name === "Randevular") iconName = "calendar";
          else if (route.name === "Profil") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#f1c40f", // Berber dükkanının altın sarısı rengi
        tabBarInactiveTintColor: "gray",
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 1. ADIM: Navigasyon mantığını ayrı bir fonksiyon (bileşen) yapıyoruz
function RootNavigation() {
  // Burası artık AuthProvider içinde olduğu için useContext çalışacaktır! ✅
  const { isLoggedIn, checkingAuth } = useContext(AuthContext); // Burada AuthContext kullanmalısın, AuthProvider değil

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 2. ADIM: Ana App fonksiyonunda sadece sarmalama yapıyoruz
export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
