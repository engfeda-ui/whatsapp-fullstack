import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansService } from '../plans.service';
import { Plan } from '../plan.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/core/ApiResponse';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubscriptionService, SubscriptionRequest } from '../subscription.service';
import { Period } from '../period.model';
import { PlanColorService } from '@/core/services/plan-color.service';

@Component({
    selector: 'p-plan-list',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule, DropdownModule, FormsModule, ToastModule],
    templateUrl: './plan-list.component.html',
    styleUrls: ['./plan-list.component.scss'],
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanListComponent implements OnInit {
    plans: Plan[] = [];
    periods: Period[] = [];
    loading = true;
    periodsLoading = false;
    error = false;
    selectedPlan: Plan | null = null;
    selectedPeriod: Period | null = null;
    displayDialog = false;
    submitting = false;

    private readonly plansService = inject(PlansService);
    private readonly subscriptionService = inject(SubscriptionService);
    private readonly messageService = inject(MessageService);
    private readonly planColorService = inject(PlanColorService);

    getPlanColorClasses(planId: number, isSelected: boolean = false): { [key: string]: boolean } {
        return this.planColorService.getAllClasses(planId, isSelected);
    }

    getPlanTextColor(planId: number): string {
        return this.planColorService.getTextColor(planId);
    }

    getPlanBgColor(planId: number): string {
        return this.planColorService.getSecondaryColor(planId);
    }

    getPlanHoverColor(planId: number): string {
        return this.planColorService.getHoverColor(planId);
    }

    getPlanBgLightColor(planId: number): string {
        return this.planColorService.getBgLightColor(planId);
    }

    // TrackBy functions to improve ngFor performance
    trackByPlanId(index: number, plan: Plan): number {
        return plan.id;
    }

    trackByPeriodId(index: number, period: Period): number {
        return period.id;
    }

    ngOnInit(): void {
        this.loadPlans();
        this.loadPeriods();
    }

    loadPlans(retryCount: number = 0): void {
        this.loading = true;
        this.plansService.getPlans().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.plans = response.data;
                } else {
                    this.error = true;
                }

                this.loading = false;
            },
            error: (error) => {
                // Retry up to 2 times if there's an error
                if (retryCount < 2) {
                    setTimeout(
                        () => {
                            this.loadPlans(retryCount + 1);
                        },
                        1000 * (retryCount + 1)
                    ); // Exponential backoff
                } else {
                    this.error = true;
                    this.loading = false;
                }
            }
        });
    }

    loadPeriods(retryCount: number = 0): void {
        this.periodsLoading = true;
        this.subscriptionService.getPeriods().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.periods = response.data;
                    this.periods.sort((a, b) => a.months - b.months);
                }

                this.periodsLoading = false;
            },
            error: (error) => {
                // Retry up to 2 times if there's an error
                if (retryCount < 2) {
                    setTimeout(
                        () => {
                            this.loadPeriods(retryCount + 1);
                        },
                        1000 * (retryCount + 1)
                    ); // Exponential backoff
                } else {
                    this.periodsLoading = false;
                }
            }
        });
    }

    selectPlan(plan: Plan): void {
        this.selectedPlan = plan;
        this.selectedPeriod = null;
        this.displayDialog = true;

        if (this.periods.length === 0) {
            this.loadPeriods();
        }
    }

    createSubscription(): void {
        if (!this.selectedPlan || !this.selectedPeriod) {
            this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'يرجى اختيار مدة الاشتراك'
            });

            return;
        }

        this.submitting = true;
        const request: SubscriptionRequest = {
            planId: this.selectedPlan.id,
            periodId: this.selectedPeriod.id
        };

        this.subscriptionService.createSubscription(request).subscribe({
            next: (response) => {
                this.submitting = false;

                if (response.isSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'تم بنجاح',
                        detail: 'تم إنشاء الاشتراك بنجاح'
                    });
                    this.displayDialog = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ',
                        detail: response.message || 'حدث خطأ أثناء إنشاء الاشتراك'
                    });
                }
            },
            error: (error) => {
                this.submitting = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'حدث خطأ أثناء إنشاء الاشتراك'
                });
            }
        });
    }
}
