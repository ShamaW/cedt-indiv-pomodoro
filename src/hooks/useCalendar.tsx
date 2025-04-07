import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { CalendarEvent, StoredSession } from '../utils/interface';

const SESSION_TIMEOUT = 3 * 24 * 60 * 60 * 1000;

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

    useEffect(() => {
        const checkStoredSession = () => {
            try {
                const storedSessionJSON = localStorage.getItem('googleCalendarSession');
                if (storedSessionJSON) {
                    const storedSession: StoredSession = JSON.parse(storedSessionJSON);
                    
                    const now = Date.now();
                    if (storedSession.isSignedIn && (now - storedSession.timestamp) < SESSION_TIMEOUT) {
                        setIsSignedIn(true);
                        fetchEvents();
                        console.log('Restored session from localStorage');
                    } else {
                        localStorage.removeItem('googleCalendarSession');
                        console.log('Session expired, removed from localStorage');
                    }
                }
            } catch (error) {
                console.error('Error accessing stored session:', error);
                localStorage.removeItem('googleCalendarSession');
            }
        };
        
        checkStoredSession();
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
        onSuccess: (response) => {
            console.log('Login Success:', response);
            setIsSignedIn(true);
            const session: StoredSession = {
                isSignedIn: true,
                timestamp: Date.now()
            };
            localStorage.setItem('googleCalendarSession', JSON.stringify(session));
            fetchEvents();
            message.success('Successfully signed in!');
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

    const handleLogout = () => {
        googleLogout();
        setIsSignedIn(false);
        setEvents([]);
        localStorage.removeItem('googleCalendarSession');
        console.log('Log out successfully');
        message.info('Signed out successfully');
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
