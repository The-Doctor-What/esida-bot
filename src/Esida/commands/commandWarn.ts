import {devId, getFraction, getUserData, getVkId, saveUser, userid} from "../../database";
import moment from "moment";
import {vkGroup} from "../../bots";
moment.locale('ru')

export async function setWarn(msg, args, sender) {
    await setData(msg, args, sender, {tag: "warns", name: "предупреждений"})
}

export async function setVig(msg, args, sender) {
    await setData(msg, args, sender, {tag: "vigs", name: "выговоров"})
}

export async function setFWarn(msg, args, sender) {
    await setData(msg, args, sender, {tag: "fwarns", name: "федеральных выговоров"})
}

export async function setDays(msg, args, sender) {
    await setData(msg, args, sender, {tag: "term", name: "дней к сроку"})
}

export async function setScore(msg, args, sender) {
    await setData(msg, args, sender, {tag: "score", name: "баллов"})
}

export async function setLitrbol(msg, args, sender) {
    await setData(msg, args, sender, {tag: "litrbol", name: "основных балллов"})
}
export async function setRep(msg, args, sender) {
    await setData(msg, args, sender, {tag: "rep", name: "репутации"})
}

export async function setData(msg, args, sender, type = {tag: "warns", name: "предупреждений"}) {
    let user = await getVkId(args[0])
    if (!user) user = (args[0])
    let action = "set"
    if (args[1].startsWith("+")) action = "+"
    else if (args[1].startsWith("-")) action = "-"
    let count = args[1].replace(/[^0-9]/g, "")
    count = parseInt(count)
    let reason = args.slice(2).join(" ")
    let time = moment()
    let data = await getUserData(user)
    if (!data) {
        return msg.send({
            message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
            disable_mentions: 1
        })
    }
    let text = `@id${msg.senderId}(${sender.nick}) пользователю @id${data.vk_id} (${data.nick})\n\n`
    if (!data) return msg.send("🚫 Пользователь не найден! 🚫")
    let actionText = "Установил"
    if (action == "+") actionText = "Выдал"
    else if (action == "-") actionText = "Снял"
    if (data.access >= sender.access) return msg.send(`🚫 Вы не можете использовать это на пользователя с таким же или большим уровнем доступа! 🚫`)
    text += `🔹 ${actionText} ${count} ${type.name}\n`
    if (type.tag == "score" && action == "+") {
        data.litrbol += count
    }
    if (action == "set") data[type.tag] = count
    else if (action == "+") data[type.tag] += count
    else if (action == "-") data[type.tag] -= count
    data.history[type.tag].push({user: msg.senderId, time: time, action: action, count: count, reason: reason})
    text += await checkWarns(data)
    text += `🔸 Причина: ${reason}\n🔸 Время: ${time.format("DD.MM.YYYY HH:mm:ss")}\n\n`
    await saveUser(data)
    msg.send({ message: text, disable_mentions: 1, dont_parse_links: 1 })
    let chat = await getFraction(data.frac, "chat")
    if (data.access < 4 && chat != msg.chatId) await vkGroup.api.messages.send({
        chat_id: chat,
        message: text,
        dont_parse_links: 1,
        disable_mentions: 1,
        random_id: 0
    })
}

export async function checkWarns(data) {
    let time = moment()
    let text = ``
    while (true) {
        if (data.access < 4) {
            if (data.warns >= 3) {
                data.warns -= 3
                data.vigs += 1
                data.history.warns.push({user: userid, time: time, action: "-", count: 3, reason: "3/3 предупреждений"})
                data.history.vigs.push({user: userid, time: time, action: "+", count: 1, reason: "3/3 предупреждений"})
                text += `🔹 Снял 3 предупреждения и выдал выговор\n`
            } else if (data.warns <= -1 && data.vigs >= 1) {
                data.warns += 3
                data.vigs -= 1
                data.history.warns.push({
                    user: userid,
                    time: time,
                    action: "+",
                    count: 3,
                    reason: "-1/3 предупреждений"
                })
                data.history.vigs.push({user: userid, time: time, action: "-", count: 1, reason: "-1/3 предупреждений"})
                text += `🔹 Выдал 3 предупреждения и снял выговор\n`
            } else if (data.fwarns >= 2) {
                data.fwarns -= 2
                data.warns += 1
                data.history.fwarns.push({
                    user: userid,
                    time: time,
                    action: "-",
                    count: 2,
                    reason: "2/2 федеральных выговоров"
                })
                data.history.warns.push({
                    user: userid,
                    time: time,
                    action: "+",
                    count: 1,
                    reason: "2/2 федеральных выговоров"
                })
                text += `🔹 Снял 2 федеральных выговоров и выдал предупреждения\n`
            } else if (data.fwarns <= -1) {
                data.fwarns += 2
                data.warns -= 1
                data.history.fwarns.push({
                    user: userid,
                    time: time,
                    action: "+",
                    count: 2,
                    reason: "-1/2 федеральных выговоров"
                })
                data.history.warns.push({
                    user: userid,
                    time: time,
                    action: "-",
                    count: 1,
                    reason: "-1/2 федеральных выговоров"
                })
                text += `🔹 Выдал 2 федеральных выговоров и снял предупреждения\n`
            } else if (data.score > 70 && data.access == 1) {
                data.score = 70
                data.history.score.push({
                    user: userid,
                    time: time,
                    action: "set",
                    count: 70,
                    reason: "больше 70 баллов"
                })
                text += `🔹 Установил 70 баллов (Лимит баллов)\n`
            } else if (data.score > 140 && (data.access == 2 || (data.frac == 6 && data.access == 3))) {
                data.score = 140
                data.history.score.push({
                    user: userid,
                    time: time,
                    action: "set",
                    count: 140,
                    reason: "больше 140 баллов"
                })
                text += `🔹 Установил 140 баллов (Лимит баллов)\n`
            } else if (data.score > 160 && data.access == 3 && data.frac != 6) {
                data.score = 160
                data.history.score.push({
                    user: userid,
                    time: time,
                    action: "set",
                    count: 160,
                    reason: "больше 160 баллов"
                })
                text += `🔹 Установил 160 баллов (Лимит баллов)\n`
            } else break
        } else break
    }
    await saveUser(data)
    return text
}