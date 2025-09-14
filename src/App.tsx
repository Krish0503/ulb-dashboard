import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// Theme Provider
import ThemeProvider from './theme/ThemeProvider';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Reports from './pages/Reports';
import Users from './pages/Users';
import ReportForm from './pages/ReportForm';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<MapView />} />
            <Route path="reports" element={<Reports />} />
            <Route path="report-form" element={<ReportForm />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
