import { getConnection } from "typeorm"

import { client } from "./client"
import { SlackID } from "../slack"
import { findOrBuildUserByUUID } from "../finders/user"

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
