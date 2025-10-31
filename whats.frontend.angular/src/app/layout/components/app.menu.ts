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
                label: 'OU,Oï¿½Oï¿½USO3USOc',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'OU,O"OU,OOï¿½',
                        icon: 'pi pi-tags',
                        routerLink: ['/plans']
                    },
                    {
                        label: 'OO\'Oï¿½Oï¿½OUï¿½OOï¿½US',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription']
                    },
                    {
                        label: 'OU,OO\'Oï¿½Oï¿½OUï¿½OOï¿½',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription/admin'],
                        visibleWhen: () => this.tokenService.isAdmin()
                    },
                    {
                        label: 'OU,OOï¿½Uï¿½Oï¿½Uï¿½',
                        icon: 'pi pi-mobile',
                        routerLink: ['/device']
                    }
                ]
            },
            {
                label: 'OU,Oï¿½O3OOï¿½U,',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Oï¿½O3OU,Oc U^OO-O_Oc',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single']
                    },
                    {
                        label: 'Oï¿½O3OU,Oc U^OO-O_Oc U.O1 U.U,U?',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single-media']
                    },
                    {
                        label: 'Oï¿½O3OU,Oc U,O1O_Oc Oï¿½Oï¿½U,OU.',
                        icon: 'pi pi-users',
                        routerLink: ['/message/multi']
                    },
                    {
                        label: 'Oï¿½O3OU,Oc U.O1 U.U,U? U,O1O_Oc Oï¿½Oï¿½U,OU.',
                        icon: 'pi pi-images',
                        routerLink: ['/message/multi-media']
                    }
                ]
            }
        ];
    }
}
