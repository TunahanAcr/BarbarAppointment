const generateTimeSlots = (startHour = 9, endHour = 20, interval = 60) => {
  const slots = [];
  const start = new Date();

  // Başlangıç saatini ayarla
  start.setHours(startHour, 0, 0, 0); // Saat, dakika, saniye, milisaniye

  while (start.getHours() < endHour) {
    const hour = start.getHours().toString().padStart(2, "0"); // 9 -> "09" yapar
    const minute = start.getMinutes().toString().padStart(2, "0"); // 0 -> "00" yapar

    slots.push(`${hour}:${minute}`);
    start.setMinutes(start.getMinutes() + interval); // Belirtilen aralıkla ilerle
  }
  return slots;
};

export default generateTimeSlots;
