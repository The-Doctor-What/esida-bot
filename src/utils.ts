import {getRankData, userid} from "./database";
import {vkUser} from "./bots";
import dedent from "dedent-js";

export function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function commandSend(cmd, id = 62) {
    await vkUser.api.messages.send({
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

export function getID(msg) {
    msg.send(`ID чата: ${msg.chatId}`)
}

export async function chatsActions(msg, user, action = "add") {
    let tag: string
    const rank = await getRankData(user.rank)
    if (rank.chatTag) tag = rank.chatTag
    else if (action == "kick") tag = "Agos_0"
    else if (user.fraction > 0 && user.fraction < 30) tag = `leader_${user.fraction}`
    await commandSend(`!f${action} @id${msg.senderId} ${tag} ${rank.name} 16`)
}

export async function sendMessage(id, msg) {
    if (userid == id) return msg.send('🚫 | Вы не можете отправить сообщение боту!')
    let message = dedent`Приветик я Эвелина, давай сразу на ты! Я рада за тебя так как ты возможно будущий руководитель гос. организации, но если ты видишь, это сообщение, значит ты был одобрен.
Сначала тебе надо будет добавить меня в друзья,
Потом просто заполни форму - /form`
    const friendCheck = await vkUser.api.friends.get({user_id: userid})
    if (!friendCheck.items.includes(Number(id))) {
        await vkUser.api.friends.add({
            user_id: id,
            text: message,
        })
        msg.send('🚫 | У пользователя закрыты личные сообщения, поэтому я отправила ему заявку в друзья!')
        return
    } else {
        await vkUser.api.messages.send({
            peer_id: id,
            message: message,
            random_id: 0
        })
        msg.send('✅ | Отправила форму на пост руководителя!')
    }
}