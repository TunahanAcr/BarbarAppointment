//Gelecek Günleri hesaplayan yardımcı fonksiyon

//Default olarak 7 gün alır
const getNextDays = (numberOfDays = 7) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < numberOfDays; i++) {
    const nextDay = new Date(today); // Klonlama
    nextDay.setDate(today.getDate() + i); // Tarihi gün ekleyerek ilerlet
    days.push({
      id: i,
      dayNumber: nextDay.getDate(), // Ayın günü
      dayName: nextDay.toLocaleDateString("tr-TR", { weekday: "short" }), // Gün adı (kısa)
      fullDate: nextDay.toISOString().split("T")[0], // YYYY-MM-DD formatında tam tarih
      month: nextDay.toLocaleDateString("tr-TR", { month: "long" }), // Ay adı
    });
  }

  return days;
};

export default getNextDays;
