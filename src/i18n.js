import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
    en: {
        translation: {
            common: {
                save: 'Save',
                cancel: 'Cancel',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
            },
            popup: {
                title: 'ClickSendAI Forum Agent',
                configuration: 'Configuration',
                draftReply: 'Draft Reply',
                activityLog: 'Activity Log',
                performance: 'Performance',
            },
            options: {
                title: 'Settings',
                agentConfig: 'Agent Configuration',
                accounts: 'Accounts',
                advanced: 'Advanced Settings',
            },
        },
    },
};
i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;
