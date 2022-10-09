import {checkUser, getFraction} from "../database";
import moment from "moment";
import {getAdminInfo} from "../others/aliensAPI";
import {congressRanks} from "../personnel";
import {getGender, isURL} from "../others/utils";
import {Keyboard} from "vk-io";
import dedent from "dedent-js";

moment.locale('ru')

export async function stats(msg, args, sender) {
    const user = await checkUser(msg, args[0] || msg.senderId, sender)
    if (!user) return;

    const access = user.access > 0 ? user.access : user.oldaccess

    const postStart = moment(user.post)
    const postEnd = moment(postStart).add(user.term, 'days')

    const {text: header, warning} = await getStatsHeader(user, access)
    const text = dedent`
        ${header}
        🔹 Выговоров: ${user.vigs}/${access >= 5 ? `5` : `3`}
        ${access <= 4 ? dedent`
        🔹 Предупреждения: ${user.warns}/3
        🔹 Федеральный выговоров: ${user.fwarns}/2
        ${user.rpbio ? `🔹 РП-биография: ${user.rpbio}` : ''}
        🔹 Структура: ${await getFraction(user.frac)}
        ${user.congressAccess > 0 ? `🔹 Должность в конгрессе: ${congressRanks[user.congressAccess]}` : ''}
        ${await getScores(user)}
        🔹 Тип постановления: ${user.type_add}
        \n` : ''}🔹 Discord: ${user.discord}
        🔹 Дата назначения: ${postStart.format("DD MMM YYYY")}
        🔹 Отстоял${await getGender(user.vk_id)}: ${moment().diff(postStart, "days")} дней
        ${access >= 3 && access <= 4 ? dedent`
        🔹 Дата срока: ${postEnd.format("DD MMMM YYYY")}
        🔹 Осталось: ${postEnd.diff(moment(), "days")} дней
        ${user.characteristic ? `🔹 Характеристика: ${user.characteristic}` : ''}
        ` : ''}
        
        ${user.access == 0 ? await archive(user) : ''}
        
        ${warning + (access <= 4 ? await getWarnings(user, access, postEnd) : '')}
    `

    const keyboard = await checkLinks(user)
    await msg.send(keyboard ?
        {
            message: text,
            disable_mentions: 1,
            keyboard: keyboard
        } : {
            message: text,
            disable_mentions: 1
        }
    )
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
    const buttons = []

    if (isURL(`https://${user.forum}`) && user.forum != "{}") {
        buttons.push(
            {
                type: "open_link",
                link: `https://${user.forum}`,
                label: "Форум"
            }
        )
    }

    if (user.telegramTag) {
        buttons.push(
            {
                type: "open_link",
                link: `https://t.me/${user.telegramTag}`,
                label: "Telegram"
            }
        )
    }

    if (buttons.length === 0) {
        return
    }

    return JSON.stringify({
        buttons:
            [
                buttons.map(action => ({action})),
            ],
        inline: true
    })
}

async function archive(user) {
    return dedent`
        📚 Архивные данные:
        
        🔸 Снят${await getGender(user.vk_id)} по причине: ${user.reason}
        🔸 Дата снятия: ${moment(user.dateUval).format("DD MMMM YYYY")}
        🔸 Снял${await getGender(user.uvalUser)}: @id${user.uvalUser}
        🔸 Возраст: ${user.age} лет
    `
}

async function getStatsHeader(user, access) {
    const info = user.access >= 5 && await getAdminInfo(user.nick)

    const warning = !info && user.access >= 5 ? '🔸 Пользователь не найден в базе администраторов!\n' : ''
    const text = dedent`
        📊 Статистика пользователя: @id${user.vk_id} (${user.nick})
        
        🔹 Должность: ${user.rank} [D: ${
        access <= 0 ?
            `0 (До снятия: ${user.oldaccess})` :
            access < 69 ? access : 'DEV'
    }]${info ? dedent`\n
            🔹 Уровень администратора: ${info.lvl}
            🔹 Префикс: ${info.prefix}
        ` : ''}
    `
    return {text, warning}
}

async function getScores(user) {
    if (user.frac == 30) return `🔹 Репутация: ${user.rep}`
    return dedent`
        🔹 Баллов: ${user.score}
        🔹 Основных баллов: ${user.litrbol}
    `
}

async function getWarnings(user, access, postEnd) {
    let warning = ""
    if (user.vigs >= 3) warning += `🔸 Пользователь имеет 3 выговора!\n`
    if (!user.rpbio) warning += `🔸 Пользователь не имеет РП-биографии!\n`
    if (access == 3 && user.congressAccess <= 0) warning += `🔸 Пользователь не имеет должности в конгрессе!\n`
    if ((!user.characteristic && postEnd.diff(moment(), "days") <= 10) && (access >= 3 && access <= 4)) warning += `🔸 На пользователя не написана характеристика!\n`
    if (user.adminInfo.block) warning += `🔸 Данному пользователю запрещено занимать пост администратора!\n`
    return warning
}