"use client";

import { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity} from "react-native";
import DatePicker from "react-native-date-picker";
import { Ionicons } from "@expo/vector-icons";

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }
    const newTask = {
      title,
      description,
      reminderTime: reminderTime.toISOString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onAddTask(newTask);
    setTitle("");
    setDescription("");
    setReminderTime(new Date());
  };
  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Ionicons name="create-outline" size={24} color="#9e9e9e" />
        <Text style={styles.formTitle}>Create New Task</Text>
      </View>
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#757575"/>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        placeholderTextColor="#757575"/>
      <Text style={styles.label}>Reminder Time</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setDatePickerOpen(true)}>
        <Ionicons name="calendar-outline" size={20} color="#9e9e9e" />
        <Text style={styles.dateButtonText}>
          {reminderTime.toLocaleString()}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={datePickerOpen}
        date={reminderTime}
        onConfirm={(date) => {
          setDatePickerOpen(false);
          setReminderTime(date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
        minimumDate={new Date()}
        androidVariant="nativeAndroid"
        theme="dark"/>
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#2c2c2c", borderRadius: 20, margin: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5},
  formHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20},
  formTitle: { fontSize: 20, fontWeight: "700", color: "#e0e0e0", marginLeft: 8},
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#bdbdbd"},
  input: { borderWidth: 1.5, borderColor: "#424242", borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 16, backgroundColor: "#3d3d3d", color: "#e0e0e0"},
  textArea: { height: 100, textAlignVertical: "top"},
  dateButton: { borderWidth: 1.5, borderColor: "#424242", borderRadius: 12, padding: 14, marginBottom: 24, backgroundColor: "#3d3d3d", flexDirection: "row", alignItems: "center"},
  dateButtonText: { fontSize: 16, color: "#e0e0e0", marginLeft: 8},
  addButton: { backgroundColor: "#424242", padding: 16, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "center"},
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 8},
});
export default TaskForm;