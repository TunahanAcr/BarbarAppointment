import axios from "axios";

//Base URL
const api = axios.create({
  baseURL: "http://192.168.184.111:8080/api/dashboard/appointments",
});

export default api;
