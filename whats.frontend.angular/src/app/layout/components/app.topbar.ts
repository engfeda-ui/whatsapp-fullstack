import { AppBreadcrumb } from './app.breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
    selector: 'p-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, AppBreadcrumb],
    template: `<div class="layout-topbar">
        <div class="topbar-start">
            <button #menubutton type="button" class="topbar-menubutton p-link p-trigger" (click)="onMenuButtonClick()">
                <i class="pi pi-bars"></i>
            </button>
            <nav p-breadcrumb class="topbar-breadcrumb"></nav>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <li class="relative">
                    <button type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-900 hover:bg-primary-800 transition duration-200 shadow" (click)="onProfileButtonClick()">
                        <i class="pi pi-user text-white text-xl"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>`
})
export class AppTopbar {
    @ViewChild('menubutton') menuButton!: ElementRef;

    public readonly layoutService = inject(LayoutService);

    onMenuButtonClick(): void {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick(): void {
        this.layoutService.showProfileSidebar();
    }

    onConfigButtonClick(): void {
        this.layoutService.showConfigSidebar();
    }
}

