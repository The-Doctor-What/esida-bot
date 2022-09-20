require('dotenv').config()
import {vkGroup, vkUser} from "./bots";
import {loadFracs} from "./database";
import "./Esida/commandSystem"
import "./Esida/personnel"

export const main = async () => {
    await loadFracs()
    vkUser.updates.start().catch(console.error)
    vkGroup.updates.start().catch(console.error)
    console.log(`Logs » Все модули успешно загружены`)
}
main().then()