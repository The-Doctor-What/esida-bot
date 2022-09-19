import {user} from "../bots";
import {deleteUser, devId, getAccess, getFraction, getUserData, getVkId, saveUser, supabase, userid} from "../database";
import moment from "moment";
import dedent from "dedent-js";
import {chatsActions, commandSend, getShortURL, isURL, sendMessage} from "../utils";
import {works} from "./commands/commandProject";
moment.locale('ru')

export const congressRanks = {
    "0": "Не состоит в конгрессе",
    "1": "Заместитель конгрессмена",
    "2": "Конгрессмен",
    "3": "Вице Спикер",
    "4": "Спикер",
}
export const ranksData = {
    '9': {
        access: 1,
        term: 10,
        rank: 'Заместитель',
        admAccess: 4,
    },
    '1': {
        access: 1,
        term: 0,
        rank: 'Судья',
        admAccess: 3,
        chatTag: 'Syd',
    },
    '7': {
        access: 3,
        term: 35,
        rank: 'Верховный судья',
        admAccess: 4,
        report: true,
        chatTag: 'V_Syd',
    },
    '8': {
        access: 1,
        term: 0,
        rank: 'Советник',
        admAccess: 4,
        chatTag: 'zam_6',
    },
    '2': {
        access: 1,
        term: 0,
        rank: 'Прокурор',
        admAccess: 3,
        chatTag: 'Prok',
    },
    '10': {
        access: 2,
        term: 30,
        rank: 'Лидер',
        admAccess: 4,
        report: true,
    },
    '11': {
        access: 3,
        term: 45,
        rank: 'Министр',
        admAccess: 4,
        report: true,
    },
    '12': {
        access: 3,
        term: 45,
        rank: 'Генеральный прокурор',
        admAccess: 4,
        report: true,
        chatTag: 'minister_32',
    },
    '13': {
        access: 3,
        term: 30,
        rank: 'Губернатор',
        admAccess: 4,
        report: true,
        chatTag: 'leader_6'
    },
    '20': {
        access: 4,
        term: 0,
        rank: 'Следящий',
        admAccess: 5,
    },
    '21': {
        access: 5,
        term: 0,
        rank: 'Главный следящий',
        admAccess: 6,
    },
    '99': {
        access: 6,
        term: 0,
        rank: 'Руководитель',
        admAccess: 6,
    },
    'dev': {
        access: 666,
        term: 0,
        rank: 'Разработчик',
        admAccess: 666,
    },
}

export function addText(msg) {
    msg.send(dedent`🍬 Заполните форму для отправки пользователю формы 🍬
    
ВК кандидата:
Фракция:
Должность: 

Должности:
1. Судья
2. Прокурор
7. Верховный судья
8. Советник
9. Заместитель
10. Лидер
11. Министр
12. Генеральный прокурор
13. Губернатор
20. Следящий
21. Главный следящий
99. Руководитель

Фракции: /fracs`)
}

export function fracs(msg) {
    msg.send(dedent`🍬 Список фракций 🍬
    
    👨‍⚖ Аппарат губернатора
    Правительство: 6
    Государственные Структуры: 100
    Министерство Обороны: 101
    Министерство Юстиции: 102
    Средства Массовой Информации: 103
    Центральный Аппарат: 104
    Министерства Здравоохранения: 105
    Министерство Финансов и Культуры: 106
    
    👮‍♂ МЮ
    Полиция LS: 1
    RCSD: 2
    FBI: 3
    Полиция SF: 4
    SWAT: 23
    
    ‍👩 МЗ
    Медицинский Центр LS: 5
    Медицинский Центр SF: 8
    Медицинский Центр LV: 22
    
    👩‍💼 ЦА
    Главный Центр Лицензирования: 9
    Центральный Банк: 21
    Страховая Компания: 29
    
    👩‍✈ МО
    Тюрьма Строгого Режима: 7
    Армия LS: 20
    Армия SF: 27
    
    🕵‍♂ СМИ
    Radio LS: 10
    Radio LV: 24
    Radio SF: 26

    👩‍🔧 Остальные:
    Суд: 30
    Прокуратура: 31
    Руководство Сервера: 16
`)
}

export async function form(msg) {
    const user = await getUserData(msg.senderId, "candidates")
    if (!user) return msg.send(`🚫 | К сожалению вы не числитесь в списке будущих руководителей 💔`)
    msg.send(dedent`🍬 Заполните форму для назначения на руководящий пост 🍬

Игровой ник:
Возраст:
Тип назначения:
Дискорд:
Форум:
 
📋 Пример заполнения этой формы находиться ниже:
 
Игровой ник: Mary_Benson
Возраст: 18
Тип назначения: Обзвон/Передача/Доверка/Отчеты/ВрИО
Дискорд: JustAll#7777
Форум: https://forum.arizona-rp.com/members/

Обратите внимание: 
» Пробел после двоеточия писать обязательно!
» Ник обязательно писать с нижним подчеркиванием!
» Форму принимает бот по этому писать строго как представлено выше!
`)
}

user.hear(/^ВК кандидата: (.*)/i, async msg => {
    if (!works) return
    let id = msg.text.split('ВК кандидата: ')[1].split('\n')[0].trim()
    if (!id) return msg.send('🚫 Введите корректный тег 🚫')
    let frac = msg.text.split('Фракция: ')[1].split('\n')[0].trim()
    if (!frac) return msg.send('🚫 Введите id фракции /fracks! 🚫')
    let status = msg.text.split('Должность: ')[1].split('\n')[0].trim()
    if (!status) return msg.send('🚫 Введите должность! 🚫')
    if (!ranksData[status]) return msg.send('🚫 Такой должности не существует! 🚫')
    if (!await getAccess(msg.senderId, ranksData[status].admAccess)) {
        return msg.send(`🚫 | У вас нет доступа к назначению на данную должность!`)
    }
    id = await getVkId(id)
    if (!id) return msg.send('🚫 Введите корректный тег 🚫')
    let user = await getUserData(id, "candidates")
    if (user) return msg.send('🚫 Данный пользователь уже является кандидатом! 🚫')
    user = await getUserData(id, "users")
    if (user) {
        if (user.access > 0) return msg.send('🚫 Данный пользователь уже является руководителем! 🚫')
        else {
            await deleteUser(user.vk_id)
            msg.send(`✅ | Удален ранее составленый архив на пользователя!`)
        }
    }
    const {error} = await supabase
        .from("candidates")
        .insert({
            vk_id: id,
            access: ranksData[status].access,
            fraction: frac,
            rank: status
        })
    if (error) {
        console.error(`Logs » Не удалось добавить пользователя в базу данных!`)
        console.error(error)
        return  msg.send(`🚫 Не удалось добавить пользователя в базу данных! 🚫`)
    }
    else console.log(`Logs » Новый кандидат добавлен в базу данных!`)
    await sendMessage(id, msg)
})

user.hear(/^Игровой ник: (.*)/i, async msg => {
    if (!works) return
    let user = await getUserData(msg.senderId, "candidates")
    if (!user) msg.send(`🚫 | К сожалению вы не числитесь в списке будущих руководителей 💔`)
    else {
        let nick = msg.text.split('Игровой ник: ')[1].split('\n')[0].trim()
        if (!nick) return msg.send('🚫 Введите корректный ник 🚫')
        let age = msg.text.split('Возраст: ')[1].split('\n')[0].trim()
        if (!age) return msg.send('🚫 Введите id фракции /fracks! 🚫')
        let type_add = msg.text.split('Тип назначения: ')[1].split('\n')[0].trim()
        if (!type_add) return msg.send('🚫 Введите тип назначения! 🚫')
        let discord = msg.text.split('Дискорд: ')[1].split('\n')[0].trim()
        if (!discord) return msg.send('🚫 Введите id Discord аккаунта! 🚫')
        let forum = msg.text.split('Форум: ')[1].split('\n')[0].trim()
        console.log(`"${forum}"`)
        forum = await getShortURL(forum)
        console.log(`"${forum}"`)
        if (!forum) return msg.send('🚫 Введите url форума! 🚫')
        const {error} = await supabase
            .from("users")
            .insert({
                vk_id: msg.senderId,
                term: ranksData[user.rank].term,
                access: user.access,
                nick,
                age,
                type_add,
                discord,
                frac: user.fraction,
                rank: ranksData[user.rank].rank,
                forum,
            })
        if (error) {
            console.error(`Logs » Не удалось добавить пользователя в базу данных!`)
            console.error(error)
            msg.send(`🚫 Не удалось добавить вас в базу данных!\nОбратитесь к администрации!`)
        } else {
            console.log(`Logs » Новый руководитель успешно добавлен!`)
            msg.send('✅ | Удачи вам на посту руководителя! <3')
            if (user.access >= 2 && user.access <= 3) {
                await commandSend(dedent`Ник нового лидера: ${nick}
                                        Какая фракция: ${await getFraction(user.fraction)}
                                        Возраст: ${age}
                                        Каким образом поставлен (обзвон / передача): ${type_add}
                                        Дата обзвона/передачи: ${moment().format('DD.MM.YYYY')}
                                        VK: @id${msg.senderId}`, 73)
                await commandSend(dedent`!addleader @id${msg.senderId} ${nick} ${await getFraction(user.fraction)}`, 81)
            }
            if (user.access <= 3) await chatsActions(msg, user)
            const error = await deleteUser(msg.senderId, "candidates")
            if (error) {
                console.error(`Logs » Не удалось удалить пользователя из базы данных!`)
                console.error(error)
                msg.send(`🚫 Не удалось удалить вас из базы данных!\nОбратитесь к администрации!`)
            } else {
                console.log(`Logs » Пользователь успешно удален из базы данных!`)
            }
        }
    }
})

export async function removedCandidate(msg, args) {
    if (!args) return msg.send("🚫 Вы не указали ID пользователя! 🚫")
    let user = await getVkId(args[0])
    if (!user) user = (args[0])
    let data = await getUserData(user, "candidates")
    if (!data) {
        msg.send(`🚫 | Данный человек и так не имеет доступа к форме 💔`)
    } else {
        const error = await deleteUser(user, "candidates")
        if (error) {
            console.error(`Logs » Не удалось удалить пользователя из базы данных!`)
            console.error(error)
            msg.send(`🚫 Не удалось удалить пользователя из базы данных!\nОбратитесь к разработчику!`)
        } else {
            console.log(`Logs » Пользователь успешно удален из базы данных!`)
            msg.send(`✅ | Вы успешно удалили пользователя из списка кандидатов!`)
        }
    }
}

export async function promotion(msg, args, sender) {
    let user = await getVkId(args[0])
    if (!user) user = (args[0])
    let rank = args[1]
    if (!ranksData[rank]) return msg.send(`🚫 Такой должности не существует! 🚫`)
    let type = args[2]
    let data = await getUserData(user)
    if (!data) return msg.send({
        message: `🚫 Пользователь не найден, если вы уверены, что он зарегистрирован, обратитесь к @id${devId} (разработчику)! 🚫`,
        disable_mentions: 1
    })
    if (data.access >= sender.access) return msg.send("🚫 Вы не можете изменить должность этому человеку! 🚫")
    if (data.access >= 2 && data.access <= 3) {
        await commandSend(dedent`Ник снимаемого лидера: ${data.nick}
Какая фракция: ${await getFraction(data.frac)}
За что снят: ${type}
VK: @id${data.vk_id}
Дата снятия: ${moment().format('DD.MM.YYYY')}`, 73)
        await commandSend(dedent`!remleader @id${data.vk_id} ${data.nick} ${await getFraction(data.frac)}`, 81)
    }
    data.access = ranksData[rank].access
    data.term = ranksData[rank].term
    data.type_add = type
    data.post = new Date()
    data.rank = ranksData[rank].rank
    data.history.data.push({user: msg.senderId, time: moment(), action: "set", count: "Должность", reason: `Новая должность: ${data.rank}`})
    let text = `${sender.rank} @id${msg.senderId} (${sender.nick}) изменил должность @id${data.vk_id} (${data.nick}) на ${data.rank}!`
    text += `\n\n🔸 Изменен уровень доступа на: ${data.access}!`
    text += `\n🔸 Изменено количество дней до срока на: ${data.term}!`
    text += `\n🔸 Изменен тип постановления на: ${data.type_add}!`
    text += `\n🔸 Изменена дата постановления на: ${moment(data.post).format("LL")}!`
    if (ranksData[rank].report) {
        text += `\n🔸 Отчет о постановлении: отправлен!`
        text += `\n🔸 Пользователь отправлен на проверку в технический отдел!`
    }
    if (data.access >= 2 && data.access <= 3) {
        await commandSend(dedent`Ник нового лидера: ${data.nick}
                                        Какая фракция: ${await getFraction(data.frac)}
                                        Возраст: ${data.age}
                                        Каким образом поставлен (обзвон / передача): ${data.type_add}
                                        Дата обзвона/передачи: ${moment().format('DD.MM.YYYY')}
                                        VK: @id${data.vk_id}`, 73)
        await commandSend(dedent`!addleader @id${data.vk_id} ${data.nick} ${await getFraction(data.frac)}`, 81)
    }
    await saveUser(data)
    msg.send({message: text, disable_mentions: 1})
}

export async function uval(msg, args, sender) {
    let user = await getVkId(args[0])
    if (!user) user = args[0]
    let reason = args.slice(1).join(" ")
    let data = await getUserData(user)
    if (!data) return msg.send({message: `🚫 Пользователь не найден! 🚫`})
    if (data.access >= sender.access) return msg.send("🚫 Вы не можете уволить этого человека! 🚫")
    if (data.access >= 2 && data.access <= 3) {
        if (data.access >= 2 && data.access <= 3) {
            await commandSend(dedent`Ник снимаемого лидера: ${data.nick}
Какая фракция: ${await getFraction(data.frac)}
За что снят: ${reason}
VK: @id${data.vk_id}
Дата снятия: ${moment().format('DD.MM.YYYY')}`, 73)
            await commandSend(dedent`!remleader @id${data.vk_id} ${data.nick} ${await getFraction(data.frac)}`, 81)
        }
    }
    data.oldaccess = data.access
    data.reason = reason
    data.dateUval = new Date()
    data.uvalUser = msg.senderId
    data.access = 0
    await commandSend(`!fkick @id${data.vk_id} Agos_0 ${data.rank} 16`)
    await saveUser(data)
    msg.send({message: `${sender.rank} @id${msg.senderId} (${sender.nick}) уволил @id${data.vk_id} (${data.nick})!`, disable_mentions: 1})
}

export async function recovery(msg, args) {
    let user = await getVkId(args[0])
    if (!user) user = args[0]
    let data = await getUserData(user)
    if (!data) return msg.send({message: `🚫 Пользователь не найден в архиве! 🚫`})
    else if (data.access > 0) return msg.send({message: `🚫 Пользователь не снят с должности! 🚫`})
    data.access = data.oldaccess
    data.oldaccess = 0
    data.reason = ""
    data.uvalUser = 0
    await saveUser(data)
    msg.send({message: `@id${msg.senderId} восстановил @id${data.vk_id} (${data.nick})!`, disable_mentions: 1})
}