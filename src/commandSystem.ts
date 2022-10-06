import {group, user} from "./bots";
import {chats, getUserData} from "./database";
import {checkCooldown} from "./others/cooldowns";
import {works} from "./commands/commandProject";
import {commands, commandsUser} from "./commands/commands";

group.hear(/^\//i, async msg => {
    await commandSystem(msg)
})

user.hear(/^\//i, async msg => {
    if (!checkCooldown(msg.senderId)) return
    await commandSystem(msg, false, commandsUser)
})

async function commandSystem(msg, group = true, commandGroup = commands) {
    try {
        const command = msg.text.split(" ")[0].substring(1)
        const args = msg.text.split(" ").slice(1)
        let access = 0
        const sender = await getUserData(msg.senderId)
        if (sender) access = sender.access
        if (!works && command != "esida") return
        if (access < 5) {
            for (const chat of chats) {
                if (chat.defaultChat === msg.chatId && group && chat.blackList) return
                else if (chat.userChat === msg.chatId && !group && chat.blackList) return
            }
        }
        let cmd = commandGroup.find(x => x.name == command || x.aliases.includes(command))
        if (!cmd) return
        if (cmd.access > access) return await msg.send(`🚫 У вас недостаточно прав для использования этой команды, необходимо иметь уровень доступа: ${cmd.access}`)
        if (cmd.minArgs > args.length) return await msg.send(`🚫 Недостаточно аргументов для использования команды! 🚫\nИспользование: ${cmd.usage}\n\n${cmd.fullHelp}`)
        await cmd.func(msg, args, sender)
    }
    catch (error) {
        console.log(error)
        await msg.send(`🚫 Произошла ошибка при выполнении команды! 🚫\n\n${error}`)
    }
}