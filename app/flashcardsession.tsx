import FlashCard from "@/components/ui/FlashCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MoreHorizontal,
  Timer as TimerIcon, // Renamed to avoid conflict with logic
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface userSelectionType {
  questionNumber: number;
  selectedOption: string;
  correctAnswer: string;
}

const FlashcardSession = () => {
  const { questions } = useLocalSearchParams<{ questions: string }>();
  const router = useRouter();

  const parsedQuestions =
    typeof questions === "string" ? JSON.parse(questions) : questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelection, setUserSelection] = useState<userSelectionType[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Timer State ---
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Start timer on mount
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  // -------------------

  const total = parsedQuestions.length;
  const isLastQuestion = currentIndex === total - 1;
  const progressWidth = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const currentData = parsedQuestions[currentIndex];

  const getCurrentSelection = () => {
    return (
      userSelection.find((s) => s.questionNumber === currentIndex + 1)
        ?.selectedOption || null
    );
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitted(true);

    router.push({
      pathname: "/result",
      params: {
        questions: JSON.stringify(parsedQuestions),
        userSelection: JSON.stringify(userSelection),
        timeTaken: formatTime(seconds), // Passing the final time
      },
    });
  };

  if (!currentData) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#f6f6f8] dark:bg-[#121121]">
      <StatusBar barStyle="dark-content" />

      {/* Navigation Header */}
      <View className="px-4 py-3 flex-row items-center justify-between bg-white dark:bg-[#121121] border-b border-primary/10">
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="w-10 h-10 rounded-full items-center justify-center bg-indigo-50"
        >
          <ArrowLeft size={20} color="#4c44e4" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-[10px] tracking-widest font-bold text-indigo-400 uppercase">
            Study Session
          </Text>
          <View className="flex-row items-center">
            <TimerIcon size={12} color="#6366f1" style={{ marginRight: 4 }} />
            <Text className="text-sm font-mono font-bold text-[#121121] dark:text-white">
              {formatTime(seconds)}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
          <MoreHorizontal size={24} color="#4c44e4" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="px-6 py-4 bg-white dark:bg-[#121121]">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[11px] font-bold text-indigo-400 uppercase">
            Progress
          </Text>
          <Text className="text-[11px] font-bold text-indigo-600">
            {currentIndex + 1} / {total}
          </Text>
        </View>
        <View className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${progressWidth}%` }}
          />
        </View>
      </View>

      {/* Main Question Area */}
      <FlashCard
        questionNumber={currentIndex + 1}
        question={currentData.question}
        options={currentData.options}
        correctAnswer={currentData.answer}
        selectedOption={getCurrentSelection()}
        onSelect={(selection: userSelectionType) => {
          setUserSelection((prev) => {
            const filtered = prev.filter(
              (s) => s.questionNumber !== selection.questionNumber,
            );
            return [...filtered, selection];
          });
        }}
        showResult={isSubmitted}
      />

      {/* Footer Action */}
      <View className="p-6 pb-5 bg-white dark:bg-[#121121] flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() =>
            currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
          }
          activeOpacity={0.8}
          className={`h-12 w-[35%] rounded-full flex-row items-center justify-center border border-indigo-100 bg-white dark:bg-[#1c1b2e] ${
            currentIndex === 0 ? "opacity-0" : "opacity-100"
          }`}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={18} className="dark:text-white text-[#4c44e4]" />
          <Text className="text-indigo-600 dark:text-white font-bold ml-2 text-sm">
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isLastQuestion && !isSubmitted ? handleSubmit : handleNext}
          activeOpacity={0.8}
          className={`h-12 w-[50%] rounded-full flex-row items-center justify-center ${
            isLastQuestion && !isSubmitted
              ? "bg-emerald-600 shadow-emerald-200"
              : "bg-indigo-600 shadow-indigo-300"
          }`}
          style={{ elevation: 5 }}
        >
          <Text className="text-white font-extrabold text-base mr-2">
            {isLastQuestion && !isSubmitted ? "Finish" : "Next"}
          </Text>
          {isLastQuestion && !isSubmitted ? (
            <CheckCircle size={20} color="white" />
          ) : (
            <ArrowRight size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FlashcardSession;
