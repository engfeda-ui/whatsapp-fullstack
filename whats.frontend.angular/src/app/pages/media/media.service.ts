import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MediaFile, MediaUploadOptions, MediaLibraryFilter, MediaFolder, MediaStatistics, MediaProcessing, ThumbnailOptions, BulkOperation } from './types/media.types';
import { ApiResponse, QueryOptions } from '../../core/ApiResponse';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private readonly apiUrl = `${environment.apiUrl}/media`;
    private uploadProgress$ = new Subject<{ id: string; progress: number }>();

    constructor(private http: HttpClient) {}

    /**
     * Get all media files
     */
    getMediaFiles(filter?: MediaLibraryFilter, options?: QueryOptions): Observable<ApiResponse<MediaFile[]>> {
        let params = new HttpParams();

        if (filter) {
            if (filter.mimeType) {params = params.set('mimeType', filter.mimeType);}

            if (filter.tags) {params = params.set('tags', filter.tags.join(','));}

            if (filter.search) {params = params.set('search', filter.search);}

            if (filter.minSize) {params = params.set('minSize', filter.minSize.toString());}

            if (filter.maxSize) {params = params.set('maxSize', filter.maxSize.toString());}
        }

        if (options) {
            if (options.pageNumber) {params = params.set('page', options.pageNumber.toString());}

            if (options.pageSize) {params = params.set('size', options.pageSize.toString());}
        }

        return this.http.get<ApiResponse<MediaFile[]>>(this.apiUrl, { params });
    }

    /**
     * Get media file by ID
     */
    getMediaFile(id: string | number): Observable<MediaFile> {
        return this.http.get<ApiResponse<MediaFile>>(`${this.apiUrl}/${id}`).pipe(map((response) => response.data));
    }

    /**
     * Upload media file
     */
    uploadMedia(options: MediaUploadOptions): Observable<HttpEvent<MediaFile>> {
        const formData = new FormData();

        formData.append('file', options.file);

        if (options.tags) {
            formData.append('tags', JSON.stringify(options.tags));
        }

        if (options.description) {
            formData.append('description', options.description);
        }

        if (options.generateThumbnail !== undefined) {
            formData.append('generateThumbnail', options.generateThumbnail.toString());
        }

        if (options.compress !== undefined) {
            formData.append('compress', options.compress.toString());
        }

        if (options.quality) {
            formData.append('quality', options.quality.toString());
        }

        return this.http.post<MediaFile>(this.apiUrl, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    /**
     * Upload multiple files
     */
    uploadMultiple(files: File[]): Observable<MediaFile[]> {
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        return this.http.post<ApiResponse<MediaFile[]>>(`${this.apiUrl}/bulk`, formData).pipe(map((response) => response.data));
    }

    /**
     * Delete media file
     */
    deleteMedia(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Update media file
     */
    updateMedia(id: string | number, data: Partial<MediaFile>): Observable<MediaFile> {
        return this.http.put<ApiResponse<MediaFile>>(`${this.apiUrl}/${id}`, data).pipe(map((response) => response.data));
    }

    /**
     * Generate thumbnail
     */
    generateThumbnail(id: string | number, options?: ThumbnailOptions): Observable<string> {
        return this.http.post<ApiResponse<{ url: string }>>(`${this.apiUrl}/${id}/thumbnail`, options || {}).pipe(map((response) => response.data.url));
    }

    /**
     * Get media statistics
     */
    getStatistics(): Observable<MediaStatistics> {
        return this.http.get<ApiResponse<MediaStatistics>>(`${this.apiUrl}/statistics`).pipe(map((response) => response.data));
    }

    /**
     * Get folders
     */
    getFolders(): Observable<MediaFolder[]> {
        return this.http.get<ApiResponse<MediaFolder[]>>(`${this.apiUrl}/folders`).pipe(map((response) => response.data));
    }

    /**
     * Create folder
     */
    createFolder(data: Omit<MediaFolder, 'id' | 'createdAt'>): Observable<MediaFolder> {
        return this.http.post<ApiResponse<MediaFolder>>(`${this.apiUrl}/folders`, data).pipe(map((response) => response.data));
    }

    /**
     * Move files to folder
     */
    moveToFolder(fileIds: (string | number)[], folderId: string | number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/move`, { fileIds, folderId });
    }

    /**
     * Perform bulk operation
     */
    bulkOperation(operation: BulkOperation): Observable<{
        success: number;
        failed: number;
    }> {
        return this.http.post<ApiResponse<{ success: number; failed: number }>>(`${this.apiUrl}/bulk-operation`, operation).pipe(map((response) => response.data));
    }

    /**
     * Search media files
     */
    searchMedia(query: string): Observable<MediaFile[]> {
        return this.http
            .get<ApiResponse<MediaFile[]>>(`${this.apiUrl}/search`, {
                params: { q: query }
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Get upload progress observable
     */
    getUploadProgress(): Observable<{ id: string; progress: number }> {
        return this.uploadProgress$.asObservable();
    }

    /**
     * Compress image
     */
    compressImage(id: string | number, quality: number): Observable<MediaFile> {
        return this.http.post<ApiResponse<MediaFile>>(`${this.apiUrl}/${id}/compress`, { quality }).pipe(map((response) => response.data));
    }

    /**
     * Convert media format
     */
    convertFormat(id: string | number, targetFormat: string): Observable<MediaFile> {
        return this.http
            .post<ApiResponse<MediaFile>>(`${this.apiUrl}/${id}/convert`, {
                targetFormat
            })
            .pipe(map((response) => response.data));
    }

    /**
     * Get file size formatted
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) {return '0 Bytes';}

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Validate file type
     */
    isValidFileType(file: File, allowedTypes: string[]): boolean {
        return allowedTypes.some((type) => {
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.replace('/*', ''));
            }

            return file.type === type;
        });
    }

    /**
     * Validate file size
     */
    isValidFileSize(file: File, maxSizeMB: number): boolean {
        const maxBytes = maxSizeMB * 1024 * 1024;

        return file.size <= maxBytes;
    }

    /**
     * Get file extension
     */
    getFileExtension(filename: string): string {
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    }

    /**
     * Get MIME type icon
     */
    getMimeTypeIcon(mimeType: string): string {
        if (mimeType.startsWith('image/')) {return 'pi-image';}

        if (mimeType.startsWith('video/')) {return 'pi-video';}

        if (mimeType.startsWith('audio/')) {return 'pi-volume-up';}

        if (mimeType.includes('pdf')) {return 'pi-file-pdf';}

        if (mimeType.includes('word')) {return 'pi-file-word';}

        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {return 'pi-file-excel';}

        return 'pi-file';
    }

    /**
     * Create share link
     */
    createShareLink(
        mediaId: string | number,
        options?: {
            expiresAt?: Date;
            password?: string;
            downloadLimit?: number;
        }
    ): Observable<string> {
        return this.http.post<ApiResponse<{ url: string }>>(`${this.apiUrl}/${mediaId}/share`, options || {}).pipe(map((response) => response.data.url));
    }

    /**
     * Export media files
     */
    exportMedia(fileIds: (string | number)[]): Observable<Blob> {
        return this.http.post(`${this.apiUrl}/export`, { fileIds }, { responseType: 'blob' });
    }
}
