import axios from "axios";

//Base URL
const api = axios.create({
  baseURL: "http://192.168.1.168:8080/api",
});

export default api;
