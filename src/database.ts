import {vkUser} from "./bots";
import {createClient} from "@supabase/supabase-js";
import "websocket"

export let fractions: any = {}
export let chats: any = {}
export const devId = 236464202;
export const userid = 573028398;
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN)

export async function getFraction(id: number, type: string = "name") {
    for (const frac of fractions) {
        if (frac.id == id)
            if (type == "name") return `${frac.name} [${id}]`
            else if (type == "tag") return frac.tag
            else if (type == "chat") {
                for (const chat of chats) {
                    frac.tag
                    if (chat.name == frac.group) return chat.defaultChat
                }
            }
    }
    return id
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
        let user = await vkUser.api.users.get({
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

export async function getFullData(table = "users") {
    const {data, error} = await supabase
        .from(table)
        .select("*").order('access', {ascending: false})
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

export async function deleteUser(user, table = "users") {
    const {error} = await supabase
        .from(table)
        .delete()
        .eq('vk_id', user)
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

export async function checkUser(msg, user, sender, archive = true) {
    let id = await getVkId(user.toString())
    if (!id) id = user
    let access = 0
    if (sender) access = sender.access
    let data = await getUserData(id)
    if (!data) {
        await msg.send({
            message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
            disable_mentions: 1
        })
        return undefined
    } else if (data.access == 0 && access < 5) {
        await msg.send({message: `🚫 У вас нет доступа к архивным пользователям! 🚫`, disable_mentions: 1})
        return undefined
    } else if (data.access == 0 && !archive) {
        await msg.send({message: `🚫 Пользователь архивный, вы не можете с ним взаимодействовать! 🚫`, disable_mentions: 1})
        return undefined
    } else return data
}