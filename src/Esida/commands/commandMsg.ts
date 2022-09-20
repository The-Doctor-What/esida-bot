import {chats, getFullData} from "../../database";
import {vkGroup, vkUser} from "../../bots";
import {helpMsg} from "../../others/helpTexts";

export async function msgCommand(msg, args, sender) {
    let frac = args[0]
    let message = msg.text.split(' ').slice(2).join(' ')
    let error = true
    for (let c = chats.length - 1; c >= 0; c--) {
        if (chats[c].name == frac) {
            if (chats[c].access > sender.access) return msg.send({
                message: "🚫 | У вас недостаточно прав для отправки сообщения в эту фракцию!",
                dont_parse_links: true
            })
            error = false
            // @ts-ignore
            let allUsers = await vkUser.api.messages.getChat({
                chat_id: chats[c].userChat,
            })
            let usersData = await getFullData()
            allUsers = allUsers.users
            let users = ``
            for (const user of allUsers) {
                for (const data of usersData) {
                    if (data.vk_id == user) {
                        if (data.access < sender.access && data.access < 6) users += ` @id${user} (👤)`
                    }
                }
            }
            await vkGroup.api.messages.send({
                chat_id: chats[c].defaultChat,
                message: `${message}\n\n🗣 @id${msg.senderId} (${sender.nick})\n\n${users}`,
                dont_parse_links: true,
                random_id: 0
            })
            error = false
            break
        }
    }
    if (error) return msg.send(`🚫 | Чат не найден!\n\n${helpMsg}`)
    else msg.send("✅ | Сообщение успешно отправлено!")
}