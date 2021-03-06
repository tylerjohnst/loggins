/** Slack timestamp is a Unix epoch with high precision: "1566676804.000900" */
export type SlackTimestamp = string
/** Standard UUID format */
export type SlackUUID = string
/** Internal SHA-like ID for Teams, Channels, etc: "T03QUJQ7L" */
export type SlackID = string

export const token = process.env.SLACK_BOT_TOKEN || ""

/** Parses a given Slack timestamp or Unix epoch. */
export const parseTimestamp = (timestamp: SlackTimestamp | string | number): Date =>
  new Date(Number(timestamp) * 1000)
