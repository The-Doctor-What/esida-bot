import {checkUser, saveUser} from "../database";
import {vkGroup, vkUser} from "../bots";
import {messageSend, getGender} from "../others/utils";
import dedent from "dedent-js";

export async function commandMakeAdmin(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender)
    if (!user) return
    if (user.adminInfo.block) return await msg.send("🚫 Данному пользователю запрещено занимать пост администратора!")

    const message = dedent(`
        Приветик, ${user.nick} поздравляю тебе, ты стал${await getGender(user.vk_id)} кандидатом на пост администратора!
        
        Для того что бы встать на пост администратора, тебе нужно выполнить несколько действий
        1. Добавить в друзья @id637477240 (бота)
        2. Открыть доступ к сообщениям от группы: @public172773148 (Admin Tools)
        3. Заполнить форму: https://admin-tools.ru/a/setadm.php
        
        ВНИМАНИЕ!
        1. Перед заполнением формы, убедись что ты привязал${await getGender(user.vk_id)} к своему аккаунту в игре ВКонтакте, иначе твоя заявка будет отклонена!
        2. На заполнение формы у тебя есть 24 часа, иначе твоя заявка будет отклонена!
        
        По всем вопросам обращайся к кураторам или следящим за хелперами, они тебе помогут!
        
        Удачи, люблю 🎉❤`
    )

    await vkUser.api.messages.send({
        user_id: user.vk_id,
        message: message,
        dont_parse_links: 1,
        random_id: 0
    })

    await messageSend(`!padm @id${user.vk_id}`)
    await messageSend(dedent(`
        Logs:
        ${sender.rank} @id${sender.vk_id} (${sender.nick}) назначил${await getGender(sender.vk_id)} @id${user.vk_id} (${user.nick}) кандидатом на пост администратора!`
        ),
        41,
        vkGroup)

    user.adminInfo.userPost = sender.vk_id
    await saveUser(user)
    await msg.send(`🎉 Пользователь @id${user.vk_id} (${user.nick}) успешно стал кандидатом в администрацию! 🎉`)
}

export async function commandAdminBlock(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender, false)
    await msg.send(`✅ Пользователю @id${user.vk_id} (${user.nick}) теперь ${user.adminInfo.block ? `разрешено` : `запрещено`} занимать пост администратора!`)
    user.adminInfo.block = !user.adminInfo.block
    await saveUser(user)
}