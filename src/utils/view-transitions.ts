export interface ViewTransitionOptions {
  x: number;
  y: number;
}

export function startViewTransition(
  callback: () => void,
  options?: ViewTransitionOptions,
): void {
  if (!document.startViewTransition) {
    callback();
    return;
  }

  if (options) {
    const endRadius = Math.hypot(
      Math.max(options.x, window.innerWidth - options.x),
      Math.max(options.y, window.innerHeight - options.y),
    );

    document.documentElement.style.setProperty('--x', `${options.x}px`);
    document.documentElement.style.setProperty('--y', `${options.y}px`);
    document.documentElement.style.setProperty('--r', `${endRadius}px`);
  }

  document.startViewTransition(callback);
}

export function getViewTransitionSupport(): boolean {
  return 'startViewTransition' in document;
}
