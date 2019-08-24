import { RTMClient } from "@slack/rtm-api"
import { messageChanged, SlackMessageChangedEvent } from "./handlers/message-changed"
import { messageDeleted, SlackMessageDeletedEvent } from "./handlers/message-deleted"
import { messageCreated, SlackMessageCreatedEvent } from "./handlers/message-created"
import { token } from "../slack"

const rtm = new RTMClient(token)

export interface SlackMessageEvent {
  type: "message"
  subtype?: "message_changed" | "message_deleted"
}

rtm.on("message", (event: SlackMessageEvent) => {
  console.log(JSON.stringify(event, null, 2))

  switch (event.subtype) {
    case "message_changed":
      messageChanged(event as SlackMessageChangedEvent)
      break
    case "message_deleted":
      messageDeleted(event as SlackMessageDeletedEvent)
      break
    default:
      messageCreated(event as SlackMessageCreatedEvent)
      break
  }
})

export const listenToRTM = async (): Promise<void> => {
  try {
    await rtm.start()
  } catch (err) {
    console.error(err)
  }
}
