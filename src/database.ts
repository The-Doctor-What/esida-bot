import {vkUser} from "./bots";
import {createClient} from "@supabase/supabase-js";
import "websocket"

export let fractions: any = {}
export let chats: any = {}
export const devId = 236464202;
export const userid = 573028398;
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN)

export async function getFraction(id: number, type: string = "name") {
    for (const fraction of fractions) {
        if (fraction.id == id)
            if (type == "name") return `${fraction.name} [${id}]`
            else if (type == "chat") {
                for (const chat of chats) {
                    fraction.tag
                    if (chat.name == fraction.group) return chat.defaultChat
                }
            } else return fraction[type]
    }
    return undefined
}

export async function loadFracs() {
    fractions = await getFullData("fractions")
    chats = await getFullData("chats")
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

export async function getAccess(id, access) {
    if (access == 0) return true
    const user = await getUserData(id)
    if (!user) return false
    else return user.access >= access;
}

export async function getUserData(user, table = "users") {
    const isNum = !isNaN(Number(user))
    const {data, error} = await supabase
        .from(table)
        .select("*")
        .eq(isNum ? 'vk_id' : 'nick', user).maybeSingle()
    if (error) {
        console.error(`Logs » Не удалось получить информацию о пользователе:`)
        console.error(error)
    } else {
        return data
    }
}

export async function getFullData(table = "users", order = "id") {
    const {data, error} = await supabase
        .from(table)
        .select("*")
        .order('access', {ascending: false})
        .order(order)
    if (error || !data) {
        console.error(`Logs » Не удалось получить информацию о пользователе:`)
        console.error(error)
    } else {
        return data
    }
}

export async function saveUser(user) {
    const {data, error} = await supabase
        .from("users")
        .upsert(user)
    if (error || !data) {
        console.error(`Logs » Не удалось сохранить информацию о пользователе:`)
        console.error(error)
    } else {
        return data
    }
}

export async function deleteElement(user, table = "users", id = "vk_id") {
    const {error} = await supabase
        .from(table)
        .delete()
        .eq(id, user)
    if (error) {
        console.error(error)
    }
    return error
}

export async function getRankData(rank) {
    const isNum = !isNaN(Number(rank))
    const {data, error} = await supabase
        .from("ranksData")
        .select("*")
        .eq(isNum ? 'id' : 'name', rank).maybeSingle()
    if (error) {
        console.error(`Logs » Не удалось получить информацию о должности:`)
        console.error(error)
    } else {
        return data
    }
}

export async function checkUser(msg, data, sender, archive = true) {
    const user = await getUserData(await getVkId(data.toString()) || data)

    if (!user)
        await msg.send({
            message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
            disable_mentions: 1
        })
    else if (user.access == 0 && sender.access < 5) await msg.send(`🚫 У вас нет доступа к архивным пользователям! 🚫`)
    else if (user.access == 0 && !archive) await msg.send(`🚫 Пользователь архивный, вы не можете с ним взаимодействовать! 🚫`)

    else return user
    return undefined
}