import { findOrBuildChannelByUUID } from "../finders/channel"
import { getChannels } from "../slack/get-channels"
import { saveEntity } from "../commands/save-entity"

export const syncChannels = async (): Promise<void[]> => {
  const channels = await getChannels()

  return Promise.all(
    channels.map(async ({ name, id }) => {
      const channel = await findOrBuildChannelByUUID(id)

      channel.name = name

      await saveEntity(channel).catch(console.error)
    }),
  )
}
