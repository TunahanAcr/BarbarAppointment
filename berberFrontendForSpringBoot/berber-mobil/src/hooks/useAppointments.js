import api from "../api";
import { berberId } from "../configId";
import { Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAppointments = (selectedDate) => {
  const queryClient = useQueryClient();

  // 🔄 Veri Çekme Fonksiyonu
  const fetchDashboardData = async (date) => {
    const [appointmentsResponse, netRevenueResponse, pendingRevenueResponse] =
      await Promise.all([
        api.get(
          `/dashboard/appointments/barber/${berberId}/daily?fullDate=${date}`,
        ),
        api.get(
          `/dashboard/appointments/barber/${berberId}/price?status=approved&fullDate=${date}`,
        ),
        api.get(
          `/dashboard/appointments/barber/${berberId}/price?status=pending&fullDate=${date}`,
        ),
      ]);

    console.log("Randevular:", appointmentsResponse.data);
    return {
      appointments: appointmentsResponse.data,
      netDailyRevenue: netRevenueResponse.data,
      pendingDailyRevenue: pendingRevenueResponse.data,
    };
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["dashboardData", berberId, selectedDate], // Verinin benzersiz anahtarı
    queryFn: () => fetchDashboardData(selectedDate), // Veriyi çekme fonksiyonu
  });

  // ✅ Onaylama Fonksiyonu
  const handleAccept = async (id) => {
    Alert.alert(
      "Randevu Onayı",
      "Bu randevuyu onaylamak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Onayla", onPress: () => onAccept.mutate(id) },
      ],
    );
  };

  const onAccept = useMutation({
    // API Request
    mutationFn: (id) =>
      api.patch(`/dashboard/appointments/${id}`, { status: "approved" }),

    // Başarılı Onaylama
    onSuccess: () => {
      console.log("Randevu onaylandı!");
      queryClient.invalidateQueries({
        queryKey: ["dashboardData", berberId, selectedDate],
      }); // Veriyi yeniden çek sadece ilgili query'yi invalid et
    },

    onError: (err) => {
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
        { text: "Onayla", onPress: () => onCancel.mutate(id) },
      ],
    );
  };
  const onCancel = useMutation({
    mutationFn: (id) =>
      api.patch(`/dashboard/appointments/${id}`, {
        status: "cancelled",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboardData", berberId, selectedDate],
      }); // Veriyi yeniden çek
    },

    onError: (err) => {
      console.log("İptal hatası:", err);
    },
  });

  // Dışarıya neleri kullandıracağız?
  return {
    appointments: data?.appointments || [],
    netDailyRevenue: data?.netDailyRevenue || 0,
    pendingDailyRevenue: data?.pendingDailyRevenue || 0,
    isLoading, // Sadece ilk kez veri .çekilirken true olur
    refreshing: isFetching, // Her güncellemede true olur
    fetchDashboardData: refetch,
    handleAccept,
    handleCancel,
  };
};
