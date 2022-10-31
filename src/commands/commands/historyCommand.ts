import moment from "moment";
import {checkUser} from "../../database/user";
import {getGender} from "../../utils/vk";
import {userid} from "../../database/database";

moment.locale('ru')

export async function getHistory(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender)
    if (!user) return

    const type = args[1]
    if (!user.history[type]) return await msg.send("🚫 У пользователя нет истории данного типа! 🚫")

    let text = `📚 История пользователя @id${user.vk_id} (${user.nick}) 📚\n\n`
    for (const history of user.history[type]) {
        let actionText = `Установил`
        if (history.action == "+") actionText = `Выдал`
        else if (history.action == "-") actionText = `Снял `
        text += `🔹 ${moment(history.time).format("DD.MM.YYYY HH:mm:ss")} @id${history.user} ${actionText}${await getGender(history.user)} ${history.count} ${type}\n🔸 Причина: ${history.reason}\n`
    }

    await msg.send({message: text, disable_mentions: 1, dont_parse_links: 1})
}

export async function addHistory(user, type, count, reason, action, sender = userid) {
    user.history[type].push({
        user: sender,
        time: moment(),
        action: action,
        count: count,
        reason: reason
    })
}