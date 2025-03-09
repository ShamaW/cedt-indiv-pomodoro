import React, { useState } from "react";
interface SettingData {
    defaultFocusTime: string;
    defaultBreakTime: string;
    defaultRestTime: string;
}

const Setting = () => {
    const [setting, setSetting] = useState<SettingData>({
        defaultFocusTime: "25",
        defaultBreakTime: "5",
        defaultRestTime: "10"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSetting({
            ...setting,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    const saveSetting = () => {
        localStorage.setItem('pomoSetting', JSON.stringify(setting));
        alert('Setting saved!');
    }

    return (
        <div className="settings-container">
            <h2>Timer Settings</h2>
            <div className="settings-form">
                <div className="setting-item">
                    <label htmlFor="defaultFocusTime">Focus:</label>
                    <input
                        type="number"
                        id="defaultFocusTime"
                        name="defaultFocusTime"
                        value={setting.defaultFocusTime}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                    <label htmlFor="defaultBreakTime">Break:</label>
                    <input
                        type="number"
                        id="defaultBreakTime"
                        name="defaultBreakTime"
                        value={setting.defaultBreakTime}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                    <label htmlFor="defaultRestTime">Rest:</label>
                    <input
                        type="number"
                        id="defaultRestTime"
                        name="defaultRestTime"
                        value={setting.defaultRestTime}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                </div>
                <button onClick={saveSetting} className="save-button">Save Settings</button>
            </div>
        </div>
    );
}

export default Setting;