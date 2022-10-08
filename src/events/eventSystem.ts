import {getUserData} from "../database";
import {works} from "../commands/commandProject";
import {events} from "./events";
import {vkGroup} from "../bots";
import {Keyboard} from "vk-io";
import {getError} from "../commands/commandSystem";

vkGroup.updates.on('message_event', async msg => await eventSystem(msg))

export async function eventSystem(msg) {
    try {
        if (!works) return
        const {command, args, sender: commandSender} = msg.payload.payload
        if (commandSender != undefined) {
            if (commandSender != msg.userId) return await show_snackbar(msg, "🚫 Вы не можете использовать чужие кнопки! 🚫")
        }
        const sender = await getUserData(msg.userId) || {vk_id: msg.userId, access: 0}
        const event = events.find(x => x.name == command)
        if (!event) return await show_snackbar(msg, "🚫 Не найдено событие с таким названием! 🚫")
        if (event.access > sender.access) return await show_snackbar(msg, `🚫 У вас недостаточно прав для использования этого события`)
        await event.func(msg, args, sender)
    } catch (error) {
        try {
            const {keyboard} = await getError(error, "eventSystem")
            await vkGroup.api.messages.send({
                chat_id: 41,
                message: `🚫 Произошла ошибка при выполнении события! 🚫\n\n${error}`,
                keyboard: keyboard,
                random_id: 0
            })
        } catch {
            console.log(error)
        }
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

export async function getHomeButton(command, sender) {
    return Keyboard.callbackButton({
        label: 'Вернуться в главное меню',
        color: `primary`,
        payload: {
            command: command,
            args: ["main"],
            sender: sender.vk_id
        }
    })
}