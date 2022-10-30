import 'dotenv/config.js';
import {vkGroup, vkUser} from "./bots";
import {loadFracs} from "./database";
import "./events/eventSystem"
import "./commands/commandSystem"

async function main() {
    await loadFracs()
    vkUser.updates.start().catch(console.error)
    vkGroup.updates.start().catch(console.error)
    console.log(`Logs » Все модули успешно загружены`)
}
main().then()