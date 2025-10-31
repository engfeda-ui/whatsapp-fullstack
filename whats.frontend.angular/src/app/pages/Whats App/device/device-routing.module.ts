import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./device-list/device-list.component').then((m) => m.DeviceListComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule {}
