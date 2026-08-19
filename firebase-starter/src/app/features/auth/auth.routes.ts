import { Routes } from '@angular/router';

import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { VerifyEmail } from './pages/verify-email/verify-email';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
    canActivate: [guestGuard],
  },
  
];