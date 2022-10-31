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

export async function loadData() {
    fractions = await getFullData("fractions")
    chats = await getFullData("chats")
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