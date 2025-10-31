import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesService } from '../message.service';
import { DeviceService } from '../../device/device.service';
import { IDevice } from '../../device/IDevice';
import { finalize } from 'rxjs';

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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'p-multi-message',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, DropdownModule, ToastModule, ProgressSpinnerModule, CardModule, DividerModule, MessageModule, MessagesModule, InputGroupModule, InputGroupAddonModule],
    templateUrl: './multi-message.component.html',
    styleUrl: './multi-message.component.scss',
    providers: [MessageService]
})
export class MultiMessageComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly messagesService = inject(MessagesService);
    private readonly deviceService = inject(DeviceService);
    private readonly messageService = inject(MessageService);

    multiMessageForm: FormGroup;
    devices: IDevice[] = [];
    onlineDevices: IDevice[] = [];
    isLoading = false;
    isSending = false;
    success = false;
    error = '';
    phoneNumbers: string[] = [];

    constructor() {
        this.multiMessageForm = this.fb.group({
            phoneNumbers: [[], [Validators.required]],
            message: ['', [Validators.required]],
            deviceId: ['', [Validators.required]]
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
                            this.multiMessageForm.patchValue({
                                deviceId: this.onlineDevices[0].id
                            });
                        }
                    } else {
                        this.error = response.message || 'فشل في تحميل الأجهزة';
                    }
                },
                error: (_err) => {
                    this.error = 'حدث خطأ أثناء تحميل الأجهزة. يرجى المحاولة مرة أخرى.';
                }
            });
    }

    onAddNumber(event: any): void {
        if (event.key === 'Enter' && event.target.value) {
            this.addPhoneNumber(event.target.value);
            event.target.value = '';
            event.preventDefault();
        }
    }

    addMultipleNumbers(text: string): void {
        if (!text.trim()) {
            return;
        }

        const numbers = text
            .split(/[\n,]/)
            .map((n) => n.trim())
            .filter((n) => n !== '');

        if (numbers.length === 0) {
            return;
        }

        let validCount = 0;
        let invalidCount = 0;
        let duplicateCount = 0;

        for (const number of numbers) {
            if (!/^\d+$/.test(number)) {
                invalidCount++;
                continue;
            }

            if (this.phoneNumbers.includes(number)) {
                duplicateCount++;
                continue;
            }

            this.phoneNumbers.push(number);
            validCount++;
        }

        this.multiMessageForm.patchValue({ phoneNumbers: this.phoneNumbers });

        if (validCount > 0) {
            this.messageService.add({
                severity: 'success',
                summary: 'تم',
                detail: `تم إضافة ${validCount} رقم بنجاح`,
                life: 3000
            });
        }

        if (invalidCount > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: `تم تجاهل ${invalidCount} رقم غير صالح (يجب أن تحتوي على أرقام فقط)`,
                life: 3000
            });
        }

        if (duplicateCount > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'تنبيه',
                detail: `تم تجاهل ${duplicateCount} رقم مكرر`,
                life: 3000
            });
        }
    }

    addPhoneNumber(value: string): void {
        const number = value.trim();

        if (!number) {
            return;
        }

        if (!/^\d+$/.test(number)) {
            this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'يجب أن يحتوي رقم الهاتف على أرقام فقط',
                life: 3000
            });

            return;
        }

        if (!this.phoneNumbers.includes(number)) {
            this.phoneNumbers.push(number);
            this.multiMessageForm.patchValue({ phoneNumbers: this.phoneNumbers });

            this.messageService.add({
                severity: 'success',
                summary: 'تم',
                detail: 'تم إضافة الرقم بنجاح',
                life: 2000
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'تنبيه',
                detail: 'هذا الرقم موجود بالفعل في القائمة',
                life: 2000
            });
        }
    }

    onRemoveNumber(index: number): void {
        this.phoneNumbers.splice(index, 1);
        this.multiMessageForm.patchValue({ phoneNumbers: this.phoneNumbers });
    }

    onChipRemove(number: string): void {
        const index = this.phoneNumbers.indexOf(number);

        if (index !== -1) {
            this.phoneNumbers.splice(index, 1);
            this.multiMessageForm.patchValue({ phoneNumbers: this.phoneNumbers });
        }
    }

    sendMultiMessage(): void {
        if (this.multiMessageForm.invalid) {
            return;
        }

        this.isSending = true;
        this.success = false;
        this.error = '';

        const deviceId = this.multiMessageForm.value.deviceId;
        const message = this.multiMessageForm.value.message;
        const numbers = this.phoneNumbers;

        this.messagesService
            .sendMessageToMultipleNumbers(deviceId, numbers, message)
            .pipe(finalize(() => (this.isSending = false)))
            .subscribe({
                next: (response) => {
                    if (response.isSuccess) {
                        this.success = true;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'نجاح',
                            detail: 'تم إرسال الرسالة إلى جميع الأرقام بنجاح!',
                            life: 3000
                        });
                        this.multiMessageForm.patchValue({
                            message: '',
                            phoneNumbers: []
                        });
                        this.phoneNumbers = [];
                    } else {
                        this.error = response.message || 'فشل في إرسال الرسالة';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'خطأ',
                            detail: this.error,
                            life: 5000
                        });
                    }
                },
                error: (_err) => {
                    this.error = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
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
