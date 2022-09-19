import {commands, commandsUser} from "../commandSystem";

export async function help(msg, args, sender) {
    let command = args ? args[0] : null
    let access = 0
    if (sender) access = sender.access
    if (!command) {
        let text = `📚 Список команд: 📚\n\n`
        for (const cmd of commands) {
            if (access >= cmd.access && cmd.description != "") text += `🔹 ${cmd.usage} - ${cmd.description}\n`
        }
        text += `\n\n📚 Команды Эвелины: 📚\n\n`
        for (const cmd of commandsUser) {
            if (access >= cmd.access && cmd.description != "") text += `🔹 ${cmd.usage} - ${cmd.description}\n`
        }
        msg.send(text)
    }
    else if (command == "all") {
        let text = `📚 Список команд: 📚\n\n`
        for (const cmd of commands) {
            if (access >= cmd.access && cmd.description != "") {
                text += `🔹 ${cmd.usage} - ${cmd.description}\n`
                if (cmd.aliases.length > 0) {
                    text += `🔸 Альтернативные варианты: ${cmd.aliases.join(", ")}\n`
                }
                if (cmd.access > 0) {
                    text += `🔸 Требуемый уровень доступа: ${cmd.access}\n`
                }
            }
        }
        msg.send(text)
    }
    else {
        let cmd = commands.find(x => x.name == command || x.aliases.includes(command))
        if (!cmd) return msg.send("🚫 Такой команды не существует! 🚫")
        if (access < cmd.access) return msg.send("🚫 У вас недостаточно прав для использования этой команды! 🚫")
        let text = `🔹 ${cmd.usage} - ${cmd.description}\n`
        text += `🔸 Альтернативные варианты: ${cmd.aliases.join(", ")}\n`
        text += `🔸 Требуемый уровень доступа: ${cmd.access}\n`
        text += `🔸 Минимальное количество аргументов: ${cmd.minArgs}`
        if (cmd.fullHelp != "") text += `\n\n${cmd.fullHelp}`
        msg.send(text)
    }
}