import {getUserData, getVkId, saveUser} from "../../database";
import {congressRanks} from "../personnel";
import {vkUser} from "../../bots";

export async function congressSetAccess(msg, args) {
    let sender = await getUserData(msg.senderId)
    if (sender.congressAccess < 4 && sender.access <= 3) return msg.send({message: "🚫 | Доступ к настройке доступа в конгрессе имеет только спикер конгресса! 🚫"})
    let id = await getVkId(args[0])
    if (!id) id = args[0]
    let user = await getUserData(id)
    if (!user) return msg.send({message: "🚫 | Пользователь не найден! 🚫"})
    if (Number(args[1]) > 4 || Number(args[1]) < 0) return msg.send({message: "🚫 | Уровень доступа должен быть от 0 до 4! 🚫"})
    if (Number(args[1]) >= sender.congressAccess && sender.access < 4) return msg.send({message: "🚫 | Вы не можете выдать доступ выше или равный вашему! 🚫"})
    if (user.congressAccess == 0 && Number(args[1] > 0)) await vkUser.api.messages.send({
        chat_id: 62,
        message: `!fadd @id${user.vk_id} senat Член конгресса 16`,
        dont_parse_links: true,
        random_id: 0
    })
    else if (user.congressAccess > 0 && Number(args[1] == 0)) await vkUser.api.messages.send({
        chat_id: 62,
        message: `!fkick @id${user.vk_id} senat Член конгресса 16`,
        dont_parse_links: true,
        random_id: 0
    })
    user.congressAccess = Number(args[1])
    await saveUser(user)
    msg.send({message: `🔹 | Пользователь @id${user.vk_id} (${user.nick}) назначен на должность ${congressRanks[args[1]]}! 🔹`})
}