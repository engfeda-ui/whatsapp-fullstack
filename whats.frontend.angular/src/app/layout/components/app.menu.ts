import { Component, OnInit } from '@angular/core';
import { TokenService } from '@/core/services/token.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: any[] = [];

    constructor(private tokenService: TokenService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'الرئيسية',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'الباقات',
                        icon: 'pi pi-tags',
                        routerLink: ['/plans']
                    },
                    {
                        label: 'اشتراكاتي',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription']
                    },
                    {
                        label: 'الاشتراكات',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription/admin'],
                        visible: () => this.tokenService.isAdmin()
                    },
                    {
                        label: 'الاجهزه',
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
                        label: 'رسالة واحدة',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single']
                    },
                    {
                        label: 'رسالة واحدة مع ملف',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single-media']
                    },
                    {
                        label: 'رسالة لعدة أرقام',
                        icon: 'pi pi-users',
                        routerLink: ['/message/multi']
                    },
                    {
                        label: 'رسالة مع ملف لعدة أرقام',
                        icon: 'pi pi-images',
                        routerLink: ['/message/multi-media']
                    }
                ]
            }
        ];
    }
}
