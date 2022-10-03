import {checkUser, getFraction, saveUser} from "../database";
import moment from "moment";
import {vkGroup} from "../bots";
import {addHistory} from "./commandHistory";
import {getGender} from "../others/utils";

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
    let action = "set"
    if (args[1].startsWith("+")) action = "+"
    else if (args[1].startsWith("-")) action = "-"
    let count = args[1].replace(/[^0-9]/g, "")
    count = parseInt(count)
    if(!count) return msg.send("🚫 Неверное количество! 🚫")
    let reason = args.slice(2).join(" ")
    let time = moment()
    let data = await checkUser(msg, args[0], sender, false)
    if (!data) return
    let text = `${sender.rank} @id${msg.senderId}(${sender.nick})\n\n`
    let actionText = "Установил"
    if (action == "+") actionText = "Выдал"
    else if (action == "-") actionText = "Снял"
    if (data.access >= sender.access) return msg.send(`🚫 Вы не можете использовать это на пользователя с таким же или большим уровнем доступа! 🚫`)
    text += `🔹 ${actionText}${await getGender(msg.senderId)} ${count} ${type.name}\n`
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
    if (data.access < 5 && chat != msg.chatId) await vkGroup.api.messages.send({chat_id: chat, message: text, dont_parse_links: 1, disable_mentions: 1, random_id: 0})
}

export async function checkScores(data, limit) {
    data.score = limit
    await addHistory(data, "score", limit, `Больше ${limit} баллов`, "set")
    await saveUser(data)
    return `🔹 Эвелина установила ${limit} баллов (Лимит баллов)\n`
}

export async function checkWarns(data, mode, count = 3, name = "предупреждения", _name = "выговор", type = "warns", _type = "vigs") {
    if (mode == 1) {
        data[type] -= count
        data[_type] += 1
        await addHistory(data, type, count, `${count}/${count} ${name}`, "-")
        await addHistory(data, _type, count, `${count}/${count} ${name}`, "+")
        await saveUser(data)
        return `🔹 Эвелина сняла ${count} ${name} и выдала ${_name} (${count}/${count} ${name})\n`
    } else {
        data[type] += count
        data[_type] -= 1
        await addHistory(data, type, count, `-1/${count} ${name}`, "+")
        await addHistory(data, _type, count, `-1/${count} ${name} `, "-")
        await saveUser(data)
        return `🔹 Эвелина выдала ${count} ${name} и сняла ${_name} (-1/${count} ${name})\n`
    }
}

export async function checkData(data) {
    let text = ``
    while (true) {
        if (data.access < 5) {
            if (data.warns >= 3) text += await checkWarns(data, 1)
            else if (data.warns <= -1 && data.vigs >= 1) text += await checkWarns(data, 2)
            else if (data.fwarns >= 2) text += await checkWarns(data, 1, 2, "федеральных выговоров", "предупреждения", "fwarns", "warns")
            else if (data.fwarns <= -1) text += await checkWarns(data, 2, 2, "федеральных выговоров", "предупреждения", "fwarns", "warns")
            else if (data.vigs <= -1) text += await checkWarns(data, 2, 3, "выговоров", "предупреждения", "vigs", "warns")
            else if (data.score > 70 && data.access == 1) text += await checkScores(data, 70)
            else if (data.score > 140 && (data.access == 3 || (data.frac == 6 && data.access == 3))) text += await checkScores(data, 140)
            else if (data.score > 160 && data.access == 4 && data.frac != 6) text += await checkScores(data, 160)
            else break
        } else break
    }
    await saveUser(data)
    return text
}