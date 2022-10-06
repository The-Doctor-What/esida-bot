import {getUserData} from "../database";
import {works} from "../commands/commandProject";
import {events} from "./events";
import {vkGroup} from "../bots";

vkGroup.updates.on('message_event', async msg => await eventSystem(msg))

export async function eventSystem(msg) {
    try {
        const command = msg.payload.payload.command
        const args = msg.payload.payload.args
        if (msg.payload.payload.sender != undefined) {
            const commandSender = msg.payload.payload.sender
            if (commandSender != msg.userId) return await show_snackbar(msg, "🚫 Вы не можете использовать чужие кнопки! 🚫")
        }
        let sender = await getUserData(msg.userId)
        if (!sender) sender = {vk_id: msg.userId, access: 0}
        if (!works && command != "esida") return
        const event = events.find(x => x.name == command)
        if (!event) return await show_snackbar(msg, "🚫 Не найдено событие с таким названием! 🚫")
        if (event.access > sender.access) return await show_snackbar(msg, `🚫 У вас недостаточно прав для использования этого события`)
        await event.func(msg, args, sender)
    } catch (error) {
        console.log(error)
        await show_snackbar(msg, "Произошла ошибка при выполнении события!")
    }
}

export async function show_snackbar(event, text) {
    await vkGroup.api.messages.sendMessageEventAnswer({
        event_id: event.eventId,
        user_id: event.userId,
        peer_id: event.peerId,
        event_data: JSON.stringify({
            type: "show_snackbar",
            text: `${text}`
        })
    })
}