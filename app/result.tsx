import StatCard from "@/components/ui/StatCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Timer as TimerIcon,
  X,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Result() {
  // Added timeTaken to search params
  const { userSelection, questions, timeTaken } = useLocalSearchParams<{
    userSelection: string;
    questions: string;
    timeTaken: string;
  }>();

  const router = useRouter();

  const parsedQuestions =
    typeof questions === "string" ? JSON.parse(questions) : questions || [];

  const stats = useMemo(() => {
    const data =
      typeof userSelection === "string" ? JSON.parse(userSelection) : [];
    let correct = 0;
    let total = parsedQuestions.length;

    data.forEach((item: any) => {
      if (item.selectedOption === item.correctAnswer) {
        correct++;
      }
    });

    const score = total > 0 ? correct / total : 0;
    return {
      correct,
      wrong: total - correct,
      total,
      score,
    };
  }, [userSelection, parsedQuestions.length]);

  const size = 240;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(stats.score, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [stats.score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progress.value * circumference,
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#121121]">
      {/* Header */}
      <View className="flex-row items-center justify-between py-5 px-6 bg-white/50 dark:bg-[#121121]/50">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/",
            })
          }
          className="w-10 h-10 rounded-full items-center justify-center bg-indigo-50"
        >
          <X size={20} color="#64748b" />
        </TouchableOpacity>

        <Text className="text-lg font-extrabold tracking-tight dark:text-white text-slate-900">
          Quiz Results
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {/* Progress Visualization */}
        <View className="items-center justify-center py-10">
          <View className="items-center justify-center">
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#4c44e4"
                strokeWidth={strokeWidth}
                strokeOpacity={0.1}
                fill="transparent"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#4c44e4"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>

            <View className="absolute items-center">
              <Text className="text-5xl font-extrabold tracking-tighter text-[#4c44e4]">
                {Math.round(stats.score * 100)}%
              </Text>
              <Text className="text-xs font-bold text-[#4c44e4]/60 uppercase tracking-widest">
                Mastery Score
              </Text>
            </View>
          </View>

          <View className="mt-8 items-center px-4">
            <Text className="text-2xl font-bold dark:text-white text-slate-900">
              {stats.score >= 0.8
                ? "Incredible job!"
                : stats.score >= 0.5
                  ? "Good effort!"
                  : "Keep practicing!"}
            </Text>
            <Text className="mt-2 text-sm text-[#656487] font-medium text-center">
              You got {stats.correct} out of {stats.total} questions correct.
            </Text>
          </View>
        </View>

        {/* Stats Grid - Now with Dynamic Timer Data */}
        <View className="flex-row gap-3">
          <StatCard
            icon={<CheckCircle2 size={18} color="#16a34a" />}
            label="Correct"
            value={stats.correct.toString()}
            bgColor="bg-green-100 dark:bg-green-500/10"
          />
          <StatCard
            icon={<XCircle size={18} color="#dc2626" />}
            label="Wrong"
            value={stats.wrong.toString()}
            bgColor="bg-red-100 dark:bg-red-500/10"
          />
          <StatCard
            icon={<TimerIcon size={18} color="#2563eb" />}
            label="Time"
            value={timeTaken || "0:00"}
            bgColor="bg-blue-100 dark:bg-blue-500/10"
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-white/90 dark:bg-[#121121]/90 border-t border-black/5">
        <View className="gap-3">
          <TouchableOpacity
            className="h-14 w-full flex-row items-center justify-center rounded-2xl bg-[#4c44e4]"
            style={styles.primaryShadow}
            onPress={() => {
              router.push({
                pathname: "/flashcardsession",
                params: { questions, userSelection, mode: "result", timeTaken },
              });
            }}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-lg mr-2">
              Review Answers
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-14 w-full flex-row items-center justify-center rounded-2xl border-2 border-[#4c44e4]/20 bg-white dark:bg-white/5"
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: "/flashcardsession",
                params: { questions },
              });
            }}
          >
            <RotateCcw size={20} color="#4c44e4" style={{ marginRight: 8 }} />
            <Text className="text-[#4c44e4] font-bold text-lg">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  primaryShadow: {
    boxShadow: "0px 4px 8px rgba(76, 68, 228, 0.3)",
    elevation: 5,
  },
});

export default Result;
