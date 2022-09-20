import {devId, getUserData, getVkId, userid} from "../../database";
import moment from "moment";

moment.locale('ru')

export async function getHistory(msg, args) {
    let user = await getVkId(args[0])
    if (!user) user = (args[0])
    let type = args[1]
    let data = await getUserData(user)
    if (!data) {
        return msg.send({
            message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
            disable_mentions: 1
        })
    }
    let text = `📚 История пользователя @id${data.vk_id} (${data.nick}) 📚\n\n`
    if (!data.history[type]) return msg.send("🚫 У пользователя нет истории данного типа! 🚫")
    for (const history of data.history[type]) {
        let actionText = "Установил"
        if (history.action == "+") actionText = "Выдал"
        else if (history.action == "-") actionText = "Снял"
        text += `🔹 ${moment(history.time).format("DD.MM.YYYY HH:mm:ss")} @id${history.user} ${actionText} ${history.count} ${type}\n🔸 Причина: ${history.reason}\n`
    }
    msg.send({message: text, disable_mentions: 1, dont_parse_links: 1})
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