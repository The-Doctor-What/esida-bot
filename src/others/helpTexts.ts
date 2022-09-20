import dedent from "dedent-js";

export const helpJustall = dedent`
        Для перезагрузки базы данных JustAll: /justall reload
        Для получения списка тегов: /justall tags
        Для получения списка проектов: /justall projects
        Для удаление проекта: /justall delete [ID]
        Для полключения социальной сети: /justall connect [icon] [url]
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
        - frac (фракция)
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
        - Прокуратура
        - Суд
`
export const helpList = dedent`
        Доступные списки:
        - admins (следящие)
        - leaders (лидеры)
        - zams (заместители)
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
        - restart (Перезагрузить проект)
        `