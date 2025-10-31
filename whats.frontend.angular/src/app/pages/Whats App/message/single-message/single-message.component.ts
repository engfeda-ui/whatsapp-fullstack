import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesService } from '../message.service';

import { Imessage } from '../Imessage';
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
import { MessageService, MessageService as PrimeMessageService } from 'primeng/api';

@Component({
    selector: 'app-single-message',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, DropdownModule, ToastModule, ProgressSpinnerModule, CardModule, DividerModule, MessageModule, MessagesModule],
    templateUrl: './single-message.component.html',
    styleUrl: './single-message.component.scss',
    providers: [PrimeMessageService]
})
export class SingleMessageComponent implements OnInit {
    messageForm: FormGroup;
    devices: IDevice[] = [];
    onlineDevices: IDevice[] = [];
    isLoading = false;
    isSending = false;
    success = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private messagesService: MessagesService,
        private deviceService: DeviceService,
        private messageService: MessageService
    ) {
        this.messageForm = this.fb.group({
            number: ['', [Validators.required]],
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
                            this.messageForm.patchValue({
                                deviceId: this.onlineDevices[0].id
                            });
                        }
                    } else {
                        this.error = response.message || 'Failed to load devices';
                    }
                },
                error: (err) => {
                    this.error = 'Error loading devices. Please try again.';
                }
            });
    }

    sendMessage(): void {
        if (this.messageForm.invalid) {
            return;
        }

        const message: Imessage = {
            number: this.messageForm.value.number,
            message: this.messageForm.value.message
        };
        const deviceId = this.messageForm.value.deviceId;

        this.isSending = true;
        this.success = false;
        this.error = '';

        this.messagesService
            .sendMessage(message, deviceId)
            .pipe(finalize(() => (this.isSending = false)))
            .subscribe({
                next: (response) => {
                    if (response.isSuccess) {
                        this.success = true;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'نجاح',
                            detail: 'تم إرسال الرسالة بنجاح!',
                            life: 3000
                        });
                        this.messageForm.reset({
                            deviceId: deviceId
                        });
                    } else {
                        this.error = response.message || 'Failed to send message';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'خطأ',
                            detail: this.error,
                            life: 5000
                        });
                    }
                },
                error: (err) => {
                    this.error = 'Error sending message. Please try again.';
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
