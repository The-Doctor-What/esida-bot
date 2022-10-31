import {checkUser, saveUser} from "../../database/user";
import {getGender} from "../../utils/vk";

export async function setRole(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return

    const role = args.slice(1).join(" ")
    if (user.access > sender.access) return await msg.send("🚫 Вы не можете установить роль пользователю с большим уровнем доступа! 🚫")

    user.rank = role
    await saveUser(user)
    await msg.send(`@id${sender.vk_id} (${sender.nick}) установил${await getGender(sender.vk_id)} роль @id${user.vk_id} (${user.nick}) на ${role}`)
}