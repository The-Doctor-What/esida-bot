import 'dotenv/config.js';
import {vkGroup, vkUser} from "./database/bots";
import {loadData} from "./database/database";
import "./events/eventSystem"
import "./commands/commandSystem"

async function main() {
    await loadData()
    vkUser.updates.start().catch(console.error)
    vkGroup.updates.start().catch(console.error)
    console.log(`Logs » Все модули успешно загружены`)
}
main().then()