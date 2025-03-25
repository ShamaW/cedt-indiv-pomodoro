import React, { createContext, useContext, ReactNode } from 'react';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

const NOTIFICATION_MESSAGES = {
    focus: {
        title: "Time's Up!",
        body: "Focus session has ended. Take a break!"
    },
    break: {
        title: "Time's Up!",
        body: "Break session has ended. Ready for another?"
    },
    rest: {
        title: "Time's Up!",
        body: "Rest session has ended. Ready to get back?"
    },
    default: {
        title: "Time's Up!",
        body: "Timer has finished."
    }
};

type NotificationContextType = {
    sendSystemNotification: (timerType: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const sendSystemNotification = async (timerType: string) => {
        let permissionGranted = await isPermissionGranted();
    
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }
    
        if (permissionGranted) {
            const notification = NOTIFICATION_MESSAGES[timerType as keyof typeof NOTIFICATION_MESSAGES] ||NOTIFICATION_MESSAGES.default;
            sendNotification(notification);
        }
    };

    return (
        <NotificationContext.Provider value={{ sendSystemNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export {NotificationProvider, useNotification};