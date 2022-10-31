import {getAdminInfo, getOnline, SuccessfulOnlineAPIResponse} from "../../others/aliensAPI";
import moment, {Moment} from "moment";
import dedent from "dedent-js";
import {getAccess} from "../../database/user";

moment.locale('ru')

export async function getOnlineUser(msg, args, sender) {
    const nick = args[0] || sender.nick
    const server = args[1] || 16

    if (!await getAccess(msg.senderId, 5)) {
        if (server != 16) return await msg.send({message: `🚫 | Вы не можете получить онлайн игрока с другого сервера`})
        if (await getAdminInfo(nick)) return await msg.send(`🚫 | Вы не можете получить онлайн администратора`)
    }

    const online = await getOnline(nick, server)
    console.log(online)
    if ("error" in online) return await msg.send(`🚫 | ${online.msg}`)

    await msg.send(dedent`
        📊 Онлайн игрока ${nick}:
        🔸 Сервер: ${server}
        
        🔸 Онлайн за последние 7 дней
    
        ${await getOnlineText(moment(), online)}
        
        🔸 Онлайн за текущую неделю
        
        ${await getOnlineText(moment().startOf('week').add(6, 'days'), online, "dddd")}
        
        Онлайн работает!
    `)
}

export async function getOnlineText(
    date: Moment,
    online: SuccessfulOnlineAPIResponse,
    format: string = "DD MMMM"
): Promise<string> {
    let text = ""
    let sumTime = moment.duration(0)
    for (let i = 0; i < 7; i++) {
        const dateText = date.format(format)
        const onlineText = online.online[date.format("YYYY-MM-DD")] || "00:00:00"
        sumTime.add(moment.duration(onlineText))
        text += `🔹 ${dateText}: ${onlineText}\n`

        date.subtract(1, 'days')
    }
    text += `🔸 Всего: ${Math.floor(sumTime.asHours())}:${sumTime.minutes()}:${sumTime.seconds()}`
    return text
}