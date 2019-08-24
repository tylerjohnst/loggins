import { Message } from "../../entity/message"
import { getConnection } from "typeorm"
import { parseTimestamp } from "../../util"
import { SlackTimestamp, SlackID, SlackUUID } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageCreatedEvent extends SlackMessageEvent {
  client_msg_id: SlackUUID
  suppress_notification: boolean
  text: string
  user: SlackID
  team: SlackID
  user_team: SlackID
  source_team: SlackID
  channel: SlackID
  event_ts: SlackTimestamp
  ts: SlackTimestamp
}

export const messageCreated = async (event: SlackMessageCreatedEvent): Promise<void> => {
  const message = new Message()

  message.uuid = event.client_msg_id
  message.body = event.text
  message.userUUID = event.user
  message.channelUUID = event.channel
  message.timestamp = parseTimestamp(event.ts)

  await getConnection().manager.save(message)
}
