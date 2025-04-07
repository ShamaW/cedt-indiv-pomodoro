import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { invoke } from '@tauri-apps/api/core';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { CalendarEvent } from '../utils/interface';

const apiCalendar = new ApiCalendar({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
});

const useCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const initializeWithToken = async (token: string) => {
        return new Promise<void>((resolve, reject) => {
            try {
                window.gapi.client.setToken({
                    access_token: token,
                });
                
                window.gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'maxResults': 1,
                }).then(() => {
                    setIsSignedIn(true);
                    resolve();
                }).catch((error) => {
                    console.error('Token validation failed:', error);
                    invoke('clear_calendar_token').catch(console.error);
                    reject(error);
                });
            } catch (error) {
                console.error('Failed to initialize with token:', error);
                reject(error);
            }
        });
    };

    useEffect(() => {
        const checkGapiAndToken = async () => {
            if (!window.gapi || !window.gapi.client || !window.gapi.client.calendar) {
                console.log('Waiting for GAPI to load...');
                setTimeout(checkGapiAndToken, 500);
                return;
            }
            
            try {
                const token = await invoke<string | null>('get_calendar_token');
                if (token) {
                    console.log('Restoring session with stored token');
                    try {
                        await initializeWithToken(token);
                        console.log('Session restored successfully, fetching events');
                        fetchEvents();
                    } catch (error) {
                        console.error('Failed to restore session:', error);
                        setIsSignedIn(false);
                    }
                }
            } catch (error) {
                console.error('Error accessing stored token:', error);
            }
        };
        
        checkGapiAndToken();
    }, []);

    const formatDateTime = (dateTimeStr?: string, dateStr?: string) => {
        if (!dateTimeStr && !dateStr) return 'N/A';

        const date = dateTimeStr
            ? new Date(dateTimeStr)
            : dateStr
                ? new Date(dateStr)
                : new Date();

        return dateTimeStr
            ? date.toLocaleString()
            : date.toLocaleDateString();
    };

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!window.gapi || !window.gapi.client || !window.gapi.client.getToken()) {
                throw new Error("Google API client not initialized or not signed in");
            }

            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const response = await apiCalendar.listEvents({
                timeMin: today.toISOString(),
                timeMax: tomorrow.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            setEvents(response.result.items || []);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch calendar events');
            if (retryCount < 3) {
                message.info('Retrying to fetch events...');
                setRetryCount(prev => prev + 1);
                setTimeout(fetchEvents, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            console.log('Login Success');
            
            try {
                await invoke('store_calendar_token', {
                    token: response.access_token,
                    expiresIn: response.expires_in
                });
                
                window.gapi.client.setToken({
                    access_token: response.access_token,
                });
                
                setIsSignedIn(true);
                fetchEvents();
                message.success('Successfully signed in!');
            } catch (error) {
                console.error('Failed to store token:', error);
                message.error('Failed to store session. Your login might not persist.');
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            setError('Failed to sign in. Please try again.');
            message.error('Sign in failed. Please try again.');
        },
        onNonOAuthError: (error) => {
            console.error('Non OAuth error:', error);
            if (error.type === 'popup_closed') {
                setError('Login popup was closed. Please try again and keep the popup open until authentication completes.');
                message.warning('Login popup was closed. Please try again.');
            } else {
                setError('Not from OAuth: ' + error);
                message.error('Authentication error: ' + error);
            }
        },
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        flow: 'implicit'
    });

    const handleLogout = async () => {
        if (window.gapi && window.gapi.client) {
            window.gapi.client.setToken(null);
        }
        
        googleLogout();
        setIsSignedIn(false);
        setEvents([]);
        
        try {
            await invoke('clear_calendar_token');
            console.log('Log out successfully');
            message.info('Signed out successfully');
        } catch (error) {
            console.error('Failed to clear token:', error);
            message.error('Failed to clear session completely.');
        }
    };

    const retryFetchEvents = () => {
        setRetryCount(0);
        fetchEvents();
    };

    return {
        isSignedIn,
        events,
        loading,
        error,
        login,
        handleLogout,
        retryFetchEvents,
        formatDateTime
    };
};

export default useCalendar;
