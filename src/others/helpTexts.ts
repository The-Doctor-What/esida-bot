import dedent from "dedent-js";

export const helpJustall = dedent`
        Для перезагрузки базы данных JustAll: /justall reload
        Для получения списка тегов: /justall tags
        Для получения списка проектов: /justall projects
        Для удаление проекта: /justall delete [ID]
        Для подключения социальной сети: /justall connect [icon] [url]
        Для отключения социальной сети: /justall disconnect [url]
        
        Для добавления проекта: 
        /justall add
        Название:
        Ссылка:
        Описание:
        Иконка:
        Теги:
        
        Пример:
        /justall add
        Название: JustAll
        Ссылка: https://justall.studio
        Описание: Просто все
        Иконка: fa-plug
        Теги: 1,2
        `
export const helpSet = dedent`
        Доступные типы:
        - nick (Ник)
        - forum (Форум)
        - discord (Дискорд)
        - rpbio (РП биография)
        - harakter (характеристика)
        - age (возраст)
        - fraction (фракция)
        - type_add (тип постановления)
        - access (доступ) - доступно только для разработчиков
`
export const helpHistory = dedent`
        Доступные типы:
        - warns (предупреждения)
        - vigs (выговоры)
        - fwarns (федеральные выговоры)
        - term (дни до срока)
        - rep (репутация)
        - score (баллы)
        - litrbol (основные баллы)
`
export const helpMsg = dedent`
        Доступные фракции:
        - ГОС
        - МО
        - МЗ
        - МЮ
        - ЦА
        - СМИ
        - Право
        - Суд
        - Прокуратура
        - sled
`
export const helpList = dedent`
        Доступные списки:
        - dev (разработчики)
        - admins (следящие)
        - leaders (лидеры)
        - zams (заместители)
        - others (советники, прокуроры, судьи)
        - candidates (кандидаты)
        - archive (архив)
        - all (все)
`
export const helpCongress = dedent`
       Должности:
       - Спикер [4]
       - Вице-спикер [3]
       - Конгрессмен [2]
       - Заместитель конгрессмена [1]
       - Не участник конгресса [0]
       `
export const helpEsida = dedent`
        Доступные Действия:
        - stop (Выключить проект)
        - pause (Остановить прием комманд)
        - upfraction (Обновить фракции)
        - status (Получить состояние проекта)
        `
export const helpForum = dedent`
        Доступные Действия:
        - delete (Удалить тему)
        - close (Закрыть тему)
        - open (Открыть тему)
        - pin (Закрепить тему)
        - unpin (Открепить тему)
`

export const helpPermissions = dedent`
        Доступные варианты:
        user - Информация о пользователе
`

export const helpInvite = dedent`
        Должности:
        1. Судья
        2. Прокурор
        7. Верховный судья
        8. Советник
        9. Заместитель
        10. Лидер
        11. Министр
        12. Генеральный прокурор
        13. Губернатор
        20. Следящий
        21. Главный следящий
        99. Руководитель

        Фракции: /fracs
`