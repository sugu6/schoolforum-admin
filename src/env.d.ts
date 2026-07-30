/// <reference types="vite/client" />
/// <reference types="vue/jsx" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, unknown, any>;
  export default component;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
