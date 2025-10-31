import { Component, computed, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LayoutService } from '@/layout/service/layout.service';
import { TokenService } from '@/core/services/token.service';
import { UserService, User, ChangePasswordRequest } from '@/core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-profilesidebar',
    imports: [CommonModule, ButtonModule, DrawerModule, BadgeModule, DialogModule, InputTextModule, PasswordModule, ToastModule, FormsModule, ReactiveFormsModule],
    providers: [MessageService],
    template: `
        <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="left" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-profile-sidebar w-full sm:w-25rem">
            <div class="flex flex-col mx-auto md:mx-0 text-right">
                <span class="mb-2 font-semibold">Ù…Ø±Ø­Ø¨Ø§Ù‹</span>
                <span class="text-surface-500 dark:text-surface-400 font-medium mb-8">{{ currentUser?.fullName || currentUser?.name || 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…' }}</span>

                <ul class="list-none m-0 p-0">
                    <li>
                        <a (click)="showPasswordDialog()" class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-key text-xl text-primary"></i>
                            </span>
                            <div class="mr-4">
                                <span class="mb-2 font-semibold">ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">ØªØ­Ø¯ÙŠØ« ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø®Ø§ØµØ© Ø¨Ùƒ</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a (click)="logout()" class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 dark:border-surface-700 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150">
                            <span>
                                <i class="pi pi-sign-out text-xl text-primary"></i>
                            </span>
                            <div class="mr-4">
                                <span class="mb-2 font-semibold">ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬</span>
                                <p class="text-surface-500 dark:text-surface-400 m-0">Ø§Ù„Ø®Ø±ÙˆØ¬ Ù…Ù† Ø§Ù„Ø­Ø³Ø§Ø¨</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </p-drawer>

        <p-dialog
            header="ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±"
            [(visible)]="passwordDialogVisible"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [closable]="false"
            [rtl]="true"
            styleClass="password-dialog"
            [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
            [style]="{ width: '30rem', maxWidth: '95%' }"
        >
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="p-fluid">
                <div class="space-y-6">
                    <!-- Current Password -->
                    <div class="space-y-2">
                        <label for="oldPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ©</label>
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
                                [placeholder]="'Ø£Ø¯Ø®Ù„ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø­Ø§Ù„ÙŠØ©'"
                            ></p-password>
                        </div>
                    </div>

                    <!-- New Password -->
                    <div class="space-y-2">
                        <label for="newPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©</label>
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
                                [placeholder]="'Ø£Ø¯Ø®Ù„ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©'"
                            ></p-password>
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="space-y-2">
                        <label for="confirmPassword" class="block text-lg font-medium text-gray-700 dark:text-gray-200">ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±</label>
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
                                [placeholder]="'Ø£Ø¹Ø¯ Ø¥Ø¯Ø®Ø§Ù„ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©'"
                            ></p-password>
                        </div>
                        <small *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched" class="text-red-500 text-sm block mt-1">ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± Ù…ØªØ·Ø§Ø¨Ù‚Ø©</small>
                    </div>
                </div>

                <div class="flex justify-end items-center space-x-4 rtl:space-x-reverse mt-8">
                    <button pButton type="button" label="Ø¥Ù„ØºØ§Ø¡" (click)="passwordDialogVisible = false" class="p-button-outlined  hover:bg-gray-100 transition-colors duration-150"></button>
                    <button pButton type="submit" label="Ø­ÙØ¸" [disabled]="passwordForm.invalid || isSubmitting" class=" shadow-md hover:shadow-lg transition-all duration-150"></button>
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

    public readonly layoutService = inject(LayoutService);
    private readonly tokenService = inject(TokenService);
    private readonly userService = inject(UserService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly messageService = inject(MessageService);

    ngOnInit(): void {
        this.initPasswordForm();
        this.loadUserData();
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
                    this.currentUser = {
                        id: decodedToken.Id || decodedToken.nameid || decodedToken.sub,
                        userName: decodedToken.unique_name || '',
                        email: decodedToken.email || '',
                        fullName: decodedToken.FullName || decodedToken.name || '',
                        phoneNumber: decodedToken.MobileNumber || '',
                        UserType: decodedToken.UserType,
                        TenantId: decodedToken.TenantId,
                        roles: decodedToken.role ? (Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]) : [],
                        ...decodedToken
                    };
                }
            } catch {
                this.currentUser = null;
            }
        } else {
            this.currentUser = null;
        }
    }

    showProfileDialog(): void {
        this.profileDialogVisible = true;
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
            this.messageService.add({ severity: 'error', summary: 'Ø®Ø·Ø£', detail: 'ÙŠØ¬Ø¨ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø£ÙˆÙ„Ø§Ù‹' });

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
                    this.messageService.add({ severity: 'success', summary: 'Ù†Ø¬Ø§Ø­', detail: 'ØªÙ… ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø¨Ù†Ø¬Ø§Ø­' });
                    this.passwordDialogVisible = false;
                    this.passwordForm.reset();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Ø®Ø·Ø£', detail: response.message || 'ÙØ´Ù„ ÙÙŠ ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±' });
                }
            },
            error: (_error) => {
                this.isSubmitting = false;
                this.messageService.add({ severity: 'error', summary: 'Ø®Ø·Ø£', detail: 'ÙØ´Ù„ ÙÙŠ ØªØºÙŠÙŠØ± ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±' });
            }
        });
    }

    logout(): void {
        this.tokenService.logout();
        window.location.href = '/auth/login';
    }

    onDrawerHide(): void {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: false
        }));
    }
}
