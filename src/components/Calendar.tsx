import { CalendarOutlined, LoginOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Button, Empty, List, message, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import '../styles/calendar.css';

const SESSION_TIMEOUT = 3 * 24 * 60 * 60 * 1000;

const apiCalendar = new ApiCalendar({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
});

interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    description?: string;
}

interface StoredSession {
    isSignedIn: boolean;
    timestamp: number;
}

const Calendar = () => {
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

    const handleLogout = () => {
        googleLogout();
        setIsSignedIn(false);
        setEvents([]);
        localStorage.removeItem('googleCalendarSession');
        console.log('Log out successfully');
        message.info('Signed out successfully');
    };

    const openInGoogleCalendar = async (eventId: string) => {
        try {
            await openUrl(`https://calendar.google.com/calendar`);
            console.log(eventId);
        } catch (err) {
            console.error('Failed to open calendar event:', err);
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h1><CalendarOutlined /> Today's Events</h1>

                {isSignedIn ? (
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        type="primary"
                        danger
                    >
                        Sign Out
                    </Button>
                ) : (
                    <Button
                        icon={<LoginOutlined />}
                        onClick={() => login()}
                        type="primary"
                    >
                        Sign in with Google
                    </Button>
                )}
            </div>

            {!isSignedIn && (
                <div className="calendar-signin-message">
                    <Empty
                        description="Sign in with your Google account to view your calendar events"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </div>
            )}

            {isSignedIn && (
                <div className="calendar-events">
                    {loading ? (
                        <div className="calendar-loading">
                            <Spin size="large" tip="Loading events..." />
                        </div>
                    ) : error ? (
                        <div className="calendar-error">
                            <p>{error}</p>
                            <Button
                                onClick={() => {
                                    setRetryCount(0);
                                    fetchEvents();
                                }}
                                type="primary"
                                icon={<ReloadOutlined />}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : events.length === 0 ? (
                        <Empty description="No events scheduled for today" />
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={events}
                            renderItem={(event) => (
                                <List.Item
                                    key={event.id}
                                    className="calendar-event-item"
                                    onClick={() => openInGoogleCalendar(event.id)}
                                >
                                    <List.Item.Meta
                                        title={event.summary || 'Untitled Event'}
                                        description={
                                            <>
                                                <p>{event.description || 'No description'}</p>
                                                <div className="event-time">
                                                    <Tag color="blue">
                                                        {formatDateTime(event.start?.dateTime, event.start?.date)}
                                                    </Tag>
                                                    <span>to</span>
                                                    <Tag color="green">
                                                        {formatDateTime(event.end?.dateTime, event.end?.date)}
                                                    </Tag>
                                                </div>
                                                {event.location && (
                                                    <div className="event-location">
                                                        <Tag color="orange">{event.location}</Tag>
                                                    </div>
                                                )}
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Calendar;
