import { WebClient } from "@slack/web-api"
import { token } from "../slack"

export const client = new WebClient(token)
