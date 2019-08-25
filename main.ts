import "reflect-metadata"

import { createConnection } from "typeorm"
import { listenToRTM } from "./src/rtm"
import { startChannelSync, startUserSync } from "./src/sync"

const main = async (): Promise<void> => {
  await createConnection()

  try {
    await Promise.all([startChannelSync(), startUserSync(), listenToRTM()])
  } catch (err) {
    console.error(err)
  }
}

main()
