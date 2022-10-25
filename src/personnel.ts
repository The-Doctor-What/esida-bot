import {user} from "./bots";
import {deleteUser, getFraction, getRankData, getUserData, supabase,} from "./database";
import moment from "moment";
import dedent from "dedent-js";
import {chatsActions, messageSend, getShortURL, startMessage} from "./others/utils";
import {works} from "./commands/projectCommand";
import {getError} from "./commands/commandSystem";

moment.locale('ru')

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
        sender.rank = rank.name
        sender.term = rank.term
        delete sender.code
        delete sender.id

        const {error} = await supabase
            .from("users")
            .insert(sender)

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