import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

const useNotification = () => {
    const sendSystemNotification = async (timerType: string) => {
        let permissionGranted = await isPermissionGranted();
    
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }
    
        if (permissionGranted) {
            let title = "Time's up! | Pomo by ShamaW";
            let body = "";
    
            switch (timerType) {
                case 'focus':
                    body = "Focus session has ended. Take a break!";
                    break;
                case 'break':
                    body = "Break session has ended. Ready for another?";
                    break;
                case 'rest':
                    body = "Rest session has ended. Ready to get back?";
                    break;
                default:
                    body = "Timer has finished";
            }
    
            sendNotification({title, body});
        }
    }

    return { sendSystemNotification };
}

export default useNotification;