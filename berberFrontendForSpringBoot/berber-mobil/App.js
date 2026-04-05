import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import HomePage from "./src/screens/HomePage";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. ADIM: Navigasyon mantığını ayrı bir fonksiyon (bileşen) yapıyoruz
function RootNavigation() {
  // Burası artık AuthProvider içinde olduğu için useContext çalışacaktır! ✅
  const { isLoggedIn, checkingAuth } = useContext(AuthContext); // Burada AuthContext kullanmalısın, AuthProvider değil

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={HomePage} />
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
