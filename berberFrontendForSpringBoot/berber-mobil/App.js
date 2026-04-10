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
import { Colors } from "./src/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. ADIM: QueryClient oluşturuyoruz
const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // İkonların Kazanç Odaklı Renk Yapılandırması 🎨
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Appointments") iconName = "calendar";
          else if (route.name === "Finance")
            iconName = "stats-chart"; // Gelir-gider için grafik ikonu
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Aktif sekme: Zümrüt Yeşili (Kazancı ve ilerlemeyi temsil eder) 🟢
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,

        // Tab Bar'ın arka planını koyu yapıp ayırıyoruz
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },

        // Üst başlık (Header) tasarımı
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0, // Android gölge kaldır
          shadowOpacity: 0, // iOS gölge kaldır
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Pano" }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: "Ajanda" }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{ title: "Kasa" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn, checkingAuth } = useContext(AuthContext);

  if (checkingAuth) {
    // Yükleme ekranı da koyu temaya uygun olmalı
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {/* Stack Navigator'da headerShown: false yapıyoruz çünkü 
        başlıkları Tab Navigator içinden yöneteceğiz. 
      */}
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </QueryClientProvider>
  );
}
