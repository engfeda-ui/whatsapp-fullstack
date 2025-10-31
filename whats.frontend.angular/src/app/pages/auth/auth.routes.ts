import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { Register } from './register/register.component';
import { ForgotPassword } from './forgotpassword';
import { NewPassword } from './newpassword';
import { Verification } from './verification/verification.component';
import { LockScreen } from './lockscreen';
import { Login } from './login/login.component';
import { guestGuard } from '../../core/guards/guest.guard';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'forgotpassword', component: ForgotPassword, canActivate: [guestGuard] },
    { path: 'newpassword', component: NewPassword, canActivate: [guestGuard] },
    { path: 'verification', component: Verification },
    { path: 'lockscreen', component: LockScreen, canActivate: [guestGuard] }
] as Routes;
