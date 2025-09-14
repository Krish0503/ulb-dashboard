import { ReportStatus } from './index';

// Analytics Data
export interface AnalyticsData {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  averageResolutionTime: number;
  reportsByWard: {
    ward: string;
    count: number;
  }[];
  reportsByStatus: {
    status: ReportStatus;
    count: number;
  }[];
  reportsTrend: {
    date: string;
    count: number;
  }[];
}