import {checkUser, getFraction} from "../../database";
import moment from "moment";
import {getAdminInfo} from "../../others/aliensAPI";
import {congressRanks} from "../personnel";
import {getGender} from "../../utils";

moment.locale('ru')

export async function stats(msg, args, sender) {
    let user = msg.senderId
    if (args.length > 0) user = args[0]
    let text = ``
    user = await checkUser(msg, user, sender)
    if (user == undefined) return
    else {
        let access: number
        if (user.access > 0) access = user.access
        else access = user.oldaccess
        let postStart = moment(user.post)
        let postEnd = moment(postStart).add(user.term, 'days')
        let warning = ``
        text = `📊 Статистика пользователя: @id${user.vk_id} (${user.nick}) 📊\n\n`
        text += `🔹 Должность: ${user.rank} [D: `
        if (user.access > 0 && user.access != 69) text += ` ${access}]\n`
        else if (user.access == 69) text += ` DEV]\n`
        else if (user.access == 0) text += `0 (До снятия: ${user.oldaccess})]\n`
        if (user.access >= 4) {
            const info = await getAdminInfo(user.nick)
            if (info) {
                text += `🔹 Уровень администратора: ${info.lvl}\n`
                text += `🔹 Префикс: ${info.prefix}\n`
            } else warning += `🔸 Пользователь не найден в базе администраторов!\n`
        }
        text += `🔹 Предупреждения: ${user.warns}/3\n`
        if (access <= 3) {
            if (user.vigs >= 3) warning += `🔸 Пользователь имеет 3 выговора!\n`
            text += `🔹 Выговоров: ${user.vigs}/3\n`
            text += `🔹 Федеральный выговоров: ${user.fwarns}/2\n`
            if (!user.rpbio) warning += `🔸 Пользователь не имеет РП-биографии!\n`
            else text += `🔹 РП-биография: ${user.rpbio}\n`
            text += `🔹 Структура: ${await getFraction(user.frac)}\n`
            if (user.congressAccess > 0) text += `🔹 Должность в конгрессе: ${congressRanks[user.congressAccess]}\n`
            else if (user.access == 2) warning += `🔸 Пользователь не имеет должности в конгрессе!\n`
            if (user.frac != 30) {
                text += `🔹 Баллов: ${user.score}\n`
                text += `🔹 Основных баллов: ${user.litrbol}\n`
            }
            text += `🔹 Тип постановления: ${user.type_add}\n`
        }
        text += `🔹 Дата назначения: ${postStart.format("DD MMM YYYY")}\n`
        text += `🔹 Отстоял${await getGender(user.vk_id)}: ${moment().diff(postStart, "days")} дней\n`
        if ((access <= 3 && access >= 2)) {
            text += `🔹 Дата срока: ${postEnd.format("DD MMMM YYYY")}\n`
            text += `🔹 Осталось: ${postEnd.diff(moment(), "days")} дней\n`
            if (!user.characteristic && postEnd.diff(moment(), "days") <= 10) warning += `🔸 На пользователя не написана характеристика!\n`
            else if (user.characteristic) text += `🔹 Характеристика: ${user.characteristic}\n`
        }
        if (user.frac == 30) text += `🔹 Репутация: ${user.rep}\n`
        text += `🔹 Discord: ${user.discord}\n`
        if (user.forum && user.forum != "{}") text += `🔹 Форум: ${user.forum}\n`
        if (user.access == 0) {
            text += `\n📚 Архивные данные: \n`
            text += `\n🔸 Снят${await getGender(user.vk_id)} по причине: ${user.reason}\n`
            text += `🔸 Дата снятия: ${moment(user.dateUval).format("DD MMMM YYYY")}\n`
            text += `🔸 Снял${await getGender(user.uvalUser)}: @id${user.uvalUser}\n`
            text += `🔸 Возраст: ${user.age} лет\n`
        }
        text += `\n${warning}`
        msg.send({message: text, disable_mentions: 1})
    }
}