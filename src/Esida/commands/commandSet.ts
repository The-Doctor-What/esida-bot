import {getAccess, getUserData, getVkId, saveUser} from "../../database";
import {getShortURL} from "../../utils";
import {helpSet} from "../../others/helpTexts";

export async function setDataUser(msg, args) {
    let user = await getVkId(args[0])
    if (!user) user = (args[0])
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
    if (!checkType[type]) return msg.send({message: helpSet, dont_parse_links: true})
    if (checkType[type] == "rpbio" || checkType[type] == "characteristic" || checkType[type] == "forum") {
        value = await getShortURL(value)
        if (!value) return msg.send('🚫 Введите url форума! 🚫')
    }
    if (type == "access" && !await getAccess(msg.senderId, 666)) return msg.send({message: "🚫 | У вас недостаточно прав для выполнения этой команды!", dont_parse_links: true})
    let data = await getUserData(user)
    if (!data) return msg.send({message: "🚫 | Пользователь не найден"})
    data[checkType[type]] = value
    await saveUser(data)
    msg.send({message: "✅ | Данные успешно изменены"})
}
