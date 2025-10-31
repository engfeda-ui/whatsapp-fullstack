import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AppMenu } from './app.menu';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'p-sidebar',
    standalone: true,
    imports: [AppMenu, RouterModule],
    template: ` <div class="layout-sidebar" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
        <div class="sidebar-header">
            <a [routerLink]="['/']" class="app-logo">
                <img src="/layout/images/logo.png" alt="" />
            </a>
            <button class="layout-sidebar-anchor p-link z-2" type="button" (click)="anchor()"></button>
        </div>

        <div #menuContainer class="layout-menu-container">
            <p-menu></p-menu>
        </div>
    </div>`
})
export class AppSidebar {
    timeout: ReturnType<typeof setTimeout> | null = null;

    @ViewChild('menuContainer') menuContainer?: ElementRef<HTMLDivElement>;

    public readonly layoutService = inject(LayoutService);
    public readonly el = inject(ElementRef);

    onMouseEnter(): void {
        if (!this.layoutService.layoutState().anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.layoutService.layoutState.update((state) => {
                if (!state.sidebarActive) {
                    return {
                        ...state,
                        sidebarActive: true
                    };
                }

                return state;
            });
        }
    }

    onMouseLeave(): void {
        if (!this.layoutService.layoutState().anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.layoutService.layoutState.update((state) => {
                        if (state.sidebarActive) {
                            return {
                                ...state,
                                sidebarActive: false
                            };
                        }

                        return state;
                    });
                }, 300);
            }
        }
    }

    anchor(): void {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            anchored: !state.anchored
        }));
    }
}
