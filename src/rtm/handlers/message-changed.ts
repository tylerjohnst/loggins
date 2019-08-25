import { saveEntity } from "../../commands/save-entity"
import { findMessageByUUID } from "../../finders/message"
import { Message, MessageStatus } from "../../entity/message"
import { MessageHistory } from "../../entity/message_history"
import { parseTimestamp, SlackTimestamp, SlackUUID, SlackID } from "../../slack"
import { SlackMessageEvent } from ".."

export interface SlackMessageChangedEvent extends SlackMessageEvent {
  channel: SlackID
  message: {
    client_msg_id: SlackUUID
    text: string
    user: SlackID
    edited: {
      ts: SlackTimestamp
      // user: SlackID
    }
    // type: "message"
    // team: SlackID
    // ts: SlackTimestamp
    // user_team: SlackID
    // source_team: SlackID
  }
  previous_message: {
    client_msg_id: SlackUUID
    text: string
    ts: SlackTimestamp
    // type: "message"
    // user: SlackID
    // team: SlackID
  }
  // subtype: "message_changed"
  // hidden: boolean
  // event_ts: SlackTimestamp
  // ts: SlackTimestamp
}

export class MessageChangeHandler {
  constructor(
    private event: SlackMessageChangedEvent,
    private entitySaver: typeof saveEntity,
    private entityLoader: typeof findMessageByUUID,
  ) {}

  async process(): Promise<void> {
    const model = await this.entityLoader(this.id)

    if (model) {
      await this.updateMessage(model)
    } else {
      await this.createMessage()
    }

    await this.createMessageHistory()
  }

  private async updateMessage(model: Message): Promise<void> {
    const {
      message: {
        text,
        edited: { ts },
      },
    } = this.event

    model.status = MessageStatus.Edited
    model.body = text
    model.edited = parseTimestamp(ts)

    await this.entitySaver(model)
  }

  private async createMessageHistory(): Promise<void> {
    const {
      previous_message: { ts, client_msg_id, text },
    } = this.event

    const model = new MessageHistory()

    model.body = text
    model.timestamp = parseTimestamp(ts)
    model.messageUUID = client_msg_id

    await this.entitySaver(model)
  }

  private async createMessage(): Promise<void> {
    const {
      channel,
      message: { user },
      previous_message: { ts },
    } = this.event

    const model = new Message()

    model.uuid = this.id
    model.channelUUID = channel
    model.userUUID = user
    model.timestamp = parseTimestamp(ts)

    await this.updateMessage(model)
  }

  private get id(): SlackID {
    return this.event.message.client_msg_id
  }
}

export default async (event: SlackMessageChangedEvent): Promise<void> =>
  new MessageChangeHandler(event, saveEntity, findMessageByUUID).process()
