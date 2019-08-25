import { getConnection } from "typeorm"
import { Channel } from "../entity/channel"

export const findChannelByUUID = async (uuid: string): Promise<Channel | undefined> =>
  await getConnection().manager.findOne(Channel, { where: { uuid } })

export const findOrBuildChannelByUUID = async (uuid: string): Promise<Channel> => {
  let channel = await findChannelByUUID(uuid)

  if (channel) {
    return channel
  } else {
    channel = new Channel()
    channel.uuid = uuid
    return channel
  }
}
