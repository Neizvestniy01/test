import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onDeleteTask, onClearAll }) => {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/000000/task-completed.png",
          }}
          style={styles.emptyImage}/>
        <Text style={styles.emptyTitle}>No Tasks Yet</Text>
        <Text style={styles.emptyText}>
          Add a task to get started with your day!
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headingWrapper}>
          <Ionicons name="list" size={22} color="#9e9e9e" />
          <Text style={styles.heading}>Your Tasks</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
          <Ionicons name="trash-bin-outline" size={16} color="white" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {tasks.map((item) => (
        <TaskItem key={item.id} task={item} onDelete={onDeleteTask} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12},
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, marginBottom: 16, marginTop: 8},
  headingWrapper: { flexDirection: "row", alignItems: "center"},
  heading: { fontSize: 20, fontWeight: "bold", color: "#e0e0e0", marginLeft: 8},
  emptyContainer: { padding: 30, alignItems: "center", backgroundColor: "#212121", minHeight: 300},
  emptyImage: { width: 120, height: 120, marginBottom: 20, opacity: 0.8},
  emptyTitle: { fontSize: 22, fontWeight: "bold", color: "#e0e0e0", marginBottom: 10},
  emptyText: { fontSize: 16, color: "#9e9e9e", textAlign: "center", lineHeight: 24},
  clearButton: { backgroundColor: "#424242", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, flexDirection: "row", alignItems: "center"},
  clearButtonText: { color: "white", fontWeight: "bold", fontSize: 14, marginLeft: 4},
});
export default TaskList;