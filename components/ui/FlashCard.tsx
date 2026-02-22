import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react-native';

interface Option {
  label: string;
  value: string;
}

interface userSelectionType {
  questionNumber: number;
  selectedOption: string;
  correctAnswer: string;
}

interface FlashCardProps {
  questionNumber: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  selectedOption: string | null;
  onSelect: (selection: userSelectionType) => void;
  showResult: boolean;
}

const FlashCard = ({
  questionNumber,
  question,
  options,
  correctAnswer,
  selectedOption,
  onSelect,
  showResult
}: FlashCardProps) => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}>
      {/* Question Card */}
      <View className="bg-white dark:bg-[#1c1b2e] rounded-3xl p-8 shadow-sm border border-indigo-50 dark:border-white/5 relative overflow-hidden mb-8">
        <View className="absolute -top-2 -right-2 opacity-5">
          <HelpCircle size={80} color="#4c44e4" />
        </View>

        <View className="bg-indigo-50 dark:bg-indigo-900/40 self-start px-3 py-1 rounded-full mb-4">
          <Text className="text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            Question {questionNumber}
          </Text>
        </View>

        <Text className="text-xl font-bold leading-7 text-[#121121] dark:text-white">
          {question}
        </Text>
      </View>

      <Text className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1 mb-4">
        {showResult ? "Reviewing Results" : "Select the best answer"}
      </Text>

      {/* Options List */}
      {options.map((option, index) => {
        const isSelected = selectedOption?.toLowerCase() === option.label.toLowerCase();
        const isCorrect = option.label.toLowerCase() === correctAnswer.toLowerCase();
        
        // Logical states
        const showAsCorrect = showResult && isCorrect;
        const showAsWrong = showResult && isSelected && !isCorrect;
        const highlightSelection = !showResult && isSelected;

        // Container Styles
        let containerClass = 'border-white dark:border-[#1c1b2e] bg-white dark:bg-[#1c1b2e]';
        if (highlightSelection) containerClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20';
        if (showAsCorrect) containerClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10';
        if (showAsWrong) containerClass = 'border-rose-500 bg-rose-50 dark:bg-rose-900/10';

        // Indicator Circle Styles
        let circleClass = (highlightSelection) ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800';
        if (showAsCorrect) circleClass = 'bg-emerald-500';
        if (showAsWrong) circleClass = 'bg-rose-500';

        // Text Color Logic
        let textClass = 'text-[#121121] dark:text-white';
        if (highlightSelection) textClass = 'text-indigo-700 dark:text-indigo-300';
        if (showAsCorrect) textClass = 'text-emerald-700 dark:text-emerald-400';
        if (showAsWrong) textClass = 'text-rose-700 dark:text-rose-400';

        return (
          <TouchableOpacity
            key={index}
            onPress={() => !showResult && onSelect({
                questionNumber,
                selectedOption: option.label,
                correctAnswer
            })}
            disabled={showResult}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-3 shadow-sm ${containerClass}`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${circleClass}`}>
                <Text className={`font-bold ${(isSelected || showAsCorrect || showAsWrong) ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {option.label}
                </Text>
              </View>

              <View className="flex-1">
                <Text className={`font-semibold text-sm ${textClass}`}>
                  {option.value}
                </Text>
              </View>
            </View>

            <View className="ml-2">
              {showAsCorrect && <CheckCircle2 size={24} color="#10b981" />}
              {showAsWrong && <XCircle size={24} color="#f43f5e" />}
              {!showResult && (
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center 
                  ${isSelected ? 'border-indigo-600' : 'border-indigo-100 dark:border-slate-700'}`}>
                  {isSelected && <View className="w-3 h-3 rounded-full bg-indigo-600" />}
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FlashCard;