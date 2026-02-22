import React from "react";
import { TouchableOpacity, View, Text, ViewStyle } from "react-native";
import { UploadCloud, FileText } from "lucide-react-native";
import { FileInfoType } from "@/types/document";

interface Props {
  fileInfo: FileInfoType | null;
  onPress: () => void;
}

const UploadCard = ({ fileInfo, onPress }: Props) => (
  <TouchableOpacity
    activeOpacity={0.9}
    className="relative mb-8"
    onPress={onPress}
  >
    <View
      className="absolute inset-0 bg-indigo-600/5 rounded-2xl"
      style={{ transform: [{ rotate: "-2deg" }] } as ViewStyle}
    />
    <View className="bg-white dark:bg-slate-800 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-2xl p-10 items-center justify-center shadow-sm">
      <View className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full items-center justify-center mb-6">
        {fileInfo ? (
          <FileText
            size={40}
            color={fileInfo.type === "pdf" ? "#ef4444" : "#3b82f6"}
          />
        ) : (
          <UploadCloud size={40} color="#4c44e4" strokeWidth={1.5} />
        )}
      </View>
      <Text className="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">
        {fileInfo ? fileInfo.name : "Tap to upload PDF"}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm text-center px-4 leading-5">
        {fileInfo ? `${fileInfo.size} MB` : "Maximum file size: 2MB"}
      </Text>
      <View className="mt-6 px-8 py-3 bg-indigo-600 rounded-full">
        <Text className="text-white text-sm font-bold">
          {fileInfo ? "Change Document" : "Select Document"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default UploadCard;
