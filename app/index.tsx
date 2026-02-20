import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookOpen,
  FileText,
  UploadCloud,
} from 'lucide-react-native';
import DocumentItem from '@/components/ui/DocumentItem';
import * as DocumentPicker from 'expo-document-picker';
import api from '@/api/axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const questions: any = [
  {
    "subject": "Biology",
    "question": "Which organelle is responsible for photosynthesis in plant cells?",
    "imageUrl": "https://example.com/chloroplast-diagram.png",
    "correctAnswer": "C",
    "options": [
      { "label": "A", "value": "Mitochondria" },
      { "label": "B", "value": "Nucleus" },
      { "label": "C", "value": "Chloroplast" },
      { "label": "D", "value": "Ribosome" }
    ]
  },
  {
    "subject": "Computer Science",
    "question": "What is the Big O time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    "imageUrl": null,
    "correctAnswer": "B",
    "options": [
      { "label": "A", "value": "O(1)" },
      { "label": "B", "value": "O(log n)" },
      { "label": "C", "value": "O(n)" },
      { "label": "D", "value": "O(n log n)" }
    ]
  },
  {
    "subject": "World History",
    "question": "Which of these factors was a primary catalyst for the start of the Industrial Revolution in Great Britain?",
    "imageUrl": null,
    "correctAnswer": "A",
    "options": [
      { "label": "A", "value": "Access to large coal deposits and the development of the steam engine." },
      { "label": "B", "value": "The sudden end of all international trade which forced domestic production." },
      { "label": "C", "value": "A mandate from the monarchy to ban all agricultural work in favor of factories." },
      { "label": "D", "value": "The invention of the internet allowed for faster communication between inventors." }
    ]
  },
  {
    "subject": "Chemistry",
    "question": "What is the pH level of pure distilled water at room temperature (25°C)?",
    "imageUrl": "https://example.com/ph-scale.png",
    "correctAnswer": "B",
    "options": [
      { "label": "A", "value": "pH 1.0 (Highly Acidic)" },
      { "label": "B", "value": "pH 7.0 (Neutral)" },
      { "label": "C", "value": "pH 14.0 (Highly Alkaline)" },
      { "label": "D", "value": "pH 4.5 (Slightly Acidic)" }
    ]
  }
]

interface FileInfoType {
  name: string;
  size: number;
  type: string;
  file: any;
}

function App () {
  const [fileInfo, setFileInfo] = useState<FileInfoType | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // This limits the selection to PDF and DOCX
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        // Check file size (25MB = 25 * 1024 * 1024 bytes)
        if (file.size && file.size > 25 * 1024 * 1024) {
          Alert.alert("File too large", "Please select a file smaller than 25MB.");
          return;
        }

        setFileInfo({
          name: file.name,
          size: file.size ? parseFloat((file.size / (1024 * 1024)).toFixed(2)) : 0,
          type: file.name.split('.')[1].toLowerCase(),
          file
        });

        // Proceed with your AI processing or upload to your server


      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const generateFlashCards = async () => {
    if (!fileInfo?.file.uri) return; // Don't send if no file exists

    try {
      const formData = new FormData();

      // We append the file to the "envelope"
      // The key 'file' must match what your backend is looking for
      formData.append('file', {
        uri: fileInfo.file.uri,
        name: fileInfo.name,
        type: fileInfo.file.mimeType || 'application/pdf', // The backend needs the MIME type
      } as any);

      const res = await api.post('/812a7fe1-d3c9-4a83-9cae-758fa29bfd4f', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Flashcards generated:", res.data);
    } catch (error: any) {
      console.log(error)
      console.error("Upload failed:", error.response?.data || error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#121121]" edges={['top']}>
      <StatusBar className='bg-indigo-600' />

      {/* Header Section */}
      <View className="bg-[#1e1b4b] pt-8 pb-8 px-6 rounded-b-[32px] shadow-lg relative overflow-hidden">
        {/* Decorative circle backdrop */}
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

      <ScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Card */}
        <TouchableOpacity activeOpacity={0.9} className="relative mb-8" onPress={handleUpload}>
          {/* Visual Tilt Decoration */}
          <View
            className="absolute inset-0 bg-indigo-600/5 rounded-2xl"
            style={{ transform: [{ rotate: '-2deg' }] } as ViewStyle}
          />
          <View className="bg-white dark:bg-slate-800 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-2xl p-10 items-center justify-center shadow-sm">
            <View className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full items-center justify-center mb-6">
              {
                fileInfo ? <FileText size={40} color={fileInfo.type === 'pdf' ? '#ef4444' : '#3b82f6'} /> : <UploadCloud size={40} color="#4c44e4" strokeWidth={1.5} />
              }
            </View>
            <Text className={`text-lg font-bold text-slate-800 dark:text-white mb-2 text-center ${fileInfo?.name && "text-2xl"}`}>
              {
                fileInfo ? fileInfo.name : "Tap to upload PDF / DOCX"
              }
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center px-4 leading-5">
              Maximum file size: 25MB for optimal AI processing
            </Text>
            <View className="mt-6 px-8 py-3 bg-indigo-600 rounded-full">
              <Text className="text-white text-sm font-bold">Select Document</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Uploads Section */}
        <View>
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Recent Uploads
            </Text>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-indigo-600">View All</Text>
            </TouchableOpacity>
          </View>

          <DocumentItem
            title="Cellular_Biology_Notes.pdf"
            info="Oct 24, 2023 • 4.2 MB"
            type="pdf"
          />
          <DocumentItem
            title="World_History_Quiz_Prep.docx"
            info="Oct 22, 2023 • 1.1 MB"
            type="doc"
          />
          <DocumentItem
            title="Calculus_Formula_Sheet.pdf"
            info="Oct 19, 2023 • 0.8 MB"
            type="pdf"
          />
        </View>
      </ScrollView>

      {/* Action Button (Generate) */}
      <View className="mt-auto mb-8 mx-5">
        <TouchableOpacity
          activeOpacity={0.9}
          className="bg-indigo-600 rounded-2xl py-5 flex-row items-center justify-center gap-3 shadow-xl shadow-indigo-400"
          style={Platform.OS === 'android' ? { elevation: 8 } : {}}
          // disabled={!fileInfo}
          onPress={() => navigation.navigate("flashcardsession", {
            questions
          })}
        >
          <Text className="text-white font-extrabold text-base">Generate Flashcards</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;