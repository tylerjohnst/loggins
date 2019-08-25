import { SlackMessageDeletedEvent, MessageDeletedHandler } from "../message-deleted"
import { Message, MessageStatus } from "../../../entity/message"
import { mockPromise } from "../../../test/helpers"

const event: SlackMessageDeletedEvent = {
  deleted_ts: "1566749.5873",
  channel: "CHANNEL1",
  type: "message",
  subtype: "message_deleted",
  previous_message: {
    client_msg_id: "MESSAGE1",
    text: "I was deleted",
    ts: "1546749.5873",
    user: "USER1",
  },
}

it("marks the existing Message as deleted", async () => {
  const message = new Message()
  const saveEntity = mockPromise()
  const loadEntity = jest.fn().mockResolvedValue(message)

  await new MessageDeletedHandler(event, loadEntity, saveEntity).process()

  expect(saveEntity).toHaveBeenCalledWith(message)
  expect(message.deleted).toBeTruthy()
  expect(message.status).toEqual(MessageStatus.Deleted)
})

it("creates the Message in the deleted state if it does not exist", async () => {
  const saveEntity = mockPromise()
  const loadEntity = jest.fn().mockResolvedValue(undefined)

  await new MessageDeletedHandler(event, loadEntity, saveEntity).process()

  expect(saveEntity).toHaveBeenCalledTimes(1)

  const message: Message = saveEntity.mock.calls[0][0]

  expect(message.uuid).toEqual(event.previous_message.client_msg_id)
  expect(message.channelUUID).toEqual(event.channel)
  expect(message.userUUID).toEqual(event.previous_message.user)
  expect(message.timestamp).toBeTruthy()
  expect(message.edited).toBeFalsy()
  expect(message.status).toEqual(MessageStatus.Deleted)
  expect(message.deleted).toBeTruthy()
})
