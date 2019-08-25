import { SlackMessageCreatedEvent, MessageCreatedHandler } from "../message-created"
import { mockPromise } from "../../../test/helpers"
import { Message, MessageStatus } from "../../../entity/message"

const event: SlackMessageCreatedEvent = {
  type: "message",
  client_msg_id: "MESSAGE1",
  text: "Hello There",
  user: "USER1",
  channel: "CHANNEL1",
  ts: "1566349.5873",
}

it("creates the Message in the database", async () => {
  const saveEntity = mockPromise()

  await new MessageCreatedHandler(event, saveEntity).process()

  expect(saveEntity).toHaveBeenCalledTimes(1)

  const message: Message = saveEntity.mock.calls[0][0]

  expect(message.uuid).toEqual(event.client_msg_id)
  expect(message.channelUUID).toEqual(event.channel)
  expect(message.userUUID).toEqual(event.user)
  expect(message.timestamp).toBeTruthy()
  expect(message.edited).toBeFalsy()
  expect(message.status).toEqual(MessageStatus.Created)
  expect(message.body).toEqual(event.text)
  expect(message.deleted).toBeFalsy()
})
