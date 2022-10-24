import {createClient} from "@supabase/supabase-js";
import request from 'prequest'
import {helpJustall} from "./helpTexts";
const supabaseJA = createClient(process.env.SUPABASE_URL_JA, process.env.SUPABASE_TOKEN_JA)

async function justallReloadCommand(msg) {
    await justallReload()
    await msg.send("✅ База данных JustAll была обновлена!")
}

export async function justallReload() {
    await request('https://justall.studio/api/refresh?token=' + process.env.AUTHOR_TOKEN).then((data) => {
        if (data.revalidated) console.log("Logs » База данных JustAll была обновлена!")
        else console.log("Logs » Произошла ошибка при обновлении базы данных JustAll!")
    })
}

export async function justallCommand(msg, args) {
    const command = msg.text.split(' ')[1]

    const checkCommand = {
        "reload": justallReloadCommand,
        "add": justallAdd,
        "delete": justallDelete,
        "connect" : justallConnect,
        "disconnect" : justallDisconnect,
        "tags" : justallTags,
        "projects" : justallProjects,
    }

    if (checkCommand[command]) return await checkCommand[command](msg, args)
    await msg.send({message: helpJustall, dont_parse_links: true})
}

async function justallDelete(msg, args) {
    const id = args[0].trim()

    const {error} = await supabaseJA
        .from("projects")
        .delete()
        .match({id: id})

    if (error) {
        console.error(`Logs » Не удалось удалить проект с id ${id}!`)
        console.error(error)
        await msg.send(`🚫 Не удалось удалить проект с id ${id}!`)
    }

    else {
        await msg.send(`✅ Удаление проекта проекта с id ${id} прошло успешно!`)
        await justallReload()
    }
}

async function justallAdd(msg) {
    const name = msg.text.split('Название: ')[1].split('\n')[0].trim()
    if (!name) return await msg.send('🚫 Введите корректное имя 🚫')

    const link = msg.text.split('Ссылка: ')[1].split('\n')[0].trim()
    if (!link) return await msg.send('🚫 Введите корректную ссылку 🚫')

    const description = msg.text.split('Описание: ')[1].split('\n')[0].trim()
    if (!description) return await msg.send('🚫 Введите корректное описание 🚫')

    const icon = msg.text.split('Иконка: ')[1].split('\n')[0].trim()
    if (!icon) return await msg.send('🚫 Введите корректную иконку 🚫')

    const tags = msg.text.split('Теги: ')[1].split('\n')[0].trim().split(',').map(t => Number(t.trim()))
    if (!tags) return await msg.send('🚫 Введите корректные теги 🚫')

    const {error} = await supabaseJA
        .from("projects")
        .insert({
            title: name,
            description: description,
            url: link,
            icon: icon,
            tags: tags
        })

    if (error) {
        console.error(`Logs » Не удалось создать новый проект "${name}"!`)
        console.error(error)
        await msg.send(`🚫 Не удалось создать новый проект "${name}"!`)
    }

    else {
        await msg.send(`✅ Создание нового проекта "${name}" прошло успешно!`)
        await justallReload()
    }
}

async function justallConnect(msg, args) {
    const icon = args[0]
    const url = args[1]

    const {error} = await supabaseJA
        .from("socials")
        .insert({
            icon: icon,
            url: url
        })

    if (error) {
        console.error(`Logs » Не удалось привязать новую социальную сеть!`)
        console.error(error)
        await msg.send(`🚫 Не удалось привязать новую социальную сеть!`)
    }

    else {
        await msg.send(`✅ Подключение новой социальной сети прошло успешно!`)
        await justallReload()
    }
}

async function justallDisconnect(msg, args) {
    const url = args[0]

    const {error} = await supabaseJA
        .from("socials")
        .delete()
        .match({url: url})

    if (error) {
        console.error(`Logs » Не удалось отключить социальную сеть!`)
        console.error(error)
        await msg.send(`🚫 Не удалось отключить социальную сеть!`)
    }

    else {
        await msg.send(`✅ Отключение социальной сети прошло успешно!`)
        await justallReload()
    }
}

async function justallTags(msg) {
    await getFullDataJA(msg, "project_tags")
}

async function justallProjects(msg) {
    await getFullDataJA(msg, "projects")
}

async function getFullDataJA(msg, section) {
    await supabaseJA
        .from(section)
        .select("*")
        .then(({data, error}) => {
            if (error) {
                console.error(`Logs » Не удалось получить список данных!`)
                console.error(error)
                msg.send(`🚫 Не удалось получить список данных!`)
            } else {
                let projects = data.map(p => `ID: ${p.id} | Название: ${p.title}`).join('\n')
                msg.send(`📋 Список:\n${projects}`)
            }
        })
}