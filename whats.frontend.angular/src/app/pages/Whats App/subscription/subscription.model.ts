import { Plan } from '../plans/plan.model';
import { Period } from '../plans/period.model';

export interface User {
    id: number;
    tenantId: number;
    companyName: string;
    fullName: string;
    mobileNumber: string;
    isActive: boolean;
    userType: number;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    id: number;
    price: number;
    startDate: string;
    endDate: string;
    pricePayDate?: string;
    user?: User;
    plan: Plan;
    period: Period;
    devicesCount: number;
}
