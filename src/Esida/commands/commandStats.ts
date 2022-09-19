import {devId, getAccess, getFraction, getUserData, getVkId} from "../../database";
import moment from "moment";
import {getAdminInfo} from "../../others/aliensAPI";
import {congressRanks} from "../personnel";
moment.locale('ru')
export async function stats(msg, args) {
    let user = msg.senderId
    if (args.length > 0) user = await getVkId(args[0])
    if (!user) user = (args[0])
    let text = ``
    let data = await getUserData(user)
    if (!data) {
        msg.send({
            message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
            disable_mentions: 1
        })
    } else {
        let access: number
        if (data.access > 0) access = data.access
        else {
            access = data.oldaccess
            if (!await getAccess(msg.senderId, 4) && data.vk_id != msg.senderId) return msg.send("🚫 У вас нет доступа к архивным данным! 🚫")
        }
        let postStart = moment(data.post)
        let postEnd = moment(postStart).add(data.term, 'days')
        let warning = ``
        text = `📊 Статистика пользователя: @id${data.vk_id} (${data.nick}) 📊\n\n`
        text += `🔹 Должность: ${data.rank} [D: `
        if (data.access > 0 && data.access < 500) text += ` ${access}]\n`
        else if (data.access == 666) text += ` DEV]\n`
        else if (data.access == 0) text += `0 (До снятия: ${data.oldaccess})]\n`
        if (data.access >= 4) {
            let info = await getAdminInfo(data.nick)
            if (info) {
                text += `🔹 Уровень администратора: ${info.lvl}\n`
                text += `🔹 Префикс: ${info.prefix}\n`
            }
            else warning += `🔸 Пользователь не найден в базе администраторов!\n`
        }
        text += `🔹 Предупреждения: ${data.warns}/3\n`
        if (access <= 3) {
            if (data.vigs >= 3) warning += `🔸 Пользователь имеет 3 выговора!\n`
            text += `🔹 Выговоров: ${data.vigs}/3\n`
            text += `🔹 Федеральный выговоров: ${data.fwarns}/2\n`
            if (!data.rpbio) warning += `🔸 Пользователь не имеет РП-биографии!\n`
            else text += `🔹 РП-биография: ${data.rpbio}\n`
            text += `🔹 Структура: ${await getFraction(data.frac)}\n`
            if (data.congressAccess > 0) text += `🔹 Должность в конгрессе: ${congressRanks[data.congressAccess]}\n`
            else if (data.access == 2) warning += `🔸 Пользователь не имеет должности в конгрессе!\n`
            if (data.frac != 30) {
                text += `🔹 Баллов: ${data.score}\n`
                text += `🔹 Основных баллов: ${data.litrbol}\n`
            }
            text += `🔹 Тип постановления: ${data.type_add}\n`
        }
        text += `🔹 Дата назначение: ${postStart.format("DD MMM YYYY")}\n`
        text += `🔹 Отстоял: ${moment().diff(postStart, "days")} дней\n`
        if (access <= 3 && access >= 2) {
            text += `🔹 Дата срока: ${postEnd.format("DD MMMM YYYY")}\n`
            text += `🔹 Осталось: ${postEnd.diff(moment(), "days")} дней\n`
            if (!data.characteristic && postEnd.diff(moment(), "days") <= 10) warning += `🔸 На пользователя не написана характеристика!\n`
            else if (data.characteristic) text += `🔹 Характеристика: ${data.characteristic}\n`
        }
        if (data.frac == 30) text += `🔹 Репутация: ${data.rep}\n`
        text += `🔹 Discord: ${data.discord}\n`
        if (data.forum && data.forum != "{}") text += `🔹 Форум: ${data.forum}\n`
        if (data.access == 0) {
            text += `\n📚 Архивные данные: \n`
            text += `\n🔸 Снят по причине: ${data.reason}\n`
            text += `🔸 Дата снятия: ${moment(data.dateUval).format("DD MMMM YYYY")}\n`
            text += `🔸 Снял: @id${data.uvalUser}\n`
        }
        text += `\n${warning}`
        msg.send({ message: text, disable_mentions: 1 })
    }
}