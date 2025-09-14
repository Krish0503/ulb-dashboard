import React from 'react';
import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

const MainWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
}));

const ContentWrapper = styled(Box)<{ open: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 240, // Width of the sidebar
  }),
  overflow: 'auto',
}));

const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const MainLayoutContent = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <MainWrapper>
      <Sidebar open={sidebarOpen} />
      <ContentWrapper open={sidebarOpen}>
        <Header toggleSidebar={toggleSidebar} open={sidebarOpen} />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </MainWrapper>
  );
};

const MainLayout = () => {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
};

export default MainLayout;