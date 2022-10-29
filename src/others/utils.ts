import {getFraction, userid} from "../database";
import {vkGroup, vkUser} from "../bots";

export async function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function sleep(second) {
    return new Promise(resolve => setTimeout(resolve, second * 1000))
}

export async function messageSend(cmd, id = 100, vk = vkUser, keyboard: any = undefined) {
    if (keyboard == undefined) {
        await vk.api.messages.send({
            chat_id: id,
            message: cmd,
            random_id: 0
        })
    } else await vk.api.messages.send({
        chat_id: id,
        message: cmd,
        keyboard: keyboard,
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
    const short = await vkUser.api.utils.getShortLink({url: url})
    return `vk.cc/${short.key}`
}

export async function getID(msg) {
    await msg.send(`ID чата: ${msg.chatId}`)
}

export async function sendMessage(id, msg, message) {
    if (userid == id) return await msg.send('🚫 | Вы не можете отправить сообщение боту!')

    const friendCheck = await vkUser.api.friends.get({user_id: userid})
    if (!friendCheck.items.includes(Number(id))) {
        await vkUser.api.friends.add({
            user_id: id,
            text: message,
        })
        await msg.send('🚫 | У пользователя закрыты личные сообщения, поэтому Эвелина отправила ему заявку в друзья!')
        return
    } else {
        await vkUser.api.messages.send({
            peer_id: id,
            message: message,
            random_id: 0
        })
        await msg.send('✅ | Эвелина отправила сообщение пользователю!')
    }
}

export async function getGender(id, male = "", girl = "а") {
    const user = await vkUser.api.users.get({user_ids: id, fields: ["sex"]})
    if (user[0].sex == 1) return girl
    else return male
}

export async function unInviteMessage(user, sender, reason, visable = true) {
    const text = `
        ${sender.rank} @id${sender.vk_id} (${sender.nick}) снял${await getGender(sender.vk_id)} @id${user.vk_id} (${user.nick})
        C должности: ${user.rank}
        ${user.oldaccess < 4 ? await getFraction(user.fraction) : ""}
        Причина: ${visable ? reason : "Скрыта"}`

    await messageSend(text, await getFraction(100, "chat"), vkGroup)
    if (user.oldaccess < 5) {
        await messageSend(text, await getFraction(user.fraction, "chat"), vkGroup)
    }
}

export async function genCode() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 12;

    let code = "";

    for (let i = 0; i <= length; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        code += chars.substring(randomNumber, randomNumber + 1);
    }

    return code
}