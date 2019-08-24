import { getConnection } from "typeorm"

import { SlackID } from "../slack"
import { findOrBuildChannelByUUID } from "../finders/channel"
import { client } from "./client"

interface SlackChannel {
  id: SlackID
  name: string
}

export const syncChannels = async (): Promise<void> => {
  const response = await client.channels.list({
    exclude_archived: true,
    exclude_members: true,
  })

  if (response.ok) {
    const channels = response.channels as [SlackChannel]

    for (const { name, id } of channels) {
      const channel = await findOrBuildChannelByUUID(id)
      channel.name = name
      getConnection().manager.save(channel)
    }
  }
}
