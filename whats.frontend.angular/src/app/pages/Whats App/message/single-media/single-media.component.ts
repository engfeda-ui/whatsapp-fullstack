import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesService } from '../message.service';
import { DeviceService } from '../../device/device.service';
import { IDevice } from '../../device/IDevice';
import { finalize } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '@env/environment';
@Component({
    selector: 'app-single-media',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, DropdownModule, ToastModule, ProgressSpinnerModule, CardModule, DividerModule, MessageModule, MessagesModule, FileUploadModule],
    templateUrl: './single-media.component.html',
    styleUrl: './single-media.component.scss',
    providers: [MessageService]
})
export class SingleMediaComponent implements OnInit {
    mediaForm: FormGroup;
    devices: IDevice[] = [];
    onlineDevices: IDevice[] = [];
    isLoading = false;
    isSending = false;
    success = false;
    error = '';
    selectedFile: File | null = null;
    filePreview: string | null = null;
    fileType: string = '';
    maxFileSize = 5 * 1024 * 1024; // 5MB
    isDragOver = false;

    constructor(
        private fb: FormBuilder,
        private messagesService: MessagesService,
        private deviceService: DeviceService,
        private messageService: MessageService
    ) {
        this.mediaForm = this.fb.group({
            number: ['', [Validators.required]],
            message: ['', [Validators.required]],
            deviceId: ['', [Validators.required]],
            fileNameAppearsInWhatsMessage: ['', []]
        });
    }

    ngOnInit(): void {
        this.loadDevices();
    }

    loadDevices(): void {
        this.isLoading = true;
        this.deviceService
            .getAllDevices()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (response) => {
                    if (response.isSuccess) {
                        this.devices = response.data;
                        this.onlineDevices = this.devices.filter((device) => device.isOnline);

                        if (this.onlineDevices.length > 0) {
                            this.mediaForm.patchValue({
                                deviceId: this.onlineDevices[0].id
                            });
                        }
                    } else {
                        this.error = response.message || 'فشل في تحميل الأجهزة';
                    }
                },
                error: (err) => {
                    this.error = 'حدث خطأ أثناء تحميل الأجهزة. يرجى المحاولة مرة أخرى.';
                }
            });
    }

    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        if (event.dataTransfer?.files.length) {
            const file = event.dataTransfer.files[0];
            // Check file size
            if (file.size > this.maxFileSize) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: `حجم الملف كبير جدًا. الحد الأقصى هو ${this.maxFileSize / 1024 / 1024} ميجابايت`,
                    life: 5000
                });
                return;
            }

            const fileType = file.type.split('/')[0];
            const isPdf = file.type === 'application/pdf';
            if (!['image', 'video', 'audio'].includes(fileType) && !isPdf) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'نوع الملف غير مدعوم. يرجى اختيار صورة أو فيديو أو ملف صوتي أو PDF',
                    life: 5000
                });
                return;
            }

            this.processFile(file);
        }
    }

    processFile(file: File): void {
        this.selectedFile = file;
        this.fileType = file.type.split('/')[0];

        if (!this.mediaForm.get('fileNameAppearsInWhatsMessage')?.value) {
            this.mediaForm.patchValue({
                fileNameAppearsInWhatsMessage: file.name
            });
        }

        // Create preview for images
        if (this.fileType === 'image') {
            const reader = new FileReader();
            reader.onload = () => {
                this.filePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        } else {
            this.filePreview = null;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'تم',
            detail: 'تم اختيار الملف بنجاح',
            life: 3000
        });
    }

    clearFile(): void {
        this.selectedFile = null;
        this.filePreview = null;
        this.fileType = '';
    }

    sendMediaMessage(): void {
        if (this.mediaForm.invalid || !this.selectedFile) {
            return;
        }

        this.isSending = true;
        this.success = false;
        this.error = '';

        const formData = new FormData();
        formData.append('Number', this.mediaForm.value.number);
        formData.append('Message', this.mediaForm.value.message);
        formData.append('File', this.selectedFile);

        if (this.mediaForm.value.fileNameAppearsInWhatsMessage) {
            formData.append('FileNameAppearsInWhatsMessage', this.mediaForm.value.fileNameAppearsInWhatsMessage);
        }

        const deviceId = this.mediaForm.value.deviceId;

        this.messagesService
            .sendMediaMessage(formData, deviceId)
            .pipe(finalize(() => (this.isSending = false)))
            .subscribe({
                next: (response) => {
                    if (response.isSuccess) {
                        this.success = true;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'نجاح',
                            detail: 'تم إرسال الرسالة والملف بنجاح!',
                            life: 3000
                        });
                        this.mediaForm.reset({
                            deviceId: deviceId
                        });
                        this.clearFile();
                    } else {
                        this.error = response.message || 'فشل في إرسال الرسالة والملف';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'خطأ',
                            detail: this.error,
                            life: 5000
                        });
                    }
                },
                error: (err) => {
                    this.error = 'حدث خطأ أثناء إرسال الرسالة والملف. يرجى المحاولة مرة أخرى.';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ',
                        detail: this.error,
                        life: 5000
                    });
                }
            });
    }
}
