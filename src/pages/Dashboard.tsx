import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MapIcon from '@mui/icons-material/Map';
import ReportIcon from '@mui/icons-material/Report';
import PeopleIcon from '@mui/icons-material/People';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Using only locally defined types

// Icons
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock Data and Types - Hardcoded for now to fix import issues

// Define types locally to avoid import issues
enum ReportStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}
const mockAnalyticsData = {
  totalReports: 7,
  resolvedReports: 2,
  pendingReports: 2,
  averageResolutionTime: 36,
  reportsByWard: [
    { ward: 'Central Ward', count: 2 },
    { ward: 'North Ward', count: 2 },
    { ward: 'South Ward', count: 1 },
    { ward: 'East Ward', count: 1 },
    { ward: 'West Ward', count: 1 },
  ],
  reportsByStatus: [
    { status: 'pending', count: 2 },
    { status: 'assigned', count: 2 },
    { status: 'in_progress', count: 1 },
    { status: 'resolved', count: 1 },
    { status: 'closed', count: 1 },
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

const mockReports = [
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
    status: 'pending',
    ward: 'Central Ward',
    reportedBy: { name: 'Citizen Sharma' },
    createdAt: new Date('2023-06-01T10:30:00'),
    updatedAt: new Date('2023-06-01T10:30:00'),
  },
  {
    id: '2',
    title: 'Broken street light',
    description: 'Street light not working on main road',
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: 'Main Road, North Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?streetlight'],
    status: 'assigned',
    ward: 'North Ward',
    reportedBy: { name: 'Champion Singh' },
    assignedTo: { name: 'Officer Kumar' },
    createdAt: new Date('2023-06-02T14:15:00'),
    updatedAt: new Date('2023-06-02T16:45:00'),
  },
  {
    id: '3',
    title: 'Water logging',
    description: 'Water logging in residential area after rain',
    location: {
      lat: 28.6219,
      lng: 77.2290,
      address: 'Residential Colony, South Ward',
    },
    images: ['https://source.unsplash.com/random/800x600/?flood'],
    status: 'in_progress',
    ward: 'South Ward',
    reportedBy: { name: 'Citizen Sharma' },
    assignedTo: { name: 'Officer Kumar' },
    createdAt: new Date('2023-06-03T09:45:00'),
    updatedAt: new Date('2023-06-03T11:30:00'),
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <StyledCard sx={{ border: '1px solid', borderColor: `${color}30` }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Box sx={{ 
              color: color,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {icon}
            </Box>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {value}
          </Typography>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

// Colors for the pie chart - more subtle palette
const COLORS = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5'];

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Hide welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ 
            mb: 4, 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'primary.light',
            boxShadow: 'none',
            borderRadius: 1
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                Welcome to ULB Waste Management Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                This dashboard provides insights into waste management activities across the city.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500, color: 'text.primary', letterSpacing: 0.5 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Total Reports" 
            value={mockAnalyticsData.totalReports} 
            icon={<ReportProblemIcon sx={{ color: '#90caf9' }} />}
            color="#90caf9"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Resolved" 
            value={mockAnalyticsData.resolvedReports} 
            icon={<CheckCircleIcon sx={{ color: '#a5d6a7' }} />}
            color="#a5d6a7"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Pending" 
            value={mockAnalyticsData.pendingReports} 
            icon={<AccessTimeIcon sx={{ color: '#ffe082' }} />}
            color="#ffe082"
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard 
            title="Avg. Resolution Time" 
            value={`${mockAnalyticsData.averageResolutionTime}h`} 
            icon={<PeopleIcon sx={{ color: '#b39ddb' }} />}
            color="#b39ddb"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <StyledCard sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.light', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AddCircleIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Report Waste
                  </Typography>
                </Box>
                <Button 
                  variant="text" 
                  color="primary" 
                  component={Link}
                  to="/report-form"
                  sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', '&:hover': { background: 'none' } }}
                >
                  Report Now →
                </Button>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <StyledCard sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'info.light', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <MapIcon sx={{ fontSize: 24, mr: 1, color: 'info.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    View Map
                  </Typography>
                </Box>
                <Button 
                  variant="text" 
                  color="info" 
                  component={Link}
                  to="/map"
                  sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', '&:hover': { background: 'none' } }}
                >
                  Open Map →
                </Button>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <StyledCard sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'success.light', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <ReportIcon sx={{ fontSize: 24, mr: 1, color: 'success.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    All Reports
                  </Typography>
                </Box>
                <Button 
                  variant="text" 
                  color="success" 
                  component={Link}
                  to="/reports"
                  sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', '&:hover': { background: 'none' } }}
                >
                  View Reports →
                </Button>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <StyledCard sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'warning.light', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <PeopleIcon sx={{ fontSize: 24, mr: 1, color: 'warning.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Users
                  </Typography>
                </Box>
                <Button 
                  variant="text" 
                  color="warning" 
                  component={Link}
                  to="/users"
                  sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', '&:hover': { background: 'none' } }}
                >
                  Manage Users →
                </Button>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StyledCard sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
                  Reports Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={mockAnalyticsData.reportsTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#90caf9"
                      activeDot={{ r: 6 }}
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StyledCard sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
                  Reports by Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.reportsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockAnalyticsData.reportsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StyledCard sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
                  Reports by Ward
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={mockAnalyticsData.reportsByWard}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ward" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#90caf9" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StyledCard sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
                  Recent Reports
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {mockReports.map((report) => (
                    <Grid item xs={12} key={report.id}>
                      <Card sx={{ 
                        mb: 1, 
                        boxShadow: 'none', 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                        },
                      }}>
                        <CardContent sx={{ py: 1.5, px: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5, color: 'text.primary' }}>
                                {report.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                                {report.description.substring(0, 60)}...
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="caption" sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  color: 'text.secondary',
                                  '& svg': { mr: 0.5, fontSize: '0.75rem' }
                                }}>
                                  <LocationOnIcon fontSize="small" />
                                  {report.ward}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  color: 'text.secondary',
                                  '& svg': { mr: 0.5, fontSize: '0.75rem' }
                                }}>
                                  <CalendarTodayIcon fontSize="small" />
                                  {formatDate(report.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  px: 1.5, 
                                  py: 0.5, 
                                  borderRadius: 10, 
                                  backgroundColor: 
                                    report.status === 'pending' ? '#ff980020' : 
                                    report.status === 'assigned' ? '#6200ea20' : 
                                    report.status === 'in_progress' ? '#00bcd420' : 
                                    report.status === 'resolved' ? '#4caf5020' : '#f4433620',
                                  color: 
                                    report.status === 'pending' ? '#ff9800' : 
                                    report.status === 'assigned' ? '#6200ea' : 
                                    report.status === 'in_progress' ? '#00bcd4' : 
                                    report.status === 'resolved' ? '#4caf50' : '#f44336',
                                  textTransform: 'capitalize',
                                  fontWeight: 500,
                                  letterSpacing: 0.25,
                                  fontSize: '0.7rem'
                                }}
                              >
                                {report.status.replace('_', ' ')}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;