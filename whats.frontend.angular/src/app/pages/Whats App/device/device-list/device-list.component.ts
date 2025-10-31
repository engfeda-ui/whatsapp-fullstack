import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeviceService } from '../device.service';
import { DeviceActionComponent } from '../device-action/device-action.component';
import { IDevice } from '../IDevice';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayPanel } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressBarModule } from 'primeng/progressbar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-device-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, MenuModule, ToastModule, ConfirmDialogModule, OverlayPanelModule, InputTextModule, CardModule, TagModule, ToolbarModule, ProgressBarModule, DynamicDialogModule, DialogModule, TooltipModule],
    providers: [MessageService, ConfirmationService, DialogService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './device-list.component.html',
    styleUrl: './device-list.component.scss'
})
export class DeviceListComponent implements OnInit {
    @ViewChild('op') overlayPanel!: OverlayPanel;

    devices: IDevice[] = [];
    filteredDevices: IDevice[] = [];
    loading: boolean = true;
    error: boolean = false;
    errorMessage: string = '';
    retryCount: number = 0;
    maxRetries: number = 3;
    menuItems: MenuItem[] = [];
    selectedDevice: IDevice | null = null;
    dialogRef: DynamicDialogRef | undefined;
    currentDevice: IDevice | null = null;
    viewMode: 'grid' | 'table' = 'grid';
    searchTerm: string = '';
    detailsDialog: boolean = false;
    apiKeyDialog: boolean = false;
    qrCodeDialog: boolean = false;
    qrCodeImage: string | null = null;
    qrCodeLoading: boolean = false;

    constructor(
        private deviceService: DeviceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.getMenuItems();
        this.loadDevices();
    }

    setCurrentDevice(device: IDevice, event: Event, menu: any) {
        this.currentDevice = device;
        menu.toggle(event);
    }

    loadDevices() {
        this.loading = true;
        this.error = false;
        this.deviceService.getAllDevices().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.devices = response.data;
                    this.filteredDevices = [...this.devices];
                } else {
                    this.error = true;
                    this.errorMessage = response.message || 'حدث خطأ أثناء تحميل الأجهزة';
                    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: this.errorMessage });
                }
                this.loading = false;
            },
            error: (error) => {
                this.error = true;
                this.loading = false;

                if (error.status === 0) {
                    this.errorMessage = 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت';
                } else if (error.status === 401) {
                    this.errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                } else if (error.status === 403) {
                    this.errorMessage = 'ليس لديك صلاحية للوصول إلى هذه البيانات';
                } else {
                    this.errorMessage = 'حدث خطأ أثناء تحميل الأجهزة';
                }

                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: this.errorMessage });

                // Auto retry logic
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    setTimeout(() => {
                        this.loadDevices();
                    }, 3000); // Retry after 3 seconds
                }
            }
        });
    }

    retryManually(): void {
        this.retryCount = 0;
        this.loadDevices();
    }

    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'grid' ? 'table' : 'grid';
    }

    onRowSelect(device: IDevice) {
        this.selectedDevice = device;
    }

    showDetails(device: IDevice): void {
        this.selectedDevice = device;
        this.detailsDialog = true;
    }

    showApiKey(device: IDevice): void {
        this.selectedDevice = device;
        this.apiKeyDialog = true;
    }

    showQRCode(device: IDevice): void {
        this.selectedDevice = device;
        this.qrCodeLoading = true;
        this.qrCodeDialog = true;
        this.qrCodeImage = null;

        if (!device.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'معرف الجهاز غير متوفر'
            });
            this.qrCodeLoading = false;
            return;
        }

        this.deviceService.getQRCodeAsImage(device.id).subscribe({
            next: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.qrCodeImage = reader.result as string;
                    this.qrCodeLoading = false;
                };
                reader.readAsDataURL(blob);
            },
            error: (error) => {
                this.qrCodeLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'حدث خطأ أثناء تحميل رمز QR، يرجى المحاولة مرة أخرى'
                });
            }
        });
    }

    searchDevices(event: any): void {
        const term = event.target.value.toLowerCase();
        this.searchTerm = term;

        if (!term) {
            this.filteredDevices = [...this.devices];
            return;
        }

        this.filteredDevices = this.devices.filter((device) => {
            return (
                (device.nameAr && device.nameAr.toLowerCase().includes(term)) ||
                (device.nameEn && device.nameEn.toLowerCase().includes(term)) ||
                (device.whatsNumber && device.whatsNumber.toLowerCase().includes(term)) ||
                (device.subscriptionNameAr && device.subscriptionNameAr.toLowerCase().includes(term)) ||
                (device.subscriptionNameEn && device.subscriptionNameEn.toLowerCase().includes(term))
            );
        });
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filteredDevices = [...this.devices];
    }

    getSubscriptionColorClass(subscriptionName: string | undefined): string {
        if (!subscriptionName) return '';

        const name = subscriptionName.toLowerCase();
        if (name.includes('basic') || name.includes('أساس')) return 'subscription-basic';
        if (name.includes('advanced') || name.includes('متقدم')) return 'subscription-advanced';
        if (name.includes('professional') || name.includes('احتراف')) return 'subscription-professional';
        if (name.includes('silver') || name.includes('فض')) return 'subscription-silver';
        if (name.includes('gold') || name.includes('ذهب')) return 'subscription-gold';
        if (name.includes('diamond') || name.includes('ماس')) return 'subscription-diamond';

        return '';
    }

    getStatusSeverity(isOnline: boolean | undefined): 'success' | 'danger' {
        return isOnline ? 'success' : 'danger';
    }

    getStatusText(isOnline: boolean | undefined): string {
        return isOnline ? 'متصل' : 'غير متصل';
    }

    getMenuItems(): void {
        this.menuItems = [
            {
                label: 'عرض التفاصيل',
                icon: 'pi pi-eye',
                command: () => {
                    if (this.currentDevice) {
                        this.showDetails(this.currentDevice);
                    }
                }
            },
            {
                label: 'تعديل',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.currentDevice) {
                        this.editDevice(this.currentDevice);
                    }
                }
            },
            {
                label: 'عرض مفتاح API',
                icon: 'pi pi-key',
                command: () => {
                    if (this.currentDevice) {
                        this.showApiKey(this.currentDevice);
                    }
                }
            },
            {
                label: 'عرض رمز QR للواتساب',
                icon: 'pi pi-qrcode',
                command: () => {
                    if (this.currentDevice) {
                        this.showQRCode(this.currentDevice);
                    }
                }
            },
            {
                label: 'حذف',
                icon: 'pi pi-trash',
                command: () => {
                    if (this.currentDevice) {
                        this.confirmDelete(this.currentDevice);
                    }
                }
            }
        ];
    }

    editDevice(device: IDevice) {
        this.dialogRef = this.dialogService.open(DeviceActionComponent, {
            header: 'تعديل جهاز',
            width: '30%',
            modal: true,
            data: { device }
        });

        this.dialogRef.onClose.subscribe((result: IDevice) => {
            if (result) {
                this.loadDevices();
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث الجهاز بنجاح' });
            }
        });
    }

    addNewDevice() {
        this.dialogRef = this.dialogService.open(DeviceActionComponent, {
            header: 'إضافة جهاز جديد',
            width: '30%',
            modal: true,
            data: { subscriptionId: this.devices.length > 0 ? this.devices[0].subscriptionId : null }
        });

        this.dialogRef.onClose.subscribe((result: IDevice) => {
            if (result) {
                this.loadDevices();
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إضافة الجهاز بنجاح' });
            }
        });
    }

    regenerateApiKey(device: IDevice) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من أنك تريد إعادة توليد مفتاح API لهذا الجهاز؟',
            header: 'تأكيد إعادة توليد المفتاح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (device.id) {
                    this.deviceService.regenerateApiKey(device).subscribe({
                        next: (response) => {
                            if (response.isSuccess) {
                                const index = this.devices.findIndex((d) => d.id === device.id);
                                if (index !== -1) {
                                    this.devices[index] = response.data;
                                }
                                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إعادة توليد مفتاح API بنجاح' });
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: response.message || 'حدث خطأ أثناء إعادة توليد المفتاح' });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الاتصال بالخادم' });
                        }
                    });
                }
            }
        });
    }

    confirmDelete(device: IDevice) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من أنك تريد حذف هذا الجهاز؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (device.id) {
                    this.deviceService.deleteDevice(device.id).subscribe({
                        next: (response) => {
                            if (response.isSuccess) {
                                this.devices = this.devices.filter((d) => d.id !== device.id);
                                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف الجهاز بنجاح' });
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: response.message || 'حدث خطأ أثناء حذف الجهاز' });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الاتصال بالخادم' });
                        }
                    });
                }
            }
        });
    }

    copyApiKey(): void {
        if (this.selectedDevice?.newDeviceApiKey) {
            navigator.clipboard.writeText(this.selectedDevice.newDeviceApiKey).then(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'تم النسخ', detail: 'تم نسخ مفتاح API بنجاح' });
                },
                () => {
                    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل نسخ مفتاح API' });
                }
            );
        }
    }
}
