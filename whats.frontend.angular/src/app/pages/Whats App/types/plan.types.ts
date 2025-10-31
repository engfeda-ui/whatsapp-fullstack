export interface Plan {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    currency: string;
    duration: number;
    durationType: 'day' | 'month' | 'year';
    features: PlanFeature[];
    deviceLimit: number;
    messageLimit: number;
    isActive: boolean;
    isPopular?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface PlanFeature {
    name: string;
    description?: string;
    included: boolean;
    limit?: number | string;
}

export interface PlanFormData {
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
    durationType: 'day' | 'month' | 'year';
    deviceLimit: number;
    messageLimit: number;
    isActive: boolean;
    features: PlanFeature[];
}

export interface PlanStats {
    totalPlans: number;
    activePlans: number;
    totalSubscriptions: number;
    revenue: number;
}
