import { create } from "zustand";

export const useAppointmentStore = create((set, get) => ({
  //Randevu ile ilgili state'ler
  barber: null,
  date: null,
  time: null,
  services: [],
  totalPrice: 0,
  cartBarber: null,

  // Setter Fonksiyonları

  // Basit setter fonksiyonları
  //setBarber: (gelenVeri) => set({ barber: gelenVeri }) şeklinde
  setBarber: (barber) => set({ barber: barber }),

  setDateTime: (date, time) => set({ date: date, time: time }),

  toggleService: (service, targetBarber) => {
    const { services, totalPrice, cartBarber } = get();

    const isAlreadySelected = services.find((s) => s._id === service._id);
    const price = Number(service.price);

    if (isAlreadySelected) {
      const newServices = services.filter((s) => s._id !== service._id);
      // Hizmet zaten seçili, kaldır
      set({
        services: newServices,
        totalPrice: totalPrice - price,
        cartBarber: newServices.length === 0 ? null : cartBarber,
      });
    } else {
      const newCartBarber = services.length === 0 ? targetBarber : cartBarber;
      // Hizmet seçili değil, ekle
      set({
        services: [...services, service],
        totalPrice: totalPrice + price,
        cartBarber: newCartBarber,
      });
    }
  },

  // Randevu oluşturulduktan sonra state'leri temizle
  clearAppointment: () =>
    set({
      barber: null,
      date: null,
      time: null,
      services: [],
      totalPrice: 0,
      cartBarber: null,
    }),

  // Sadece sepeti temizlemek için
  clearCart: () =>
    set({
      services: [],
      totalPrice: 0,
      cartBarber: null,
    }),
}));

export default useAppointmentStore;
