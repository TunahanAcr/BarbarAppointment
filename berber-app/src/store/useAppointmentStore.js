import { create } from "zustand";

export const useAppointmentStore = create((set, get) => ({
  //Randevu ile ilgili state'ler
  barber: null,
  date: null,
  time: null,
  services: [],
  totalPrice: 0,

  // Setter Fonksiyonları

  // Basit setter fonksiyonları
  //setBarber: (gelenVeri) => set({ barber: gelenVeri }) şeklinde
  setBarber: (barber) => set({ barber: barber }),

  setDateTime: (date, time) => set({ date: date, time: time }),

  toggleService: (service) => {
    const currentServices = get().services; // Mevcut hizmetler
    const isAlreadySelected = currentServices.find(
      (s) => s._id === service._id
    );

    const price = Number(service.price);

    if (isAlreadySelected) {
      // Hizmet zaten seçili, kaldır
      set({
        services: currentServices.filter((s) => s._id !== service._id),
        totalPrice: get().totalPrice - price,
      });
    } else {
      // Hizmet seçili değil, ekle
      set({
        services: [...currentServices, service],
        totalPrice: get().totalPrice + price,
      });
    }
  },

  //Randevu oluşturulduktan sonra state'leri temizle
  clearAppointment: () =>
    set({
      barber: null,
      date: null,
      time: null,
      services: [],
      totalPrice: 0,
    }),
}));

export default useAppointmentStore;
