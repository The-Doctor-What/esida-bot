import {getAdminInfo, getStats} from "../others/aliensAPI";
import dedent from "dedent-js";
import {getServer} from "./membersCommand";

export async function checkCommand(msg, args) {
    const server = await getServer(msg, args[1])
    if (!server) return

    try {
        const info = await getAdminInfo(args[0])
        console.log(info)
        const data = await getStats(args[0], server)
        console.log(data)
        msg.send(dedent`
            🏛 Информация о игроке: ${args[0]}
            🌐 Сервер: ${server}
            В данный момент: ${info.isOnline ? "Онлайн" : "Оффлайн"}
            ${info ? dedent`\n
            Уровень администратора: ${info.lvl}
            ID аккаунта: ${info.id}` : ""}
            Уровень в игре${data.lvl}
            
            Наличные: ${data.cash}
            Деньги в банке: ${data.bank}
            Деньги на депозите: ${data.deposit}
            Всего денег: ${data.totalMoney}
            
            Примечание: используется API веселого прикола`
        )
    } catch (error){
        console.log(error)
        await msg.send(`🚫 Проблемы с получением данных от API веселого прикола`)
    }
}