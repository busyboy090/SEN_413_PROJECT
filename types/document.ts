export interface RecentDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface FileInfoType {
  name: string;
  size: number;
  type: string;
  uri: string;
  mimeType: string;
  fileBlob?: any;
}