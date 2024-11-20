interface Window {
  analytics: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (event: string, properties?: Record<string, any>) => void;
  };
}
