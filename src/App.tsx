import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import AppContent from './components/AppContent';
import Layout from './components/Layout';
import { PanelProvider } from './context/PanelContext';
import { NotificationProvider } from './context/SystemNotificationContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <NotificationProvider>
                <PanelProvider>
                    <Layout>
                        <AppContent />
                    </Layout>
                </PanelProvider>
            </NotificationProvider>
        </GoogleOAuthProvider>
    );
}

export default App;