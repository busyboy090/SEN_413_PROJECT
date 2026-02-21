import React from "react";
import { History } from "lucide-react-native";
import { Text, View } from "react-native";
import DocumentItem from "./DocumentItem";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition, FadeOut } from "react-native-reanimated";

function RecentUploads() {
  const { recentDocs, deleteFromHistory } = useFileProcessor();

  return (
    <View className="pb-10">
      <View className="flex-row items-center gap-2 mb-4 px-1">
        <History size={14} color="#94a3b8" />
        <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Recent Uploads
        </Text>
      </View>

      {recentDocs.length > 0 ? (
        recentDocs.map((doc) => (
          <Animated.View 
            key={doc.id} 
            layout={LinearTransition} 
            exiting={FadeOut.duration(300)}
            className="mb-3"
          >
            <Swipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={80}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  deleteFromHistory(doc.id);
                }
              }}
              renderRightActions={() => <View className="w-20" />}
            >
              <DocumentItem
                title={doc.name}
                info={`${doc.date} • ${doc.size}`}
                type={doc.type === "pdf" ? "pdf" : "doc"}
              />
            </Swipeable>
          </Animated.View>
        ))
      ) : (
        <View className="py-8 items-center border border-slate-100 dark:border-slate-800 rounded-xl">
          <Text className="text-slate-400 text-xs italic">
            No recent uploads found
          </Text>
        </View>
      )}
    </View>
  );
}

export default RecentUploads;