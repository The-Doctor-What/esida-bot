import {getAccess} from "../database";
import {getAdminInfo, getOnline} from "../others/aliensAPI";
import moment from "moment";
moment.locale('ru')

export async function getOnlineUser(msg, args, sender) {
    let nick: string
    let server = 16
    if (args[0]) nick = args[0]
    else nick = sender.nick
    if (args[1]) {
        if (await getAccess(msg.senderId, 5)) server = args[1]
        else return await msg.send({message: `🚫 У вас нет доступа к получению онлайна игрока с другого сервера`})
    }
    let checkAdmin = await getAdminInfo(nick)
    if (checkAdmin != undefined) {
        if (!await getAccess(msg.senderId, 5)) return await msg.send(`🚫 | Вы не можете получить онлайн администратора`)
    }
    let online = await getOnline(nick, server)
    if (online.error) return await msg.send(`🚫 | ${online.msg}`)
    let text = `📊 Онлайн игрока ${nick}:`
    text += `\n🔸 Сервер: ${server}\n\n`
    let time = moment()
    text += `\n\n🔸 Онлайн за последние 7 дней\n\n`
    text += await getOnlineText(time, online)
    time = moment().startOf('week').add(6, 'days')
    text += `\n\n🔸 Онлайн за текущую неделю\n\n`
    text += await getOnlineText(time, online, "dddd")
    text += `\nПока что общий онлайн за неделю не работает корректно`
    await msg.send(text)
}

export async function getOnlineText(time, online, format = "DD MMM") {
    let text = ``
    let reports = 0
    let onlineTime: any
    for (let c = 0; c < 7; c++) {
        if (!online.online[time.format("YYYY-MM-DD")]) {
            text += `🔹 ${time.format(format)} 00:00:00\n`
            time.subtract(1, "days")
            continue
        }
        text += `🔹 ${time.format(format)} ${online.online[time.format("YYYY-MM-DD")]}`
        if (online.report[time.format("YYYY-MM-DD")] > 0) {
            text += ` [R: ${online.report[time.format("YYYY-MM-DD")]}]`
            reports += online.report[time.format("YYYY-MM-DD")]
        }
        text += `\n`
        time.subtract(1, "days")
        onlineTime = online.allonline.split(":")
        let onl = online.online[time.format("YYYY-MM-DD")].split(":")
        for (let i = 0; i < 3; i++) {
            onlineTime[i] = Number(onlineTime[i]) - Number(onl[i])
            if (onlineTime[i] < 0) {
                onlineTime[i] += 60
                onlineTime[i - 1] -= 1
            }
        }
    }
    text += `🔸 Общее: ${onlineTime[0]}:${onlineTime[1]}:${onlineTime[2]}`
    if (reports > 0) text += ` [R: ${reports}]`
    return text
}