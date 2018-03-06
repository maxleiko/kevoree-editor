/**
 * Kevoree Web Editor declaration file
 * 
 * Contains this application's interfaces/enum in order to have
 * consistent types.
 */
declare namespace kwe {
  export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

  export interface Toast {
    type: ToastType;
    title: string;
    message: string;
    delay: number;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export interface RGB {
    r: number;
    g: number;
    b: number;
  }
}