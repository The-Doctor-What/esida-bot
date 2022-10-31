import {getFraction, getFullData, getRankData} from "../../database/database";
import moment from "moment";
import dedent from "dedent-js";

export async function listUsers(msg, args, sender) {
    const group = args[0] ? args[0] : "all"
    const groups = {
        "all": [-1],
        "archive": [0],
        "others": [1],
        "zams": [2],
        "leaders": [3, 4],
        "admins": [666, 69, 9, 8, 7, 6, 5],
        "dev": [69, 666],
        "candidates": [0]
    }
    if (!groups[group]) return await msg.send("🚫 Неверная группа! 🚫")

    let text = `📊 Список пользователей: 📊\n\n`
    if (group == "candidates" && sender.access > 4) {
        const users = await getFullData("candidates")
        if (!users) return await msg.send(`🚫 Не найдено ни одного кандидата! 🚫`)

        for (const user of users) {
            const rank = await getRankData(user.rank)
            text += dedent`🔹 ${rank.name} @id${user.vk_id} "${await getFraction(user.fraction, "tag")}"`
            text += `\n`
        }
    } else {
        const users = await getFullData("users", "fraction")
        if (!users) return await msg.send(`🚫 Не найдено ни одного пользователя! 🚫`)

        for (const user of users) {
            if (((groups[group].includes(user.access) || groups[group][0] == -1) && (!user.hide || group == "dev")) && (user.access != 0 || groups[group][0] == 0)) {
                const postStart = moment(user.post)
                const postEnd = moment(postStart).add(user.term, 'days')

                text += `🔹 ${user.rank}`
                if (user.access < 4) text += ` "${await getFraction(user.fraction, "tag")}"`
                text += ` @id${user.vk_id} (${user.nick})`
                if (user.access >= 3 && user.access <= 4) text += ` до срока осталось ${postEnd.diff(moment(), "days")} дней`
                text += `\n`
            }
        }
    }

    await msg.send({message: text, disable_mentions: 1})
}