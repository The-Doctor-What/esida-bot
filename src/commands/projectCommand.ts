import {loadFracs} from "../database";
import {helpEsida} from "../others/helpTexts";
import {vkGroup} from "../bots";
import {messageSend, sleep} from "../others/utils";

export let works = true

export async function stopProject(msg, args, sender) {
    if (works) {
        await pauseProject(msg)
        await sleep(20)
    }
    await msg.send(`🚫 Все модули были выключены! 🚫`)
    console.log(`Logs » ${sender.rank} @id${sender.vk_id}(${sender.nick}) выключил все модули!`)
    await messageSend(`${sender.rank} @id${sender.vk_id}(${sender.nick}) выключил все модули!`, 3, vkGroup)
    process.exit(0)
}

export async function pauseProject(msg) {
    const text = works ? `Работа всех модулей приостановлена!` : `Работа всех модулей возобновлена!`
    await msg.send(`✅ ${text}`)
    console.log(`Logs » ${text}`)
    works = !works
}

export async function reloadFractions(msg) {
    await loadFracs()
    await msg.send(`✅ Данные успешно обновлены!`)
    console.log(`Logs » Данные успешно обновлены`)
}

export async function statusProject(msg) {
    await msg.send(`📊 Состояние модулей: ${works ? "✅ Включены" : "🚫 Выключены"}`)
}
export async function project(msg, args, sender) {
    const actions = {
        "stop": stopProject,
        "pause": pauseProject,
        "upfraction": reloadFractions,
        "status": statusProject,
    }
    if (!actions[args[0]]) return await msg.send(`🚫 Данное действие не найдено! 🚫\n${helpEsida}`)
    await actions[args[0]](msg, args, sender)
}