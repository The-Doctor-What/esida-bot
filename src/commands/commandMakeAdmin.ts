import {checkUser} from "../database";
import {vkUser} from "../bots";
import {commandSend, getGender} from "../others/utils";
import dedent from "dedent-js";

export async function commandMakeAdmin(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender)
    if (!user) return
    const message = dedent(`Приветик, ${user.nick} поздравляю тебе, ты стал${await getGender(user.vk_id)} кандидатом на пост администратора!
    
    Для того что бы встать на пост администратора, тебе нужно выполнить несколько действий
    1. Добавить в друзья @id637477240 (бота)
    2. Открыть доступ к сообщениям от группы: @public172773148 (Admin Tools)
    3. Заполнить форму: https://admin-tools.ru/a/setadm.php
    
    ВНИМАНИЕ!
    1. Перед заполнением формы, убедись что ты привязал${await getGender(user.vk_id)} к своему аккаунту в игре ВКонтакте, иначе твоя заявка будет отклонена!
    2. На заполнение формы у тебя есть 24 часа, иначе твоя заявка будет отклонена!
    
    По всем вопросам обращайся к кураторам или следящим за хелперами, они тебе помогут!
    
    Удачи, люблю 🎉❤`)
    await vkUser.api.messages.send({
        user_id: user.vk_id,
        message: message,
        dont_parse_links: 1,
        random_id: 0
    })
    await commandSend(`!padm @id${user.vk_id}`)
    await msg.send(`🎉 Пользователь @id${user.vk_id} (${user.nick}) успешно стал кандидатом в администрацию! 🎉`)
}