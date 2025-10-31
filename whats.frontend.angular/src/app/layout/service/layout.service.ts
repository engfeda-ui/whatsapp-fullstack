import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export type ColorScheme = 'light' | 'dark' | 'dim';

export interface LayoutConfig {
    inputStyle: string;
    preset: string;
    primary: string;
    surface: string | null;
    ripple: boolean;
    darkTheme: boolean;
    menuMode: 'static' | 'overlay' | 'slim' | 'slim-plus' | 'horizontal' | 'reveal' | 'drawer';
    menuTheme: 'colorScheme' | 'primaryColor' | 'transparent';
    colorScheme?: ColorScheme;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    profileSidebarVisible: boolean;
    sidebarActive: boolean;
    anchored: boolean;
    overlaySubmenuActive: boolean;
    activeMenuItem: string | null;
}

export interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private _config: LayoutConfig = {
        ripple: false,
        preset: 'Aura',
        primary: 'indigo',
        inputStyle: 'outlined',
        surface: null,
        darkTheme: false,
        menuMode: 'static',
        menuTheme: 'colorScheme'
    };

    private _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        activeMenuItem: null
    };

    layoutConfig = signal<LayoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<LayoutConfig>();

    private overlayOpen = new Subject<void>();

    private menuSource = new Subject<MenuChangeEvent>();

    private resetSource = new Subject<void>();

    menuSource$ = this.menuSource.asObservable();

    resetSource$ = this.resetSource.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    isSlim = computed(() => this.layoutConfig().menuMode === 'slim');

    isSlimPlus = computed(() => this.layoutConfig().menuMode === 'slim-plus');

    isHorizontal = computed(() => this.layoutConfig().menuMode === 'horizontal');

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    isSidebarStateChanged = computed(() => {
        const { menuMode } = this.layoutConfig();

        return menuMode === 'horizontal' || menuMode === 'slim' || menuMode === 'slim-plus';
    });

    private initialized = false;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();

            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;

                return;
            }

            this.handleDarkModeTransition(config);
        });

        effect(() => {
            if (this.isSidebarStateChanged()) {
                this.reset();
            }
        });
    }

    private handleDarkModeTransition(config: LayoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: LayoutConfig): void {
        const doc = document as Document & {
            startViewTransition?: (callback: () => void) => { ready: Promise<void> };
        };

        const transition = doc.startViewTransition?.(() => {
            this.toggleDarkMode(config);
        });

        if (transition) {
            transition.ready
                .then(() => {
                    this.onTransitionEnd();
                })
                .catch(() => {});
        }
    }

    toggleDarkMode(config?: LayoutConfig): void {
        const nextConfig = config || this.layoutConfig();

        if (nextConfig.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private onTransitionEnd(): void {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onMenuToggle(): void {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({
                ...prev,
                overlayMenuActive: !this.layoutState().overlayMenuActive
            }));

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next();
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive
            }));
        } else {
            const isActive = !this.layoutState().staticMenuMobileActive;

            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuMobileActive: isActive
            }));

            if (isActive) {
                this.overlayOpen.next();
            }
        }
    }

    onConfigUpdate(): void {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent): void {
        this.menuSource.next(event);
    }

    reset(): void {
        this.resetSource.next();
    }

    onOverlaySubmenuOpen(): void {
        this.overlayOpen.next();
    }

    showProfileSidebar(): void {
        this.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: true
        }));
    }

    showConfigSidebar(): void {
        this.layoutState.update((state) => ({
            ...state,
            configSidebarVisible: true
        }));
    }

    hideConfigSidebar(): void {
        this.layoutState.update((prev) => ({ ...prev, configSidebarVisible: false }));
    }

    isDesktop(): boolean {
        return window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }
}
