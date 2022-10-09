import {chats, getFullData} from "../database";
import {vkGroup, vkUser} from "../bots";
import {helpMsg} from "../others/helpTexts";
import {messageSend} from "../others/utils";

export async function msgCommand(msg, args, sender) {
    const frac = args[0].toLowerCase()
    const message = msg.text.split(' ').slice(2).join(' ')
    let error = true
    for (const chat of chats) {
        if (chat.name.toLowerCase() == frac) {
            if (chat.access > sender.access) return await msg.send("🚫 | У вас недостаточно прав для отправки сообщения в эту фракцию!")
            error = false

            // @ts-ignore
            const allUsers = await vkUser.api.messages.getChat({chat_id: chat.userChat,}).users
            const usersData = await getFullData()

            let users = ``
            for (const user of allUsers) {
                for (const data of usersData) {
                    if (data.vk_id == user) {
                        if (data.access < sender.access && data.access < 7) users += `@id${user} (ᅠ) `
                    }
                }
            }

            await messageSend(
                `${message}\n\n🗣 @id${msg.senderId} (${sender.nick})\n\n${users}`,
                chat.defaultChat,
                vkGroup
            )
            break
        }
    }
    if (error) return await msg.send(`🚫 | Чат не найден!\n\n${helpMsg}`)
    else await msg.send("✅ | Сообщение успешно отправлено!")
}