import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppConfigurator } from './app.configurator';
import { AppLoading } from './app.loading';
import { AppProfileSidebar } from './app.profilesidebar';
import { AppSidebar } from './app.sidebar';
import { AppTopbar } from './app.topbar';

@Component({
    selector: 'p-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppConfigurator, AppProfileSidebar, AppLoading],
    template: `<div class="layout-container" [ngClass]="containerClass">
        <p-sidebar></p-sidebar>
        <div class="layout-content-wrapper">
            <p-topbar></p-topbar>
            <div class="layout-content">
                <router-outlet></router-outlet>
            </div>
        </div>
        <p-profilesidebar></p-profilesidebar>
        <p-configurator></p-configurator>
        <p-loading></p-loading>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout implements OnDestroy {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: (() => void) | null = null;

    menuScrollListener: (() => void) | null = null;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    public readonly layoutService = inject(LayoutService);
    public readonly renderer = inject(Renderer2);
    public readonly router = inject(Router);

    constructor() {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            const menuContainerEl = this.appSidebar?.menuContainer?.nativeElement;

            if ((this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && menuContainerEl && !this.menuScrollListener) {
                this.menuScrollListener = this.renderer.listen(menuContainerEl, 'scroll', () => {
                    if (this.layoutService.isDesktop()) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((_event) => {
            this.hideMenu();
        });
    }

    isOutsideClicked(event: MouseEvent): boolean {
        const target = event.target as Node | null;
        const sidebarNode = this.appSidebar?.el?.nativeElement as Node | undefined;
        const topbarButtonNode = this.appTopBar?.menuButton?.nativeElement as Node | undefined;

        if (!target) {
            return true;
        }

        const clickedSidebar = sidebarNode ? sidebarNode === target || sidebarNode.contains(target) : false;
        const clickedTopbarButton = topbarButtonNode ? topbarButtonNode === target || topbarButtonNode.contains(target) : false;

        return !(clickedSidebar || clickedTopbarButton);
    }

    hideMenu(): void {
        this.layoutService.layoutState.update((prev) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));
        this.layoutService.reset();

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        if (this.menuScrollListener) {
            this.menuScrollListener();
            this.menuScrollListener = null;
        }

        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass(): Record<string, boolean> {
        const layoutConfig = this.layoutService.layoutConfig();
        const layoutState = this.layoutService.layoutState();

        return {
            'layout-light': !layoutConfig.darkTheme,
            'layout-dark': layoutConfig.darkTheme,
            'layout-colorscheme-menu': layoutConfig.menuTheme === 'colorScheme',
            'layout-primarycolor-menu': layoutConfig.menuTheme === 'primaryColor',
            'layout-transparent-menu': layoutConfig.menuTheme === 'transparent',
            'layout-overlay': layoutConfig.menuMode === 'overlay',
            'layout-static': layoutConfig.menuMode === 'static',
            'layout-slim': layoutConfig.menuMode === 'slim',
            'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
            'layout-horizontal': layoutConfig.menuMode === 'horizontal',
            'layout-reveal': layoutConfig.menuMode === 'reveal',
            'layout-drawer': layoutConfig.menuMode === 'drawer',
            'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
            'layout-overlay-active': layoutState.overlayMenuActive,
            'layout-mobile-active': layoutState.staticMenuMobileActive,
            'layout-sidebar-active': layoutState.sidebarActive,
            'layout-sidebar-anchored': layoutState.anchored
        };
    }

    ngOnDestroy(): void {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
