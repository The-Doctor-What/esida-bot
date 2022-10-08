import {checkUser, getFraction} from "../database";
import moment from "moment";
import {getAdminInfo} from "../others/aliensAPI";
import {congressRanks} from "../personnel";
import {getGender, isURL} from "../others/utils";
import {Keyboard} from "vk-io";

moment.locale('ru')

export async function stats(msg, args, sender) {
    let user = msg.senderId
    if (args.length > 0) user = args[0]
    user = await checkUser(msg, user, sender)
    if (user == undefined) return
    else {
        let access: number
        if (user.access > 0) access = user.access
        else access = user.oldaccess
        const postStart = moment(user.post)
        const postEnd = moment(postStart).add(user.term, 'days')
        let {text, warning} = await getStatsHeader(user, access)
        text += `🔹 Выговоров: ${user.vigs}/`
        text += access >= 5 ? `5\n` : `3\n`
        if (access <= 4) {
            warning += await getWarnings(user, access, postEnd)
            text += `🔹 Предупреждения: ${user.warns}/3\n`
            text += `🔹 Федеральный выговоров: ${user.fwarns}/2\n`
            if (user.rpbio) text += `🔹 РП-биография: ${user.rpbio}\n`
            text += `🔹 Структура: ${await getFraction(user.frac)}\n`
            if (user.congressAccess > 0) text += `🔹 Должность в конгрессе: ${congressRanks[user.congressAccess]}\n`
            text += await getScores(user)
            text += `🔹 Тип постановления: ${user.type_add}\n`
        }
        text += `🔹 Дата назначения: ${postStart.format("DD MMM YYYY")}\n`
        text += `🔹 Отстоял${await getGender(user.vk_id)}: ${moment().diff(postStart, "days")} дней\n`
        if ((access >= 3 && access <= 4)) {
            text += `🔹 Дата срока: ${postEnd.format("DD MMMM YYYY")}\n`
            text += `🔹 Осталось: ${postEnd.diff(moment(), "days")} дней\n`
            if (user.characteristic) text += `🔹 Характеристика: ${user.characteristic}\n`
        }
        text += `🔹 Discord: ${user.discord}\n`
        let keyboard = await checkLinks(user)
        if (user.access == 0) await archive(user)
        text += `\n${warning}`
        if (keyboard) await msg.send({message: text, disable_mentions: 1, keyboard: keyboard})
        else await msg.send({message: text, disable_mentions: 1})

    }
}

export async function urlButton(link, text) {
    if (isURL(link)) {
        return Keyboard.urlButton({
            url: link.toString(),
            label: text
        })
    }
}

async function checkLinks(user) {
    const buttons = {
        buttons:
            [
                [],
            ],
        inline: true
    }
    if (isURL(`https://${user.forum}`) && user.forum != "{}") {
        buttons.buttons[0].push(
            {
                action: {
                    type: "open_link",
                    link: `https://${user.forum}`,
                    label: "Форум"
                },
            })
    }
    if (user.telegramTag != null) {
        buttons.buttons[0].push(
            {
                action: {
                    type: "open_link",
                    link: `https://t.me/${user.telegramTag}`,
                    label: "Telegram"
                },
            })
    }
    if (!buttons.buttons[0][0]) {
        return
    }
    return JSON.stringify(buttons)
}

async function archive(user) {
    let text = `\n📚 Архивные данные: \n`
    text += `\n🔸 Снят${await getGender(user.vk_id)} по причине: ${user.reason}\n`
    text += `🔸 Дата снятия: ${moment(user.dateUval).format("DD MMMM YYYY")}\n`
    text += `🔸 Снял${await getGender(user.uvalUser)}: @id${user.uvalUser}\n`
    text += `🔸 Возраст: ${user.age} лет\n`
    return text
}

async function getStatsHeader(user, access) {
    let warning = ``
    let text = `📊 Статистика пользователя: @id${user.vk_id} (${user.nick}) 📊\n\n`
    text += `🔹 Должность: ${user.rank} [D: `
    if (user.access > 0 && user.access < 69) text += ` ${access}]\n`
    else if (user.access >= 69) text += ` DEV]\n`
    else if (user.access == 0) text += `0 (До снятия: ${user.oldaccess})]\n`
    if (user.access >= 5) {
        const info = await getAdminInfo(user.nick)
        if (info) {
            text += `🔹 Уровень администратора: ${info.lvl}\n`
            text += `🔹 Префикс: ${info.prefix}\n`
        } else warning += `🔸 Пользователь не найден в базе администраторов!\n`
    }
    return {text, warning}
}

async function getScores(user) {
    let text = ""
    if (user.frac != 30) {
        text += `🔹 Баллов: ${user.score}\n`
        text += `🔹 Основных баллов: ${user.litrbol}\n`
    } else text += `🔹 Репутация: ${user.rep}\n`
    return text
}

async function getWarnings(user, access, postEnd) {
    let warning = ""
    if (user.vigs >= 3) warning += `🔸 Пользователь имеет 3 выговора!\n`
    if (!user.rpbio) warning += `🔸 Пользователь не имеет РП-биографии!\n`
    if (access == 3 && user.congressAccess <= 0) warning += `🔸 Пользователь не имеет должности в конгрессе!\n`
    if ((!user.characteristic && postEnd.diff(moment(), "days") <= 10) && (access >= 3 || access <= 4)) warning += `🔸 На пользователя не написана характеристика!\n`
    if (user.adminInfo.block) warning += `🔸 Данному пользователю запрещено занимать пост администратора!\n`
    return warning
}