import {deleteUser, getAccess, getFraction, getRankData, getUserData, getVkId, supabase} from "../database";
import {genCode, sendMessage} from "../others/utils";

export async function inviteCommand(msg, args, sender) {
    const candidate = await getVkId(args[0])
    if (!candidate) return await msg.send('🚫 Введите корректный id пользователя! 🚫')

    const rank = await getRankData(args[1])
    if (!rank) return await msg.send('🚫 Такой должности не существует! 🚫')
    if (!await getAccess(sender.vk_id, rank.admAccess)) {
        return await msg.send(`🚫 | У вас нет доступа к назначению на данную должность!`)
    }

    const fraction = getFraction(args[2])
    if (!fraction) return await msg.send('🚫 Такой фракции не существует! 🚫')

    const user = await getUserData(candidate, "candidates") || await getUserData(candidate, "users")
    if (user) {
        if (user.access > 0) return await msg.send('🚫 Данный пользователь уже является руководителем! 🚫')
        else {
            await deleteUser(user.vk_id)
            await msg.send(`✅ | Удален ранее составленный архив на пользователя!`)
        }
    }

    const {error} = await supabase
        .from("candidates")
        .insert({
            vk_id: candidate,
            access: rank.access,
            fraction,
            rank: rank.id,
            code: genCode(),
        })

    if (error) {
        console.error(`Logs » Не удалось добавить пользователя в базу данных!`)
        console.error(error)
        return await msg.send(`🚫 Не удалось добавить пользователя в базу данных! 🚫`)
    }

    await sendMessage(candidate, msg)
}

export async function removedCandidate(msg, args) {
    const user = await getUserData(getVkId(args[0]) || args[0], "candidates")
    if (!user) return await msg.send(`🚫 | Данный человек и так не имеет доступа к форме 💔`)

    const error = await deleteUser(user.vk_id, "candidates")
    if (error) {
        console.error(`Logs » Не удалось удалить пользователя из базы данных!`)
        console.error(error)
        await msg.send(`🚫 Не удалось удалить пользователя из базы данных!\nОбратитесь к разработчику!`)
    } else {
        console.log(`Logs » Пользователь успешно удален из базы данных!`)
        await msg.send(`✅ | Вы успешно удалили пользователя из списка кандидатов!`)
    }
}