import React, { useState, useEffect } from "react";
import { History } from "lucide-react-native";
import { Text, View } from "react-native";
import DocumentItem from "./DocumentItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the structure for recent uploads
interface RecentDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  file: any;
}

const RECENT_UPLOADS_KEY = "@recent_uploads";

function RecentUploads() {
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);

  // Load history on component mount
  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      const savedData = await AsyncStorage.getItem(RECENT_UPLOADS_KEY);
      if (savedData) {
        setRecentDocs(JSON.parse(savedData));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  return (
    <View>
      <View className="flex-row items-center gap-2 mb-4 px-1">
        <History size={14} color="#94a3b8" />
        <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Recent Uploads
        </Text>
      </View>

      {recentDocs.length > 0 ? (
        recentDocs.map((doc) => (
          <DocumentItem
            key={doc.id}
            title={doc.name}
            info={`${doc.date} • ${doc.size}`}
            type={doc.type === "pdf" ? "pdf" : "doc"}
          />
        ))
      ) : (
        <View className="py-8 items-center border border-slate-100 dark:border-slate-800 rounded-xl">
          <Text className="text-slate-400 text-xs italic">
            No recent uploads found
          </Text>
        </View>
      )}
    </View>
  );
}

export default RecentUploads;
