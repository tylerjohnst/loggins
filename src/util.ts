export const parseTimestamp = (timestamp: string | number): Date => new Date(Number(timestamp) * 1000)
