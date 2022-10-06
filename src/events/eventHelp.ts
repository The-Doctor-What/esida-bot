import {
    commandsData,
    commandsDev,
    commandsForum,
    commandsInfo,
    commandsOthers,
    commandsPost
} from "../commands/commands";
import {vkGroup} from "../bots";
import {helpGroup, helpMain} from "../commands/commandHelp";
import {show_snackbar} from "./eventSystem";
import {Keyboard} from "vk-io";

export async function eventHelp(event, args, sender) {
    let access = 0
    if (sender) access = sender.access
    let group: any
    if (args[0] == "info") group = commandsInfo
    else if (args[0] == "data") group = commandsData
    else if (args[0] == "forum") group = commandsForum
    else if (args[0] == "post") group = commandsPost
    else if (args[0] == "others") group = commandsOthers
    else if (args[0] == "dev") group = commandsDev
    else if (args[0] == "main") {
        const {text, keyboard} = await helpMain(sender)
        await vkGroup.api.messages.edit({
            peer_id: event.peerId,
            message: text,
            keyboard: keyboard,
            conversation_message_id: event.conversationMessageId
        })
        return await show_snackbar(event, "Вы находитесь в главном меню помощи!")
    }
    const text = await helpGroup(group, access)
    const keyboard = Keyboard
        .keyboard([
                [
                    Keyboard.callbackButton({
                        label: 'Вернуться на главную',
                        color: `primary`,
                        payload: {
                            command: "help",
                            args: ["main"],
                            sender: sender.vk_id
                        }
                    }),
                ],
            ]
        ).inline(true)
    await vkGroup.api.messages.edit({
        peer_id: event.peerId,
        message: text,
        keyboard: keyboard,
        conversation_message_id: event.conversationMessageId
    })
    await show_snackbar(event, "Список команд отправлен в личные сообщения!")
}