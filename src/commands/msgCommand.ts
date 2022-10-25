import {chats, getFullData} from "../database";
import {vkGroup} from "../bots";
import {helpMsg} from "../others/helpTexts";
import {messageSend} from "../others/utils";

export async function msgCommand(msg, args, sender) {
    const fraction = args[0].toLowerCase()
    const message = msg.text.split(' ').slice(2).join(' ')
    let error = true

    for (const chat of chats) {
        if (chat.name.toLowerCase() == fraction) {
            error = false
            if (chat.access > sender.access) return await msg.send("🚫 | У вас недостаточно прав для отправки сообщения в эту фракцию!")

            const allUsers = await vkGroup.api.messages.getConversationMembers({peer_id: chat.defaultChat + 2000000000})
            const usersData = await getFullData()

            let users = ``
            for (const user of allUsers.items) {
                for (const data of usersData) {
                    if (data.vk_id == user.member_id) {
                        if (data.access < sender.access && data.access < 7) users += `@id${user.member_id} (ᅠ) `
                    }
                }
            }

            await messageSend(`${message}\n\n🗣 @id${msg.senderId} (${sender.nick})\n\n${users}`, chat.defaultChat, vkGroup)
            break
        }
    }

    if (error) return await msg.send(`🚫 | Чат не найден!\n\n${helpMsg}`)
    else await msg.send("✅ | Сообщение успешно отправлено!")
}