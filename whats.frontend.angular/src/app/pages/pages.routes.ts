import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Invoice } from './invoice/invoice';
import { AboutUs } from './aboutus/aboutus';
import { Help } from './help/help';
import { Faq } from './faq/faq';
import { ContactUs } from './contactus/contactus';
import { authGuard } from '../core/guards/auth.guard';

export default [
    { path: 'documentation', component: Documentation, canActivate: [authGuard] },
    { path: 'crud', component: Crud, canActivate: [authGuard] },
    { path: 'empty', component: Empty, canActivate: [authGuard] },
    { path: 'invoice', component: Invoice, canActivate: [authGuard] },
    { path: 'aboutus', component: AboutUs, canActivate: [authGuard] },
    { path: 'help', component: Help, canActivate: [authGuard] },
    { path: 'faq', component: Faq, canActivate: [authGuard] },
    { path: 'contact', component: ContactUs, canActivate: [authGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
