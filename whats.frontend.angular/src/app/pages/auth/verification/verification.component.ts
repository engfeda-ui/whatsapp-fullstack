import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/layout/service/layout.service';
import { RippleModule } from 'primeng/ripple';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ApiResponse } from '@/core/ApiResponse';

@Component({
    selector: 'app-verification',
    imports: [
        ButtonModule,
        RouterModule,
        AppConfigurator,
        FormsModule,
        ReactiveFormsModule,
        InputNumberModule,
        RippleModule,
        ToastModule,
        HttpClientModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        InputOtpModule,
        CommonModule,
        DecimalPipe
    ],
    providers: [MessageService, AuthService],
    standalone: true,
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss']
})
export class Verification implements OnInit {
    layoutService = inject(LayoutService);
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    verificationForm!: FormGroup;
    isLoading: boolean = false;
    isResending: boolean = false;
    userId: number = 0;
    otpValue: string = '';
    mobileNumber: string = '';

    // Timer properties
    timerMinutes: number = 5;
    timerSeconds: number = 0;
    timerInterval: any;
    canResend: boolean = false;

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    ngOnInit() {
        this.verificationForm = this.formBuilder.group({
            otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
            securityCode: ['', [Validators.required]]
        });

        this.route.queryParams.subscribe((params) => {
            if (params['id']) {
                this.userId = +params['id'];
            }

            if (params['mobile']) {
                this.mobileNumber = params['mobile'];
                // معالجة رقم الموبايل لعرضه بشكل مخفي جزئياً
                if (this.mobileNumber && this.mobileNumber.length > 4) {
                    const visiblePart = this.mobileNumber.slice(-3);
                    const hiddenPart = this.mobileNumber.slice(0, -3).replace(/\d/g, '*');
                    this.mobileNumber = hiddenPart + visiblePart;
                }
            }
        });

        // بدء العد التنازلي لمدة 5 دقائق
        this.startResendTimer();
    }

    // بدء العد التنازلي
    startResendTimer() {
        this.canResend = false;
        this.timerMinutes = 5;
        this.timerSeconds = 0;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (this.timerSeconds > 0) {
                this.timerSeconds--;
            } else if (this.timerMinutes > 0) {
                this.timerMinutes--;
                this.timerSeconds = 59;
            } else {
                // انتهاء الوقت، يمكن إعادة إرسال الرمز
                this.canResend = true;
                clearInterval(this.timerInterval);
            }
        }, 1000);
    }

    // تنظيف المؤقت عند تدمير المكون
    ngOnDestroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    onSubmit() {
        if (this.verificationForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'تحذير',
                detail: 'يرجى ملء جميع الحقول المطلوبة'
            });
            return;
        }

        this.isLoading = true;
        const verificationData = {
            Id: this.userId,
            VerificationCode: this.verificationForm.value.otpCode,
            SecurityCode: this.verificationForm.value.securityCode
        };

        this.authService.verify(verificationData).subscribe({
            next: (response: ApiResponse<any>) => {
                this.isLoading = false;
                if (response.isSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'نجاح',
                        detail: 'تم التحقق بنجاح'
                    });
                    this.router.navigate(['/']);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ',
                        detail: response.message || 'فشل التحقق'
                    });
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: error.error?.message || 'حدث خطأ أثناء التحقق'
                });
            }
        });
    }

    // إعادة إرسال رمز التحقق
    resendCode() {
        if (!this.canResend || this.isResending) {
            return;
        }

        this.isResending = true;
        const resendData = {
            Id: this.userId,
            SecurityCode: this.verificationForm.value.securityCode
        };

        this.authService.resendCode(resendData).subscribe({
            next: (response: ApiResponse<any>) => {
                this.isResending = false;
                if (response.isSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'نجاح',
                        detail: 'تم إعادة إرسال رمز التحقق بنجاح'
                    });
                    // إعادة تشغيل المؤقت
                    this.startResendTimer();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ',
                        detail: response.message || 'فشل إعادة إرسال رمز التحقق'
                    });
                }
            },
            error: (error: any) => {
                this.isResending = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: error.error?.message || 'حدث خطأ أثناء إعادة إرسال رمز التحقق'
                });
            }
        });
    }
}
