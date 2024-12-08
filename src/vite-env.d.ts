/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HTTP_PROXY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
declare module 'markdown-it-texmath'
