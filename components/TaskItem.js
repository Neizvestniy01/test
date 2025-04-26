import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TaskItem = ({ task, onDelete }) => {
  const formatReminderTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#9e9e9e" />
          <Text style={styles.time}>
            {formatReminderTime(task.reminderTime)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#2c2c2c", borderRadius: 16, padding: 18, marginVertical: 10, marginHorizontal: 12, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, borderLeftWidth: 4, borderLeftColor: "#616161"},
  content: { flex: 1},
  title: { fontSize: 18, fontWeight: "700", color: "#e0e0e0", marginBottom: 6},
  description: { fontSize: 14, color: "#9e9e9e", marginBottom: 10, lineHeight: 20},
  timeContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#3d3d3d", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-start"},
  time: { fontSize: 14, color: "#9e9e9e", marginLeft: 5, fontWeight: "500"},
  deleteButton: { padding: 10, backgroundColor: "#424242", borderRadius: 12, marginLeft: 10},
});
export default TaskItem;