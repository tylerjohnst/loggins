import { getConnection } from "typeorm"

import { findOrBuildChannelByUUID } from "../finders/channel"
import { getChannels } from "../slack/get-channels"

export const syncChannels = async (): Promise<void> => {
  const channels = await getChannels()

  for (const { name, id } of channels) {
    const channel = await findOrBuildChannelByUUID(id)
    channel.name = name
    getConnection().manager.save(channel)
  }
}
