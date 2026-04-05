import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
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
      }
    };

    checkLogin();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
