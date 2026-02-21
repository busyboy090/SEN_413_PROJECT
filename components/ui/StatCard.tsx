import React from "react";
import { Text, View } from "react-native";

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <View className="flex-1 bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 rounded-3xl p-4 items-center shadow-sm">
      <View
        className={`w-11 h-11 items-center justify-center rounded-2xl ${bgColor} mb-3`}
      >
        {icon}
      </View>
      <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </Text>
      <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </Text>
    </View>
  );
}

export default StatCard;
