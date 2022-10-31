import {vkUser} from "../database/bots";


export async function getGender(id, male = "", girl = "а") {
    const user = await vkUser.api.users.get({user_ids: id, fields: ["sex"]})
    if (user[0].sex == 1) return girl
    else return male
}

export async function getID(msg) {
    await msg.send(`ID чата: ${msg.chatId}`)
}

const mentionRegex = /\[id(\d+)\|.+]/
const idUrlRegex = /vk.com\/id(\d+)/
const nickUrlRegex = /vk.com\/([a-zA-Z0-9_]+)/

export async function getVkId(data) {
    const id = (data.match(mentionRegex) || data.match(idUrlRegex) || [])[1]
    if (!id) {
        const username = (data.match(nickUrlRegex) || [])[1]
        if (!username) return undefined
        const user = await vkUser.api.users.get({
            user_ids: [username]
        })
        return user[0].id
    }
    return id
}