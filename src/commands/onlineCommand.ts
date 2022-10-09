import {getAccess} from "../database";
import {getAdminInfo, getOnline} from "../others/aliensAPI";
import moment from "moment";
import dedent from "dedent-js";

moment.locale('ru')

export async function getOnlineUser(msg, args, sender) {
    const nick = args[0] || sender.nick
    const server = args[1] || 16

    if (!await getAccess(msg.senderId, 5)) {
        if (server != 16) return await msg.send({message: `🚫 | Вы не можете получить онлайн игрока с другого сервера`})
        if (await getAdminInfo(nick)) return await msg.send(`🚫 | Вы не можете получить онлайн администратора`)
    }

    const online = await getOnline(nick, server)
    if (online.error) return await msg.send(`🚫 | ${online.msg}`)

    await msg.send(dedent`
        📊 Онлайн игрока ${nick}:
        🔸 Сервер: ${server}
        
        🔸 Онлайн за последние 7 дней
    
        ${await getOnlineText(moment(), online)}
        
        🔸 Онлайн за текущую неделю
        
        ${await getOnlineText(moment().startOf('week').add(6, 'days'), online, "dddd")}
    
        Бот может отображать общий онлайн некорректно, скоро будет исправлено`
    )
}

export async function getOnlineText(time, online, format = "DD MMM") {
    let text = ``
    let reports = 0
    let onlineTime = moment("00:00:00", "HH:mm:SS")

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

        let onl = moment(online.online[time.format("YYYY-MM-DD")], "HH:mm:SS")
        onlineTime.add(Number(onl.format("HH")), "hours")
        onlineTime.add(Number(onl.format("mm")), "minutes")
        onlineTime.add(Number(onl.format("SS")), "seconds")
    }

    text += `🔸 Общее: ${onlineTime.format("LTS")}`
    if (reports > 0) text += ` [R: ${reports}]`
    return text
}