import {getUserData, getVkId, saveUser} from "../../database";
import moment from "moment";
import {getGender} from "../../utils";
moment.locale('ru')

export async function setRole(msg, args, sender) {
    let user = await getVkId(args[0])
    if (!user) user = args[0]
    let role = args.slice(1).join(" ")
    let data = await getUserData(user)
    if (data.access > sender.access) return msg.send("🚫 Вы не можете установить роль пользователю с большим уровнем доступа! 🚫")
    if (!data) return msg.send("🚫 Пользователь не найден! 🚫")
    data.rank = role
    data.history.data.push({
        time: moment(),
        user: msg.senderId,
        action: "set",
        count: role,
        reason: "Установка роли"
    })
    await saveUser(data)
    msg.send(`@id${sender.vk_id} (${sender.nick}) установил${await getGender(sender.vk_id, "", "а")} роль @id${data.vk_id} (${data.nick}) на ${role}`)
}