import { MessageChangeHandler, SlackMessageChangedEvent } from "../message-changed"
import { Message, MessageStatus } from "../../../entity/message"
import { MessageHistory } from "../../../entity/message_history"
import { mockPromise } from "../../../test/helpers"

const event: SlackMessageChangedEvent = {
  type: "message",
  channel: "CHANNEL1",
  subtype: "message_changed",
  message: {
    client_msg_id: "message-id-1",
    text: "Hello World!",
    user: "USER1",
    edited: {
      ts: "1566749.5873",
    },
  },
  previous_message: {
    text: "Hello",
    client_msg_id: "message-id-1",
    ts: "1566349.5873",
  },
}

const expectValidHistory = ({ mock: { calls } }: jest.Mock): void => {
  const history: MessageHistory = calls[1][0]

  expect(history.body).toEqual(event.previous_message.text)
  expect(history.messageUUID).toEqual(event.previous_message.client_msg_id)
  expect(history.timestamp).toBeTruthy()
}

it("updates an existing Message and creates a MessageHistory", async () => {
  const message = new Message()
  const saveEntity = mockPromise()
  const loadEntity = jest.fn().mockResolvedValue(message)

  await new MessageChangeHandler(event, loadEntity, saveEntity).process()

  expect(saveEntity).toHaveBeenCalledTimes(2)

  expectValidHistory(saveEntity)

  expect(message.edited).not.toBeNull()
  expect(message.body).toEqual(event.message.text)
  expect(message.status).toEqual(MessageStatus.Edited)
})

it("creates both entities if the Message entity is missing", async () => {
  const saveEntity = mockPromise()
  const loadEntity = jest.fn().mockResolvedValue(undefined)

  await new MessageChangeHandler(event, loadEntity, saveEntity).process()

  expect(saveEntity).toHaveBeenCalledTimes(2)

  expectValidHistory(saveEntity)

  const message: Message = saveEntity.mock.calls[0][0]

  expect(message.uuid).toEqual(event.message.client_msg_id)
  expect(message.channelUUID).toEqual(event.channel)
  expect(message.userUUID).toEqual(event.message.user)
  expect(message.timestamp).toBeTruthy()
  expect(message.edited).toBeTruthy()
  expect(message.status).toEqual(MessageStatus.Edited)
  expect(message.body).toEqual(event.message.text)
  expect(message.deleted).toBeFalsy()
})
