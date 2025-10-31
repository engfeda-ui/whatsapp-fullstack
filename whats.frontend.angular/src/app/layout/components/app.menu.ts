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
                <p-menuitem *ngIf="!item.separator" [item]="item" [index]="index" [root]="true" parentKey=""></p-menuitem>
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
                label: 'OU,O�O�USO3USOc',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'OU,O"OU,OO�',
                        icon: 'pi pi-tags',
                        routerLink: ['/plans']
                    },
                    {
                        label: 'OO\'O�O�OU�OO�US',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription']
                    },
                    {
                        label: 'OU,OO\'O�O�OU�OO�',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/subscription/admin'],
                        visible: () => this.tokenService.isAdmin()
                    },
                    {
                        label: 'OU,OO�U�O�U�',
                        icon: 'pi pi-mobile',
                        routerLink: ['/device']
                    }
                ]
            },
            {
                label: 'OU,O�O3OO�U,',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'O�O3OU,Oc U^OO-O_Oc',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single']
                    },
                    {
                        label: 'O�O3OU,Oc U^OO-O_Oc U.O1 U.U,U?',
                        icon: 'pi pi-envelope',
                        routerLink: ['/message/single-media']
                    },
                    {
                        label: 'O�O3OU,Oc U,O1O_Oc O�O�U,OU.',
                        icon: 'pi pi-users',
                        routerLink: ['/message/multi']
                    },
                    {
                        label: 'O�O3OU,Oc U.O1 U.U,U? U,O1O_Oc O�O�U,OU.',
                        icon: 'pi pi-images',
                        routerLink: ['/message/multi-media']
                    }
                ]
            }
        ];
    }
}
