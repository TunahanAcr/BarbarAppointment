import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Base URL
const api = axios.create({
  baseURL: "http://192.168.115.111:5000/api",
});

//Her istekten önce Token'ı otomaik ekleyeyen "Interceptor"
api.interceptors.request.use(async (config) => {
  //config axios tarafından arkaplanda otomatik oluşturulan bir js objesidir
  //Her requestin headerına tokenı ekler
  const token = await AsyncStorage.getItem("userToken");

  console.log("Interceptor Çalıştı! Bulunan Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; //Bearer Web standardı
  }
  return config;
});

export default api;
