import {getFraction, getFullData, getRankData} from "../database";
import moment from "moment";

export async function listUsers(msg, args, sender) {
    let group = "all"
    let groups = [-1]
    if (args[0]) group = args[0]
    if (group == "all") groups = [-1]
    else if (group == "leaders") groups = [3, 2]
    else if (group == "zams") groups = [1]
    else if (group == "admins") groups = [69, 9, 8, 7, 6, 5, 4]
    else if (group == "archive" && sender.access > 3) groups = [0]
    else if (group == "dev") groups = [69]
    let text = `📊 Список пользователей: 📊\n\n`
    if (group == "candidates" && sender.access > 3) {
        const data = await getFullData("candidates")
        if (!data) return msg.send({ message: `🚫 Не найдено ни одного кандидата! 🚫`, disable_mentions: 1 })
        for (const user of data) {
            const rank = await getRankData(user.rank)
            text += `🔹 ${rank.name} @id${user.vk_id} [${user.rank}]`
            text += ` "${await getFraction(user.fraction, "tag")}"`
            text += `\n`
        }
    } else {
        const data = await getFullData("users")
        for (const user of data) {
            if (!data)  msg.send({ message: `🚫 Не найдено ни одного пользователя! 🚫`, disable_mentions: 1 })
            if (((groups.includes(user.access) || groups[0] == -1) && (user.frac != -1 || group == "dev")) && (user.access != 0 || groups[0] == 0)) {
                let postStart = moment(user.post)
                let postEnd = moment(postStart).add(user.term, 'days')
                text += `🔹 ${user.rank}`
                if (user.access < 4) text += ` "${await getFraction(user.frac, "tag")}"`
                text += ` @id${user.vk_id} (${user.nick})`
                if (user.access >= 2 && user.access <= 3) text += ` до срока осталось ${postEnd.diff(moment(), "days")} дней`
                text += `\n`
            }
        }
    }
    msg.send({message: text, disable_mentions: 1})
}