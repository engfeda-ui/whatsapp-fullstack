import { Component, computed, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LayoutService } from '@/layout/service/layout.service';
import { TokenService } from '@/core/services/token.service';
import { UserService, User, ChangePasswordRequest } from '@/core/services/user.service';
import { I18nService, Language, Font } from '@/core/services/i18n.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-profilesidebar',
    imports: [CommonModule, ButtonModule, DrawerModule, BadgeModule, DialogModule, InputTextModule, PasswordModule, ToastModule, DropdownModule, FormsModule, ReactiveFormsModule],
    providers: [MessageService],
    template: `
        <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="left" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-profile-sidebar w-full sm:w-25rem">
            <div class="flex flex-col mx-auto md:mx-0 text-right">
                <!-- Account Info Section -->
                <span class="mb-2 font-semibold text-lg">{{ i18n.t('accountInfo') }}</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium mb-8">{{ currentUser?.fullName || currentUser?.name || i18n.t('user') }}</span>

                <!-- Menu Items -->
                <ul class="list-none m-0 p-0 space-y-2">
                    <!-- Language Setting -->
                    <li>
                        <div class="flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-globe text-xl text-primary"></i>
                            </span>
                            <div class="mr-4 flex-1">
                                <span class="mb-2 font-semibold block">{{ i18n.t('language') }}</span>
                                <p-dropdown
                                    [options]="availableLanguages"
                                    [(ngModel)]="selectedLanguage"
                                    (onChange)="onLanguageChange($event)"
                                    optionLabel="name"
                                    optionValue="code"
                                    styleClass="w-full"
                                    [showClear]="false"
                                ></p-dropdown>
                            </div>
                        </div>
                    </li>

                    <!-- Font Setting -->
                    <li>
                        <div class="flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-font text-xl text-primary"></i>
                            </span>
                            <div class="mr-4 flex-1">
                                <span class="mb-2 font-semibold block">{{ i18n.t('font') }}</span>
                                <p-dropdown
                                    [options]="availableFonts"
                                    [(ngModel)]="selectedFont"
                                    (onChange)="onFontChange($event)"
                                    optionLabel="name"
                                    optionValue="code"
                                    styleClass="w-full"
                                    [showClear]="false"
                                ></p-dropdown>
                            </div>
                        </div>
                    </li>

                    <!-- Change Password -->
                    <li>
                        <a (click)="showPasswordDialog()" class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-key text-xl text-primary"></i>
                            </span>
                            <div class="mr-4">
                                <span class="mb-2 font-semibold block">{{ i18n.t('changePassword') }}</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">{{ i18n.t('updatePasswordDesc') }}</p>
                            </div>
                        </a>
                    </li>

                    <!-- Logout -->
                    <li>
                        <a (click)="logout()" class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-sign-out text-xl text-primary"></i>
                            </span>
                            <div class="mr-4">
                                <span class="mb-2 font-semibold block">{{ i18n.t('logout') }}</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">{{ i18n.t('logoutDesc') }}</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </p-drawer>

        <!-- Change Password Dialog -->
        <p-dialog
            [header]="i18n.t('changePasswordTitle')"
            [(visible)]="passwordDialogVisible"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [closable]="false"
            [rtl]="i18n.getCurrentLanguage() === 'ar'"
            styleClass="password-dialog"
            [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
            [style]="{ width: '30rem', maxWidth: '95%' }"
        >
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="p-fluid">
                <div class="space-y-6">
                    <!-- Current Password -->
                    <div class="space-y-2">
                        <label for="oldPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">{{ i18n.t('currentPassword') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <i class="pi pi-lock text-gray-400"></i>
                            </div>
                            <p-password
                                id="oldPassword"
                                formControlName="oldPassword"
                                [toggleMask]="true"
                                [feedback]="false"
                                styleClass="w-full"
                                inputStyleClass="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                                [placeholder]="i18n.t('currentPasswordPlaceholder')"
                            ></p-password>
                        </div>
                    </div>

                    <!-- New Password -->
                    <div class="space-y-2">
                        <label for="newPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">{{ i18n.t('newPassword') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <i class="pi pi-key text-gray-400"></i>
                            </div>
                            <p-password
                                id="newPassword"
                                formControlName="newPassword"
                                [toggleMask]="true"
                                [feedback]="false"
                                styleClass="w-full"
                                inputStyleClass="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                                [placeholder]="i18n.t('newPasswordPlaceholder')"
                            ></p-password>
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="space-y-2">
                        <label for="confirmPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">{{ i18n.t('confirmPassword') }}</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <i class="pi pi-check-circle text-gray-400"></i>
                            </div>
                            <p-password
                                id="confirmPassword"
                                formControlName="confirmPassword"
                                [toggleMask]="true"
                                [feedback]="false"
                                styleClass="w-full"
                                inputStyleClass="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                                [placeholder]="i18n.t('confirmPasswordPlaceholder')"
                            ></p-password>
                        </div>
                        <small *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched" class="text-red-500 text-sm block mt-1">{{ i18n.t('passwordMismatch') }}</small>
                    </div>
                </div>

                <div class="flex justify-end items-center space-x-4 rtl:space-x-reverse mt-8">
                    <button pButton type="button" [label]="i18n.t('cancel')" (click)="passwordDialogVisible = false" class="p-button-outlined  hover:bg-gray-100 transition-colors duration-150"></button>
                    <button pButton type="submit" [label]="i18n.t('save')" [disabled]="passwordForm.invalid || isSubmitting" class=" shadow-md hover:shadow-lg transition-all duration-150"></button>
                </div>
            </form>
        </p-dialog>

        <p-toast position="bottom-left"></p-toast>
    `
})
export class AppProfileSidebar implements OnInit {
    visible = computed(() => this.layoutService.layoutState().profileSidebarVisible);

    profileDialogVisible = false;
    passwordDialogVisible = false;
    currentUser: User | null = null;
    passwordForm!: FormGroup;
    isSubmitting = false;

    selectedLanguage: Language = 'ar';
    selectedFont: Font = 'tajawal';
    availableLanguages: { code: Language; name: string }[] = [];
    availableFonts: { code: Font; name: string }[] = [];

    public readonly layoutService = inject(LayoutService);
    private readonly tokenService = inject(TokenService);
    private readonly userService = inject(UserService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly messageService = inject(MessageService);
    public readonly i18n = inject(I18nService);

    ngOnInit(): void {
        this.initPasswordForm();
        this.loadUserData();
        this.loadLanguageAndFontOptions();
    }

    /**
     * Load language and font options from i18n service
     */
    private loadLanguageAndFontOptions(): void {
        this.availableLanguages = this.i18n.getAvailableLanguages();
        this.availableFonts = this.i18n.getAvailableFonts();
        this.selectedLanguage = this.i18n.getCurrentLanguage();
        this.selectedFont = this.i18n.getCurrentFont();
    }

    /**
     * Handle language change
     */
    onLanguageChange(event: any): void {
        const language = event.value || event as Language;
        this.i18n.setLanguage(language);
        this.messageService.add({
            severity: 'success',
            summary: this.i18n.t('success'),
            detail: `${this.i18n.t('language')} ${this.i18n.t(language === 'ar' ? 'arabic' : 'english')}`
        });
    }

    /**
     * Handle font change
     */
    onFontChange(event: any): void {
        const font = event.value || event as Font;
        this.i18n.setFont(font);
        this.messageService.add({
            severity: 'success',
            summary: this.i18n.t('success'),
            detail: `${this.i18n.t('font')} changed`
        });
    }

    initPasswordForm(): void {
        this.passwordForm = this.formBuilder.group(
            {
                oldPassword: ['', Validators.required],
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required]
            },
            { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            return { passwordMismatch: true };
        }

        return null;
    }

    loadUserData(): void {
        const token = this.tokenService.getToken();

        if (token) {
            try {
                const decodedToken = this.tokenService.decodeToken(token);

                if (decodedToken) {
                    const record = decodedToken as Record<string, unknown>;
                    const getString = (value: unknown, fallback = ''): string =>
                        typeof value === 'string' ? value : fallback;

                    const idSource = record['Id'] ?? record['nameid'] ?? record['sub'];
                    const id = idSource != null ? Number(idSource) : undefined;

                    const rolesValue = record['role'];
                    const roles = Array.isArray(rolesValue)
                        ? rolesValue.map((role) => String(role))
                        : rolesValue
                          ? [String(rolesValue)]
                          : [];

                    const user: User = {
                        id: id ?? (record['sub'] ? Number(record['sub']) : 0),
                        userName: getString(record['unique_name'] ?? record['Username'] ?? record['name'], ''),
                        email: getString(record['email'], ''),
                        fullName: getString(record['FullName'] ?? record['name'], ''),
                        phoneNumber: getString(record['MobileNumber'], ''),
                        roles
                    };

                    if (typeof record['UserType'] === 'string') {
                        user.UserType = record['UserType'];
                    }

                    if (typeof record['TenantId'] === 'string') {
                        user.TenantId = record['TenantId'];
                    }

                    this.currentUser = user;
                }
            } catch {
                this.currentUser = null;
            }
        } else {
            this.currentUser = null;
        }
    }

    showProfileDialog(): void {
        // profileDialogVisible = true; // Not used currently
    }

    showPasswordDialog(): void {
        this.passwordForm.reset();
        this.passwordDialogVisible = true;
    }

    changePassword(): void {
        if (this.passwordForm.invalid) {
            return;
        }

        if (!this.currentUser || !this.currentUser.id) {
            this.messageService.add({ severity: 'error', summary: this.i18n.t('error'), detail: this.i18n.t('errorLoadingUser') });

            return;
        }

        this.isSubmitting = true;
        const request: ChangePasswordRequest = {
            id: this.currentUser.id,
            oldPassword: this.passwordForm.value.oldPassword,
            newPassword: this.passwordForm.value.newPassword
        };

        this.userService.changePassword(request).subscribe({
            next: (response) => {
                this.isSubmitting = false;

                if (response.isSuccess) {
                    this.messageService.add({ severity: 'success', summary: this.i18n.t('success'), detail: this.i18n.t('successUpdatePassword') });
                    this.passwordDialogVisible = false;
                    this.passwordForm.reset();
                } else {
                    this.messageService.add({ severity: 'error', summary: this.i18n.t('error'), detail: response.message || this.i18n.t('errorUpdatePassword') });
                }
            },
            error: (_error) => {
                this.isSubmitting = false;
                this.messageService.add({ severity: 'error', summary: this.i18n.t('error'), detail: this.i18n.t('errorUpdatePassword') });
            }
        });
    }

    logout(): void {
        this.tokenService.logout();
        window.location.href = '/auth/login';
    }

    onDrawerHide(): void {
        this.layoutService.layoutState.update((state) => (
            {
                ...state,
                profileSidebarVisible: false
            }
        ));
    }
}
