import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '@/core/services/token.service';
import { AppMenuitem, AppMenuItem } from './app.menuitem';

@Component({
    selector: 'p-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let index = index">
                <p-menuitem *ngIf="!item.separator" [item]="item" [index]="index" [root]="true"></p-menuitem>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    model: AppMenuItem[] = [];

    private readonly tokenService = inject(TokenService);

    ngOnInit(): void {
        this.model = this.buildMenuModel();
    }

    private buildMenuModel(): AppMenuItem[] {
        return [
            {
                label: 'الخدمات',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'الباقات',
                        icon: 'pi pi-tags',
                        routerLink: ['/plans']
                    },
                    {
                        label: 'الاشتراكات',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription']
                    },
                    {
                        label: 'إدارة الاشتراكات',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription/admin'],
                        visibleWhen: () => this.tokenService.isAdmin()
                    },
                    {
                        label: 'الأجهزة',
                        icon: 'pi pi-mobile',
                        routerLink: ['/device']
                    }
                ]
            },
            {
                label: 'الرسائل',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'إرسال رسالة واحدة',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single']
                    },
                    {
                        label: 'إرسال رسالة واحدة مع ملف',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single-media']
                    },
                    {
                        label: 'إرسال رسائل متعددة',
                        icon: 'pi pi-users',
                        routerLink: ['/message/multi']
                    },
                    {
                        label: 'إرسال رسائل مع ملفات متعددة',
                        icon: 'pi pi-images',
                        routerLink: ['/message/multi-media']
                    }
                ]
            }
        ];
    }
}
