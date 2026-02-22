export interface RecentDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  mimeType: string;
  uri: string;
  file?: any;
}

export interface FileInfoType {
  name: string;
  size: number;
  type: string;
  uri: string;
  mimeType: string;
  fileBlob?: any;
  file: any;
}