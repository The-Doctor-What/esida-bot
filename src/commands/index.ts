import {getID} from "../others/utils";
import {helpCommand} from "./helpCommand";
import {setDays, setFWarn, setLitrbol, setRep, setScore, setVig, setWarn} from "./warnCommand";
import {
    helpCongress,
    helpEsida,
    helpForum,
    helpHistory,
    helpInvite,
    helpJustall,
    helpList,
    helpMsg,
    helpSet
} from "../others/helpTexts";
import {commandShop} from "./shopCommand";
import {project} from "./projectCommand";
import {commandForum, commandForumAccept, commandForumDecline, getFullForum} from "./forumCommand";
import {congressSetAccess} from "./congressCommand";
import {getHistory} from "./historyCommand";
import {stats} from "./statsCommand";
import {setDataUser} from "./setCommand";
import {justallCommand} from "../others/justall";
import {getOnlineUser} from "./onlineCommand";
import {changePassword} from "./passwordCommand";
import {msgCommand} from "./msgCommand";
import {commandAdminBlock, commandMakeAdmin} from "./makeAdminCommand";
import {listUsers} from "./listCommand";
import {setRole} from "./setRoleCommand";
import {membersCommand} from "./membersCommand";
import {checkCommand} from "./checkCommand";
import {aboutCommand} from "./aboutCommand";
import {inviteCommand, removedCandidate} from "./inviteCommand";
import {recoveryCommand, unInviteCommand} from "./unInviteCommand";
import {setRankCommand} from "./setRankCommand";
import {fracs} from "./fractionsCommand";
import {hideCommand} from "./hideCommand";
import {formCommand} from "./formCommand";

export class Command {
    public access: number;
    public name: string;
    public aliases: string[];
    public description: string;
    public execute: (msg, args, sender: any) => void;
    public minArgs: number
    public usage: string
    public fullHelp: string

    constructor(name, access, aliases, execute, description = "", usage = "", args = 0, fullHelp = "") {
        this.name = name
        this.access = access
        this.aliases = aliases
        this.execute = execute
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
    new Command("about", 0, [], aboutCommand),
];

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
    new Command("invite", 4, ["user_add", "adduser"], inviteCommand, "Сделать пользователя кандидатом", "[user] [должность] [фракция]", 3, helpInvite),
    new Command("uninvite", 5, ["noadd"], removedCandidate, "Снять пользователя с кандидатов", "[user]", 1),
    new Command("uval", 5, [], unInviteCommand, "Увольнение пользователя", "[user] [Причина]", 2),
    new Command("recovery", 5, [], recoveryCommand, "Восстановление пользователя", "[user]", 1),
    new Command("setrank", 5, [], setRankCommand, "Изменить должность пользователя", "[user] [Должность] [Тип постановления]", 3),
    new Command("makecongress", 2, [], congressSetAccess, "Установить доступ к конгрессу", "[user] [Доступ]", 2, helpCongress),
    new Command("hide", 5, [], hideCommand, "Скрыть/рассекретить пользователя", "[user]", 1),
]

export const commandsOthers: Command[] = [
    new Command("online", 1, ["onl"], getOnlineUser, "Получить онлайн игрока", "[nick]", 0),
    new Command("msg", 4, [], msgCommand, "Отравить сообщение в беседу всем пользователям", "[Министерство] [Сообщение]", 2, helpMsg),
    new Command("adminblock", 6, [], commandAdminBlock, "Разрешить или запретить пользователю занимать пост администратора", "[user]", 1),
    new Command("makeadmin", 7, [], commandMakeAdmin, "Сделать пользователя кандидатом на пост администратора", "[user]", 1),
    new Command("shop", 2, [], commandShop, "Обменник баллов"),
    new Command("members", 0, [], membersCommand, "Получить список сотрудников в сети у организации", "[id фракции] [server]", 1),
    new Command("check", 5, [], checkCommand, "Статистика игрока на сервере", "[Ник игрока] [server]", 1),
    new Command("form", 3, [], formCommand),
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
]