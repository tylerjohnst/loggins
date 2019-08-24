import { getConnection } from "typeorm"
import { findMessageByUUID } from "../../finders/message"
import { MessageHistory } from "../../entity/message_history"
import { parseTimestamp } from "../../util"
import { SlackTimestamp, SlackUUID, SlackID } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageChangedEvent extends SlackMessageEvent {
  subtype: "message_changed"
  hidden: boolean
  message: {
    client_msg_id: SlackUUID
    type: "message"
    text: string
    user: SlackID
    team: SlackID
    edited: {
      user: SlackID
      ts: SlackTimestamp
    }
    ts: SlackTimestamp
    user_team: SlackID
    source_team: SlackID
  }
  channel: SlackID
  previous_message: {
    client_msg_id: SlackUUID
    type: "message"
    text: string
    user: SlackID
    ts: SlackTimestamp
    team: SlackID
  }
  event_ts: SlackTimestamp
  ts: SlackTimestamp
}

export const messageChanged = async ({ message, previous_message }: SlackMessageChangedEvent): Promise<void> => {
  const model = await findMessageByUUID(previous_message.client_msg_id)

  model.body = message.text
  model.edited = parseTimestamp(message.edited.ts)

  await getConnection().manager.save(model)

  const history = new MessageHistory()

  history.body = previous_message.text
  history.timestamp = parseTimestamp(previous_message.ts)
  history.messageUUID = previous_message.client_msg_id

  await getConnection().manager.save(history)
}
