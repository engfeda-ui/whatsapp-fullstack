export interface Subscription {
    id: string | number;
    userId: string | number;
    planId: string | number;
    planName?: string;
    startDate: Date | string;
    endDate: Date | string;
    status: SubscriptionStatus;
    price: number;
    currency?: string;
    autoRenew?: boolean;
    deviceLimit?: number;
    messageLimit?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended';

export interface SubscriptionStats {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    revenue: number;
    currency?: string;
}

export interface SubscriptionFilter {
    status?: SubscriptionStatus;
    userId?: string | number;
    planId?: string | number;
    startDate?: Date | string;
    endDate?: Date | string;
}

export interface SubscriptionFormData {
    userId: string | number;
    planId: string | number;
    startDate: Date | string;
    autoRenew: boolean;
}
