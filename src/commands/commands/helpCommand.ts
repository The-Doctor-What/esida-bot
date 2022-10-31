import dedent from "dedent-js";
import commands from "../index";
import {Keyboard} from "vk-io";

export async function helpCommand(msg, args, sender) {
    const command = args ? args[0] : null
    if (!command) {
        const {text, keyboard} = await helpMain(sender)
        await msg.send({message: text, keyboard})
    } else {
        let cmd = commands.find(x => x.name == command || x.aliases.includes(command))
        if (!cmd) return await msg.send("🚫 Такой команды не существует! 🚫")
        if (sender.access < cmd.access) return await msg.send("🚫 У вас недостаточно прав для использования этой команды! 🚫")
        await msg.send(dedent`🔹 ${cmd.usage} - ${cmd.description}
            ${cmd.aliases.length > 0 ? `🔹 Альтернативные варианты: ${cmd.aliases.join(", ")}` : ""}
            🔸 Требуемый уровень доступа: ${cmd.access}
            🔸 Минимальное количество аргументов: ${cmd.minArgs}
            
            ${cmd.fullHelp}`
        )
    }
}

export async function helpGroup(group, access) {
    let text = ``
    for (const cmd of group) {
        if (access >= cmd.access && cmd.description != "") text += `🔹 ${cmd.usage} - ${cmd.description}\n`
    }
    if (text == ``) text = `Для вас в данной группе нет доступных команд.\n`
    text = `\n📚 Список команд 📚\n\n${text}`
    return text
}

export async function helpMain(sender) {
    const text = dedent(`📚 Список команд: 📚
        
        Выберите категорию команд, чтобы увидеть список команд в ней.
        
        1. Информационные
        2. Изменение данных
        3. Взаимодействие с форумом
        4. Назначение и снятие пользователей
        5. Прочие команды
        6. Для разработчика
        `);
    const keyboard = Keyboard
        .keyboard([
            [
                Keyboard.callbackButton({
                    label: '1',
                    color: `primary`,
                    payload: {
                        command: "help",
                        args: ["info"],
                        sender: sender.vk_id
                    }
                }),
                Keyboard.callbackButton({
                    label: '2',
                    color: `primary`,
                    payload: {
                        command: 'help',
                        args: ['data'],
                        sender: sender.vk_id
                    },
                }),
                Keyboard.callbackButton({
                    label: '3',
                    color: `primary`,
                    payload: {
                        command: 'help',
                        args: ['forum'],
                        sender: sender.vk_id
                    },
                }),
            ],
            [
                Keyboard.callbackButton({
                    label: '4',
                    color: `primary`,
                    payload: {
                        command: 'help',
                        args: ['post'],
                        sender: sender.vk_id
                    },
                }),
                Keyboard.callbackButton({
                    label: '5',
                    color: `primary`,
                    payload: {
                        command: 'help',
                        args: ['others'],
                        sender: sender.vk_id
                    },
                }),
                Keyboard.callbackButton({
                    label: '6',
                    color: `primary`,
                    payload: {
                        command: 'help',
                        args: ['dev'],
                        sender: sender.vk_id
                    },
                })
            ]]
        ).inline(true)
    return {text, keyboard}
}