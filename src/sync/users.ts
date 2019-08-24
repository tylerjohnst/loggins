import { getConnection } from "typeorm"

import { findOrBuildUserByUUID } from "../finders/user"
import { getUsers } from "../slack/get-users"

export const syncUsers = async (): Promise<void> => {
  const users = await getUsers()

  for (const { id, name, real_name, profile } of users) {
    const user = await findOrBuildUserByUUID(id)

    user.avatar = profile.image_72
    user.handle = name
    user.name = real_name

    try {
      getConnection().manager.save(user)
    } catch (err) {
      console.error(err)
    }
  }
}
