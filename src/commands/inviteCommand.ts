import {deleteElement, getAccess, getFraction, getRankData, getUserData, getVkId, supabase} from "../database";
import {genCode, sendMessage} from "../others/utils";
import dedent from "dedent-js";

export async function inviteCommand(msg, args, sender) {
    const candidate: any = {}
    candidate.vk_id = await getVkId(args[0])
    if (!candidate.vk_id) return await msg.send('🚫 Введите корректный id пользователя! 🚫')

    const rank = await getRankData(args[1])
    if (!rank) return await msg.send('🚫 Такой должности не существует! 🚫')
    if (!await getAccess(sender.vk_id, rank.admAccess)) {
        return await msg.send(`🚫 | У вас нет доступа к назначению на данную должность!`)
    }
    candidate.access = rank.access
    candidate.rank = rank.id

    candidate.fraction = await getFraction(args[2], "id")
    if (!candidate.fraction) return await msg.send('🚫 Такой фракции не существует! 🚫')

    const user = await getUserData(candidate.vk_id, "candidates") || await getUserData(candidate, "users")
    if (user) {
        if (user.access > 0) return await msg.send('🚫 Данный пользователь уже является руководителем! 🚫')
        else {
            await deleteElement(user.vk_id)
            await msg.send(`✅ | Удален ранее составленный архив на пользователя!`)
        }
    }

    candidate.code = await genCode()

    const {error} = await supabase
        .from("candidates")
        .insert(candidate)

    if (error) {
        console.error(`Logs » Не удалось добавить пользователя в базу данных!`)
        console.error(error)
        return await msg.send(`🚫 Не удалось добавить пользователя в базу данных! 🚫`)
    }

    const message = dedent`
        Приветик я Эвелина, давай сразу на ты! Я рада за тебя так как ты возможно будущий руководитель гос. организации, но если ты видишь, это сообщение, значит ты был одобрен.
        Сначала тебе надо будет добавить меня в друзья, а также добавить в друзья @id637477240 (Алексея Бабенко).
        Потом напиши в группу @esida команду - /form`

    await sendMessage(candidate.vk_id, msg, message)
}

export async function removedCandidate(msg, args) {
    const user = await getUserData(await getVkId(args[0]) || args[0], "candidates")
    if (!user) return await msg.send(`🚫 | Данный человек и так не имеет доступа к форме 💔`)

    const error = await deleteElement(user.vk_id, "candidates")
    if (error) {
        console.error(`Logs » Не удалось удалить пользователя из базы данных!`)
        console.error(error)
        await msg.send(`🚫 Не удалось удалить пользователя из базы данных!\nОбратитесь к разработчику!`)
    } else {
        console.log(`Logs » Пользователь успешно удален из базы данных!`)
        await msg.send(`✅ | Вы успешно удалили пользователя из списка кандидатов!`)
    }
}