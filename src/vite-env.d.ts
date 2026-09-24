/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional Unlayer project id — enables the AI Assistant inside the editor. */
  readonly VITE_UNLAYER_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
