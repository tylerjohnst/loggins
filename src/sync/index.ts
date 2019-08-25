import { syncUsers } from "./users"
import { syncChannels } from "./channels"

const POLL_INTERVAL = 60 * 60 * 1000

const interval = (fn: Function) => (): Promise<void> =>
  new Promise((): void => {
    const start = (): void => {
      fn()
      setTimeout(start, POLL_INTERVAL)
    }

    start()
  })

export const startUserSync = interval(syncUsers)
export const startChannelSync = interval(syncChannels)
