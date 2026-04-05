import axios from "axios";

//Base URL
const api = axios.create({
  baseURL: "http://172.20.10.2:8080/api",
});

export default api;
