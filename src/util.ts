export const parseTimestamp = (timestamp: string | number) =>
  new Date(Number(timestamp) * 1000)
