import { SlackID } from "."
import { client } from "./client"

interface SlackChannel {
  id: SlackID
  name: string
}

export const getChannels = async (): Promise<SlackChannel[]> => {
  const response = await client.channels.list({
    exclude_archived: true,
    exclude_members: true,
  })

  if (response.ok) {
    return response.channels as [SlackChannel]
  } else {
    return []
  }
}
