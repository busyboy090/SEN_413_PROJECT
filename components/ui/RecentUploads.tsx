import { useFileProcessor } from "@/hooks/useFileProcessor";
import { FileInfoType } from "@/types/document";
import { History } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import DocumentItem from "./DocumentItem";

interface RecentUploadsProps {
  uploadDocument: (document: FileInfoType) => void;
}

function RecentUploads({ uploadDocument }: RecentUploadsProps) {
  const { recentDocs, deleteFromHistory } = useFileProcessor();
  // Track the ID of the document that has an open menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <View className="pb-12">
      <View className="flex-row items-center gap-2 mb-4 px-1">
        <History size={14} color="#94a3b8" />
        <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Recent Uploads
        </Text>
      </View>

      <View className="flex-col gap-3">
        {recentDocs.length > 0 ? (
          recentDocs.map((doc) => (
            <DocumentItem
              key={`recent-doc-${doc.id}`}
              title={doc.name}
              info={`${doc.date} • ${doc.size}`}
              type={doc.type === "pdf" ? "pdf" : "doc"}
              showMenu={activeMenuId === doc.id}
              onToggleMenu={() =>
                setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
              }
              onCloseMenu={() => setActiveMenuId(null)}
              onUpload={() =>
                uploadDocument({
                  name: doc.name,
                  size: parseFloat(doc.size.split(" ")?.[0]), // Ensure size is a number
                  type: doc.type,
                  uri: doc.uri,
                  mimeType: doc.mimeType,
                  fileBlob: doc.file,
                  file: doc.file,
                })
              }
              onDelete={() => deleteFromHistory(doc.id)}
            />
          ))
        ) : (
          <View className="py-8 items-center border border-slate-100 dark:border-slate-800 rounded-xl">
            <Text className="text-slate-400 text-xs italic">
              No recent uploads
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default RecentUploads;
