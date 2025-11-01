import { Injectable, signal } from '@angular/core';

// Arabic translations
const AR_TRANSLATIONS = {
    // Account & Profile
    accountInfo: 'معلومات الحساب',
    user: 'مستخدم',
    profile: 'الملف الشخصي',

    // Password
    changePassword: 'تغيير كلمة المرور',
    updatePasswordDesc: 'تحديث كلمة المرور الخاصة بحسابك',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    currentPasswordPlaceholder: 'أدخل كلمة المرور الحالية للتحقق',
    newPasswordPlaceholder: 'أدخل كلمة مرور جديدة قوية',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    changePasswordTitle: 'تغيير كلمة المرور',

    // Logout
    logout: 'تسجيل الخروج',
    logoutDesc: 'الخروج من تطبيقك',

    // Buttons
    cancel: 'إلغاء',
    save: 'حفظ',
    ok: 'موافق',
    delete: 'حذف',
    edit: 'تعديل',

    // Messages
    error: 'خطأ',
    success: 'نجاح',
    warning: 'تحذير',
    info: 'معلومة',

    // Errors
    errorLoadingUser: 'حدث خطأ في جلب بيانات المستخدم الحالي',
    successUpdatePassword: 'تم تحديث كلمة المرور بنجاح',
    errorUpdatePassword: 'فشل تحديث كلمة المرور',

    // Settings
    settings: 'الإعدادات',
    language: 'اللغة',
    font: 'الخط',
    theme: 'المظهر',
    appearance: 'المظهر',

    // Language options
    arabic: 'العربية',
    english: 'English',

    // Font options
    tajawal: 'Tajawal',
    poppins: 'Poppins',
    droidSans: 'Droid Sans',
    alJazeera: 'Al Jazeera Plus',
};

// English translations
const EN_TRANSLATIONS = {
    // Account & Profile
    accountInfo: 'Account Information',
    user: 'User',
    profile: 'Profile',

    // Password
    changePassword: 'Change Password',
    updatePasswordDesc: 'Update your account password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    currentPasswordPlaceholder: 'Enter your current password to verify',
    newPasswordPlaceholder: 'Enter a strong new password',
    confirmPasswordPlaceholder: 'Re-enter your new password',
    passwordMismatch: 'Passwords do not match',
    changePasswordTitle: 'Change Password',

    // Logout
    logout: 'Logout',
    logoutDesc: 'Sign out from your account',

    // Buttons
    cancel: 'Cancel',
    save: 'Save',
    ok: 'OK',
    delete: 'Delete',
    edit: 'Edit',

    // Messages
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',

    // Errors
    errorLoadingUser: 'Failed to load current user data',
    successUpdatePassword: 'Password updated successfully',
    errorUpdatePassword: 'Failed to update password',

    // Settings
    settings: 'Settings',
    language: 'Language',
    font: 'Font',
    theme: 'Theme',
    appearance: 'Appearance',

    // Language options
    arabic: 'العربية',
    english: 'English',

    // Font options
    tajawal: 'Tajawal',
    poppins: 'Poppins',
    droidSans: 'Droid Sans',
    alJazeera: 'Al Jazeera Plus',
};

export type Language = 'ar' | 'en';
export type Font = 'tajawal' | 'poppins' | 'droid-sans' | 'al-jazeera';

interface I18nState {
    language: Language;
    font: Font;
    translations: Record<string, string>;
}

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly STORAGE_KEY_LANGUAGE = 'app-language';
    private readonly STORAGE_KEY_FONT = 'app-font';

    private state = signal<I18nState>({
        language: this.getStoredLanguage(),
        font: this.getStoredFont(),
        translations: this.getStoredLanguage() === 'ar' ? AR_TRANSLATIONS : EN_TRANSLATIONS
    });

    // Expose state for template consumption
    language = signal<Language>(this.state().language);
    font = signal<Font>(this.state().font);
    translations = signal<Record<string, string>>(this.state().translations);

    constructor() {
        this.applyLanguage(this.state().language);
        this.applyFont(this.state().font);
    }

    /**
     * Get translation for a key
     */
    t(key: keyof typeof AR_TRANSLATIONS): string {
        return this.translations()[key] || key;
    }

    /**
     * Set language
     */
    setLanguage(language: Language): void {
        if (this.state().language === language) return;

        // Update state
        this.language.set(language);
        const newTranslations = language === 'ar' ? AR_TRANSLATIONS : EN_TRANSLATIONS;
        this.translations.set(newTranslations);

        // Persist to storage
        localStorage.setItem(this.STORAGE_KEY_LANGUAGE, language);

        // Apply to DOM
        this.applyLanguage(language);
    }

    /**
     * Set font
     */
    setFont(font: Font): void {
        if (this.state().font === font) return;

        this.font.set(font);
        localStorage.setItem(this.STORAGE_KEY_FONT, font);
        this.applyFont(font);
    }

    /**
     * Get current language
     */
    getCurrentLanguage(): Language {
        return this.language();
    }

    /**
     * Get current font
     */
    getCurrentFont(): Font {
        return this.font();
    }

    /**
     * Get all available languages
     */
    getAvailableLanguages(): { code: Language; name: string }[] {
        return [
            { code: 'ar', name: this.t('arabic' as any) },
            { code: 'en', name: this.t('english' as any) }
        ];
    }

    /**
     * Get all available fonts
     */
    getAvailableFonts(): { code: Font; name: string }[] {
        return [
            { code: 'tajawal', name: 'Tajawal' },
            { code: 'poppins', name: 'Poppins' },
            { code: 'droid-sans', name: 'Droid Sans' },
            { code: 'al-jazeera', name: 'Al Jazeera Plus' }
        ];
    }

    /**
     * Apply language to DOM
     */
    private applyLanguage(language: Language): void {
        const html = document.documentElement;
        html.lang = language;
        html.dir = language === 'ar' ? 'rtl' : 'ltr';
        html.setAttribute('data-lang', language);

        // Also update body for compatibility
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Apply font to DOM
     */
    private applyFont(font: Font): void {
        const root = document.documentElement;

        // Remove all font classes
        root.classList.remove('font-tajawal', 'font-poppins', 'font-droid-sans', 'font-al-jazeera');

        // Add new font class
        const fontClass = `font-${font}`;
        root.classList.add(fontClass);

        // Set CSS variable
        let fontFamily = '';
        switch (font) {
            case 'tajawal':
                fontFamily = 'Tajawal, sans-serif';
                break;
            case 'poppins':
                fontFamily = 'Poppins, sans-serif';
                break;
            case 'droid-sans':
                fontFamily = '"Droid Sans", sans-serif';
                break;
            case 'al-jazeera':
                fontFamily = '"Al Jazeera Plus", sans-serif';
                break;
        }

        root.style.setProperty('--font-family-override', fontFamily);
    }

    /**
     * Get stored language from localStorage
     */
    private getStoredLanguage(): Language {
        const stored = localStorage.getItem(this.STORAGE_KEY_LANGUAGE);
        if (stored === 'ar' || stored === 'en') {
            return stored;
        }
        // Default to browser language or Arabic
        const browserLang = navigator.language.split('-')[0];
        return browserLang === 'en' ? 'en' : 'ar';
    }

    /**
     * Get stored font from localStorage
     */
    private getStoredFont(): Font {
        const stored = localStorage.getItem(this.STORAGE_KEY_FONT);
        if (['tajawal', 'poppins', 'droid-sans', 'al-jazeera'].includes(stored || '')) {
            return stored as Font;
        }
        return 'tajawal'; // Default font
    }
}
