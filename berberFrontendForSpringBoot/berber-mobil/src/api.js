import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Base URL
const api = axios.create({
  baseURL: "http://192.168.0.10:8080/api",
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Config:", config.baseURL); // Log the request
    console.log("Request Headers:", config.headers.Authorization); // Log the headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
