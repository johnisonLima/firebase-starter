import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { emailVerifiedGuard } from '@core/guards/email-verified.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes')
            .then(m => m.AUTH_ROUTES),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
            .then(m => m.Dashboard),
        canActivate: [
            authGuard,
            emailVerifiedGuard,
        ],
    },
    {
        path: 'playground',
        loadComponent: () => import('./features/dev/playground/playground/playground')
            .then(m => m.Playground),
    }
];
