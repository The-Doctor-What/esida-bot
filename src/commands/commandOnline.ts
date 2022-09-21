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
        if (await getAccess(msg.senderId, 4)) server = args[1]
        else return msg.send({message: `🚫 У вас нет доступа к получению онлайна игрока с другого сервера`})
    }
    let checkAdmin = await getAdminInfo(nick)
    if (checkAdmin != undefined) {
        if (!await getAccess(msg.senderId, 4)) return msg.send(`🚫 | Вы не можете получить онлайн администратора`)
    }
    let online = await getOnline(nick, server)
    if (online.error) return msg.send(`🚫 | ${online.msg}`)
    let text = `📊 Онлайн игрока ${nick}:\n\n`
    let time = moment()
    let reports = 0;
    let onlineTime
    for (let c = 0; c < 7; c++) {
        text += `🔹 ${time.format("DD MMM")} ${online.online[time.format("YYYY-MM-DD")]}`
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
    text += `\n🔸 Онлайн за последние 7 дней\n`
    text += `🔸 Отыгранно: ${onlineTime[0]}:${onlineTime[1]}:${onlineTime[2]}`
    if (reports > 0) text += ` [R: ${reports}]`
    text += `\n🔸 Сервер: ${server}`
    msg.send(text)
}