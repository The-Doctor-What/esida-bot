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
            ${info ? dedent`\n
            Уровень администратора: ${info.lvl}
            ID аккаунта: ${info.id}` : ""}
            
            Примечание: используется API веселого прикола`
        )
    } catch (error){
        console.log(error)
        await msg.send(`🚫 Проблемы с получением данных от API веселого прикола`)
    }
}