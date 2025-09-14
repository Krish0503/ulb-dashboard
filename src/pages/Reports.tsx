import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock Data
import { mockReports, mockWards } from '../data/mockData';

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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);

  // Filter and sort reports
  useEffect(() => {
    let filtered = [...mockReports];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by ward
    if (selectedWard !== 'all') {
      filtered = filtered.filter(report => report.ward === selectedWard);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    
    // Sort reports
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'ward':
        filtered.sort((a, b) => a.ward.localeCompare(b.ward));
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    setFilteredReports(filtered);
  }, [searchTerm, selectedWard, selectedStatus, sortBy]);

  // Get status color
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return { bg: '#fff8e1', color: '#ff8f00' };
      case ReportStatus.ASSIGNED:
        return { bg: '#e3f2fd', color: '#1976d2' };
      case ReportStatus.IN_PROGRESS:
        return { bg: '#e8f5e9', color: '#388e3c' };
      case ReportStatus.RESOLVED:
        return { bg: '#e8f5e9', color: '#388e3c' };
      case ReportStatus.CLOSED:
        return { bg: '#e0f2f1', color: '#00897b' };
      default:
        return { bg: '#f5f5f5', color: '#616161' };
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Waste Reports
        </Typography>
      </motion.div>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="ward-select-label">Ward</InputLabel>
              <Select
                labelId="ward-select-label"
                id="ward-select"
                value={selectedWard}
                label="Ward"
                onChange={(e) => setSelectedWard(e.target.value)}
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Wards</MenuItem>
                {mockWards.map((ward) => (
                  <MenuItem key={ward.id} value={ward.name}>{ward.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.values(ReportStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="ward">Ward</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredReports.length} reports found
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <AnimatePresence>
        <Grid container spacing={3}>
          {filteredReports.map((report, index) => {
            const statusColor = getStatusColor(report.status);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <StyledCard>
                    <CardMedia
                      component="img"
                      height="140"
                      image={report.images[0]}
                      alt={report.title}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {report.title}
                        </Typography>
                        <Chip 
                          label={report.status.replace('_', ' ')} 
                          size="small"
                          sx={{ 
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {report.description.substring(0, 100)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {report.ward}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Reported by: {report.reportedBy.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(report.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {(report.status === ReportStatus.PENDING) && (
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<AssignmentIcon />}
                            fullWidth
                            size="small"
                          >
                            Assign
                          </Button>
                        )}
                        
                        {(report.status === ReportStatus.ASSIGNED || report.status === ReportStatus.IN_PROGRESS) && (
                          <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            fullWidth
                            size="small"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        
                        <Button 
                          variant="outlined" 
                          color="primary"
                          fullWidth
                          size="small"
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            );
          })}
          
          {filteredReports.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No reports found matching your filters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </AnimatePresence>
    </Box>
  );
};

export default Reports;