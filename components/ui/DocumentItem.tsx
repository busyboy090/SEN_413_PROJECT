import { FileText } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface DocumentItemProps {
  title: string;
  info: string;
  type: "pdf" | "doc";
}

function DocumentItem({ title, info, type }: DocumentItemProps) {
  return (
    <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex-row items-center border border-slate-100 dark:border-slate-700 shadow-sm mb-3">
      <View
        className={`w-12 h-12 rounded-xl items-center justify-center ${type === "pdf" ? "bg-red-50" : "bg-blue-50"}`}
      >
        <FileText size={24} color={type === "pdf" ? "#ef4444" : "#3b82f6"} />
      </View>
      <View className="flex-1 ml-4">
        <Text
          className="text-sm font-bold text-slate-800 dark:text-slate-200"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-[10px] text-slate-400 font-medium mt-1">
          {info}
        </Text>
      </View>
    </View>
  );
}

export default DocumentItem;
