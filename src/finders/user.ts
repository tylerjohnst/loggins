import { getConnection } from "typeorm"
import { User } from "../entity/user"

export const findUserByUUID = async (uuid: string) =>
  await getConnection().manager.findOne(User, { where: { uuid } })

export const findOrBuildUserByUUID = async (uuid: string): Promise<User> => {
  let user = await findUserByUUID(uuid)

  if (user) {
    return user
  } else {
    user = new User()
    user.uuid = uuid
    return user
  }
}
