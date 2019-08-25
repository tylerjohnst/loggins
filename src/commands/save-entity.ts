import { getConnection } from "typeorm"

import { User } from "../entity/user"
import { Channel } from "../entity/channel"
import { Message } from "../entity/message"
import { MessageHistory } from "../entity/message_history"

export type Entities = Message | MessageHistory | User | Channel

export const saveEntity = async (model: Entities): Promise<Entities> =>
  getConnection().manager.save(model)
