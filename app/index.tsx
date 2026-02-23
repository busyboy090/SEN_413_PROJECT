import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "@/api/axios";
import RecentUploads from "@/components/ui/RecentUploads";
import UploadCard from "@/components/ui/UploadCard";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { FileInfoType } from "@/types/document";

function App() {
  const router = useRouter();
  const { fileInfo, setFileInfo, isUploading, setIsUploading, saveToHistory } =
    useFileProcessor();

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.size && asset.size > 2 * 1024 * 1024) {
        Alert.alert(
          "File too large",
          "Please select a file smaller than 2MB.",
        );
        return;
      }
      
      setFileInfo({
        name: asset.name,
        size: asset.size
          ? parseFloat((asset.size / (1024 * 1024)).toFixed(2))
          : 0,
        type: asset.name.split(".").pop()?.toLowerCase() || "pdf",
        uri: asset.uri,
        mimeType: asset.mimeType || "application/pdf",
        fileBlob: Platform.OS === "web" ? (asset as any).file : null,
        file: asset,
      });
    }
  };

  const generateFlashCards = async () => {
    if (!fileInfo) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      if (Platform.OS === "web") {
        formData.append("file", fileInfo.fileBlob, fileInfo.name);
      } else {
        formData.append("file", {
          uri: fileInfo.uri,
          name: fileInfo.name,
          type: fileInfo.mimeType,
        } as any);
      }

      const res = await api.post(
        "/812a7fe1-d3c9-4a83-9cae-758fa29bfd4f",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: (data) => data,
        },
      );

      if (res.data?.[0]?.output) {
        await saveToHistory(fileInfo);

        // Clear file info after successful upload
        setFileInfo(null);
        router.push({
          pathname: "/flashcardsession",
          params: { questions: JSON.stringify(res.data[0].output) },
        });
      }
    } catch (error) {
      Alert.alert("Upload Failed", "Could not process document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-[#121121]"
      edges={["top"]}
    >
      {/* Header */}
      <View className="bg-[#1e1b4b] pt-8 pb-8 px-6 rounded-b-[32px] shadow-lg relative overflow-hidden">
        <View className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="bg-white/10 p-2 rounded-full">
              <BookOpen size={24} color="white" />
            </View>
            <Text className="text-xl font-extrabold text-white tracking-tight">
              AI Study Companion
            </Text>
          </View>
        </View>
        <Text className="mt-4 text-indigo-200 opacity-80 text-sm font-medium">
          Ready to master your next subject?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <UploadCard fileInfo={fileInfo} onPress={handlePickDocument} />

        {/* Recent Uploads */}
        <RecentUploads
          uploadDocument={(document: FileInfoType) => setFileInfo(document)}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={{ zIndex: 20 }} className="p-5 pb-9">
        <TouchableOpacity
          className={`rounded-2xl py-5 items-center ${isUploading || !fileInfo ? "bg-indigo-600/70" : "bg-indigo-600"}`}
          onPress={generateFlashCards}
          disabled={isUploading || !fileInfo}
        >
          <Text className="text-white font-extrabold">
            {isUploading ? "Analyzing..." : "Generate Flashcards"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;
