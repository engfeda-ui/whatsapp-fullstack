import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DeviceService } from '../device.service';
import { ApiResponse } from '@/core/ApiResponse';
import { IDevice } from '../IDevice';

@Component({
    selector: 'p-device-action',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
    providers: [MessageService],
    templateUrl: './device-action.component.html',
    styleUrl: './device-action.component.scss'
})
export class DeviceActionComponent implements OnInit {
    deviceForm: FormGroup;
    isEditMode: boolean = false;
    deviceId: number | null = null;
    loading: boolean = false;
    submitting: boolean = false;
    apiKey: string = '';
    subscriptionId: number | null = null;
    isDeviceOnline: boolean = false;

    private fb: FormBuilder = inject(FormBuilder);
    private deviceService: DeviceService = inject(DeviceService);
    private messageService: MessageService = inject(MessageService);
    private dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
    private config: DynamicDialogConfig = inject(DynamicDialogConfig);

    constructor() {
        this.subscriptionId = this.config.data.subscriptionId;

        this.deviceForm = this.fb.group({
            nameAr: ['', [Validators.required]],
            nameEn: ['', [Validators.required]],
            whatsNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            subscriptionId: [this.subscriptionId, [Validators.required]]
        });
    }

    ngOnInit() {
        const device = this.config.data.device;

        if (device) {
            this.isEditMode = true;
            this.deviceId = device.id;
            this.isDeviceOnline = device.isOnline || false;

            this.deviceForm.patchValue({
                nameAr: device.nameAr,
                nameEn: device.nameEn,
                whatsNumber: device.whatsNumber
            });

            if (this.isEditMode && this.isDeviceOnline) {
                this.deviceForm.get('whatsNumber')?.disable();
            } else {
                this.deviceForm.get('whatsNumber')?.enable();
            }

            this.apiKey = device.newDeviceApiKey || '';
        }
    }

    onSubmit() {
        if (this.deviceForm.invalid) {
            Object.keys(this.deviceForm.controls).forEach((key) => {
                const control = this.deviceForm.get(key);

                if (control) {
                    control.markAsTouched();
                }
            });

            return;
        }

        this.submitting = true;
        const deviceData: IDevice = this.deviceForm.value;

        if (this.isEditMode && this.deviceId) {
            deviceData.id = this.deviceId;
            this.deviceService.updateDevice(deviceData).subscribe({
                next: (response: ApiResponse<IDevice | null>) => {
                    this.handleResponse(response, 'تم تحديث الجهاز بنجاح');
                },
                error: (error: unknown) => {
                    this.handleError(error);
                }
            });
        } else {
            this.deviceService.createDevice(deviceData).subscribe({
                next: (response: ApiResponse<IDevice | null>) => {
                    this.handleResponse(response, 'تم إنشاء الجهاز بنجاح');

                    if (response.isSuccess && response.data && response.data.newDeviceApiKey) {
                        this.apiKey = response.data.newDeviceApiKey;
                    }
                },
                error: (error: unknown) => {
                    this.handleError(error);
                }
            });
        }
    }

    private handleResponse(response: ApiResponse<IDevice | null>, successMessage: string) {
        this.submitting = false;

        if (response.isSuccess) {
            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: successMessage });
            this.dialogRef.close(response.data);
        } else {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: response.message || 'حدث خطأ أثناء حفظ الجهاز' });
        }
    }

    private handleError(error: unknown) {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الاتصال بالخادم' });
        this.submitting = false;
    }

    cancel() {
        this.dialogRef.close();
    }

    copyApiKey() {
        navigator.clipboard.writeText(this.apiKey).then(
            () => {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم نسخ مفتاح API إلى الحافظة' });
            },
            (err) => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'لم يتم نسخ مفتاح API' });
            }
        );
    }
}
