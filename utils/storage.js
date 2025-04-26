let memoryStorage = {};

if (typeof window !== "undefined" && window.localStorage) {
  try {
    const savedData = window.localStorage.getItem("todoReminderData");
    if (savedData) {
      memoryStorage = JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
  }
}

export const storeData = async (key, value) => {
  try {
    memoryStorage[key] = value;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(
        "todoReminderData",
        JSON.stringify(memoryStorage)
      );
    }
    return true;
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
};

export const getData = async (key) => {
  try {
    return memoryStorage[key];
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

export const removeData = async (key) => {
  try {
    delete memoryStorage[key];
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(
        "todoReminderData",
        JSON.stringify(memoryStorage)
      );
    }
    return true;
  } catch (error) {
    console.error("Error removing data:", error);
    throw error;
  }
};

export const clearAll = async () => {
  try {
    memoryStorage = {};
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("todoReminderData");
    }
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};