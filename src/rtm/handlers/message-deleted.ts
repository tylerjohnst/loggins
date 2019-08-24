import { getConnection } from "typeorm"

import { MessageStatus } from "../../entity/message"
import { findMessageByUUID } from "../../finders/message"
import { SlackTimestamp, SlackID, SlackUUID, parseTimestamp } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageDeletedEvent extends SlackMessageEvent {
  subtype: "message_deleted"
  hidden: boolean
  deleted_ts: SlackTimestamp
  channel: SlackID
  previous_message: {
    client_msg_id: SlackUUID
    type: "message"
    text: string
    user: SlackID
    ts: SlackTimestamp
    team: SlackID
    edited?: {
      user: SlackID
      ts: SlackTimestamp
    }
  }
  event_ts: SlackTimestamp
  ts: SlackTimestamp
}

export const messageDeleted = async (event: SlackMessageDeletedEvent): Promise<void> => {
  const result = await findMessageByUUID(event.previous_message.client_msg_id)

  result.status = MessageStatus.Deleted
  result.timestamp = parseTimestamp(event.deleted_ts)

  await getConnection().manager.save(result)
}
