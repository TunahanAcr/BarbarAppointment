import api from "../api";
import { berberId } from "../configId";
import { Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useAppointments = (selectedDate, onlyPending = false) => {
  // O an animasyonla silinen kartın ID'sini tutan state
  const [removingItemId, setRemovingItemId] = useState(null);
  const queryClient = useQueryClient(); //Global cache managera erişim aynı ugulamada 1 kere oluşturulur ve tüm componentlerde kullanılır
  // 🔄 Veri Çekme Fonksiyonu
  const fetchDashboardData = async (date) => {
    console.log("Veri çekiliyor...");
    const requests = [
      api.get(
        `/dashboard/appointments/barber/${berberId}/price?status=pending&fullDate=${date}`,
      ),
      api.get(
        `/dashboard/appointments/barber/${berberId}/price?status=approved&fullDate=${date}`,
      ),
      api.get(
        `/dashboard/appointments/barber/${berberId}/daily?fullDate=${date}`,
      ),
    ];

    const [pendingRevenueResponse, netRevenueResponse, appointmentsResponse] =
      await Promise.all(requests);
    console.log("Randevular:", appointmentsResponse.data);
    return {
      appointments: onlyPending
        ? appointmentsResponse.data.filter((appt) => appt.status === "pending")
        : appointmentsResponse.data,
      pendingDailyRevenue: pendingRevenueResponse.data,
      netDailyRevenue: netRevenueResponse?.data || 0,
    };
  };
  // bu dördü otomatik olarak oluşturulur ve biz sadece fonksiyonları tanımlarız. data : api den gelen veri, isLoading: ilk veri çekilirken true olur, isFetching: her veri güncellemesinde true olur, refetch: manuel olarak tekrar API çağırır
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["dashboardData", berberId, selectedDate, { onlyPending }], // Verinin benzersiz anahtarı
    queryFn: () => fetchDashboardData(selectedDate), // Veriyi çekme fonksiyonu
    refetchOnWindowFocus: true,
  });

  // ✅ Onaylama Fonksiyonu

  const handleAccept = async (id) => {
    console.log("Onaylanacak ID:", id);
    Alert.alert(
      "Randevu Onayı",
      "Bu randevuyu onaylamak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Onayla", onPress: () => onActionPress(id, "accept") },
      ],
    );
  };

  const onActionPress = (id, type) => {
    setRemovingItemId(id);
    if (type === "accept") {
      onAccept.mutate(id);
    } else if (type === "cancel") {
      onCancel.mutate(id);
    }
  };

  const onAccept = useMutation({
    // API Request
    mutationFn: (id) =>
      api.patch(`/dashboard/appointments/${id}`, { status: "approved" }),

    // Başarılı Onaylama
    onSuccess: () => {
      console.log("Randevu onaylandı!");
    },

    onError: (err) => {
      setRemovingItemId(null); // Hata durumunda silme animasyonunu iptal et
      console.log("Onaylama hatası:", err);
    },
  });

  // ❌ İptal Fonksiyonu
  const handleCancel = async (id) => {
    Alert.alert(
      "Randevu İptali",
      "Bu randevuyu iptal etmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Onayla", onPress: () => onActionPress(id, "cancel") },
      ],
    );
  };
  const onCancel = useMutation({
    mutationFn: (id) =>
      api.patch(`/dashboard/appointments/${id}`, {
        status: "cancelled",
      }),

    onSuccess: () => {
      console.log("Randevu iptal edildi!");
    },

    onError: (err) => {
      setRemovingItemId(null); // Hata durumunda silme animasyonunu iptal et
      console.log("İptal hatası:", err);
    },
  });

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({
      queryKey: ["dashboardData", berberId, selectedDate],
    });
  };

  // Dışarıya neleri kullandıracağız?
  return {
    appointments: data?.appointments || [],
    netDailyRevenue: data?.netDailyRevenue || 0,
    pendingDailyRevenue: data?.pendingDailyRevenue || 0,
    isLoading, // Sadece ilk kez veri .çekilirken true olur
    refreshing: isFetching, // Her güncellemede true olur
    refetch,
    handleAccept,
    handleCancel,
    removingItemId,
    setRemovingItemId,
    invalidateDashboard,
  };
};
