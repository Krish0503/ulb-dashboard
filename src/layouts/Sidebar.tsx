import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSidebar } from '../contexts/SidebarContext';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import ReportIcon from '@mui/icons-material/Report';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    }),
    ...(!open && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: `calc(${theme.spacing(7)} + 1px)`,
      [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
      },
      '& .MuiDrawer-paper': {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    }),
  }),
);

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Map View', icon: <MapIcon />, path: '/map' },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  { text: 'Report Waste', icon: <AddCircleIcon />, path: '/report-form' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography 
              variant="h6" 
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              sx={{ flexGrow: 1, ml: 2, fontWeight: 'bold' }}
            >
              ULB Dashboard
            </Typography>
            <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={open ? '' : item.text} placement="right">
                <ListItemButton
                  component={motion.div}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    borderLeft: isActive ? '4px solid white' : 'none',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 'bold' : 'normal',
                      }
                    }} 
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <div style={{ flexGrow: 1 }}></div>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title={open ? '' : 'Logout'} placement="right">
            <ListItemButton
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;