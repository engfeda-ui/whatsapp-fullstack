import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = {
    ar: {
      // Common
      'login': 'تسجيل الدخول',
      'logout': 'تسجيل الخروج',
      'username': 'اسم المستخدم',
      'password': 'كلمة المرور',
      'email': 'البريد الإلكتروني',
      'phone': 'رقم الهاتف',
      'settings': 'الإعدادات',
      'language': 'اللغة',
      'arabic': 'العربية',
      'english': 'English',

      // Login Page
      'please_enter_your_data': 'الرجاء إدخال بياناتك',
      'remember_me': 'تذكرني',
      'local_login_credentials': 'بيانات تسجيل الدخول المحلية:',
      'username_label': 'اسم المستخدم',
      'password_label': 'كلمة المرور',
      'dont_have_account': 'ليس لديك حساب؟',
      'create_new_account': 'إنشاء حساب جديد',
      'login_button': 'تسجيل الدخول',
      'loading': 'جاري التحميل...',
      'login_success': 'تم تسجيل الدخول بنجاح',
      'login_failed': 'فشل تسجيل الدخول',
      'login_error': 'حدث خطأ أثناء تسجيل الدخول',
      'login_success_dev': 'تم تسجيل الدخول بنجاح (حساب تطوير)',

      // Services Menu
      'services': 'الخدمات',
      'plans': 'الباقات',
      'subscriptions': 'الاشتراكات',
      'admin_subscriptions': 'إدارة الاشتراكات',
      'devices': 'الأجهزة',

      // Messages Menu
      'messages': 'الرسائل',
      'send_single_message': 'إرسال رسالة واحدة',
      'send_single_with_file': 'إرسال رسالة واحدة مع ملف',
      'send_multiple': 'إرسال رسائل متعددة',
      'send_multiple_with_files': 'إرسال رسائل مع ملفات متعددة',

      // Buttons
      'save': 'حفظ',
      'cancel': 'إلغاء',
      'delete': 'حذف',
      'edit': 'تعديل',
      'add': 'إضافة',
      'submit': 'إرسال',
      'back': 'رجوع',

      // Messages
      'success': 'نجح',
      'error': 'خطأ',
      'warning': 'تحذير',
      'info': 'معلومة',
      'no_data': 'لا توجد بيانات'
    },
    en: {
      // Common
      'login': 'Login',
      'logout': 'Logout',
      'username': 'Username',
      'password': 'Password',
      'email': 'Email',
      'phone': 'Phone',
      'settings': 'Settings',
      'language': 'Language',
      'arabic': 'العربية',
      'english': 'English',

      // Login Page
      'please_enter_your_data': 'Please enter your data',
      'remember_me': 'Remember me',
      'local_login_credentials': 'Local login credentials:',
      'username_label': 'Username',
      'password_label': 'Password',
      'dont_have_account': "Don't have an account?",
      'create_new_account': 'Create new account',
      'login_button': 'Login',
      'loading': 'Loading...',
      'login_success': 'Login successful',
      'login_failed': 'Login failed',
      'login_error': 'An error occurred during login',
      'login_success_dev': 'Login successful (dev account)',

      // Services Menu
      'services': 'Services',
      'plans': 'Plans',
      'subscriptions': 'Subscriptions',
      'admin_subscriptions': 'Admin Subscriptions',
      'devices': 'Devices',

      // Messages Menu
      'messages': 'Messages',
      'send_single_message': 'Send Single Message',
      'send_single_with_file': 'Send Single Message with File',
      'send_multiple': 'Send Multiple Messages',
      'send_multiple_with_files': 'Send Multiple Messages with Files',

      // Buttons
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'add': 'Add',
      'submit': 'Submit',
      'back': 'Back',

      // Messages
      'success': 'Success',
      'error': 'Error',
      'warning': 'Warning',
      'info': 'Info',
      'no_data': 'No data'
    }
  };

  currentLanguage = signal<'ar' | 'en'>('ar');

  constructor() {
    const saved = localStorage.getItem('language') as 'ar' | 'en';
    if (saved) {
      this.currentLanguage.set(saved);
    }
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang][key as keyof typeof this.translations['ar']] || key;
  }

  setLanguage(lang: 'ar' | 'en'): void {
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);

    // Update HTML lang and dir attributes
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getLanguage(): 'ar' | 'en' {
    return this.currentLanguage();
  }
}
