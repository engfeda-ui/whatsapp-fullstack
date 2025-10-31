import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubscriptionService } from '../subscription.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-admin-subscription',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, ProgressBarModule, ToolbarModule, DialogModule, CardModule, TagModule, InputTextModule, DropdownModule, MenuModule, TooltipModule, OverlayPanelModule],
    templateUrl: './admin-subscription.component.html',
    styleUrls: ['./admin-subscription.component.scss'],
    providers: [ConfirmationService, MessageService, DatePipe]
})
export class AdminSubscriptionComponent implements OnInit {
    @ViewChild('op') op: any;

    subscriptions: any[] = [];
    filteredSubscriptions: any[] = [];
    selectedSubscription: any = null;
    loading = true;
    error = false;
    errorMessage = '';
    retryCount = 0;
    maxRetries = 3;
    viewMode: 'table' | 'cards' = 'cards';
    detailsDialog = false;
    paymentDialog = false;
    searchTerm = '';

    constructor(
        private subscriptionService: SubscriptionService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.loadSubscriptions();
    }

    loadSubscriptions(): void {
        this.loading = true;
        this.error = false;
        this.errorMessage = '';

        this.subscriptionService.getSubscriptionForAdmin().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.subscriptions = response.data;
                    this.filteredSubscriptions = [...this.subscriptions];
                    this.retryCount = 0;
                } else {
                    this.error = true;
                    this.errorMessage = response.message || 'حدث خطأ أثناء تحميل الاشتراكات';
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
                    this.errorMessage = 'حدث خطأ أثناء تحميل الاشتراكات';
                }

                // Auto retry logic
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    setTimeout(() => {
                        this.loadSubscriptions();
                    }, 3000);
                }
            }
        });
    }

    retryManually(): void {
        this.retryCount = 0;
        this.loadSubscriptions();
    }

    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
    }

    showDetails(subscription: any): void {
        this.selectedSubscription = subscription;
        this.detailsDialog = true;
    }

    confirmSetPayment(subscription: any): void {
        this.selectedSubscription = subscription;
        this.confirmationService.confirm({
            message: `هل أنت متأكد من تأكيد دفع الاشتراك للمستخدم ${subscription.user.fullName}؟`,
            header: 'تأكيد الدفع',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'لا',
            accept: () => this.setPayment(subscription.id)
        });
    }

    setPayment(id: number): void {
        this.subscriptionService.setPayment(id).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.showToast('success', 'تم بنجاح', 'تم تأكيد الدفع بنجاح');
                    this.loadSubscriptions();
                } else {
                    this.showToast('error', 'خطأ', response.message || 'فشل في تأكيد الدفع');
                }
            },
            error: (error) => {
                let errorMsg = 'حدث خطأ أثناء تأكيد الدفع';

                if (error.status === 0) {
                    errorMsg = 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت';
                } else if (error.status === 401) {
                    errorMsg = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                } else if (error.status === 403) {
                    errorMsg = 'ليس لديك صلاحية لتأكيد الدفع';
                }

                this.showToast('error', 'خطأ', errorMsg);
            }
        });
    }

    confirmDelete(subscription: any): void {
        this.confirmationService.confirm({
            message: `هل أنت متأكد من رغبتك في إلغاء اشتراك ${subscription.user.fullName}؟`,
            header: 'تأكيد الإلغاء',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'لا',
            accept: () => this.deleteSubscription(subscription.id)
        });
    }

    deleteSubscription(id: number): void {
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
                }

                this.showToast('error', 'خطأ', errorMsg);
            }
        });
    }

    formatDate(dateString: string): string {
        const formattedDate = this.datePipe.transform(dateString, 'yyyy-MM-dd');
        return formattedDate || '';
    }

    getStatusClass(subscription: any): string {
        const now = new Date();
        const start = new Date(subscription.startDate);
        const end = new Date(subscription.endDate);

        if (now < start) return 'pending';
        if (now > end) return 'expired';

        const thirtyDaysBeforeEnd = new Date(end);
        thirtyDaysBeforeEnd.setDate(end.getDate() - 30);
        return now > thirtyDaysBeforeEnd ? 'expiring-soon' : 'active';
    }

    getStatusText(subscription: any): string {
        const status = this.getStatusClass(subscription);
        const statusMap: Record<string, string> = {
            active: 'نشط',
            expired: 'منتهي',
            pending: 'معلق',
            'expiring-soon': 'ينتهي قريباً'
        };
        return statusMap[status] || '';
    }

    getStatusSeverity(subscription: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const status = this.getStatusClass(subscription);
        const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
            active: 'success',
            expired: 'danger',
            pending: 'warn',
            'expiring-soon': 'warn'
        };
        return severityMap[status] || 'info';
    }

    getPlanColorClass(planName: string): string {
        const plan = planName.toLowerCase();
        if (plan.includes('basic')) return 'plan-basic';
        if (plan.includes('advanced')) return 'plan-advanced';
        if (plan.includes('professional')) return 'plan-professional';
        if (plan.includes('silver')) return 'plan-silver';
        if (plan.includes('gold')) return 'plan-gold';
        if (plan.includes('diamond')) return 'plan-diamond';
        return '';
    }

    searchSubscriptions(event: any): void {
        const term = event.target.value.toLowerCase();
        this.searchTerm = term;

        if (!term) {
            this.filteredSubscriptions = [...this.subscriptions];
            return;
        }

        this.filteredSubscriptions = this.subscriptions.filter((sub) => {
            return (
                sub.user.fullName.toLowerCase().includes(term) ||
                (sub.user.email && sub.user.email.toLowerCase().includes(term)) ||
                (sub.user.companyName && sub.user.companyName.toLowerCase().includes(term)) ||
                (sub.user.mobileNumber && sub.user.mobileNumber.toLowerCase().includes(term)) ||
                (sub.plan && sub.plan.nameAr && sub.plan.nameAr.toLowerCase().includes(term)) ||
                (sub.plan && sub.plan.nameEn && sub.plan.nameEn.toLowerCase().includes(term)) ||
                (sub.period && sub.period.nameAr && sub.period.nameAr.toLowerCase().includes(term)) ||
                sub.price.toString().includes(term)
            );
        });
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filteredSubscriptions = [...this.subscriptions];
    }

    private showToast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail });
    }

    getMenuItems(subscription: any): MenuItem[] {
        const items: MenuItem[] = [
            {
                label: 'عرض التفاصيل',
                icon: 'pi pi-eye',
                command: () => this.showDetails(subscription)
            }
        ];

        if (!subscription.pricePayDate) {
            items.push(
                {
                    label: 'تأكيد الدفع',
                    icon: 'pi pi-check',
                    command: () => this.confirmSetPayment(subscription),
                    styleClass: 'text-green-600'
                },
                {
                    label: 'إلغاء الاشتراك',
                    icon: 'pi pi-trash',
                    command: () => this.confirmDelete(subscription),
                    styleClass: 'text-red-600'
                }
            );
        }

        return items;
    }
}
