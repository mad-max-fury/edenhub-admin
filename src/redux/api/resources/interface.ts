export interface IUploadResource {
  params: { type: string };
  file: File;
}

export interface IResourceInfo {
  key: string;
  contentType: string;
  contentLength: string;
  lastModified: string;
  metadata: Record<string, string> | undefined;
}

export interface IUploadResourceInfo {
  url: string;
  key: string;
  mimetype: string;
  folder: string;
  category: string;
}
