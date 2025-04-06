import React from 'react';
import { usePanelContext } from '../context/PanelContext';
import useCountdownTimer from '../hooks/useCountdownTimer';
import TodoPage from '../pages/TodoPage';
import '../styles/AppContent.css';
import Calendar from './Calendar';
import CountdownTimer from './CountdownTimer';
import FloatingPanel from './FloatingPanel';
import PanelControls from './PanelControls';
import Setting from './Setting';

const AppContent: React.FC = () => {
    const timerProps = useCountdownTimer();
    const { visiblePanels, togglePanel, closePanel } = usePanelContext();

    return (
        <div className="app-content">
            <PanelControls />

            <FloatingPanel
                title="Pomodoro Timer"
                isVisible={visiblePanels.timer}
                onClose={() => closePanel('timer')}
                defaultPosition={{ x: 50, y: 100 }}
                width={450}
            >
                <CountdownTimer {...timerProps} />
            </FloatingPanel>

            <FloatingPanel
                title="Todo List"
                isVisible={visiblePanels.todoList}
                onClose={() => closePanel('todoList')}
                defaultPosition={{ x: 520, y: 100 }}
                width={400}
                height={500}
            >
                <TodoPage />
            </FloatingPanel>

            <FloatingPanel
                title="Calendar"
                isVisible={visiblePanels.calendar}
                onClose={() => closePanel('calendar')}
                defaultPosition={{ x: 250, y: 200 }}
                width={600}
                height={550}
            >
                <Calendar />
            </FloatingPanel>

            <FloatingPanel
                title="Settings"
                isVisible={visiblePanels.settings}
                onClose={() => closePanel('settings')}
                defaultPosition={{ x: 150, y: 150 }}
                width={400}
            >
                <Setting setInputMinutes={timerProps.setInputMinutes} />
            </FloatingPanel>
        </div>
    );
};

export default AppContent;
