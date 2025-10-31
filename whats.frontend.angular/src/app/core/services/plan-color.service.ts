import { Injectable } from '@angular/core';

export interface PlanColorConfig {
    primary: string;
    secondary: string;
    border: string;
    text: string;
    hover: string;
    bgLight: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlanColorService {
    private colorConfigs: { [key: number]: PlanColorConfig } = {
        1: {
            primary: 'purple',
            secondary: 'purple-600',
            border: 'border-purple-400',
            text: 'text-purple-500',
            hover: 'hover:bg-purple-600',
            bgLight: 'bg-purple-100'
        },
        2: {
            primary: 'blue',
            secondary: 'blue-600',
            border: 'border-blue-400',
            text: 'text-blue-500',
            hover: 'hover:bg-blue-600',
            bgLight: 'bg-blue-100'
        },
        3: {
            primary: 'green',
            secondary: 'green-600',
            border: 'border-green-400',
            text: 'text-green-500',
            hover: 'hover:bg-green-600',
            bgLight: 'bg-green-100'
        },
        4: {
            primary: 'yellow',
            secondary: 'yellow-500',
            border: 'border-yellow-400',
            text: 'text-yellow-500',
            hover: 'hover:bg-yellow-600',
            bgLight: 'bg-yellow-100'
        },
        5: {
            primary: 'red',
            secondary: 'red-500',
            border: 'border-red-400',
            text: 'text-red-500',
            hover: 'hover:bg-red-600',
            bgLight: 'bg-red-100'
        },
        6: {
            primary: 'indigo',
            secondary: 'indigo-600',
            border: 'border-indigo-400',
            text: 'text-indigo-500',
            hover: 'hover:bg-indigo-600',
            bgLight: 'bg-indigo-100'
        }
    };

    getColorConfig(planId: number): PlanColorConfig {
        return this.colorConfigs[planId] || this.colorConfigs[1]; // Default to first config if not found
    }

    getPrimaryColor(planId: number): string {
        return this.getColorConfig(planId).primary;
    }

    getSecondaryColor(planId: number): string {
        return this.getColorConfig(planId).secondary;
    }

    getBorderColor(planId: number): string {
        return this.getColorConfig(planId).border;
    }

    getTextColor(planId: number): string {
        return this.getColorConfig(planId).text;
    }

    getHoverColor(planId: number): string {
        return this.getColorConfig(planId).hover;
    }

    getBgLightColor(planId: number): string {
        return this.getColorConfig(planId).bgLight;
    }

    getAllClasses(planId: number, isSelected: boolean = false): { [key: string]: boolean } {
        const config = this.getColorConfig(planId);

        return {
            [config.border]: true,
            'border-opacity-100': isSelected,
            'border-opacity-30': !isSelected
        };
    }
}
