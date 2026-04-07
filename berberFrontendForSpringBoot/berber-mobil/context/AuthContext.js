import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const userEmail = await AsyncStorage.getItem("userEmail");
        const userName = await AsyncStorage.getItem("userName");

        if (userEmail && userName) {
          setIsLoggedIn(true);
          setUser({ email: userEmail, name: userName });
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

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userEmail", "userName"]);
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
