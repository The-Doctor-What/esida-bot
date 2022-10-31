import dedent from "dedent-js";
import {checkUser, saveUser} from "../../database/user";
import {getFraction, getRankData} from "../../database/database";
import {getGender} from "../../utils/vk";
import {messageSend} from "../../utils/messanges";
import moment from "moment";

export async function setRankCommand(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return

    const rank = await getRankData(args[1])
    if (!rank) return await msg.send(`🚫 Такой должности не существует! 🚫`)

    const type = args[2]

    if (user.access >= sender.access) return await msg.send("🚫 Вы не можете изменить должность этому человеку! 🚫")
    if (user.access >= 3 && user.access <= 4) {
        await messageSend(dedent`
            Ник снимаемого лидера: ${user.nick}
            Какая фракция: ${await getFraction(user.fraction)}
            За что снят: ${type}
            VK: @id${user.vk_id}
            Дата снятия: ${moment().format('DD.MM.YYYY')}`, 73)
        await messageSend(`!remleader @id${user.vk_id} ${user.nick} ${await getFraction(user.fraction)}`, 81)
    }

    user.access = rank.access
    user.term = rank.term
    user.type_add = type
    user.post = new Date()
    user.rank = rank.name

    const text = dedent`
        ${sender.rank} @id${msg.senderId} (${sender.nick}) изменил${await getGender(sender.vk_id)} должность @id${user.vk_id} (${user.nick}) на ${user.rank}!
        🔸 Изменен уровень доступа на: ${user.access}!
        🔸 Изменено количество дней до срока на: ${user.term}!
        🔸 Изменен тип постановления на: ${user.type_add}!
        🔸 Изменена дата постановления на: ${moment(user.post).format("LL")}!
        ${rank.report ? dedent`
        🔸 Отчет о постановлении: отправлен!
        🔸 Пользователь отправлен на проверку в технический отдел!` : ""}`

    if (user.access >= 3 && user.access <= 4) {
        await messageSend(dedent`
            Ник нового лидера: ${user.nick}
            Какая фракция: ${await getFraction(user.fraction)}
            Возраст: ${user.age}
            Каким образом поставлен (обзвон / передача): ${user.type_add}
            Дата обзвона/передачи: ${moment().format('DD.MM.YYYY')}
            VK: @id${user.vk_id}`, 73)
        await messageSend(`!addleader @id${user.vk_id} ${user.nick} ${await getFraction(user.fraction)}`, 81)
    }

    await saveUser(user)
    await msg.send({message: text, disable_mentions: 1})
}