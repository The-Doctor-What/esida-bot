require('dotenv').config()
import {vkGroup, vkUser} from "./bots";
import {loadFracs} from "./database";
import "./commandSystem"
import "./personnel"

export const main = async () => {
    await loadFracs()
    vkUser.updates.start().catch(console.error)
    vkGroup.updates.on('message_event', async msg => {
        console.log(msg)
        await vkGroup.api.messages.sendMessageEventAnswer({
            event_id: msg.eventId,
            user_id: msg.userId,
            peer_id: msg.peerId,
            event_data: JSON.stringify({
                type: "show_snackbar",
                text: "Сообщение отправлено!"
            })
        })
    })
    vkGroup.updates.start().catch(console.error)
    console.log(`Logs » Все модули успешно загружены`)
}
main().then()