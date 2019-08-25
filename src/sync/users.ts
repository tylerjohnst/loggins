import { findOrBuildUserByUUID } from "../finders/user"
import { getUsers } from "../slack/get-users"
import { saveEntity } from "../commands/save-entity"

export const syncUsers = async (): Promise<void[]> => {
  const users = await getUsers()

  return Promise.all(
    users.map(async ({ id, name, real_name, profile }) => {
      const user = await findOrBuildUserByUUID(id)

      user.avatar = profile.image_72
      user.handle = name
      user.name = real_name

      await saveEntity(user).catch(console.error)
    }),
  )
}
