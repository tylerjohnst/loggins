import { getConnection, EntityManager } from "typeorm"

import { MessageStatus, Message } from "../../entity/message"
import { findMessageByUUID } from "../../finders/message"
import { SlackTimestamp, SlackUUID, parseTimestamp, SlackID } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageDeletedEvent extends SlackMessageEvent {
  deleted_ts: SlackTimestamp
  subtype: "message_deleted"
  channel: SlackID
  previous_message: {
    client_msg_id: SlackUUID
    text: string
    user: SlackID
    ts: SlackTimestamp
    edited?: {
      ts: SlackTimestamp
      // user: SlackID
    }
    // type: "message"
    // team: SlackID
  }
  // hidden: boolean
  // event_ts: SlackTimestamp
  // ts: SlackTimestamp
}

export class MessageDeletedHandler {
  constructor(
    private event: SlackMessageDeletedEvent,
    private entityManager: EntityManager,
    private entityLoader: typeof findMessageByUUID,
  ) {}

  async process(): Promise<void> {
    const model = await this.entityLoader(this.id)

    if (model) {
      await this.updateMessage(model)
    } else {
      await this.createMessage()
    }
  }

  private async updateMessage(model: Message): Promise<void> {
    const { deleted_ts } = this.event

    model.status = MessageStatus.Deleted
    model.deleted = parseTimestamp(deleted_ts)

    await this.entityManager.save(model)
  }

  private async createMessage(): Promise<void> {
    const {
      channel,
      previous_message: { text, user, ts, edited },
    } = this.event

    const model = new Message()

    model.uuid = this.id
    model.channelUUID = channel
    model.userUUID = user
    model.timestamp = parseTimestamp(ts)
    model.body = text

    if (edited) {
      model.edited = parseTimestamp(edited.ts)
    }

    await this.updateMessage(model)
  }

  private get id(): SlackID {
    return this.event.previous_message.client_msg_id
  }
}

export default async (event: SlackMessageDeletedEvent): Promise<void> =>
  new MessageDeletedHandler(event, getConnection().manager, findMessageByUUID).process()
