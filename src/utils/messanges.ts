import {getFraction, userid} from "../database/database";
import {vkGroup, vkUser} from "../database/bots";
import {getGender} from "./vk";

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