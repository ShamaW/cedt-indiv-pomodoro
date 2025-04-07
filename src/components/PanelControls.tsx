import {
    CalendarOutlined,
    ClockCircleOutlined,
    SettingOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { usePanelContext } from '../context/PanelContext';
import '../styles/PanelControls.css';

const PanelControls: React.FC = () => {
    const { visiblePanels, togglePanel } = usePanelContext();

    return (
        <div className="panel-controls-container">
            <Button
                type={visiblePanels.timer ? 'primary' : 'default'}
                icon={<ClockCircleOutlined />}
                onClick={() => togglePanel('timer')}
                className="panel-control-button"
            >
                Timer
            </Button>

            <Button
                type={visiblePanels.todoList ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => togglePanel('todoList')}
                className="panel-control-button"
            >
                Todo List
            </Button>

            <Button
                type={visiblePanels.calendar ? 'primary' : 'default'}
                icon={<CalendarOutlined />}
                onClick={() => togglePanel('calendar')}
                className="panel-control-button"
            >
                Calendar
            </Button>

            <Button
                type={visiblePanels.settings ? 'primary' : 'default'}
                icon={<SettingOutlined />}
                onClick={() => togglePanel('settings')}
                className="panel-control-button"
            >
                Settings
            </Button>
        </div>
    );
};

export default PanelControls;
