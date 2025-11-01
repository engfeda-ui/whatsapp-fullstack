import { Component, computed, inject, OnInit } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { ApiResponse } from '@/core/ApiResponse';
import { TokenService } from '@/core/services/token.service';
import { TranslationService } from '@/core/services/translation.service';
import { environment } from '@env/environment';

@Component({
    selector: 'p-login',
    standalone: true,
    imports: [CheckboxModule, InputTextModule, FormsModule, ReactiveFormsModule, RouterModule, AppConfigurator, IconFieldModule, InputIconModule, ButtonModule, ToastModule],
    providers: [MessageService, AuthService],
    templateUrl: './login.component.html'
})
export class Login implements OnInit {
    rememberMe: boolean = false;
    loginForm!: FormGroup;
    isLoading: boolean = false;

    LayoutService = inject(LayoutService);
    translationService = inject(TranslationService);
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private tokenService = inject(TokenService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.isLoading = true;
        const username = this.loginForm.value.username;
        const password = this.loginForm.value.password;

        // في بيئة التطوير فقط: التحقق من الحساب الافتراضي
        if (!environment.production && username === 'admin' && password === '96579657') {
            this.isLoading = false;
            const mockToken = this.generateDevToken(username);

            this.tokenService.setToken(mockToken);
            this.messageService.add({
                severity: 'success',
                summary: this.translationService.translate('success'),
                detail: this.translationService.translate('login_success_dev')
            });
            this.router.navigate(['/']);

            return;
        }

        const loginData = {
            MobileNumber: username,
            Password: password
        };

        this.authService.login(loginData).subscribe({
            next: (response: ApiResponse<any>) => {
                this.isLoading = false;

                if (response.isSuccess) {
                    if (response.data && response.data.token) {
                        this.tokenService.setToken(response.data.token);

                        this.messageService.add({
                            severity: 'success',
                            summary: this.translationService.translate('success'),
                            detail: this.translationService.translate('login_success')
                        });
                        this.router.navigate(['/']);
                    }
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translationService.translate('error'),
                        detail: response.message || this.translationService.translate('login_failed')
                    });
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                let errorMsg = this.translationService.translate('login_error');

                if (error.error && typeof error.error === 'object') {
                    errorMsg = error.error.message || errorMsg;
                } else if (error.message) {
                    errorMsg = error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: this.translationService.translate('error'),
                    detail: errorMsg
                });
            }
        });
    }

    // دالة لإنشاء توكن تطوير فقط (لن تعمل في الإنتاج)
    private generateDevToken(username: string): string {
        const mockPayload = {
            Id: '1',
            Username: username,
            Role: 'admin',
            UserType: '2',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 ساعة
        };

        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify(mockPayload));
        const signature = btoa('dev-signature');

        return `${header}.${payload}.${signature}`;
    }
}
