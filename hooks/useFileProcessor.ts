import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/api/axios";
import { Platform } from "react-native";
import { FileInfoType, RecentDocument } from "../types/document";

const RECENT_UPLOADS_KEY = "@recent_uploads";

export const useFileProcessor = () => {
  const [fileInfo, setFileInfo] = useState<FileInfoType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);

  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      const savedData = await AsyncStorage.getItem(RECENT_UPLOADS_KEY);
      if (savedData) setRecentDocs(JSON.parse(savedData));
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const saveToHistory = async (doc: FileInfoType) => {
    const newEntry: RecentDocument = {
      id: Date.now().toString(),
      name: doc.name,
      size: `${doc.size} MB`,
      type: doc.type,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    const updatedDocs = [
      newEntry,
      ...recentDocs.filter((d) => d.name !== doc.name),
    ].slice(0, 5);
    setRecentDocs(updatedDocs);
    await AsyncStorage.setItem(RECENT_UPLOADS_KEY, JSON.stringify(updatedDocs));
  };

  const deleteFromHistory = async (id: string) => {
    try {
      // 1. Filter out the document with the matching ID
      const updatedDocs = recentDocs.filter((doc) => doc.id !== id);

      // 2. Update local state for immediate UI feedback
      setRecentDocs(updatedDocs);

      // 3. Persist the change to AsyncStorage
      await AsyncStorage.setItem(
        RECENT_UPLOADS_KEY,
        JSON.stringify(updatedDocs),
      );
    } catch (error) {
      console.error("Failed to delete item from history:", error);
    }
  };

  return {
    fileInfo,
    setFileInfo,
    isUploading,
    setIsUploading,
    recentDocs,
    saveToHistory,
    deleteFromHistory
  };
};
