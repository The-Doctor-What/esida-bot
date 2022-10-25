import {checkUser, saveUser} from "../database";

export async function hideCommand(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender)
    if (!user) return

    if (user.access > sender.access) return await msg.send(`🚫 | Вы не можете ${user.hide ? "рассекретить" : "скрыть"} данного человека! 🚫`)

    user.hide = !user.hide
    await saveUser(user)

    await msg.send(`✅ | Вы успешно ${user.hide ? "скрыли" : "рассекретили"} пользователя!`)
}