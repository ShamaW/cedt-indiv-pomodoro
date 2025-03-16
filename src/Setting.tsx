import React, { useEffect, useState } from "react";
import { SettingProps, SettingData } from "./interface";
import { invoke } from "@tauri-apps/api/core";

const Setting = ({ setInputMinutes }: SettingProps) => {
    const [setting, setSetting] = useState<SettingData>({
        default_focus_time: "25",
        default_break_time: "5",
        default_rest_time: "10"
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => { loadSettings(); }, []);

    const loadSettings = async () => {
        const settings: SettingData = await invoke("get_settings");
        setSetting(settings);
        setInputMinutes(settings.default_focus_time);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSetting({
            ...setting,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const saveSetting = async () => {
        setIsSaving(true);
        setSaveMessage("");
        
        await invoke("save_user_settings", { settings: setting });
        setInputMinutes(setting.default_focus_time);
        setSaveMessage("Settings saved successfully!");

        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 3000);

    };

    return (
        <div className="settings-container">
            <h2>Timer Settings</h2>
            <div className="settings-form">
                <div className="setting-item">
                    <label htmlFor="default_focus_time">Focus:</label>
                    <input
                        type="number"
                        id="default_focus_time"
                        name="default_focus_time"
                        value={setting.default_focus_time}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                    <label htmlFor="default_break_time">Break:</label>
                    <input
                        type="number"
                        id="default_break_time"
                        name="default_break_time"
                        value={setting.default_break_time}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                    <label htmlFor="default_rest_time">Rest:</label>
                    <input
                        type="number"
                        id="default_rest_time"
                        name="default_rest_time"
                        value={setting.default_rest_time}
                        onChange={handleChange}
                        min="1"
                        max="60"
                    />
                </div>
                <button
                    onClick={saveSetting}
                    className="save-button"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Settings"}
                </button>
                {saveMessage && <p className="save-message">{saveMessage}</p>}
            </div>
        </div>
    );
};

export default Setting;