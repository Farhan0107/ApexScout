import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/RouteGuards';
import MainLayout from './components/layout/MainLayout';

import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AthleteDashboard from './features/athlete/AthleteDashboard';
import MarketplacePage from './features/scout/MarketplacePage';
import WatchlistPage from './features/scout/WatchlistPage';
import ScoutDashboard from './features/scout/ScoutDashboard';

const AppContent = () => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Landing Page - only for unauthenticated users */}
                <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

                {/* Protected Layout Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout userRole={user?.role} />}>
                        <Route path="/dashboard" element={
                            user?.role === 'athlete' ? <AthleteDashboard /> : <ScoutDashboard />
                        } />

                        {/* Athlete Routes */}
                        <Route element={<RoleBasedRoute allowedRoles={['athlete']} />}>
                            <Route path="/profile/me" element={<AthleteDashboard />} />
                        </Route>

                        {/* Scout Routes */}
                        <Route element={<RoleBasedRoute allowedRoles={['scout']} />}>
                            <Route path="/marketplace" element={<MarketplacePage />} />
                            <Route path="/watchlist" element={<WatchlistPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
