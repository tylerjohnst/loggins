import { client } from "./client"
import { SlackID } from "../slack"
import { WebAPICallResult } from "@slack/web-api"

interface SlackUser {
  id: SlackID
  name: string
  real_name: string
  profile: {
    image_72: string
  }
}

export const getUsers = async (): Promise<SlackUser[]> => {
  let users: SlackUser[] = []
  let hasMore = true
  let cursor = undefined

  while (hasMore) {
    const response: WebAPICallResult = await client.users.list({ cursor })

    if (response.ok) {
      users = users.concat(response.members as SlackUser[])

      if (response.response_metadata && response.response_metadata.next_cursor) {
        cursor = response.response_metadata.next_cursor
      } else {
        cursor = undefined
      }

      hasMore = !!cursor
    } else {
      hasMore = false
      console.error(JSON.stringify(response, null, 2))
    }
  }

  return users
}
