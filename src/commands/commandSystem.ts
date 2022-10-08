import {group, user} from "../bots";
import {chats, getUserData} from "../database";
import {checkCooldown} from "../others/cooldowns";
import {works} from "./commandProject";
import commands, {commandsUser} from ".";
import {paste} from "../others/aliensAPI";
import moment from "moment";
import {Keyboard} from "vk-io";

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
    } catch (error) {
        try {
            const {link, keyboard} = await getError(error, "commandSystem")
            if (group) await msg.send({message: `🚫 Произошла ошибка при выполнении команды! 🚫\n\n${error}`, keyboard: keyboard,})
            else await msg.send(`🚫 Произошла ошибка при выполнении команды! 🚫\n\n${error}\n Подробнее: ${link}`,)
        } catch {
            console.log(error)
            await msg.send(`🚫 Произошла ошибка при выполнении команды! 🚫\n\n${error}`)
        }
    }
}

export async function getError(error, name) {
    const header = `Error in ${name}.ts ${moment().format("DD.MM.YYYY HH:mm:ss")}`
    const link = await paste(`${error.message.toString()}\n\n${error.stack.toString()}`, header)
    const keyboard = Keyboard
        .keyboard([
            Keyboard.urlButton({
                url: link.toString(),
                label: "Подробнее об ошибке"
            })
        ]).inline(true)
    return {link, keyboard}
}