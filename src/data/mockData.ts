// Define types locally to avoid import issues
enum UserRole {
  CITIZEN = 'citizen',
  CHAMPION = 'champion',
  OFFICER = 'officer',
  ADMIN = 'admin',
}

enum ReportStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

interface User {
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

interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  status: string;
  ward: string;
  reportedBy: { name: string };
  assignedTo?: { name: string };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

interface Ward {
  id: string;
  name: string;
  boundaries?: number[][];
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ulb.gov.in',
    role: UserRole.ADMIN,
    phone: '9876543210',
    address: 'ULB Office, Main Street',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Officer Kumar',
    email: 'officer@ulb.gov.in',
    role: UserRole.OFFICER,
    phone: '9876543211',
    ward: 'Ward 1',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '3',
    name: 'Champion Singh',
    email: 'champion@example.com',
    role: UserRole.CHAMPION,
    phone: '9876543212',
    ward: 'Ward 2',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date('2023-02-01'),
  },
  {
    id: '4',
    name: 'Citizen Sharma',
    email: 'citizen@example.com',
    role: UserRole.CITIZEN,
    phone: '9876543213',
    ward: 'Ward 3',
    avatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: new Date('2023-02-15'),
  },
];

// Mock Wards
export const mockWards: Ward[] = [
  {
    id: '1',
    name: 'Central Ward',
    number: 1,
    area: '5.2 sq km',
    population: 25000,
  },
  {
    id: '2',
    name: 'North Ward',
    number: 2,
    area: '4.8 sq km',
    population: 22000,
  },
  {
    id: '3',
    name: 'South Ward',
    number: 3,
    area: '6.1 sq km',
    population: 28000,
  },
  {
    id: '4',
    name: 'East Ward',
    number: 4,
    area: '5.5 sq km',
    population: 26000,
  },
  {
    id: '5',
    name: 'West Ward',
    number: 5,
    area: '4.9 sq km',
    population: 23000,
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Garbage overflow',
    description: 'Garbage bin overflowing near market area',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Market Road, Central Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?garbage'],
    status: ReportStatus.PENDING,
    ward: 'Central Ward',
    reportedBy: mockUsers[3],
    createdAt: new Date('2023-06-01T10:30:00'),
    updatedAt: new Date('2023-06-01T10:30:00'),
  },
  {
    id: '2',
    title: 'Blocked drain',
    description: 'Drain blocked causing water logging',
    location: {
      lat: 28.6219,
      lng: 77.2190,
      address: 'Main Street, North Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?drain'],
    status: ReportStatus.ASSIGNED,
    ward: 'North Ward',
    reportedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    createdAt: new Date('2023-06-02T09:15:00'),
    updatedAt: new Date('2023-06-02T14:20:00'),
  },
  {
    id: '3',
    title: 'Waste dumping',
    description: 'Illegal waste dumping near river',
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: 'River Road, South Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?waste'],
    status: ReportStatus.IN_PROGRESS,
    ward: 'South Ward',
    reportedBy: mockUsers[2],
    assignedTo: mockUsers[1],
    createdAt: new Date('2023-06-03T11:45:00'),
    updatedAt: new Date('2023-06-03T16:30:00'),
  },
  {
    id: '4',
    title: 'Broken bin',
    description: 'Waste bin damaged and needs replacement',
    location: {
      lat: 28.6359,
      lng: 77.2100,
      address: 'Park Avenue, East Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?bin'],
    status: ReportStatus.RESOLVED,
    ward: 'East Ward',
    reportedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    createdAt: new Date('2023-06-04T08:20:00'),
    updatedAt: new Date('2023-06-05T13:10:00'),
    resolvedAt: new Date('2023-06-05T13:10:00'),
  },
  {
    id: '5',
    title: 'Sewage leakage',
    description: 'Sewage leaking on main road',
    location: {
      lat: 28.6109,
      lng: 77.2380,
      address: 'Colony Road, West Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?sewage'],
    status: ReportStatus.CLOSED,
    ward: 'West Ward',
    reportedBy: mockUsers[2],
    assignedTo: mockUsers[1],
    createdAt: new Date('2023-06-05T10:00:00'),
    updatedAt: new Date('2023-06-07T09:30:00'),
    resolvedAt: new Date('2023-06-07T09:30:00'),
  },
  {
    id: '6',
    title: 'Waste collection missed',
    description: 'Regular waste collection not done for 3 days',
    location: {
      lat: 28.6229,
      lng: 77.2190,
      address: 'Residential Area, Central Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?waste-collection'],
    status: ReportStatus.PENDING,
    ward: 'Central Ward',
    reportedBy: mockUsers[3],
    createdAt: new Date('2023-06-06T14:20:00'),
    updatedAt: new Date('2023-06-06T14:20:00'),
  },
  {
    id: '7',
    title: 'Garbage burning',
    description: 'Someone burning garbage in open area',
    location: {
      lat: 28.6149,
      lng: 77.2110,
      address: 'Open Ground, North Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?burning'],
    status: ReportStatus.ASSIGNED,
    ward: 'North Ward',
    reportedBy: mockUsers[2],
    assignedTo: mockUsers[1],
    createdAt: new Date('2023-06-07T11:30:00'),
    updatedAt: new Date('2023-06-07T16:45:00'),
  },
];

// Mock Analytics Data
export const mockAnalyticsData = {
  totalReports: mockReports.length,
  resolvedReports: mockReports.filter(report => 
    report.status === ReportStatus.RESOLVED || report.status === ReportStatus.CLOSED
  ).length,
  pendingReports: mockReports.filter(report => 
    report.status === ReportStatus.PENDING || report.status === ReportStatus.ASSIGNED
  ).length,
  averageResolutionTime: 36, // in hours,
  reportsByWard: [
    { ward: 'Central Ward', count: mockReports.filter(report => report.ward === 'Central Ward').length },
    { ward: 'North Ward', count: mockReports.filter(report => report.ward === 'North Ward').length },
    { ward: 'South Ward', count: mockReports.filter(report => report.ward === 'South Ward').length },
    { ward: 'East Ward', count: mockReports.filter(report => report.ward === 'East Ward').length },
    { ward: 'West Ward', count: mockReports.filter(report => report.ward === 'West Ward').length },
  ],
  reportsByStatus: [
    { status: ReportStatus.PENDING, count: mockReports.filter(report => report.status === ReportStatus.PENDING).length },
    { status: ReportStatus.ASSIGNED, count: mockReports.filter(report => report.status === ReportStatus.ASSIGNED).length },
    { status: ReportStatus.IN_PROGRESS, count: mockReports.filter(report => report.status === ReportStatus.IN_PROGRESS).length },
    { status: ReportStatus.RESOLVED, count: mockReports.filter(report => report.status === ReportStatus.RESOLVED).length },
    { status: ReportStatus.CLOSED, count: mockReports.filter(report => report.status === ReportStatus.CLOSED).length },
  ],
  reportsTrend: [
    { date: '2023-06-01', count: 1 },
    { date: '2023-06-02', count: 1 },
    { date: '2023-06-03', count: 1 },
    { date: '2023-06-04', count: 1 },
    { date: '2023-06-05', count: 1 },
    { date: '2023-06-06', count: 1 },
    { date: '2023-06-07', count: 1 },
  ],
};

// Data for charts
export const reportsByStatusData = [
  { name: 'Pending', value: mockReports.filter(report => report.status === ReportStatus.PENDING).length },
  { name: 'Assigned', value: mockReports.filter(report => report.status === ReportStatus.ASSIGNED).length },
  { name: 'In Progress', value: mockReports.filter(report => report.status === ReportStatus.IN_PROGRESS).length },
  { name: 'Resolved', value: mockReports.filter(report => report.status === ReportStatus.RESOLVED).length },
  { name: 'Closed', value: mockReports.filter(report => report.status === ReportStatus.CLOSED).length },
];

export const reportsByWardData = [
  { name: 'Central Ward', value: mockReports.filter(report => report.ward === 'Central Ward').length },
  { name: 'North Ward', value: mockReports.filter(report => report.ward === 'North Ward').length },
  { name: 'South Ward', value: mockReports.filter(report => report.ward === 'South Ward').length },
  { name: 'East Ward', value: mockReports.filter(report => report.ward === 'East Ward').length },
  { name: 'West Ward', value: mockReports.filter(report => report.ward === 'West Ward').length },
];

export const reportsTrendData = [
  { name: '2023-06-01', new: 1, resolved: 0 },
  { name: '2023-06-02', new: 1, resolved: 0 },
  { name: '2023-06-03', new: 1, resolved: 1 },
  { name: '2023-06-04', new: 1, resolved: 0 },
  { name: '2023-06-05', new: 1, resolved: 1 },
  { name: '2023-06-06', new: 1, resolved: 0 },
  { name: '2023-06-07', new: 1, resolved: 1 },
];

// Export reports for easier access
export const reports = mockReports;