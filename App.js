"use client";

import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, View, Text, ScrollView} from "react-native";
import { storeData, getData, clearAll } from "./utils/storage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { LinearGradient } from "expo-linear-gradient";
import { OneSignal } from "react-native-onesignal";

const ONESIGNAL_APP_ID = "18953dae-c615-48c7-b87c-81bd3c8e767c";
const USER_EXTERNAL_ID = "test_external_id";
const ONESIGNAL_REST_API_KEY =
  "os_v2_app_dckt3lwgcvempod4qg6tzdtwpq2rmaqn5wdehcf37i7rvfgiplbadxtawiktyacjr6iqtsbm5bvijguo7442growmloc2ssstoi33jq";

export default function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (OneSignal) {
          console.log("Initializing OneSignal...");
          OneSignal.initialize(ONESIGNAL_APP_ID);
          OneSignal.Notifications.requestPermission(true);
          console.log("OneSignal initialized successfully");
        } else {
          console.error("OneSignal is not available");
        }
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }
    };
    initOneSignal();
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await getData("tasks");
      if (savedTasks) {
        setTasks(savedTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const taskWithId = {
        ...newTask,
        id: Date.now().toString(),
      };
      const updatedTasks = [...tasks, taskWithId];
      setTasks(updatedTasks);
      await storeData("tasks", updatedTasks);
      scheduleNotification(taskWithId);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      await storeData("tasks", updatedTasks);
      if (taskToDelete && taskToDelete.notificationId) {
        cancelNotification(taskToDelete.notificationId);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const clearAllTasks = async () => {
    try {
      for (const task of tasks) {
        if (task.notificationId) {
          await cancelNotification(task.notificationId);
        }
      }
      setTasks([]);
      await clearAll();
    } catch (error) {
      console.error("Failed to clear tasks:", error);
    }
  };

  const scheduleNotification = async (task) => {
    try {
      if (!OneSignal) {
        console.error(
          "OneSignal is not available for scheduling notifications"
        );
        return;
      }
      OneSignal.login(USER_EXTERNAL_ID);
      OneSignal.User.pushSubscription.optIn();
      const reminderTime = new Date(task.reminderTime).getTime();
      let userId = null;
      try {
        userId = await OneSignal.User.getExternalId();
      } catch (error) {
        console.error("Failed to get OneSignal External User ID:", error);
        return;
      }
      console.log("OneSignal External User ID:", userId);
      const notificationObj = {
        headings: { en: "Task Reminder" },
        contents: { en: task.title },
        data: { taskId: task.id },
        send_after: new Date(reminderTime).toISOString(),
      };
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
          },
          body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            ...notificationObj,
            include_external_user_ids: [userId],
          }),
        }
      );
      const responseData = await response.json();
      console.log("Notification scheduled:", responseData);
      if (responseData.id) {
        const updatedTasks = tasks.map((t) =>
          t.id === task.id ? { ...t, notificationId: responseData.id } : t
        );
        setTasks(updatedTasks);
        await storeData("tasks", updatedTasks);
      }
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  const cancelNotification = async (notificationId) => {
    try {
      await fetch(
        `https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to cancel notification:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />
      <LinearGradient colors={["#424242", "#212121"]} style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Task Reminder</Text>
          <Text style={styles.subtitle}>
            Keep track of your important tasks
          </Text>
        </View>
      </LinearGradient>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <TaskForm onAddTask={addTask} />
        </View>
        <View style={styles.listContainer}>
          <TaskList
            tasks={tasks}
            onDeleteTask={deleteTask}
            onClearAll={clearAllTasks}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212121"},
  header: { paddingTop: 40, paddingBottom: 20, paddingHorizontal: 20},
  titleContainer: { alignItems: "center"},
  title: { fontSize: 28, fontWeight: "bold", color: "#e0e0e0", textAlign: "center"},
  subtitle: { fontSize: 14, color: "#9e9e9e", marginTop: 5},
  scrollView: { flex: 1, backgroundColor: "#212121"},
  scrollContent: { paddingBottom: 30},
  formContainer: { paddingHorizontal: 0, paddingTop: 0},
  listContainer: { flex: 1, paddingBottom: 20},
});