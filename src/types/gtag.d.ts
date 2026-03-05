declare function gtag(
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>
): void

declare function gtag(
  command: 'js' | 'config',
  target: Date | string,
  params?: Record<string, unknown>
): void
