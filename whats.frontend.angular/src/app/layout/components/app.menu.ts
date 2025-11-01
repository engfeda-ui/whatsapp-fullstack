import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '@/core/services/token.service';
import { TranslationService } from '@/core/services/translation.service';
import { AppMenuitem, AppMenuItem } from './app.menuitem';

@Component({
    selector: 'p-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model(); let index = index">
                <p-menuitem *ngIf="!item.separator" [item]="item" [index]="index" [root]="true"></p-menuitem>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    private readonly tokenService = inject(TokenService);
    private readonly translationService = inject(TranslationService);

    model = computed(() => this.buildMenuModel());

    ngOnInit(): void {
        // Menu model is now computed, updates automatically when language changes
    }

    private buildMenuModel(): AppMenuItem[] {
        return [
            {
                label: this.translationService.translate('services'),
                icon: 'pi pi-home',
                items: [
                    {
                        label: this.translationService.translate('plans'),
                        icon: 'pi pi-tags',
                        routerLink: ['/plans']
                    },
                    {
                        label: this.translationService.translate('subscriptions'),
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription']
                    },
                    {
                        label: this.translationService.translate('admin_subscriptions'),
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription/admin'],
                        visibleWhen: () => this.tokenService.isAdmin()
                    },
                    {
                        label: this.translationService.translate('devices'),
                        icon: 'pi pi-mobile',
                        routerLink: ['/device']
                    }
                ]
            },
            {
                label: this.translationService.translate('messages'),
                icon: 'pi pi-home',
                items: [
                    {
                        label: this.translationService.translate('send_single_message'),
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single']
                    },
                    {
                        label: this.translationService.translate('send_single_with_file'),
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single-media']
                    },
                    {
                        label: this.translationService.translate('send_multiple'),
                        icon: 'pi pi-users',
                        routerLink: ['/message/multi']
                    },
                    {
                        label: this.translationService.translate('send_multiple_with_files'),
                        icon: 'pi pi-images',
                        routerLink: ['/message/multi-media']
                    }
                ]
            }
        ];
    }
}
