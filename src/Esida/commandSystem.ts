import {group, user} from "../bots";
import {addText, form, fracs, promotion, recovery, removedCandidate, uval} from "./personnel";
import {getID} from "../utils";
import {help} from "./commands/commandHelp";
import {justallCommand} from "../others/justall";
import {stats} from "./commands/commandStats";
import {listUsers} from "./commands/commandList";
import {getUserData} from "../database";
import {setDays, setFWarn, setLitrbol, setRep, setScore, setVig, setWarn} from "./commands/commandWarn";
import {getHistory} from "./commands/commandHistory";
import {setRole} from "./commands/commandSetRole";
import {getOnlineUser} from "./commands/commandOnline";
import {setDataUser} from "./commands/commandSet";
import {checkCooldown} from "../others/cooldowns";
import {reloadFractions, project, works} from "./commands/commandProject";
import {helpCongress, helpEsida, helpHistory, helpJustall, helpList, helpMsg, helpSet} from "../others/helpTexts";
import {msgCommand} from "./commands/commandMsg";
import {congressSetAccess} from "./commands/commandCongress";

group.hear(/^\//i, async msg=> {
    await commandSystem(msg)
})

user.hear(/^\//i, async msg=> {
    if (!checkCooldown(msg.senderId)) return
    await commandSystem(msg, commandsUser)
})

class Command {
    public access: number;
    public name: string;
    public aliases: string[];
    public description: string;
    public func: (msg, args, sender: any) => void;
    public minArgs: number
    public usage: string
    public fullHelp: string
    constructor(name, access, aliases, func, description, usage = "", args = 0, fullHelp = "") {
        this.name = name
        this.access = access
        this.aliases = aliases
        this.func = func
        this.description = description
        this.minArgs = args
        this.usage = `/${name} ${usage}`
        this.fullHelp = fullHelp
    }
}

export let commands: Command[] = [
    new Command("id", 0, ["chat_id"], getID, "Получить ID беседы",),
    new Command("adduser", 3, ["user_add"], addText, "Добавить пользователя в базу данных"),
    new Command("help", 0, ["ehelp"], help, "Помощь по командам","[команда]"),
    new Command("fracs", 0, [], fracs, "Список фракций"),
    new Command("stats", 0, ["info", "find"], stats, "Статистика пользователя", "[user]"),
    new Command("list", 0, [], listUsers, "Список пользователей", "[group]",0, helpList),
    new Command("warn", 4, ["setwarn"], setWarn, "Изменить предупреждения пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("vig", 4, ["setvig"], setVig, "Изменить выговоры пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("rep", 4, ["setrep"], setRep, "Изменить репутацию пользователя", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("score", 4, ["setscore"], setScore, "Изменить баллы пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("litrbol", 4, [], setLitrbol, "Изменить основные баллы пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("fwarn", 3, ["setfwarn"], setFWarn, "Изменить федеральные выговоры пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("setday", 4, [], setDays, "Установить количество дней до срока", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("history", 0, [], getHistory, "Просмотреть историю пользователя", "[user] [type]", 2, helpHistory),
    new Command("noadd", 4, [], removedCandidate, "Снять пользователя с кандидатов", "[user]", 1),
    new Command("setrank", 4, [], promotion, "Изменить должность пользователя", "[user] [Должность] [Тип постановления]", 3),
    new Command("setrole", 4, [], setRole, "Изменить роль пользователя", "[user] [Роль]", 2),
    new Command("online", 1, ["onl"], getOnlineUser, "Получить онлайн игрока", "[nick]", 0),
    new Command("set", 4, [], setDataUser, "Изменить данные пользователя", "[user] [type] [value]", 3, helpSet),
    new Command("uval", 4, [], uval, "Увольнение пользователя", "[user] [Причина]", 2),
    new Command("recovery", 4, [], recovery, "Восстановление пользователя", "[user]", 1),
    new Command("msg", 5, [], msgCommand, "Отравить сообщение в беседу всем пользователям", "[Министерство] [Сообщение]", 2, helpMsg),
    new Command("justall", 666, [], justallCommand, "Управление сайтом JustAll Studio", "[action]", 1, helpJustall),
    new Command("esida", 666, [], project, "Управление проектом Esida", "[action]", 1, helpEsida),
    new Command("reloadfracs", 666, [], reloadFractions, "Загрузить фракции из базы данных"),
    new Command("makecongress", 1, [], congressSetAccess, "Установить доступ к конгрессу", "[user] [Доступ]", 2, helpCongress),
]

export let commandsUser: Command[] = [
    new Command("id", 0, ["chat_id"], getID, "Получить ID беседы"),
    new Command("form", 0, [], form, "Форма для второго этапа регистрации"),
]

async function commandSystem(msg, commandGroup = commands) {
    const command = msg.text.split(" ")[0].substring(1)
    const args = msg.text.split(" ").slice(1)
    let access = 0
    const sender = await getUserData(msg.senderId)
    if (sender) access = sender.access
    if (!works && command != "esida") return
    let cmd = commandGroup.find(x => x.name == command || x.aliases.includes(command))
    if (!cmd) return
    if (cmd.access > access) return msg.send(`🚫 У вас недостаточно прав для использования этой команды, необходимо иметь уровень доступа: ${cmd.access}`)
    if (cmd.minArgs > args.length) return msg.send(`🚫 Недостаточно аргументов для использования команды! 🚫\nИспользование: ${cmd.usage}\n\n${cmd.fullHelp}`)
    await cmd.func(msg, args, sender)
}

