import { WebClient } from "@slack/web-api"
import { token, SlackID } from "../slack"
import { getConnection } from "typeorm"
import { findOrBuildUserByUUID } from "../finders/user"
import { findOrBuildChannelByUUID } from "../finders/channel"

const client = new WebClient(token)

interface SlackUser {
  id: SlackID
  name: string
  real_name: string
  profile: {
    image_72: string
  }
}

export const syncUsers = async (): Promise<void> => {
  let hasMore = true
  let cursor = undefined

  while (hasMore) {
    const response = await client.users.list({ cursor })

    if (response.ok) {
      const users = response.members as [SlackUser]

      users.forEach(async ({ id, name, real_name, profile: { image_72 } }) => {
        const user = await findOrBuildUserByUUID(id)

        user.avatar = image_72
        user.handle = name
        user.name = real_name

        try {
          getConnection().manager.save(user)
        } catch (err) {
          console.error(err)
        }
      })

      cursor = response.response_metadata.next_cursor
      hasMore = !!cursor
    } else {
      hasMore = false
      console.error(JSON.stringify(response, null, 2))
    }
  }
}

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
