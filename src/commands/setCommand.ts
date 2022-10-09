import {checkUser, getAccess, saveUser} from "../database";
import {getShortURL} from "../others/utils";
import {helpSet} from "../others/helpTexts";

export async function setDataUser(msg, args, sender) {
    const user = await checkUser(msg, args[0], sender, false)
    if (!user) return
    let type = args[1].trim()
    let value = args.slice(2).join(' ').trim()
    let checkType = {
        "nick": "nick",
        "forum": "forum",
        "discord": "discord",
        "rpbio": "rpbio",
        "harakter": "characteristic",
        "age": "age",
        "frac": "frac",
        "access": "access",
        "type_add": "type_add",
    }
    if (!checkType[type]) return await msg.send({message: helpSet, dont_parse_links: true})
    if (checkType[type] == "rpbio" || checkType[type] == "characteristic" || checkType[type] == "forum") {
        value = await getShortURL(value)
        if (!value) return await msg.send('🚫 Введите url форума! 🚫')
    }
    if (type == "access" && !await getAccess(msg.senderId, 69)) return await msg.send({message: "🚫 | У вас недостаточно прав для выполнения этой команды!", dont_parse_links: true})
    user[checkType[type]] = value
    await saveUser(user)
    await msg.send({message: "✅ | Данные успешно изменены"})
}
