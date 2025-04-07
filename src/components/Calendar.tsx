import { CalendarOutlined, LoginOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Button, Empty, List, Spin, Tag } from 'antd';
import React from 'react';
import useCalendar from '../hooks/useCalendar';
import '../styles/calendar.css';

const Calendar = () => {
    const {
        isSignedIn,
        events,
        loading,
        error,
        login,
        handleLogout,
        retryFetchEvents,
        formatDateTime
    } = useCalendar();

    const openInGoogleCalendar = async () => {
        try {
            await openUrl(`https://calendar.google.com/calendar`);
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
                                onClick={retryFetchEvents}
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
                                    onClick={() => openInGoogleCalendar()}
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
