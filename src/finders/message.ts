import { getConnection } from "typeorm"
import { Message } from "../entity/message"

export const findMessageByUUID = async (uuid: string): Promise<Message> =>
  await getConnection().manager.findOne(Message, { where: { uuid } })
