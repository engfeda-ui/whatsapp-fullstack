export interface MediaFile {
    id: string | number;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    storageProvider: 'local' | 's3' | 'azure' | 'cloudinary';
    storagePath: string;
    uploadedBy: string | number;
    uploadedAt: string | Date;
    tags: string[];
    metadata: MediaMetadata;
    usageCount: number;
    lastUsed?: string | Date;
}

export interface MediaMetadata {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
    bitrate?: number;
    codec?: string;
    dimensions?: string;
}

export interface MediaUploadOptions {
    file: File;
    tags?: string[];
    description?: string;
    generateThumbnail?: boolean;
    compress?: boolean;
    quality?: number;
}

export interface MediaLibraryFilter {
    mimeType?: string;
    tags?: string[];
    uploadedBy?: string | number;
    dateRange?: {
        startDate: string | Date;
        endDate: string | Date;
    };
    search?: string;
    minSize?: number;
    maxSize?: number;
}

export interface MediaFolder {
    id: string | number;
    name: string;
    description?: string;
    parentId?: string | number;
    filesCount: number;
    size: number;
    createdAt: string | Date;
    color?: string;
    icon?: string;
}

export interface MediaStatistics {
    totalFiles: number;
    totalSize: number;
    byType: TypeBreakdown[];
    byMonth: MonthlyUsage[];
    storageUsed: number;
    storageLimit: number;
    averageFileSize: number;
}

export interface TypeBreakdown {
    type: string;
    count: number;
    size: number;
    percentage: number;
}

export interface MonthlyUsage {
    month: string;
    uploads: number;
    size: number;
}

export interface MediaProcessing {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    operation: 'upload' | 'compress' | 'thumbnail' | 'convert';
    error?: string;
}

export interface ThumbnailOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageTransformOptions {
    resize?: { width: number; height: number };
    crop?: { x: number; y: number; width: number; height: number };
    rotate?: number;
    flip?: 'horizontal' | 'vertical';
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

export interface BulkOperation {
    operation: 'delete' | 'move' | 'tag' | 'export';
    fileIds: (string | number)[];
    targetFolderId?: string | number;
    tags?: string[];
}

export interface MediaShareLink {
    id: string;
    mediaId: string | number;
    url: string;
    expiresAt?: string | Date;
    password?: boolean;
    downloadLimit?: number;
    downloadsCount: number;
    createdAt: string | Date;
}
