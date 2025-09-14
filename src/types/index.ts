// Analytics Data interface moved to analytics.ts

// User Roles
export const UserRole = {
  CITIZEN: 'citizen',
  CHAMPION: 'champion',
  OFFICER: 'officer',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Report Status
export const ReportStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  ward?: string;
  avatar?: string;
  createdAt: Date;
}

// Report Interface
export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  status: ReportStatus;
  ward: string;
  reportedBy: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// Ward Interface
export interface Ward {
  id: string;
  name: string;
  number: number;
  area: string;
  population: number;
}