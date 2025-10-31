import {
    AfterViewChecked,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    computed,
    inject
} from '@angular/core';
import {
    IsActiveMatchOptions,
    NavigationEnd,
    QueryParamsHandling,
    Router,
    RouterModule
} from '@angular/router';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomHandler } from 'primeng/dom';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '@/layout/service/layout.service';
import { MenuItem as PrimeMenuItem } from 'primeng/api';

export interface AppMenuItem extends PrimeMenuItem {
    separator?: boolean;
    visibleWhen?: () => boolean;
    badgeClass?: string;
    queryParamsHandling?: QueryParamsHandling;
    routerLinkActiveOptions?: IsActiveMatchOptions;
    state?: Record<string, unknown>;
    items?: AppMenuItem[];
}

@Component({
    selector: 'p-menuitem',
    standalone: true,
    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
    animations: [
        trigger('children', [
            state(
                'collapsed',
                style({
                    height: '0'
                })
            ),
            state(
                'expanded',
                style({
                    height: '*'
                })
            ),
            state(
                'hidden',
                style({
                    display: 'none'
                })
            ),
            state(
                'visible',
                style({
                    display: 'block'
                })
            ),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    template: `
        <ng-container>
            <div *ngIf="root && isVisible()" class="layout-menuitem-root-text">
                {{ item.label }}
            </div>

            <a
                *ngIf="(!item.routerLink || item.items) && isVisible()"
                [attr.href]="item.url"
                (click)="itemClick($event)"
                (mouseenter)="onMouseEnter()"
                [ngClass]="item['class']"
                [attr.target]="item.target"
                tabindex="0"
                pRipple
                [pTooltip]="item.label"
                [tooltipDisabled]="!(isSlim() && root && !active)"
            >
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item.label }}</span>
                <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
            </a>

            <a
                *ngIf="item.routerLink && !item.items && isVisible()"
                (click)="itemClick($event)"
                (mouseenter)="onMouseEnter()"
                [ngClass]="item['class']"
                [routerLink]="item.routerLink"
                routerLinkActive="active-route"
                [routerLinkActiveOptions]="item.routerLinkActiveOptions ?? defaultRouterLinkActiveOptions"
                [fragment]="item.fragment"
                [queryParamsHandling]="item.queryParamsHandling"
                [preserveFragment]="item.preserveFragment"
                [skipLocationChange]="item.skipLocationChange"
                [replaceUrl]="item.replaceUrl"
                [state]="item.state"
                [queryParams]="item.queryParams"
                [attr.target]="item.target"
                tabindex="0"
                pRipple
                [pTooltip]="item.label"
                [tooltipDisabled]="!(isSlim() && root)"
            >
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item.label }}</span>
                <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
            </a>

            <ul #submenu *ngIf="item.items && isVisible()" [@children]="submenuAnimation" (@children.done)="onSubmenuAnimated($event)">
                <ng-template ngFor let-child let-index="index" [ngForOf]="item.items">
                    <p-menuitem [item]="child" [index]="index" [parentKey]="key"></p-menuitem>
                </ng-template>
            </ul>
        </ng-container>
    `
})
export class AppMenuitem implements OnInit, OnDestroy, AfterViewChecked {
    @Input() item!: AppMenuItem;

    @Input() index!: number;

    @Input() @HostBinding('class.layout-root-menuitem') root = false;

    @Input() parentKey = '';

    @ViewChild('submenu') submenu?: ElementRef<HTMLUListElement>;

    @HostBinding('class.active-menuitem')
    get activeClass(): boolean {
        return this.active;
    }

    active = false;

    private readonly layoutService = inject(LayoutService);
    private readonly router = inject(Router);

    private readonly menuSourceSubscription: Subscription;
    private readonly menuResetSubscription: Subscription;

    readonly defaultRouterLinkActiveOptions: IsActiveMatchOptions = {
        paths: 'exact',
        queryParams: 'ignored',
        matrixParams: 'ignored',
        fragment: 'ignored'
    };

    readonly isSlim = computed(() => this.layoutService.isSlim());
    readonly isSlimPlus = computed(() => this.layoutService.isSlimPlus());
    readonly isHorizontal = computed(() => this.layoutService.isHorizontal());

    key = '';

    constructor() {
        this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
            Promise.resolve().then(() => {
                if (value.routeEvent) {
                    this.active = value.key === this.key || value.key.startsWith(`${this.key}-`);
                } else if (value.key !== this.key && !value.key.startsWith(`${this.key}-`)) {
                    this.active = false;
                }
            });
        });

        this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (this.isSlimPlus() || this.isSlim() || this.isHorizontal()) {
                this.active = false;
            } else if (this.item.routerLink) {
                this.updateActiveStateFromRoute();
            }
        });
    }

    ngOnInit(): void {
        this.key = this.parentKey ? `${this.parentKey}-${this.index}` : String(this.index);

        if (!(this.isSlimPlus() || this.isSlim() || this.isHorizontal()) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    ngAfterViewChecked(): void {
        if (this.root && this.active && this.isDesktop() && (this.isHorizontal() || this.isSlim() || this.isSlimPlus())) {
            const submenuEl = this.submenu?.nativeElement;
            const parentEl = submenuEl?.parentElement ?? undefined;

            if (submenuEl && parentEl) {
                this.calculatePosition(submenuEl, parentEl);
            }
        }
    }

    ngOnDestroy(): void {
        this.menuSourceSubscription.unsubscribe();
        this.menuResetSubscription.unsubscribe();
    }

    get submenuAnimation(): string {
        if (this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())) {
            return this.active ? 'visible' : 'hidden';
        }

        if (this.root) {
            return 'expanded';
        }

        return this.active ? 'expanded' : 'collapsed';
    }

    itemClick(event: Event): void {
        if (this.item.disabled) {
            event.preventDefault();

            return;
        }

        if ((this.root && this.isSlim()) || this.isHorizontal() || this.isSlimPlus()) {
            this.layoutService.layoutState.update((val) => ({
                ...val,
                menuHoverActive: !val.menuHoverActive
            }));
        }

        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        if (this.item.items?.length) {
            this.active = !this.active;

            if (this.root && this.active && (this.isSlim() || this.isHorizontal() || this.isSlimPlus())) {
                this.layoutService.onOverlaySubmenuOpen();
            }
        } else {
            if (this.layoutService.isMobile()) {
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    staticMenuMobileActive: false
                }));
            }

            if (this.isSlim() || this.isHorizontal() || this.isSlimPlus()) {
                this.layoutService.reset();
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    menuHoverActive: false
                }));
            }
        }

        this.layoutService.onMenuStateChange({ key: this.key });
    }

    onMouseEnter(): void {
        if (this.root && (this.isSlim() || this.isHorizontal() || this.isSlimPlus()) && this.layoutService.isDesktop()) {
            if (this.layoutService.layoutState().menuHoverActive) {
                this.active = true;
                this.layoutService.onMenuStateChange({ key: this.key });
            }
        }
    }

    isVisible(): boolean {
        if (this.item.visibleWhen) {
            return this.item.visibleWhen();
        }

        if (typeof this.item.visible === 'boolean') {
            return this.item.visible;
        }

        return true;
    }

    onSubmenuAnimated(event: AnimationEvent): void {
        if (event.toState === 'visible' && this.isDesktop() && (this.isHorizontal() || this.isSlim() || this.isSlimPlus())) {
            const list = event.element as HTMLElement;
            const parent = list.parentElement;

            if (parent) {
                this.calculatePosition(list, parent);
            }
        }
    }

    calculatePosition(overlay: HTMLElement, target: HTMLElement): void {
        const { left, top } = target.getBoundingClientRect();
        const [viewportWidth, viewportHeight] = [window.innerWidth, window.innerHeight];
        const [overlayWidth, overlayHeight] = [overlay.offsetWidth, overlay.offsetHeight];
        const scrollbarWidth = DomHandler.calculateScrollbarWidth();

        overlay.style.top = '';
        overlay.style.left = '';

        if (this.layoutService.isHorizontal()) {
            const projectedWidth = left + overlayWidth + scrollbarWidth;

            overlay.style.left = viewportWidth < projectedWidth ? `${left - (projectedWidth - viewportWidth)}px` : `${left}px`;
        } else if (this.layoutService.isSlim() || this.layoutService.isSlimPlus()) {
            const projectedHeight = top + overlayHeight;

            overlay.style.top = viewportHeight < projectedHeight ? `${top - (projectedHeight - viewportHeight)}px` : `${top}px`;
        }
    }


    updateActiveStateFromRoute(): void {
        const link = this.item.routerLink?.[0];

        if (!link) {
            return;

        }

        const isActive = this.router.isActive(link, this.defaultRouterLinkActiveOptions);

        if (isActive) {
            this.layoutService.onMenuStateChange({
                key: this.key,
                routeEvent: true
            });
        }
    }

    private isDesktop(): boolean {
        return this.layoutService.isDesktop();
    }
}
