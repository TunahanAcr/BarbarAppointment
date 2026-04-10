import { Alert } from "react-native";
import api from "../api";
import {
  setAppointments,
  setNetDailyRevenue,
  setPendingDailyRevenue,
} from "../screens/HomePage";
export const handleAccept = async (id) => {
  Alert.alert(
    "Randevu Onayı",
    "Bu randevuyu onaylamak istediğinize emin misiniz?",
    [
      { text: "İptal", style: "cancel" },
      { text: "Onayla", onPress: () => onAccept(id) },
    ],
  );
};

const onAccept = async (id) => {
  try {
    console.log(`Randevu ${id} onaylandı!`);

    const response = await api.patch(`/dashboard/appointments/${id}`, {
      status: "approved",
    });

    if (response.status === 200) {
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? response.data : appt)),
      );
      setNetDailyRevenue((prev) => prev + response.data.totalPrice);
      setPendingDailyRevenue((prev) => prev - response.data.totalPrice);
    }
  } catch (err) {
    console.log("Onaylarken hata oluştu", err);
  }
};

export const handleCancel = async (id) => {
  Alert.alert(
    "Randevu İptali",
    "Bu randevuyu iptal etmek istediğinize emin misiniz?",
    [
      { text: "İptal", style: "cancel" },
      { text: "Onayla", onPress: () => onCancel(id) },
    ],
  );
};
const onCancel = async (id) => {
  try {
    console.log(`Randevu ${id} iptal edildi!`);

    const response = await api.patch(`/dashboard/appointments/${id}`, {
      status: "cancelled",
    });

    if (response.status === 200) {
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? response.data : appt)),
      );
      setPendingDailyRevenue((prev) => prev - response.data.totalPrice);
    }
  } catch (err) {
    console.log("İptal edilirken hata oluştu", err);
  }
};
