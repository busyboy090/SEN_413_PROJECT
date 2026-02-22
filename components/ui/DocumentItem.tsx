import {
  FileText,
  MoreVertical,
  Trash2,
  UploadCloud,
} from "lucide-react-native";
import React from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DocumentItemProps {
  title: string;
  info: string;
  type: "pdf" | "doc";
  onUpload?: () => void;
  onDelete?: () => void; // Added for completeness
  showMenu: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

function DocumentItem({
  title,
  info,
  type,
  onUpload,
  onDelete,
  showMenu,
  onToggleMenu,
  onCloseMenu,
}: DocumentItemProps) {
  
  const handleUploadPress = () => {
    onCloseMenu();
    if (onUpload) onUpload();
  };

  const handleDeletePress = () => {
    onCloseMenu();
    if (onDelete) onDelete();
  };

  return (
    <View
      style={{
        zIndex: showMenu ? 100 : 1,
      }}
      className="relative"
    >
      <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex-row items-center border border-slate-100 dark:border-slate-700 shadow-sm">
        {/* File Icon */}
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center ${
            type === "pdf"
              ? "bg-red-50 dark:bg-red-900/20"
              : "bg-blue-50 dark:bg-blue-900/20"
          }`}
        >
          <FileText size={24} color={type === "pdf" ? "#ef4444" : "#3b82f6"} />
        </View>

        {/* Text Details */}
        <View className="flex-1 ml-4">
          <Text
            className="text-sm font-bold text-slate-800 dark:text-slate-200"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-[10px] text-slate-400 font-medium mt-1 uppercase">
            {info}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={onToggleMenu}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="p-2 -mr-2 rounded-full active:bg-slate-100 dark:active:bg-slate-700"
        >
          <MoreVertical size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Popover Menu */}
      {showMenu && (
        <>
          {/* Backdrop: Covers the screen area. 
            Note: In a very long FlatList, use a Modal for 100% reliability.
          */}
          <Pressable
            className="absolute -top-[1000] -bottom-[1000] -left-[1000] -right-[1000] z-20"
            onPress={onCloseMenu}
          />

          <View
            style={{
              minWidth: 140,
              zIndex: 50,
              // Elevation is vital for Android to show above siblings
              elevation: 5,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                },
              }),
            }}
            className="absolute right-0 top-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
          >
            <TouchableOpacity
              onPress={handleUploadPress}
              className="flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800 border-b border-slate-50 dark:border-slate-800"
            >
              <UploadCloud size={16} color="#4c44e4" />
              <Text className="ml-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Upload
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeletePress}
              className="flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800"
            >
              <Trash2 size={16} color="#ef4444" />
              <Text className="ml-3 text-xs font-semibold text-red-500">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

export default DocumentItem;
