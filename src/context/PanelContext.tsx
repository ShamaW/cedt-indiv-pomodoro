import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PanelContextType, PanelType } from '../utils/interface';

const PanelContext = createContext<PanelContextType | null>(null);

export const usePanelContext = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('usePanelContext must be used within a PanelProvider');
    }
    return context;
};

export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [visiblePanels, setVisiblePanels] = useState<Record<PanelType, boolean>>({
        timer: true,
        todoList: false,
        calendar: false,
        settings: false,
    });

    const togglePanel = (panel: PanelType) => {
        setVisiblePanels(prev => ({
            ...prev,
            [panel]: !prev[panel],
        }));
    };

    const openPanel = (panel: PanelType) => {
        setVisiblePanels(prev => ({
            ...prev,
            [panel]: true,
        }));
    };

    const closePanel = (panel: PanelType) => {
        setVisiblePanels(prev => ({
            ...prev,
            [panel]: false,
        }));
    };

    return (
        <PanelContext.Provider value={{ visiblePanels, togglePanel, openPanel, closePanel }}>
            {children}
        </PanelContext.Provider>
    );
};
