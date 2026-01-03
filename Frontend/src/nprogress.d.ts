declare module 'nprogress' {
  interface NProgress {
    start(): void;
    done(force?: boolean): void;
    configure(options: {
      minimum?: number;
      easing?: string;
      speed?: number;
      trickle?: boolean;
      trickleSpeed?: number;
      showSpinner?: boolean;
      parent?: string;
    }): void;
    set(n: number): void;
    isStarted(): boolean;
  }

  const NProgress: NProgress;

  export default NProgress;
}
