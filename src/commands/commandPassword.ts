import {saveUser} from "../database";

export async function changePassword(msg, args, sender) {
    if (sender.access <= 69) return msg.send("🚫 Команда находится в разработке! 🚫")
    else if (msg.chatId != undefined) return msg.send("🚫 Эта команда доступна только в ЛС! 🚫")
    else if (args[0].length < 6) return msg.send("🚫 Пароль слишком короткий! 🚫")
    sender.password = args[0]
    await saveUser(sender)
    msg.send("✅ Пароль успешно изменён! ✅")
}