import {getMembers} from "../others/aliensAPI";
import dedent from "dedent-js";
import {getFraction} from "../database";

export async function membersCommand(msg, args) {
    if (isNaN(args[0])) return await msg.send("🚫 Нужно использовать id фракции! 🚫")
    else if (args[0] < 1 || args[0] > 29) return await msg.send("🚫 Неверный id фракции! 🚫")

    const server = await getServer(msg, args[1])
    if (!server) return

    try {
        const data = await getMembers(Number(args[0]), server)
        console.log(data)
        msg.send(dedent`
            🏛 Список сотрудников фракции: ${await getFraction(Number(args[0]))}
            🌐 Сервер: ${server}
            
            В разработке...
            
            Примечание: используется API веселого прикола`
        )
    } catch (error){
        console.log(error)
        await msg.send(`🚫 Проблемы с получением данных от API веселого прикола`)
    }
}

export async function getServer(msg, server = undefined) {
    if (!server) return 16
    else if (isNaN(server)) return await msg.send("🚫 Нужно использовать id сервера! 🚫")
    else if (server < 1 || server > 22) return await msg.send("🚫 Неверный id сервера! 🚫")
    else return server
}