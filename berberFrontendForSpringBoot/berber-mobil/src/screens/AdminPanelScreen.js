import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api"; // API çağrıları için
import { Colors } from "../constants/colors";

export default function AdminPanelScreen() {
  const [form, setForm] = useState({ name: "", location: "", image: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Backend'den dönecek olan davet kodunu burada tutacağız
  const [generatedInviteCode, setGeneratedInviteCode] = useState(null);

  const handleAddBarber = async () => {
    console.log("Form verisi gönderiliyor:", form);
    if (!form.name || !form.location) {
      Alert.alert("Hata", "Lütfen berber adı ve konumunu doldurun.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend'e gönderiyoruz (Token'ın header'da gittiğinden emin ol)
      const response = await api.post("/admin/barbers", form);

      // Başarılı olursa dönen invite code'u state'e al
      setGeneratedInviteCode(response.data.inviteCode);

      // Formu temizle
      setForm({ name: "", location: "", image: "" });
    } catch (error) {
      Alert.alert("Hata", "Berber eklenirken bir sorun oluştu.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Yeni berber eklemek için ekranı sıfırla
    setGeneratedInviteCode(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.headerTitle}>👑 Yönetim Paneli</Text>

      {/* EĞER BERBER EKLENDİYSE DAVET KODUNU GÖSTER */}
      {generatedInviteCode ? (
        <View style={styles.successBox}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={40} color={Colors.background} />
          </View>
          <Text style={styles.successTitle}>Berber Eklendi!</Text>
          <Text style={styles.successDesc}>
            Bu kodu berber sahibine gönderin:
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText} selectable={true}>
              {generatedInviteCode}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Yeni Berber Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* EKLENMEDİYSE FORMU GÖSTER */
        <View style={styles.formContainer}>
          <Text style={styles.label}>Berber / Dükkan Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Makas Kardeşler"
            placeholderTextColor={Colors.textFaint}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <Text style={styles.label}>Konum / İlçe</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Nilüfer / Bursa"
            placeholderTextColor={Colors.textFaint}
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
          />

          <Text style={styles.label}>Fotoğraf Linki (Opsiyonel)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={Colors.textFaint}
            value={form.image}
            onChangeText={(text) => setForm({ ...form, image: text })}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleAddBarber}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>Sisteme Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "800",
  },
  successBox: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  successTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 14,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 5,
    marginBottom: 20,
  },
  codeBox: {
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  codeText: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 2,
  },
  resetButton: {
    marginTop: 28,
    padding: 15,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});
