import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscripListComponent } from './subscrip-list/subscrip-list.component';
import { AdminSubscriptionComponent } from './admin-subscription/admin-subscription.component';
import { adminGuard } from '../../../core/guards/admin.guard';
import { authGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: SubscripListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: AdminSubscriptionComponent,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionRoutingModule {}
