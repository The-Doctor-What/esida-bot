import {loadFracs} from "../database";
import {helpEsida} from "../others/helpTexts";
import {vkGroup} from "../bots";

export let works = true

export async function stopProject(msg, args, sender) {
    await msg.send(`🚫 Все модули были выключены! 🚫`)
    console.log(`Logs » Все модули были выключены`)
    await vkGroup.api.messages.send(
        {
            chat_id: 3,
            message: `${sender.rank} @id${sender.vk_id}(${sender.nick}) выключил все модули!`,
            random_id: 0
        }
    )
    process.exit(0)
}

export async function pauseProject(msg) {
    const text = works ? `Работа всех модулей приостановлена!` : `Работа всех модулей возобновлена!`
    msg.send(`✅ ${text}`)
    console.log(`Logs » ${text}`)
    works = !works
}

export async function reloadFractions(msg) {
    await loadFracs()
    await msg.send(`✅ Фракции успешно перезагружены!`)
    console.log(`Logs » Фракции успешно перезагружены`)
}

export async function statusProject(msg) {
    await msg.send({message: `📊 Состояние модулей: ${works ? "✅ Включены" : "🚫 Выключены"}`, dont_parse_links: true})
}
export async function project(msg, args, sender) {
    let actions = {
        "stop": stopProject,
        "pause": pauseProject,
        "upfraction": reloadFractions,
        "status": statusProject,
    }
    if (!actions[args[0]]) return msg.send(`🚫 Данное действие не найдено! 🚫\n${helpEsida}`)
    await actions[args[0]](msg, args, sender)
}