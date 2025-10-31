export interface AnalyticsOverview {
    totalMessages: number;
    totalDevices: number;
    activeDevices: number;
    deliveryRate: number;
    readRate: number;
    failureRate: number;
    avgResponseTime: number;
    totalCost: number;
    period: DateRange;
}

export interface MessageAnalytics {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    pending: number;
    byType: MessageTypeBreakdown;
    byDevice: DeviceBreakdown[];
    byHour: TimeSeriesData[];
    byDay: TimeSeriesData[];
}

export interface MessageTypeBreakdown {
    text: number;
    image: number;
    video: number;
    audio: number;
    document: number;
}

export interface DeviceBreakdown {
    deviceId: string | number;
    deviceName: string;
    messagesSent: number;
    messagesReceived: number;
    deliveryRate: number;
    uptime: number;
    lastActive: string;
}

export interface TimeSeriesData {
    timestamp: string;
    value: number;
    label?: string;
}

export interface DateRange {
    startDate: string | Date;
    endDate: string | Date;
}

export interface PerformanceMetrics {
    avgMessageDeliveryTime: number;
    avgQRCodeGenerationTime: number;
    apiResponseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    activeConnections: number;
}

export interface CostAnalytics {
    totalCost: number;
    costPerMessage: number;
    costByDevice: CostByDevice[];
    projectedMonthlyCost: number;
    currency: string;
}

export interface CostByDevice {
    deviceId: string | number;
    deviceName: string;
    messageCount: number;
    cost: number;
}

export interface UsageStatistics {
    peakHours: number[];
    busyDays: string[];
    mostActiveUsers: TopUser[];
    messageGrowth: GrowthData;
    deviceGrowth: GrowthData;
}

export interface TopUser {
    userId: string | number;
    username: string;
    messageCount: number;
    lastActive: string;
}

export interface GrowthData {
    current: number;
    previous: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsFilter {
    dateRange: DateRange;
    deviceIds?: (string | number)[];
    messageTypes?: string[];
    statuses?: string[];
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
}

export interface ExportOptions {
    format: 'csv' | 'excel' | 'pdf' | 'json';
    dateRange: DateRange;
    includeCharts: boolean;
    sections: string[];
}
