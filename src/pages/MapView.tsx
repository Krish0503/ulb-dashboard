import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const MapView = () => {
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Custom marker icons based on status
  const getMarkerIcon = (status: ReportStatus) => {
    const iconSize = [25, 41];
    const iconAnchor = [12, 41];
    const popupAnchor = [1, -34];
    
    let iconUrl = '';
    
    switch (status) {
      case ReportStatus.PENDING:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
        break;
      case ReportStatus.ASSIGNED:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';
        break;
      case ReportStatus.IN_PROGRESS:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
        break;
      case ReportStatus.RESOLVED:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        break;
      case ReportStatus.CLOSED:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
        break;
      default:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
    }
    
    return L.icon({ 
      iconUrl,
      iconSize,
      iconAnchor,
      popupAnchor,
    });
  };

  // Filter reports based on selected ward and status
  useEffect(() => {
    let filtered = mockReports;
    
    if (selectedWard !== 'all') {
      filtered = filtered.filter(report => report.ward === selectedWard);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }
    
    setFilteredReports(filtered);
  }, [selectedWard, selectedStatus]);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Waste Reports Map
        </Typography>
      </motion.div>

      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="ward-select-label">Filter by Ward</InputLabel>
          <Select
            labelId="ward-select-label"
            id="ward-select"
            value={selectedWard}
            label="Filter by Ward"
            onChange={(e) => setSelectedWard(e.target.value)}
          >
            <MenuItem value="all">All Wards</MenuItem>
            {mockWards.map((ward) => (
              <MenuItem key={ward.id} value={ward.name}>{ward.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-select-label">Filter by Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={selectedStatus}
            label="Filter by Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {Object.values(ReportStatus).map((status) => (
              <MenuItem key={status} value={status}>{status.replace('_', ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 250px)', gap: 3 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: 2 }}
        >
          <StyledCard sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', p: '0 !important' }}>
              <MapContainer 
                center={[28.6139, 77.2090]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredReports.map((report) => (
                  <Marker 
                    key={report.id} 
                    position={[report.location.lat, report.location.lng]}
                    icon={getMarkerIcon(report.status)}
                    eventHandlers={{
                      click: () => {
                        setSelectedReport(report);
                      },
                    }}
                  >
                    <Popup>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {report.title}
                      </Typography>
                      <Typography variant="body2">
                        {report.description.substring(0, 100)}...
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Status: <span style={{ fontWeight: 'bold' }}>{report.status.replace('_', ' ')}</span>
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Ward: {report.ward}
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </StyledCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ flex: 1 }}
        >
          <StyledCard sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedReport ? 'Selected Report Details' : 'Report Details'}
              </Typography>
              
              {selectedReport ? (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {selectedReport.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedReport.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={selectedReport.images[0]} 
                      alt="Report" 
                      style={{ width: '100%', borderRadius: '8px' }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: 
                          selectedReport.status === 'pending' ? '#fff8e1' :
                          selectedReport.status === 'assigned' ? '#e3f2fd' :
                          selectedReport.status === 'in_progress' ? '#e8f5e9' :
                          selectedReport.status === 'resolved' ? '#e8f5e9' : '#e0f2f1',
                        color: 
                          selectedReport.status === 'pending' ? '#ff8f00' :
                          selectedReport.status === 'assigned' ? '#1976d2' :
                          selectedReport.status === 'in_progress' ? '#388e3c' :
                          selectedReport.status === 'resolved' ? '#388e3c' : '#00897b',
                      }}
                    >
                      {selectedReport.status.replace('_', ' ')}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ward:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReport.ward}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReport.location.address}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Reported By:
                    </Typography>
                    <Typography variant="body2">
                      {selectedReport.reportedBy.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Reported On:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedReport.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  {selectedReport.assignedTo && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Assigned To:
                      </Typography>
                      <Typography variant="body2">
                        {selectedReport.assignedTo.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a report from the map to view details
                </Typography>
              )}
            </CardContent>
          </StyledCard>
        </motion.div>
      </Box>
    </Box>
  );
};

export default MapView;