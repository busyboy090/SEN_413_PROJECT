import FlashCard from "@/components/ui/FlashCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Timer as TimerIcon,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface userSelectionType {
  questionNumber: number;
  selectedOption: string;
  correctAnswer: string;
}

const FlashcardSession = () => {
  const {
    questions,
    mode = "study",
    userSelection: initialSelection,
    timeTaken
  } = useLocalSearchParams<{
    questions: string;
    mode: "study" | "result";
    userSelection?: string;
    timeTaken?: string;
  }>();

  const router = useRouter();
  const isDarkMode = useColorScheme() === "dark";
  const isResultMode = mode === "result";

  const parsedQuestions =
    typeof questions === "string" ? JSON.parse(questions) : questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelection, setUserSelection] = useState<userSelectionType[]>(
    isResultMode && initialSelection ? JSON.parse(initialSelection) : [],
  );

  // --- Timer Logic (Disabled in Result Mode) ---
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isResultMode) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResultMode]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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

    router.push({
      pathname: "/result",
      params: {
        questions: JSON.stringify(parsedQuestions),
        userSelection: JSON.stringify(userSelection),
        timeTaken: isResultMode ? timeTaken : formatTime(seconds)
      },
    });
  };

  if (!currentData) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#f6f6f8] dark:bg-[#121121]">
      {/* Dynamic Header */}
      <View className="px-4 py-3 flex-row items-center bg-white dark:bg-[#1c1b2e] border-b border-indigo-50 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/" })}
          className="w-10 h-10 rounded-full items-center justify-center bg-indigo-50 dark:bg-indigo-900/20"
        >
          {isResultMode ? (
            <X size={20} color="#4c44e4" />
          ) : (
            <ArrowLeft size={20} color="#4c44e4" />
          )}
        </TouchableOpacity>

        <View className="items-center align-middle flex-1">
          <Text className="text-sm font-bold tracking-widest text-[#121121] dark:text-white uppercase">
            {isResultMode ? "Result" : "Study Session"}
          </Text>

          {!isResultMode && (
            <View className="flex-row items-center mt-0.5">
              <TimerIcon size={12} color="#6366f1" style={{ marginRight: 4 }} />
              <Text className="text-xs font-mono font-medium text-indigo-500">
                {formatTime(seconds)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-6 py-4 bg-white dark:bg-[#1c1b2e]">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[11px] font-bold text-indigo-400 uppercase">
            {isResultMode ? "Reviewing" : "Progress"}
          </Text>
          <Text className="text-[11px] font-bold text-indigo-600">
            {currentIndex + 1} / {total}
          </Text>
        </View>
        <View className="w-full h-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
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
          if (isResultMode) return;

          setUserSelection((prev) => {
            const filtered = prev.filter(
              (s) => s.questionNumber !== selection.questionNumber,
            );
            return [...filtered, selection];
          });
        }}
        showResult={isResultMode} // Results only shown if mode is explicitly 'result'
      />

      {/* Footer Actions */}
      <View className="p-6 pb-8 bg-white dark:bg-[#1c1b2e] flex-row items-center justify-between border-t border-indigo-50 dark:border-white/5">
        <TouchableOpacity
          onPress={() =>
            currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
          }
          className={`h-12 w-[35%] rounded-full flex-row gap-2 items-center justify-center border border-indigo-100 dark:border-indigo-800 ${
            currentIndex === 0 ? "opacity-0" : "opacity-100"
          }`}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={20} color={isDarkMode ? "white" : "#4f46e5"} />
          <Text className="text-indigo-600 dark:text-white font-bold">
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            isLastQuestion
              ? handleSubmit
              : handleNext
          }
          activeOpacity={0.8}
          className={`h-12 w-[55%] rounded-full flex-row items-center justify-center ${
            isLastQuestion && !isResultMode
              ? "bg-emerald-600 shadow-emerald-200"
              : "bg-indigo-600 shadow-indigo-200"
          }`}
        >
          <Text className="text-white font-extrabold text-base mr-2">
            {isLastQuestion
              ? "Finish"
              : "Next"}
          </Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FlashcardSession;
