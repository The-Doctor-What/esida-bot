import {messageSend, getShortURL, isURL} from "../others/utils";
import {getFraction, getUserData, supabase} from "../database";
import {vkGroup} from "../bots";
import {Keyboard} from "vk-io";
import {urlButton} from "./statsCommand";
import dedent from "dedent-js";
import {helpForum} from "../others/helpTexts";

export async function commandForum(msg, args, sender) {
    const action = args[0]
    if (action != 'delete' && action != 'close' && action != 'pin' && action != 'unpin' && action != 'open')
        return await msg.send(
        dedent`🚫 Неверное действие!
        ${helpForum}`)
    const url = args[1]
    if (!isURL(url)) return await msg.send("🚫 Неверный формат ссылки! 🚫")
    if (await getForm(url)) return await msg.send(`🚫 Нельзя отправить сразу две формы на одну тему без ответа по первой!`,)
    await msg.send(`📝 Заявка на ${action} отправлена! 📝`)
    if (action != 'delete') {
        await formSend(sender, url, action)
        const id = await getForm(url)
        const keyboard = Keyboard
            .keyboard([
                    [
                        await urlButton(url, 'Перейти к теме')
                    ],
                    [
                        Keyboard.callbackButton({
                            label: 'Принять',
                            color: `positive`,
                            payload: {
                                command: "faccept",
                                args: [id.id]
                            }
                        }),
                        Keyboard.callbackButton({
                            label: 'Отказать',
                            color: `negative`,
                            payload: {
                                command: 'fdecline',
                                args: [id.id]
                            },
                        })
                    ],
                ]
            ).inline(true)
        await messageSend(
            dedent`📝 Заявка на ${action} темы! 📝
            
            🔗 Ссылка: ${url}
            👤 Отправитель: @id${sender.vk_id} (${sender.nick})
            🆔 Принять: /facc ${id.id}
            🆔 Отклонить: /fdec ${id.id}
            Или же используйте кнопки ниже:`,
            40,
            vkGroup,
            keyboard
        )
    } else {
        await messageSend(
            dedent`📝 Заявка на удаление темы ниже!\
            👤 Отправитель: @id${sender.vk_id} (${sender.nick})
            🔸 Форма отправлена лидером а не администратором ее нужно проверить а не слепо принять!`,
            40,
            vkGroup,
        )
        await messageSend(`!fdel ${url}`)
    }
}

export async function commandForumAccept(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return await msg.send("🚫 Заявка не найдена! 🚫")
    else if (form.status) return await msg.send("🚫 Заявка уже обработана! 🚫")
    await messageSend(await getForumCommand(form))
    await formDelete(form, true)
    await msg.send("📝 Заявка успешно обработана! 📝")
}

export async function commandForumDecline(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return await msg.send("🚫 Заявка не найдена! 🚫")
    else if (form.status) return await msg.send("🚫 Заявка уже обработана! 🚫")
    await formDelete(form, false)
    await msg.send("📝 Заявка отклонена! 📝")
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

export async function getFullForum(msg) {
    const {data, error} = await supabase
        .from("forms")
        .select("*")
    if (error) {
        console.error(`Logs » Не удалось получить информацию о форме:`)
        console.error(error)
    } else {
        let text = ``
        for (const form of data) {
            if (!form.status) text += `📝 ${form.id}. ${form.url}\n`
        }
        if (text == ``) return await msg.send(`🚫 Нет заявок! 🚫`)
        else {
            text += `\n✅ Для одобрения заявки введите: /facc [id]`
            text += `\n🚫 Для отказа заявки введите: /fdec [id]`
            await msg.send(`📝 Список заявок на форуме: 📝\n\n` + text)
        }
    }
}

export async function formDelete(form, accept) {
    form.status = true
    form.url = await getShortURL(form.url)
    await saveForm(form)
    let user = await getUserData(form.sender_id)
    await messageSend(
        dedent`📝 Заявка на ${form.action} темы! 📝
        🔗 | Ссылка: ${form.url}
        ${accept ? `✅ | Принята!` : `🚫 | Отклонена!`}`,
        await getFraction(user.fraction, "chat"),
        vkGroup
    )
}

export async function getForumCommand(form) {
    let formCommand = '!f'
    if (form.action == `open`) formCommand += 'close 0 '
    else if (form.action == 'close') formCommand += 'close 1 '
    else if (form.action == `unpin`) formCommand += 'zakrep 0 '
    else if (form.action == 'pin') formCommand += 'zakrep 1 '
    formCommand += form.url
    return formCommand
}