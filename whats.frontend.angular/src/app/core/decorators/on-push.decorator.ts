import { ChangeDetectionStrategy, Component, Type } from '@angular/core';

/**
 * Decorator to apply OnPush change detection strategy to components
 * Improves performance by reducing change detection cycles
 */
export function OnPush<T extends Type<any>>(constructor: T): T {
    const metadata = (constructor as any).__annotations__ || [];

    // Find the Component decorator
    const componentDecorator = metadata.find((m: any) => m instanceof Component);

    if (componentDecorator) {
        componentDecorator.changeDetection = ChangeDetectionStrategy.OnPush;
    }

    return constructor;
}
