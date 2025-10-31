import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { authGuard } from './app/core/guards/auth.guard';
import { Access } from '@/pages/auth/access';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./app/pages/dashboards/ecommercedashboard').then((c) => c.EcommerceDashboard),
                data: { breadcrumb: 'E-Commerce Dashboard' }
            },
            {
                path: 'dashboard-banking',
                loadComponent: () => import('./app/pages/dashboards/bankingdashboard').then((c) => c.BankingDashboard),
                data: { breadcrumb: 'Banking Dashboard' }
            },
            {
                path: 'documentation',
                data: { breadcrumb: 'Documentation' },
                loadComponent: () => import('./app/pages/documentation/documentation').then((c) => c.Documentation)
            },
            {
                path: 'pages',
                loadChildren: () => import('@/pages/pages.routes')
            },

            {
                path: 'blocks',
                data: { breadcrumb: 'Free Blocks' },
                loadChildren: () => import('./app/pages/blocks/blocks.routes')
            },
            {
                path: 'profile',
                loadChildren: () => import('@/pages/usermanagement/usermanagement.routes')
            },
            {
                path: 'device',
                loadChildren: () => import('@/pages/Whats App/device/device-routing.module').then((m) => m.DeviceRoutingModule),
                data: { breadcrumb: 'اجهزه' }
            },
            {
                path: 'plans',
                loadChildren: () => import('@/pages/Whats App/plans/plans.module').then((m) => m.PlansModule),
                data: { breadcrumb: 'الباقات' }
            },
            {
                path: 'subscription',
                loadChildren: () => import('@/pages/Whats App/subscription/subscription.module').then((m) => m.SubscriptionModule),
                data: { breadcrumb: 'اشتراكاتي' }
            },
            {
                path: 'message',
                loadChildren: () => import('@/pages/Whats App/message/message.module').then((m) => m.MessageModule),
                data: { breadcrumb: 'رسائل' }
            }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'access', component: Access },
    {
        path: 'auth',
        loadChildren: () => import('@/pages/auth/auth.routes')
    },
    { path: '**', redirectTo: '/notfound' }
];
