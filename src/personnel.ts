import {user} from "./bots";
import {deleteUser, getFraction, getRankData, getUserData, supabase,} from "./database";
import moment from "moment";
import dedent from "dedent-js";
import {chatsActions, messageSend, getShortURL, startMessage} from "./others/utils";
import {works} from "./commands/projectCommand";
import {getError} from "./commands/commandSystem";

moment.locale('ru')

export const congressRanks = {
    "0": "Не состоит в конгрессе",
    "1": "Заместитель конгрессмена",
    "2": "Конгрессмен",
    "3": "Вице Спикер",
    "4": "Спикер",
}

export async function fracs(msg) {
    await msg.send(dedent`
        🍬 Список фракций 🍬
    
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
    if (!user) return await msg.send(`🚫 | К сожалению вы не числитесь в списке будущих руководителей 💔`)

    await msg.send(dedent`
        🍬 Заполните форму для назначения на руководящий пост 🍬
    
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
        » Форму принимает бот по этому писать строго как представлено выше!`
    )
}

user.hear(/^Игровой ник: (.*)/i, async msg => {
    if (!works) return
    try {
        const sender = await getUserData(msg.senderId, "candidates")
        if (!sender) return await msg.send(`🚫 | К сожалению вы не числитесь в списке будущих руководителей 💔`)

        sender.nick = msg.text.split('Игровой ник: ')[1].split('\n')[0].trim()
        if (!sender.nick) return await msg.send('🚫 Введите корректный ник 🚫')
        if (await getUserData(sender.nick)) return await msg.send('🚫 Данный ник уже занят! 🚫')

        sender.age = Number(msg.text.split('Возраст: ')[1].split('\n')[0].trim())
        if (!sender.age) return await msg.send('🚫 Не корректный возраст! 🚫')

        sender.type_add = msg.text.split('Тип назначения: ')[1].split('\n')[0].trim()
        if (!sender.type_add) return await msg.send('🚫 Введите тип назначения! 🚫')

        sender.discord = msg.text.split('Дискорд: ')[1].split('\n')[0].trim()
        if (!sender.discord) return await msg.send('🚫 Введите id Discord аккаунта! 🚫')

        sender.forum = getShortURL(msg.text.split('Форум: ')[1].split('\n')[0].trim())
        if (!sender.forum) return await msg.send('🚫 Введите url форума! 🚫')

        const rank = await getRankData(sender.rank)

        const error = await supabase
            .from("users")
            .insert({
                vk_id: msg.senderId,
                term: rank.term,
                access: sender.access,
                nick: sender.nick,
                age: sender.age,
                type_add: sender.type_add,
                discord: sender.discord,
                frac: sender.fraction,
                rank: rank.name,
                forum: sender.forum,
            })

        if (error) {
            console.error(`Logs » Не удалось добавить пользователя в базу данных!`)
            console.error(error)
            return await msg.send(`🚫 Не удалось добавить вас в базу данных!\nОбратитесь к администрации!`)
        }

        await msg.send('✅ | Удачи вам на посту руководителя! <3')

        if (sender.access >= 3 && sender.access <= 4) {
            await messageSend(dedent`
                    Ник нового лидера: ${sender.nick}
                    Какая фракция: ${await getFraction(sender.fraction)}
                    Возраст: ${sender.age}
                    Каким образом поставлен (обзвон / передача): ${sender.type_add}
                    Дата обзвона/передачи: ${moment().format('DD.MM.YYYY')}
                    VK: @id${msg.senderId}`, 73)
            await messageSend(`!addleader @id${msg.senderId} ${sender.nick} ${await getFraction(sender.fraction)}`, 81)
        }

        if (sender.access <= 4) await chatsActions(msg, sender)
        if (await deleteUser(msg.senderId, "candidates")) return await msg.send(`🚫 | К сожалению произошла ошибка, попробуйте позже! 💔`)

        await startMessage(await getUserData(msg.senderId))
    } catch (error) {
        const {link} = await getError(error, "addUser")
        await msg.send(`🚫 | Проверьте правильность введенных данных! 🚫\nПодробнее об ошибке: ${link}`)
    }
})