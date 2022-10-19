import {checkUser} from "../database";
import {helpPermissions} from "../others/helpTexts";

export async function permissionCommand(msg, args, sender) {
    const commands = {
        "user": permissionUser,
    }
    if (!commands[args[0]]) return await msg.send(`🚫 Такой подкоманды не существует! 🚫\n${helpPermissions}`)
    await commands[args[0]](msg, args, sender)
}

export async function permissionUser(msg, args, sender) {
    const user = await checkUser(msg, args[1] ? args[1] : sender.nick, sender, false)

    let text = `Информация по пользователю: ${user.nick}\nGroups:\n`

    if (!user.groups.length) return text + `\n Группы отсутствуют`
    else {
        text += `Основная группа: ${user.groups[user.mainGroup]}\n`
        text += `\nВсе группы:`
        for (const group of user.groups) {
            text += `\n ${group}`
        }
    }

    text += `\n\nPermissions:\n`

    if (!user.permissions.length) return text + `\n Особые права отсутствуют`
    else {
        for (const perm of user.permissions) {
            text += `\n ${perm}`
        }
    }

    await msg.send(text)
}