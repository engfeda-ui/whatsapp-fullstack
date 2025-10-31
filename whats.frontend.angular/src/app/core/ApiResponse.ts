export interface QueryOptions {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface ValidationError {
    field: string;
    message: string;
}

// Original NestJS format (keep for backward compatibility)
export interface ApiResponse<T> {
    isSuccess: boolean;
    returnCode: number;
    queryOptions: QueryOptions | null;
    data: T;
    message: string | null;
    transactionId: string | null;
    requestCorrelationId: string | null;
    errors: string[] | null;
    propErrors: ValidationError[] | null;
    createdOrChangedProperties: Record<string, unknown> | null;
}

// New .NET format
export interface DotNetApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error?: string | null;
}

// Utility function to convert .NET response to Angular format
export function convertDotNetResponse<T>(dotNetResponse: DotNetApiResponse<T>): ApiResponse<T> {
    return {
        isSuccess: dotNetResponse.success,
        returnCode: dotNetResponse.success ? 200 : 400,
        queryOptions: null,
        data: dotNetResponse.data!,
        message: dotNetResponse.message,
        transactionId: null,
        requestCorrelationId: null,
        errors: dotNetResponse.error ? [dotNetResponse.error] : null,
        propErrors: null,
        createdOrChangedProperties: null
    };
}
