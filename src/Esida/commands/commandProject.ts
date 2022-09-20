import {loadFracs} from "../../database";
import {helpEsida} from "../../others/helpTexts";

export let works = true

export async function stopProject(msg) {
    await msg.send(`🚫 Все модули были выключены! 🚫`)
    console.log(`Logs » Все модули были выключены`)
    process.exit(0)
}

export async function restartProject(msg) {
    await msg.send(`🔄 Все модули были перезагружены! 🔄`)
    console.log(`Logs » Все модули были перезагружены`)
    await pauseProject(msg)
    process.exit(1)
}

export async function pauseProject(msg) {
    if (works) {
        await msg.send(`✅ Работа всех модулей приостановлена!`)
        console.log(`Logs » Работа всех модулей приостановлена`)
    }
    else {
        await msg.send(`✅ Работа всех модулей возобновлена!`)
        console.log(`Logs » Работа всех модулей возобновлена`)
    }
    works = !works
}

export async function reloadFractions(msg) {
    await loadFracs()
    await msg.send(`✅ Фракции успешно перезагружены!`)
    console.log(`Logs » Фракции успешно перезагружены`)
}

export async function project(msg, args) {
    let actions = {
        "stop": stopProject,
        "pause": pauseProject,
        "upfraction": reloadFractions,
        "restart": restartProject
    }
    if (!actions[args[0]]) return msg.send(`🚫 Данное действие не найдено! 🚫\n${helpEsida}`)
    await actions[args[0]](msg)
}