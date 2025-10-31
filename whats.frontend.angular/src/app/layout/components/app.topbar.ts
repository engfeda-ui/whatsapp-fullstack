import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'p-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, BreadcrumbModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
    template: `<div class="layout-topbar">
        <div class="topbar-start">
            <button #menubutton type="button" class="topbar-menubutton p-link p-trigger" (click)="onMenuButtonClick()">
                <i class="pi pi-bars"></i>
            </button>
            <nav p-breadcrumb class="topbar-breadcrumb"></nav>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <!-- <li class="topbar-search">
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Search" class="w-48 sm:w-full" />
                    </p-iconfield>
                </li>
                <li class="ml-3">
                    <p-button icon="pi pi-palette" rounded (onClick)="onConfigButtonClick()"></p-button>
                </li> -->
                <li class="relative">
                    <button type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-900 hover:bg-primary-800 transition duration-200 shadow" (click)="onProfileButtonClick()">
                        <!-- Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã†â€™ ÃƒËœÃ‚Â§ÃƒËœÃ‚Â³ÃƒËœÃ‚ÂªÃƒËœÃ‚Â®ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦ ÃƒËœÃ‚ÂµÃƒâ„¢Ã‹â€ ÃƒËœÃ‚Â±ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â¯Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¹ Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â  ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¥ÃƒËœÃ‚Â°ÃƒËœÃ‚Â§ ÃƒËœÃ‚Â£ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¯ÃƒËœÃ‚Âª -->
                        <!-- <img src="/layout/images/avatar.png" alt="Profile" class="w-10 h-10 rounded-full" /> -->

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
