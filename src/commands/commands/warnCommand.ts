import {getFraction} from "../../database/database";
import moment from "moment";
import {vkGroup} from "../../database/bots";
import {addHistory} from "./historyCommand";
import dedent from "dedent-js";
import {messageSend} from "../../utils/messanges";
import {getGender} from "../../utils/vk";
import {checkUser, saveUser} from "../../database/user";

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
    let [action, actionText] = ["set", "Установил"]
    if (args[1].startsWith("+")) [action, actionText] = ["+", "Выдал"]
    else if (args[1].startsWith("-")) [action, actionText] = ["-", "Снял"]

    const count = Math.abs(parseInt(args[1]))
    if (isNaN(count)) return await msg.send("🚫 Неверное количество! 🚫")

    const reason = args.slice(2).join(" ")
    const time = moment()

    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return
    if (user.access >= sender.access) return await msg.send(`🚫 Вы не можете использовать это на пользователя с таким же или большим уровнем доступа! 🚫`)
    if (action == "set") user[type.tag] = count
    else if (action == "+") user[type.tag] += count
    else if (action == "-") user[type.tag] -= count
    if (type.tag == "score" && action == "+") user.litrbol += count
    await addHistory(user, type.tag, count, reason, action, sender.vk_id)

    const text = dedent`
        ${sender.rank} @id${msg.senderId}(${sender.nick})
        
        🔹 ${actionText}${await getGender(msg.senderId)} ${count} ${type.name}
        ${await checkData(user)}
        🔸 Причина: ${reason}
        🔸 Время: ${time.format("DD.MM.YYYY HH:mm:ss")}
        🔸 Пользователю: @id${user.vk_id} (${user.nick})`

    await saveUser(user)
    await msg.send({message: text, disable_mentions: 1, dont_parse_links: 1})
    const chat = await getFraction(user.fraction, "chat")
    if (user.access < 5 && chat != msg.chatId) await messageSend(text, chat, vkGroup)
}

export async function checkScores(user, limit) {
    user.score = limit
    await addHistory(user, "score", limit, `Больше ${limit} баллов`, "set")
    return `🔹 Эвелина установила ${limit} баллов (Лимит баллов)\n`
}

export async function checkWarns(user, mode, count = 3, name = "предупреждения", _name = "выговор", type = "warns", _type = "vigs") {
    if (mode == 1) {
        user[type] -= count
        user[_type] += 1
        await addHistory(user, type, count, `${count}/${count} ${name}`, "-")
        await addHistory(user, _type, count, `${count}/${count} ${name}`, "+")
        return `🔹 Эвелина сняла ${count} ${name} и выдала ${_name} (${count}/${count} ${name})\n`
    } else {
        user[type] += count
        user[_type] -= 1
        await addHistory(user, type, count, `-1/${count} ${name}`, "+")
        await addHistory(user, _type, count, `-1/${count} ${name} `, "-")
        return `🔹 Эвелина выдала ${count} ${name} и сняла ${_name} (-1/${count} ${name})\n`
    }
}

export async function checkData(user) {
    let text = ``
    while (true) {
        if (user.access < 5) {
            if (user.warns >= 3) text += await checkWarns(user, 1)
            else if (user.warns <= -1 && user.vigs >= 1) text += await checkWarns(user, 2)
            else if (user.fwarns >= 2) text += await checkWarns(user, 1, 2, "федеральных выговоров", "предупреждения", "fwarns", "warns")
            else if (user.fwarns <= -1) text += await checkWarns(user, 2, 2, "федеральных выговоров", "предупреждения", "fwarns", "warns")
            else if (user.vigs <= -1) text += await checkWarns(user, 2, 3, "выговоров", "предупреждения", "vigs", "warns")
            else if (user.score > 100 && user.access == 2) text += await checkScores(user, 100)
            else if (user.score > 200 && (user.access == 3 || (user.fraction == 6 && user.access == 3))) text += await checkScores(user, 200)
            else if (user.score > 220 && user.access == 4 && user.fraction != 6) text += await checkScores(user, 220)
            else break
        } else break
    }
    return text
}