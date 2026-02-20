import FlashCard from '@/components/ui/FlashCard';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    ArrowRight,
    MoreHorizontal,
    CheckCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    flashcardsession: { questions: any[] };
};

interface userSelectionType {
    questionNumber: number;
    selectedOption: string;
    correctAnswer: string;
}

const FlashcardSession = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'flashcardsession'>>();
    const { questions } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userSelection, setUserSelection] = useState<userSelectionType[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const total = questions.length;
    const isLastQuestion = currentIndex === total - 1;
    const progressWidth = ((currentIndex + 1) / total) * 100;
    const currentData = questions[currentIndex];

    // Helper to find selection for the current question
    const getCurrentSelection = () => {
        return userSelection.find((s) => s.questionNumber === currentIndex + 1)?.selectedOption || null;
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setCurrentIndex(0);
        Alert.alert("Session Complete", "You've reached the end of the deck!");
    }

    return (
        <SafeAreaView className="flex-1 bg-[#f6f6f8] dark:bg-[#121121]">
            <StatusBar barStyle="dark-content" />

            {/* Navigation Header */}
            <View className="px-4 py-3 flex-row items-center justify-between bg-white dark:bg-[#121121] border-b border-primary/10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-full items-center justify-center bg-indigo-50"
                >
                    <ArrowLeft size={20} color="#4c44e4" />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-[10px] tracking-widest font-bold text-indigo-400 uppercase">Study Session</Text>
                    <Text className="text-sm font-extrabold text-[#121121] dark:text-white">
                        {currentData?.subject || 'Flashcards'}
                    </Text>
                </View>

                <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
                    <MoreHorizontal size={24} color="#4c44e4" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View className="px-6 py-4 bg-white dark:bg-[#121121]">
                <div className="flex-row justify-between items-center mb-2">
                    <Text className="text-[11px] font-bold text-indigo-400 uppercase">Progress</Text>
                    <Text className="text-[11px] font-bold text-indigo-600">{currentIndex + 1} / {total}</Text>
                </div>
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
                correctAnswer={currentData.correctAnswer}
                selectedOption={getCurrentSelection()}
                onSelect={(selection: userSelectionType) => {
                    setUserSelection((prev) => {
                        const filtered = prev.filter((s) => s.questionNumber !== selection.questionNumber);
                        return [...filtered, selection];
                    });
                }}
                showResult={isSubmitted}
            />

            {/* Footer Action */}
            <View className="p-6 pb-10 bg-white dark:bg-[#121121] flex-row items-center justify-between gap-4">

                {/* Previous Question - Specified width: 35% of container */}
                <TouchableOpacity
                    onPress={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
                    activeOpacity={0.8}
                    className={`h-12 w-15 rounded-full flex-row items-center justify-center border border-indigo-100 bg-white dark:bg-[#1c1b2e] ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'
                        }`}
                    disabled={currentIndex === 0}
                >
                    <ArrowLeft size={18} color="#4c44e4" />
                    <Text className="text-indigo-600 font-bold ml-2 text-sm">Back</Text>
                </TouchableOpacity>

                {/* Next Question - Specified width: 60% of container */}
                <TouchableOpacity
                    onPress={isLastQuestion && !isSubmitted ? handleSubmit : handleNext}
                    activeOpacity={0.8}
                    className={`h-12 w-[60%] rounded-full flex-row items-center justify-center shadow-lg ${isLastQuestion && !isSubmitted ? 'bg-emerald-600 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-300'
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