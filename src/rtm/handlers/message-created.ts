import { getConnection, EntityManager } from "typeorm"

import { Message } from "../../entity/message"
import { SlackTimestamp, SlackID, SlackUUID, parseTimestamp } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageCreatedEvent extends SlackMessageEvent {
  client_msg_id: SlackUUID
  text: string
  user: SlackID
  channel: SlackID
  ts: SlackTimestamp
  // suppress_notification: boolean
  // team: SlackID
  // user_team: SlackID
  // source_team: SlackID
  // event_ts: SlackTimestamp
}

class MessageCreatedHandler {
  constructor(private event: SlackMessageCreatedEvent, private entityManager: EntityManager) {}

  async process(): Promise<void> {
    const { client_msg_id, text, user, channel, ts } = this.event

    const model = new Message()

    model.uuid = client_msg_id
    model.body = text
    model.userUUID = user
    model.channelUUID = channel
    model.timestamp = parseTimestamp(ts)

    await this.entityManager.save(model)
  }
}

export default async (event: SlackMessageCreatedEvent): Promise<void> =>
  new MessageCreatedHandler(event, getConnection().manager).process()
