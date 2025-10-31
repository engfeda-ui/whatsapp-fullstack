export interface MessageTemplate {
    id: string | number;
    name: string;
    content: string;
    category: TemplateCategory;
    variables: TemplateVariable[];
    language: string;
    status: TemplateStatus;
    mediaUrl?: string;
    mediaType?: string;
    buttons?: TemplateButton[];
    createdAt: string | Date;
    updatedAt: string | Date;
    usageCount: number;
    lastUsed?: string | Date;
}

export type TemplateCategory = 'marketing' | 'transactional' | 'otp' | 'customer_service' | 'notification' | 'promotional' | 'custom';

export type TemplateStatus = 'active' | 'draft' | 'archived' | 'pending_approval';

export interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'url' | 'phone';
    required: boolean;
    defaultValue?: string;
    placeholder?: string;
    validation?: string;
    example?: string;
}

export interface TemplateButton {
    type: 'url' | 'phone' | 'quick_reply';
    text: string;
    value: string;
}

export interface TemplateFormData {
    name: string;
    content: string;
    category: TemplateCategory;
    variables: TemplateVariable[];
    language: string;
    mediaUrl?: string;
    buttons?: TemplateButton[];
}

export interface TemplatePreview {
    content: string;
    mediaUrl?: string;
    buttons?: TemplateButton[];
}

export interface TemplateUsage {
    templateId: string | number;
    usageCount: number;
    lastUsed: string | Date;
    successRate: number;
    avgDeliveryTime: number;
}

export interface QuickReply {
    id: string | number;
    text: string;
    templateId?: string | number;
    category: string;
    order: number;
}

export interface TemplateFilter {
    category?: TemplateCategory;
    status?: TemplateStatus;
    language?: string;
    search?: string;
}

export interface BulkTemplateMessage {
    templateId: string | number;
    recipients: TemplateRecipient[];
    scheduleAt?: string | Date;
}

export interface TemplateRecipient {
    phoneNumber: string;
    variables: Record<string, string>;
}
