import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const ImagePreview = styled('div')(({ theme }) => ({
  width: '100%',
  height: 200,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative'
}));

const UploadButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1
}));

const ReportForm = () => {
  const [formData, setFormData] = useState({
    wasteType: '',
    location: '',
    description: '',
    image: null as File | null,
    imagePreview: ''
  });
  
  const [errors, setErrors] = useState({
    wasteType: false,
    location: false,
    description: false
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      wasteType: !formData.wasteType,
      location: !formData.location,
      description: !formData.description
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }
    
    // In a real app, you would send this data to your backend
    console.log('Submitting report:', formData);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Report submitted successfully!',
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      wasteType: '',
      location: '',
      description: '',
      image: null,
      imagePreview: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setSnackbar({
            open: true,
            message: 'Could not get your location. Please enter manually.',
            severity: 'error'
          });
        }
      );
    } else {
      setSnackbar({
        open: true,
        message: 'Geolocation is not supported by your browser',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Report Waste Issue
      </Typography>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ImagePreview>
                    {formData.imagePreview ? (
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Typography color="textSecondary">
                        Upload an image of the waste
                      </Typography>
                    )}
                    <UploadButton
                      component="label"
                      variant="contained"
                      startIcon={<AddPhotoAlternateIcon />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </UploadButton>
                  </ImagePreview>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth error={errors.wasteType}>
                    <InputLabel id="waste-type-label">Waste Type</InputLabel>
                    <Select
                      labelId="waste-type-label"
                      name="wasteType"
                      value={formData.wasteType}
                      label="Waste Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="solid">Solid Waste</MenuItem>
                      <MenuItem value="liquid">Liquid Waste</MenuItem>
                      <MenuItem value="hazardous">Hazardous Waste</MenuItem>
                      <MenuItem value="electronic">Electronic Waste</MenuItem>
                      <MenuItem value="biomedical">Biomedical Waste</MenuItem>
                      <MenuItem value="construction">Construction Debris</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    {errors.wasteType && (
                      <FormHelperText>Waste type is required</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                      helperText={errors.location ? 'Location is required' : ''}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={handleGetLocation}
                      startIcon={<LocationOnIcon />}
                    >
                      Get Location
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={errors.description}
                    helperText={errors.description ? 'Description is required' : ''}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<SendIcon />}
                    sx={{ mt: 2 }}
                  >
                    Submit Report
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      </motion.div>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportForm;