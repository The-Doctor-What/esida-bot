import {getFraction, getRankData, userid} from "../database";
import {vkGroup, vkUser} from "../bots";
import dedent from "dedent-js";

export async function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function commandSend(cmd, id = 100, vk = vkUser) {
    await vk.api.messages.send({
        chat_id: id,
        message: cmd,
        random_id: 0
    })
}

export function isURL(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export async function getShortURL(url) {
    if (!isURL(url)) return false
    let short = await vkUser.api.utils.getShortLink({url: url})
    return `vk.cc/${short.key}`
}

export async function getID(msg) {
    await msg.send(`ID чата: ${msg.chatId}`)
}

export async function chatsActions(msg, user, action = "add") {
    let tag: string
    const rank = await getRankData(user.rank)
    if (rank.chatTag) tag = rank.chatTag
    else if (action == "kick") tag = "Agos_0"
    else if (user.fraction > 0 && user.fraction < 30) tag = `leader_${user.fraction}`
    await commandSend(`!f${action} @id${msg.senderId} ${tag} Указано в беседе лидеров/замов 16`)
}

export async function sendMessage(id, msg) {
    if (userid == id) return await msg.send('🚫 | Вы не можете отправить сообщение боту!')
    let message = dedent`Приветик я Эвелина, давай сразу на ты! Я рада за тебя так как ты возможно будущий руководитель гос. организации, но если ты видишь, это сообщение, значит ты был одобрен.
Сначала тебе надо будет добавить меня в друзья,
Потом просто заполни форму - /form`
    const friendCheck = await vkUser.api.friends.get({user_id: userid})
    if (!friendCheck.items.includes(Number(id))) {
        await vkUser.api.friends.add({
            user_id: id,
            text: message,
        })
        await msg.send('🚫 | У пользователя закрыты личные сообщения, поэтому я отправила ему заявку в друзья!')
        return
    } else {
        await vkUser.api.messages.send({
            peer_id: id,
            message: message,
            random_id: 0
        })
        await msg.send('✅ | Отправила форму на пост руководителя!')
    }
}

export async function getGender(id, male = "", girl = "а") {
    const user = await vkUser.api.users.get({user_ids: id, fields: ["sex"]})
    if (user[0].sex == 1) return girl
    else return male
}

export async function endMessage(user, sender, reason, visable = true) {
    let text = `${sender.rank} @id${sender.vk_id} (${sender.nick}) снял${await getGender(sender.vk_id)} @id${user.vk_id} (${user.nick})\n`
    text += `C должности: ${user.rank} `
    if (user.oldaccess < 4) text += `${await getFraction(user.frac)}`
    text += `\nПричина: `
    if (visable) text += `${reason}`
    else text += `*Скрыто*`
    await vkGroup.api.messages.send({
        chat_id: await getFraction(100, "chat"),
        message: text,
        random_id: 0,
        disable_mentions: 1
    })
    if (user.oldaccess < 5) {
        await vkGroup.api.messages.send({
            chat_id: await getFraction(user.frac, "chat"),
            message: text,
            random_id: 0,
            disable_mentions: 1
        })
    }
}

export async function genCode() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 12;
    let code = "";
    for (let i = 0; i <= length; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        code += chars.substring(randomNumber, randomNumber +1);
    }
    return code
}

export async function startMessage(user) {
    let text = `@id${user.vk_id} (${user.nick}) назначен${await getGender(user.vk_id)}\n`
    text += `На должность: ${user.rank} ${await getFraction(user.frac)}`
    await vkGroup.api.messages.send({
        chat_id: await getFraction(100, "chat"),
        message: text,
        random_id: 0,
        disable_mentions: 1
    })
    if (user.access < 5) {
        await vkGroup.api.messages.send({
            chat_id: await getFraction(user.frac, "chat"),
            message: text,
            random_id: 0,
            disable_mentions: 1
        })
    }
}