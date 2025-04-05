/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_REDIRECT_URI: string;
    readonly VITE_GOOGLE_CLIENT_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}