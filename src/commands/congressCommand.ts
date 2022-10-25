import {checkUser, saveUser} from "../database";
import {messageSend} from "../others/utils";

export const congressRanks = {
    "0": "Не состоит в конгрессе",
    "1": "Заместитель конгрессмена",
    "2": "Конгрессмен",
    "3": "Вице Спикер",
    "4": "Спикер",
}

export async function congressSetAccess(msg, args, sender) {
    if (sender.congressAccess < 4 && sender.access <= 4) return await msg.send("🚫 | Доступ к настройке доступа в конгрессе имеет только спикер конгресса! 🚫")

    const user = await checkUser(msg, args[0], sender, false)

    if (Number(args[1]) > 4 && Number(args[0]) < 0) return await msg.send("🚫 | Доступ в конгресс может быть только от 0 до 4! 🚫")
    if (Number(args[1]) >= sender.congressAccess && sender.access < 5) return await msg.send("🚫 | Вы не можете выдать доступ выше или равный вашему! 🚫")
    if (user.access > 3) return await msg.send("🚫 | Вы не можете назначить администратора в конгресс! 🚫")

    if (user.congressAccess == 0 && Number(args[1] > 0)) await messageSend(`!fadd @id${user.vk_id} senat Член конгресса 16`)
    else if (user.congressAccess > 0 && Number(args[1] == 0)) await messageSend(`!fkick @id${user.vk_id} senat Член конгресса 16`)

    user.congressAccess = Number(args[1])
    await saveUser(user)
    await msg.send({message: `🔹 | Пользователь @id${user.vk_id} (${user.nick}) назначен на должность ${congressRanks[args[1]]}! 🔹`})
}