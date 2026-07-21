import { TextInput, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function MyInput({ value, onChangeText, placeholder, secure }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textFaint}
      secureTextEntry={secure}
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
  },
});