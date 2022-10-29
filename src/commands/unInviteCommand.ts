import {checkUser, getFraction, saveUser} from "../database";
import {unInviteMessage, getGender, messageSend} from "../others/utils";
import dedent from "dedent-js";
import moment from "moment";

export async function unInviteCommand(msg, args, sender) {
    const reason = args.slice(1).join(" ")
    const visable = !args[1].startsWith("!")

    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return
    if (user.access >= sender.access) return await msg.send("🚫 Вы не можете уволить этого человека! 🚫")

    if (user.access >= 3 && user.access <= 4) {
        await messageSend(dedent`
            Ник снимаемого лидера: ${user.nick}
            Какая фракция: ${await getFraction(user.fraction)}
            За что снят: ${reason}
            VK: @id${user.vk_id}
            Дата снятия: ${moment().format('DD.MM.YYYY')}`, 73)
        await messageSend(`!remleader @id${user.vk_id} ${user.nick} ${await getFraction(user.fraction)}`, 81)
    }

    user.oldaccess = user.access
    user.reason = reason
    user.dateUval = new Date()
    user.uvalUser = msg.senderId
    user.access = 0

    await messageSend(`!fkick @id${user.vk_id} Agos_0 Указано в беседе лидеров/замов 16`)
    await unInviteMessage(user, sender, reason, visable)
    await saveUser(user)

    await msg.send({
        message: `${sender.rank} @id${msg.senderId} (${sender.nick}) уволил${await getGender(msg.senderId)} @id${user.vk_id} (${user.nick})!`,
        disable_mentions: 1
    })
}

export async function recoveryCommand(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender)
    if (!user) return
    if (user.access > 0) return await msg.send(`🚫 Пользователь не снят с должности! 🚫`)

    user.access = user.oldaccess
    await saveUser(user)

    await msg.send({
        message: `${sender.rank} @id${msg.senderId} (${sender.nick}) восстановил${await getGender(msg.senderId)} @id${user.vk_id} (${user.nick})!`,
        disable_mentions: 1
    })
}