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
    let {text, keyboard} = await helpMain(sender)
    if (args[0] != "main") {
        const groups = {
            "info": commandsInfo,
            "data": commandsData,
            "forum": commandsForum,
            "post": commandsPost,
            "others": commandsOthers,
            "dev": commandsDev
        }
        text = await helpGroup(groups[args[0]], sender.access)
        keyboard = Keyboard
            .keyboard([
                    [
                        await getHomeButton("help", sender)
                    ],
                ]
            ).inline(true)
    }
    await vkGroup.api.messages.edit({
        peer_id: event.peerId,
        message: text,
        keyboard: keyboard,
        conversation_message_id: event.conversationMessageId
    })
}