import {devId, getFraction, getUserData, getVkId, saveUser} from "../../database";
import moment from "moment";
import {vkGroup} from "../../bots";
import {addHistory} from "./commandHistory";
import {getGender} from "../../utils";

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
    let text = `${sender.rank} @id${msg.senderId}(${sender.nick})\n\n`
    if (!data) return msg.send("🚫 Пользователь не найден! 🚫")
    let actionText = "Установил"
    if (action == "+") actionText = "Выдал"
    else if (action == "-") actionText = "Снял"
    if (data.access >= sender.access) return msg.send(`🚫 Вы не можете использовать это на пользователя с таким же или большим уровнем доступа! 🚫`)
    text += `🔹 ${actionText}${await getGender(msg.senderId, "", "а")} ${count} ${type.name}\n`
    if (type.tag == "score" && action == "+") {
        data.litrbol += count
    }
    if (action == "set") data[type.tag] = count
    else if (action == "+") data[type.tag] += count
    else if (action == "-") data[type.tag] -= count
    await addHistory(data, type.tag, count, reason, action, sender.vk_id)
    text += await checkData(data)
    text += `🔸 Причина: ${reason}\n🔸 Время: ${time.format("DD.MM.YYYY HH:mm:ss")}\n🔸 Пользователю: @id${data.vk_id} (${data.nick})\n\n`
    await saveUser(data)
    msg.send({message: text, disable_mentions: 1, dont_parse_links: 1})
    let chat = await getFraction(data.frac, "chat")
    if (data.access < 4 && chat != msg.chatId) await vkGroup.api.messages.send({chat_id: chat, message: text, dont_parse_links: 1, disable_mentions: 1, random_id: 0})
}

export async function checkScores(data, limit) {
    data.score = limit
    await addHistory(data, "score", limit, `Больше ${limit} баллов`, "set")
    return `🔹 Эвелина установила ${limit} баллов (Лимит баллов)\n`
}

export async function checkWarns(data, mode, count = 3, name = "предупреждения", _name = "выговор", type = "warns", _type = "vigs") {
    if (mode == 1) {
        data.warns -= count
        data.vigs += 1
        await addHistory(data, type, count, `${count}/${count} ${name}`, "-")
        await addHistory(data, _type, count, `${count}/${count} ${name}`, "+")
        return `🔹 Эвелина сняла 3 ${name} и выдала ${_name}\n`
    } else {
        data.warns += count
        data.vigs -= 1
        await addHistory(data, type, count, `-1/${count} ${name}`, "+")
        await addHistory(data, _type, count, `-1/${count} ${name} `, "-")
        return `🔹 Эвелина выдала 3 ${name} и сняла ${_name} (-1/${count} ${name})\n`
    }
}

export async function checkData(data) {
    let text = ``
    while (true) {
        if (data.access < 4) {
            if (data.warns >= 3) text += await checkWarns(data, 1)
            else if (data.warns <= -1 && data.vigs >= 1) text += await checkWarns(data, 2)
            else if (data.fwarns >= 2) text += await checkWarns(data, 1, 2, "федеральных выговоров", "предупреждения")
            else if (data.fwarns <= -1) text += await checkWarns(data, 2, 2, "федеральных выговоров", "предупреждения")
            else if (data.score > 70 && data.access == 1) text += await checkScores(data, 70)
            else if (data.score > 140 && (data.access == 2 || (data.frac == 6 && data.access == 3))) text += await checkScores(data, 140)
            else if (data.score > 160 && data.access == 3 && data.frac != 6) text += await checkScores(data, 160)
            else break
        } else break
    }
    await saveUser(data)
    return text
}