import {saveUser} from "../database";

export async function changePassword(msg, args, sender) {
    if (msg.chatId != undefined) return await msg.send("🚫 Эта команда доступна только в ЛС! 🚫")
    else if (args[0].length < 6) return await msg.send("🚫 Пароль слишком короткий! 🚫")
    sender.password = args[0]
    await saveUser(sender)
    await msg.send("✅ Пароль успешно изменён! ✅")
}