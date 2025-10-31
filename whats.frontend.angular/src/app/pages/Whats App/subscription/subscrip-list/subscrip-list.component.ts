import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubscriptionService } from '../subscription.service';
import { Subscription } from '../subscription.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DeviceActionComponent } from '../../device/device-action/device-action.component';
import { IDevice } from '../../device/IDevice';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'p-subscrip-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, RouterLink, ProgressBarModule, ToolbarModule, DialogModule],
    templateUrl: './subscrip-list.component.html',
    styleUrls: ['./subscrip-list.component.scss'],
    providers: [ConfirmationService, MessageService, DatePipe, DialogService]
})
export class SubscripListComponent implements OnInit {
    private readonly subscriptionService = inject(SubscriptionService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly dialogService = inject(DialogService);

    subscriptions: Subscription[] = [];
    loading = true;
    error = false;
    errorMessage = '';
    retryCount = 0;
    maxRetries = 3;
    ref: DynamicDialogRef | undefined;

    ngOnInit(): void {
        this.loadSubscriptions();
    }

    loadSubscriptions(): void {
        this.loading = true;
        this.error = false;
        this.errorMessage = '';

        this.subscriptionService.getSubscriptions().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.subscriptions = response.data;
                    this.retryCount = 0;
                }

                this.loading = false;
            }
        });
    }

    retryManually(): void {
        this.retryCount = 0;
        this.loadSubscriptions();
    }

    confirmDelete(subscription: Subscription): void {
        this.confirmationService.confirm({
            message: `هل أنت متأكد من رغبتك في إلغاء اشتراك ${subscription.plan.nameAr}؟`,
            header: 'تأكيد الإلغاء',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'لا',
            accept: () => this.deleteSubscription(subscription.id)
        });
    }

    private deleteSubscription(id: number): void {
        this.subscriptionService.deleteSubscription(id).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.showToast('success', 'تم بنجاح', 'تم إلغاء الاشتراك بنجاح');
                    this.loadSubscriptions();
                } else {
                    this.showToast('error', 'خطأ', response.message || 'فشل في الإلغاء');
                }
            },
            error: (error) => {
                let errorMsg = 'حدث خطأ أثناء إلغاء الاشتراك';

                if (error.status === 0) {
                    errorMsg = 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت';
                } else if (error.status === 401) {
                    errorMsg = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                } else if (error.status === 403) {
                    errorMsg = 'ليس لديك صلاحية لإلغاء هذا الاشتراك';
                } else if (error.status === 404) {
                    errorMsg = 'لم يتم العثور على الاشتراك المطلوب إلغاؤه';
                    this.loadSubscriptions();
                }

                this.showToast('error', 'خطأ', errorMsg);
            }
        });
    }

    getStatusClass(subscription: Subscription): string {
        const now = new Date();
        const start = new Date(subscription.startDate);
        const end = new Date(subscription.endDate);

        if (now < start) {return 'pending';}

        if (now > end) {return 'expired';}

        const thirtyDaysBeforeEnd = new Date(end);

        thirtyDaysBeforeEnd.setDate(end.getDate() - 30);

        return now > thirtyDaysBeforeEnd ? 'expiring-soon' : 'active';
    }

    getStatusText(subscription: Subscription): any {
        const status = this.getStatusClass(subscription);

        return {
            active: 'نشط',
            expired: 'منتهي',
            pending: 'معلق',
            'expiring-soon': 'ينتهي قريباً'
        }[status];
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    private showToast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail });
    }

    addDevice(subscriptionId: number): void {
        this.ref = this.dialogService.open(DeviceActionComponent, {
            header: 'إضافة جهاز',
            width: '30%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            data: { subscriptionId },
            modal: true
        });

        this.ref.onClose.subscribe((result: IDevice) => {
            if (result) {
                this.loadSubscriptions();
            }
        });
    }
}
