// Adapter للتحويل بين Angular IDevice و .NET DeviceDto

export interface DotNetDevice {
    id: number;
    name: string;
    phoneNumber: string;
    apiKey: string;
    qrCode?: string;
    status: string;
    createdAt: string;
    lastConnectedAt?: string;
    isActive: boolean;
    userId: string;
}

export interface IDevice {
    id?: number;
    nameAr: string;
    nameEn: string;
    whatsNumber: string;
    isOnline?: boolean;
    newDeviceApiKey?: string;
    subscriptionId?: number;
    subscriptionNameAr?: string;
    subscriptionNameEn?: string;
}

// Convert from .NET to Angular
export function fromDotNetDevice(dotNetDevice: DotNetDevice): IDevice {
    return {
        id: dotNetDevice.id,
        nameAr: dotNetDevice.name,
        nameEn: dotNetDevice.name,
        whatsNumber: dotNetDevice.phoneNumber,
        isOnline: dotNetDevice.status === 'connected',
        newDeviceApiKey: dotNetDevice.apiKey
    };
}

// Convert from Angular to .NET
export function toDotNetDevice(angularDevice: IDevice): Partial<DotNetDevice> {
    return {
        name: angularDevice.nameEn || angularDevice.nameAr,
        phoneNumber: angularDevice.whatsNumber,
        isActive: true
    };
}
