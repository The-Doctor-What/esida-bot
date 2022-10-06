require('dotenv').config()
import {vkGroup, vkUser} from "./bots";
import {loadFracs} from "./database";
import "./commandSystem"
import "./personnel"
import "./events/eventSystem"

export const main = async () => {
    await loadFracs()
    vkUser.updates.start().catch(console.error)
    vkGroup.updates.start().catch(console.error)
    console.log(`Logs » Все модули успешно загружены`)
}
main().then()