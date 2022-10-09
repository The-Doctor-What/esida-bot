import {
    commandsData,
    commandsDev,
    commandsForum,
    commandsInfo,
    commandsOthers,
    commandsPost
} from "../commands";
import {vkGroup} from "../bots";
import {Keyboard} from "vk-io";
import {helpGroup, helpMain} from "../commands/helpCommand";
import {getHomeButton} from "./eventSystem";

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
        return await vkGroup.api.messages.edit({
            peer_id: event.peerId,
            message: text,
            keyboard: keyboard,
            conversation_message_id: event.conversationMessageId
        })
    }
    const text = await helpGroup(group, access)
    const keyboard = Keyboard
        .keyboard([
                [
                    await getHomeButton("help",sender)
                ],
            ]
        ).inline(true)
    await vkGroup.api.messages.edit({
        peer_id: event.peerId,
        message: text,
        keyboard: keyboard,
        conversation_message_id: event.conversationMessageId
    })
}