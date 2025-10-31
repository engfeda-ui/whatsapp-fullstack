import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiResponse } from '@/core/ApiResponse';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, PasswordModule, FormsModule, ReactiveFormsModule, InputTextModule, CheckboxModule, RouterModule, AppConfigurator, IconFieldModule, InputIconModule, ButtonModule, RippleModule, ToastModule, HttpClientModule],
    providers: [MessageService, AuthService],
    templateUrl: './register.component.html'
})
export class Register implements OnInit {
    confirmed: boolean = false;
    registerForm!: FormGroup;
    isLoading: boolean = false;

    LayoutService = inject(LayoutService);
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            companyName: ['', [Validators.required]],
            fullName: ['', [Validators.required]],
            mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+?[0-9]{10,15})$/), Validators.minLength(10), Validators.maxLength(15)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            securityCode: ['', [Validators.required]]
        });
    }

    get mobileNumberError(): string {
        const control = this.registerForm.get('mobileNumber');
        if (control?.hasError('required')) {
            return 'رقم الهاتف مطلوب';
        }
        if (control?.hasError('pattern')) {
            return 'رقم الهاتف غير صحيح. يجب أن يحتوي على أرقام فقط (10-15 رقم)';
        }
        if (control?.hasError('minlength')) {
            return 'رقم الهاتف قصير جداً (الحد الأدنى 10 أرقام)';
        }
        if (control?.hasError('maxlength')) {
            return 'رقم الهاتف طويل جداً (الحد الأقصى 15 رقم)';
        }
        return '';
    }

    onSubmit() {
        if (this.registerForm.invalid || !this.confirmed) {
            this.messageService.add({
                severity: 'warn',
                summary: 'تحذير',
                detail: 'يرجى ملء جميع الحقول المطلوبة وقبول الشروط والأحكام'
            });
            return;
        }

        this.isLoading = true;
        const registerData = {
            CompanyName: this.registerForm.value.companyName,
            FullName: this.registerForm.value.fullName,
            MobileNumber: this.registerForm.value.mobileNumber,
            Password: this.registerForm.value.password,
            SecurityCode: this.registerForm.value.securityCode
        };

        this.authService.register(registerData).subscribe({
            next: (response: ApiResponse<any>) => {
                this.isLoading = false;
                if (response.isSuccess) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'نجاح',
                        detail: 'تم التسجيل بنجاح. يرجى التحقق من حسابك.'
                    });
                    // Navigate to verification page with user ID and mobile number
                    const queryParams: any = { mobile: this.registerForm.value.mobileNumber };

                    if (response.data && response.data.id) {
                        queryParams.id = response.data.id;
                    }

                    this.router.navigate(['/auth/verification'], { queryParams });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'خطأ',
                        detail: response.message || 'فشل التسجيل'
                    });
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: error.error?.message || 'حدث خطأ أثناء التسجيل'
                });
            }
        });
    }
}
