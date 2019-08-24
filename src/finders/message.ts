import { getConnection } from "typeorm"
import { Message } from "../entity/message"

export const findMessageByUUID = async (uuid: string) =>
  await getConnection().manager.findOne(Message, { where: { uuid } })
