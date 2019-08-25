import { WebClient } from "@slack/web-api"
import { token } from "."

export const client = new WebClient(token)
