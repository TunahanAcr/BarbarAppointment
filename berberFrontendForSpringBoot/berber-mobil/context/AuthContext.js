import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  checkingAuth: true,
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (token) {
          const decodedToken = jwtDecode(token);

          if (decodedToken.exp * 1000 < Date.now()) {
            // Token süresi dolmuş, kullanıcıyı çıkış yap
            await AsyncStorage.removeItem("userToken");
            setIsLoggedIn(false);
            setUser(null);
            setCheckingAuth(false);
            return;
          }

          setIsLoggedIn(true);
          setUser({
            email: decodedToken.sub,
            name: decodedToken.name,
            berberId: decodedToken.berberId,
          });
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.log("Kullanıcı bilgileri bulunamadı");
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();
  }, []);

  const login = async (token) => {
    try {
      // Gelen token'ın ne olduğunu terminalde görelim (Obje mi, String mi?)

      await AsyncStorage.setItem("userToken", token);

      const decodedToken = jwtDecode(token);

      setIsLoggedIn(true);
      setUser({
        email: decodedToken.sub,
        name: decodedToken.name,
        berberId: decodedToken.berberId,
        role: decodedToken.role,
      });
    } catch (error) {
      // EĞER EKRAN DEĞİŞMİYORSA KESİNLİKLE BU CONSOLE.LOG ÇALIŞACAKTIR
      console.log("Token çözülürken veya kaydedilirken HATA:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.log("Çıkış yaparken hata oluştu");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, checkingAuth, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
