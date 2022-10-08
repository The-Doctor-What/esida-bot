import {getID} from "../others/utils";
import {addText, form, fracs, promotion, recovery, removedCandidate, uval} from "../personnel";
import {helpCommand} from "./commandHelp";
import {stats} from "./commandStats";
import {listUsers} from "./commandList";
import {
    helpCongress,
    helpEsida,
    helpForum,
    helpHistory,
    helpJustall,
    helpList,
    helpMsg,
    helpSet
} from "../others/helpTexts";
import {setDays, setFWarn, setLitrbol, setRep, setScore, setVig, setWarn} from "./commandWarn";
import {getHistory} from "./commandHistory";
import {setRole} from "./commandSetRole";
import {getOnlineUser} from "./commandOnline";
import {setDataUser} from "./commandSet";
import {msgCommand} from "./commandMsg";
import {congressSetAccess} from "./commandCongress";
import {commandForum, commandForumAccept, commandForumDecline, getFullForum} from "./commandForum";
import {changePassword} from "./commandPassword";
import {commandShop} from "./commandShop";
import {justallCommand} from "../others/justall";
import {project} from "./commandProject";
import {commandAdminBlock, commandMakeAdmin} from "./commandMakeAdmin";

export class Command {
    public access: number;
    public name: string;
    public aliases: string[];
    public description: string;
    public func: (msg, args, sender: any) => void;
    public minArgs: number
    public usage: string
    public fullHelp: string

    constructor(name, access, aliases, func, description = "", usage = "", args = 0, fullHelp = "") {
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

export const commandsInfo: Command[] = [
    new Command("id", 0, ["chat_id"], getID, "Получить ID беседы",),
    new Command("help", 0, ["ehelp"], helpCommand, "Помощь по командам", "[команда]"),
    new Command("fracs", 0, [], fracs, "Список фракций"),
    new Command("stats", 0, ["info", "find"], stats, "Статистика пользователя", "[user]"),
    new Command("list", 0, [], listUsers, "Список пользователей", "[group]", 0, helpList),
    new Command("history", 0, [], getHistory, "Просмотреть историю пользователя", "[user] [type]", 2, helpHistory),
]

export const commandsData: Command[] = [
    new Command("warn", 5, ["setwarn"], setWarn, "Изменить предупреждения пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("vig", 5, ["setvig"], setVig, "Изменить выговоры пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("rep", 5, ["setrep"], setRep, "Изменить репутацию пользователя", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("score", 5, ["setscore"], setScore, "Изменить баллы пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("litrbol", 5, [], setLitrbol, "Изменить основные баллы пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("fwarn", 4, ["setfwarn"], setFWarn, "Изменить федеральные выговоры пользователю", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("setday", 5, [], setDays, "Установить количество дней до срока", "[user] +/-[Кол-во] [Причина]", 3),
    new Command("setrole", 5, [], setRole, "Изменить роль пользователя", "[user] [Роль]", 2),
    new Command("set", 5, [], setDataUser, "Изменить данные пользователя", "[user] [type] [value]", 3, helpSet),
]

export const commandsForum: Command[] = [
    new Command("forum", 3, [], commandForum, "Взаимодействие с форумом", "[action] [url]", 2, helpForum),
    new Command("facc", 5, [], commandForumAccept, "Принять форму от руководителя", "[id form]", 1),
    new Command("fdec", 5, [], commandForumDecline, "Отклонить форму от руководителя", "[id form]", 1),
    new Command("flist", 3, [], getFullForum, "Список всех необработанных форм"),
]

export const commandsDev: Command[] = [
    new Command("changepassword", 69, ["changepass"], changePassword, "Сменить пароль на сайте Esida", "[Новый пароль]", 1),
    new Command("justall", 69, [], justallCommand, "Управление сайтом JustAll Studio", "[action]", 1, helpJustall),
    new Command("esida", 666, [], project, "Управление проектом Esida", "[action]", 1, helpEsida),
]

export const commandsPost: Command[] = [
    new Command("adduser", 4, ["user_add"], addText, "Как добавить пользователя в базу данных"),
    new Command("noadd", 5, [], removedCandidate, "Снять пользователя с кандидатов", "[user]", 1),
    new Command("uval", 5, [], uval, "Увольнение пользователя", "[user] [Причина]", 2),
    new Command("recovery", 5, [], recovery, "Восстановление пользователя", "[user]", 1),
    new Command("setrank", 5, [], promotion, "Изменить должность пользователя", "[user] [Должность] [Тип постановления]", 3),
    new Command("makecongress", 2, [], congressSetAccess, "Установить доступ к конгрессу", "[user] [Доступ]", 2, helpCongress),
]

export const commandsOthers: Command[] = [
    new Command("online", 1, ["onl"], getOnlineUser, "Получить онлайн игрока", "[nick]", 0),
    new Command("msg", 4, [], msgCommand, "Отравить сообщение в беседу всем пользователям", "[Министерство] [Сообщение]", 2, helpMsg),
    new Command("adminblock", 6, [], commandAdminBlock, "Разрешить или запретить пользователю занимать пост администратора", "[user]", 1),
    new Command("makeadmin", 7, [], commandMakeAdmin, "Сделать пользователя кандидатом на пост администратора", "[user]", 1),
    new Command("shop", 2, [], commandShop, "Обменник баллов"),
]

export default [
    ...commandsInfo,
    ...commandsData,
    ...commandsForum,
    ...commandsPost,
    ...commandsOthers,
    ...commandsDev,
]

export const commandsUser: Command[] = [
    new Command("id", 0, ["chat_id"], getID, "Получить ID беседы"),
    new Command("form", 0, [], form, "Форма для второго этапа регистрации"),
]