import {devId, supabase} from "./database";
import {getVkId} from "../utils/vk";

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