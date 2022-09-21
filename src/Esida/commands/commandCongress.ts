import {checkUser, saveUser} from "../../database";
import {congressRanks} from "../personnel";
import {vkUser} from "../../bots";

export async function congressSetAccess(msg, args, sender) {
    if (sender.congressAccess < 4 && sender.access <= 3) return msg.send({message: "🚫 | Доступ к настройке доступа в конгрессе имеет только спикер конгресса! 🚫"})
    let user = await checkUser(msg, args[0], sender, false)
    if (Number(args[1]) > 4 && Number(args[0]) < 0) return msg.send({message: "🚫 | Доступ в конгресс может быть только от 0 до 4! 🚫"})
    if (Number(args[1]) >= sender.congressAccess && sender.access < 4) return msg.send({message: "🚫 | Вы не можете выдать доступ выше или равный вашему! 🚫"})
    if (user.data > 3) return msg.send({message: "🚫 | Вы не можете назначить администратора в конгресс! 🚫"})
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