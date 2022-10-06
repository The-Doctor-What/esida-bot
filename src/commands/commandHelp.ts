import {commands, commandsUser} from "./commands";
import dedent from "dedent-js";
import {Keyboard} from "vk-io";

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
        await msg.send(text)
    } else {
        let cmd = commands.find(x => x.name == command || x.aliases.includes(command))
        if (!cmd) return await msg.send("🚫 Такой команды не существует! 🚫")
        if (access < cmd.access) return await msg.send("🚫 У вас недостаточно прав для использования этой команды! 🚫")
        let text = `🔹 ${cmd.usage} - ${cmd.description}\n`
        text += `🔸 Альтернативные варианты: ${cmd.aliases.join(", ")}\n`
        text += `🔸 Требуемый уровень доступа: ${cmd.access}\n`
        text += `🔸 Минимальное количество аргументов: ${cmd.minArgs}`
        if (cmd.fullHelp != "") text += `\n\n${cmd.fullHelp}`
        await msg.send(text)
    }
}

export async function newHelp(msg, args, sender) {
    const command = args ? args[0] : null
    let access = 0
    if (sender) access = sender.access
    if (!command) {
        let text = dedent(`📚 Список команд: 📚
        
        Выберите категорию команд, чтобы увидеть список команд в ней.
        
        1. Информационные
        2. Изменение данных
        3. Взаимодействие с форумом
        4. Назначение и снятие пользователей
        5. Прочие команды
        6. Для разработчика
        `)
        const keyboard = Keyboard
            .keyboard([
                [
                    Keyboard.callbackButton({
                        label: '1',
                        color: `primary`
                    }),
                    Keyboard.callbackButton({
                        label: '2',
                        payload: {
                            command: 'help',
                            args: ['2']
                        },
                        color: `primary`
                    }),
                    Keyboard.callbackButton({
                        label: '3',
                        color: `primary`
                    }),
                ],
                [
                    Keyboard.callbackButton({
                        label: '4',
                        color: `primary`
                    }),
                    Keyboard.callbackButton({
                        label: '5',
                        color: `primary`
                    }),
                    Keyboard.callbackButton({
                        label: '6',
                        color: `primary`
                    })
                ]]
            ).inline(true)
        await msg.send({message: text, keyboard})
    } else {
        let cmd = commands.find(x => x.name == command || x.aliases.includes(command))
        if (!cmd) return await msg.send("🚫 Такой команды не существует! 🚫")
        if (access < cmd.access) return await msg.send("🚫 У вас недостаточно прав для использования этой команды! 🚫")
        let text = `🔹 ${cmd.usage} - ${cmd.description}\n`
        if (cmd.aliases.length > 0) text += `🔸 Альтернативные варианты: ${cmd.aliases.join(", ")}\n`
        text += `🔸 Требуемый уровень доступа: ${cmd.access}\n`
        text += `🔸 Минимальное количество аргументов: ${cmd.minArgs}`
        if (cmd.fullHelp != "") text += `\n\n${cmd.fullHelp}`
        await msg.send(text)
    }
}
