# 💈 Berber Randevu Sistemi (Barber Appointment App)

React Native ve Node.js kullanılarak geliştirilmiş, kullanıcıların berberlerden randevu almasını sağlayan Full-Stack mobil uygulama.

## 🚀 Proje Hakkında

Bu uygulama, kullanıcıların favori berberlerini seçip, müsait gün ve saatlere göre dinamik olarak randevu oluşturmasını sağlar. Randevular geçmiş ve gelecek olarak filtrelenir. Güvenli giriş sistemi ve sepet mantığı içerir.

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

### Frontend (Mobil)

- **React Native (Expo):** Mobil arayüz geliştirme.
- **Zustand:** Global state yönetimi (Sepet, Kullanıcı verisi).
- **Axios:** Backend ile iletişim.
- **React Navigation:** Sayfalar arası geçiş.

### Backend (Sunucu)

- **Node.js & Express:** REST API mimarisi.
- **MongoDB & Mongoose:** Veritabanı modelleme.
- **JWT (JSON Web Token):** Güvenli kimlik doğrulama (Auth).
- **Joi:** Veri doğrulama (Validation).

## ✨ Özellikler

- 🔐 **Kullanıcı İşlemleri:** Kayıt ol, Giriş yap (JWT Auth).
- ✂️ **Berber & Hizmet Seçimi:** Berberleri listeleme ve hizmetleri sepete ekleme.
- 📅 **Akıllı Randevu Sistemi:**
  - Dinamik tarih ve saat oluşturma (Hardcoded değil, hesaplanan tarihler).
  - Dolu saatlerin otomatik kapatılması (Backend kontrolü).
- 🛒 **Sepet Mantığı:** Farklı berberden hizmet eklenirse uyarı sistemi.
- 🗂️ **Randevularım:** Randevuları "Gelecek" ve "Geçmiş" olarak ayırma ve sıralama.
- ❌ **İptal Sistemi:** Gelecek randevuları iptal edebilme.

## ⚙️ Kurulum ve Çalıştırma

Bu projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Depoyu Klonlayın

```bash
git clone [https://github.com/TunahanAcr/BarbarAppointment.git][https://github.com/TunahanAcr/BarbarAppointment.git)
cd BarbarAppointment

Backend Kurulumu
cd backend
npm install
# .env dosyası oluşturun ve MONGODB_URI ile JWT_SECRET ekleyin.
npm start

Frontend Kurulumu
Yeni bir terminal açın:
cd frontend
npm install
npx expo start
```
