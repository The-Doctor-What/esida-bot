import {helpSet} from "../../others/helpTexts";
import {checkUser, getAccess, saveUser} from "../../database/user";
import {getShortURL} from "../../utils/url";

export async function setDataUser(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return

    const type = args[1].trim()
    let value = args.slice(2).join(' ').trim()

    const checkType = {
        "nick": "nick",
        "forum": "forum",
        "discord": "discord",
        "rpbio": "rpbio",
        "harakter": "characteristic",
        "age": "age",
        "fraction": "fraction",
        "access": "access",
        "type_add": "type_add",
    }

    if (!checkType[type]) return await msg.send(helpSet)
    if (checkType[type] == "rpbio" || checkType[type] == "characteristic" || checkType[type] == "forum") {
        value = await getShortURL(value)
        if (!value) return await msg.send('🚫 Введите url форума! 🚫')
    }

    if (type == "access" && !await getAccess(msg.senderId, 69)) return await msg.send("🚫 | У вас недостаточно прав для выполнения этой команды!")
    user[checkType[type]] = value

    await saveUser(user)
    await msg.send({message: "✅ | Данные успешно изменены"})
}
