export interface Plan {
    // Basic Info
    id: number;
    nameAr: string;
    nameEn: string;

    // Descriptions
    shortDescriptionAr: string;
    shortDescriptionEn: string;
    descriptionAr: string;
    descriptionEn: string;

    // Limits & Features
    devices: number;
    applications: number;
    dailyLimit: number;
    monthlyLimit: number;

    // Pricing
    price: number;
    isSpecial: boolean;

    // Metadata
    createdBy: number | null;
    createdAt: string;
    updatedBy: number | null;
    updatedAt: string | null;
}
