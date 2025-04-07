import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import '../styles/FloatingPanel.css';
import { FloatingPanelProps } from '../utils/interface';

const FloatingPanel: React.FC<FloatingPanelProps> = ({
    title,
    children,
    isVisible,
    onClose,
    defaultPosition = { x: 50, y: 50 },
    width = 400,
    height = 350,
}) => {
    const [position, setPosition] = useState(defaultPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isVisible) return null;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement && e.target.closest('.panel-controls')) {
            return;
        }
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div
            className="floating-panel"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${width}px`,
                height: isMinimized ? 'auto' : `${height}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="panel-header">
                <div className="panel-title">{title}</div>
                <div className="panel-controls">
                    <Button
                        type="text"
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={toggleMinimize}
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                    />
                </div>
            </div>
            <div className={`panel-content ${isMinimized ? 'minimized' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default FloatingPanel;
