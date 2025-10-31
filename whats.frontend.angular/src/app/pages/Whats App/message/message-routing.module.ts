import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleMessageComponent } from './single-message/single-message.component';
import { SingleMediaComponent } from './single-media/single-media.component';
import { MultiMessageComponent } from './multi-message/multi-message.component';
import { MultiMediaComponent } from './multi-media/multi-media.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'single',
        pathMatch: 'full'
    },
    {
        path: 'single',
        component: SingleMessageComponent,
        data: { breadcrumb: 'إرسال واحده' }
    },
    {
        path: 'single-media',
        component: SingleMediaComponent,
        data: { breadcrumb: 'إرسال واحده مع ملف' }
    },
    {
        path: 'multi',
        component: MultiMessageComponent,
        data: { breadcrumb: 'إرسال لعدة أرقام' }
    },
    {
        path: 'multi-media',
        component: MultiMediaComponent,
        data: { breadcrumb: 'إرسال ملف لعدة أرقام' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessageRoutingModule {}
