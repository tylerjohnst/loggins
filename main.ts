import { createConnection } from "typeorm"
import { listenToRTM } from "./src/rtm"
import { syncUsers, syncChannels } from "./src/sync"

const main = async (): Promise<void> => {
  await createConnection()

  try {
    await Promise.all([syncUsers(), syncChannels()])
  } catch (err) {
    console.error(err)
  }

  try {
    await listenToRTM()
  } catch (err) {
    console.error(err)
  }
}

main()
