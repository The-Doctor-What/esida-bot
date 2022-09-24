import {commandSend, getShortURL, isURL} from "../others/utils";
import {getFraction, getUserData, supabase} from "../database";
import {vkGroup} from "../bots";

export async function commandForum(msg, args, sender) {
    const action = args[0]
    if (action != 'delete' && action != 'close' && action != 'pin' && action != 'unpin' && action != 'open') return msg.send({message: `🚫 Неверный аргумент! 🚫`, disable_mentions: 1})
    const url = args[1]
    if (!isURL(url)) return msg.send("🚫 Неверный формат ссылки! 🚫")
    const formCheck = await getForm(url)
    if (formCheck) return msg.send({message: `🚫 Нельзя сразу отправить 2 форму без ответа по первой! 🚫`, disable_mentions: 1})
    msg.send(`📝 Заявка на ${action} отправлена! 📝`)
    if (action != 'delete') {
        await formSend(sender, url, action)
        const id = await getForm(url)
        await vkGroup.api.messages.send({
            chat_id: 40,
            message: `📝 Заявка на ${action} темы! 📝\n\n🔗 Ссылка: ${url}\n👤 Отправитель: @id${sender.vk_id} (${sender.nick})\n🆔 Принять: /facc ${id.id}\n🆔 Отклонить: /fdec ${id.id}`,
            dont_parse_links: 1,
            random_id: 0,
            disable_mentions: 1
        })
    }
    else {
        await vkGroup.api.messages.send({
            chat_id: 40,
            message: `📝 Заявка на удаление темы ниже!\n👤 Отправитель: @id${sender.vk_id} (${sender.nick})\n\n🔸 Форма отправлена лидером а не администратором ее нужно проверить а не слепо принять!`,
            dont_parse_links: 1,
            random_id: 0,
            disable_mentions: 1
        })
        await commandSend(`!fdel ${url}`)
    }
}

export async function commandForumAccept(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return msg.send("🚫 Заявка не найдена! 🚫")
    else if (form.status) return msg.send("🚫 Заявка уже обработана! 🚫")
    let formCommand = '!f'
    if (form.action == `open`) formCommand += 'close 0 '
    else if (form.action == 'close') formCommand += 'close 1 '
    else if (form.action == `unpin`) formCommand += 'zakrep 0 '
    else if (form.action == 'pin') formCommand += 'zakrep 1 '
    formCommand += form.url
    await commandSend(formCommand)
    form.status = true
    form.url = await getShortURL(form.url)
    await saveForm(form)
    let user = await getUserData(form.sender_id)
    await vkGroup.api.messages.send({
        chat_id: await getFraction(user.frac, "chat"),
        message: `📝 Заявка на ${form.action} темы! 📝\n\n🔗 | Ссылка: ${form.url}\n✅ | Принята!`,
        dont_parse_links: 1,
        random_id: 0,
        disable_mentions: 1
    })
    msg.send("📝 Заявка успешно обработана! 📝")
}

export async function commandForumDecline(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return msg.send("🚫 Заявка не найдена! 🚫")
    else if (form.status) return msg.send("🚫 Заявка уже обработана! 🚫")
    form.status = true
    form.url = await getShortURL(form.url)
    await saveForm(form)
    let user = await getUserData(form.sender_id)
    await vkGroup.api.messages.send({
        chat_id: await getFraction(user.frac),
        message: `📝 Заявка на ${form.action} темы! 📝\n\n🔗 | Ссылка: ${form.url}\n🚫 | Отказана!`,
        dont_parse_links: 1,
        random_id: 0,
        disable_mentions: 1
    })
    msg.send("📝 Заявка отклонена! 📝")
}

export async function formSend(sender, url, action) {
    await supabase
        .from('forms')
        .insert({
            url,
            action,
            sender_id: sender.vk_id
        })
}

export async function getForm(url) {
    const isNum = !isNaN(Number(url))
    const {data, error} = await supabase
        .from("forms")
        .select("*")
        .eq(isNum ? 'id' : 'url', url).maybeSingle()
    if (error) {
        console.error(`Logs » Не удалось получить информацию о форме:`)
        console.error(error)
    } else {
        return data
    }
}

export async function saveForm(form) {
    const {data, error} = await supabase
        .from("forms")
        .upsert(form)
    if (error || !data) {
        console.error(`Logs » Не удалось сохранить информацию о пользователе:`)
        console.error(error)
    } else {
        return data
    }
}