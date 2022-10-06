import {Keyboard} from "vk-io";
import dedent from "dedent-js";
import {random} from "../others/utils";

export async function commandShop(msg, args, sender) {
    const {text, keyboard} = await getShopMenu(sender, "main")
    await msg.send({message: text, keyboard: keyboard})
}

export async function getShopMenu(sender, menu) {
    let text = `🏛 | Обменник баллов\n\n`
    let keyboard: any
    if (menu == "main") {
        text += dedent(`🔹 | Выберите категорию:
        🔹 | У вас: ${sender.score} баллов\n\n
        При нажатии на "Основные баллы" вы получите рандомное количество баллов от 100 до 200
        Предупреждение: обменяться назад не получится!`)
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: 'Деньги',
                            color: `positive`,
                            payload: {
                                command: "shop",
                                args: ["money"],
                                sender: sender.vk_id
                            }
                        }),
                        Keyboard.callbackButton({
                            label: 'Изменение сроков',
                            color: `primary`,
                            payload: {
                                command: "shop",
                                args: ["time"],
                                sender: sender.vk_id
                            }
                        })
                    ],
                    [
                        Keyboard.callbackButton({
                                label: "Снятие наказаний",
                                color: `negative`,
                                payload: {
                                    command: "shop",
                                    args: ["unpunish"],
                                    sender: sender.vk_id
                                }
                            }
                        ),
                    ],
                    [
                        Keyboard.callbackButton({
                                label: "Основные баллы",
                                color: `secondary`,
                                payload: {
                                    command: "buy",
                                    args: ["litrbol", "random", await getPrice(sender, 160, 140, -1)],
                                    sender: sender.vk_id
                                }
                            }
                        ),
                    ]
                ]
            ).inline(true)
    } else if (menu == "money") {
        text += dedent(`🔹 | Выберите сумму:\n\n
        1. 5.000.000$ - 20 баллов
        2. 10.000.000$ - ${await getPrice(sender, 40, 35, 35)} баллов
        3. 20.000.000$ - ${await getPrice(sender, 80, 70, 70)} баллов`)
        if (sender.access != 2) text += `\n4. 40.000.000$ - ${await getPrice(sender, 160, 140, -1)} баллов`
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: '5.000.000$',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["money", "5.000.000", 20],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: '10.000.000$',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["money", "10.000.000", await getPrice(sender, 40, 35, 35)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: '20.000.000$',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["money", "20.000.000", await getPrice(sender, 80, 70, 70)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: '40.000.000$',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["money", "40.000.000", await getPrice(sender, 160, 140, -1)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: 'Вернуться в главное меню',
                            color: `primary`,
                            payload: {
                                command: "shop",
                                args: ["main"],
                                sender: sender.vk_id
                            }
                        }),
                    ]
                ]
            ).inline(true)
    } else if (menu == "time") {
        text += dedent(`🔹 | Выберите срок:\n\n
        1. 2 выходных дня - ${await getPrice(sender, -1, 140, 70)} баллов
        2. -3 часа к еженедельной норме (максимум 5 раз за срок) - ${await getPrice(sender, 70, 60, -1)} баллов
        3. -1 день до срока - ${await getPrice(sender, 90, 100, -1)} баллов
        4. -2 дня к сроку(только для министров) - ${await getPrice(sender, 160, -1, -1)} баллов
        Важно: максимум минус дней за срок 6`)
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: 'Выходные дни',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["time", "weekend", await getPrice(sender, -1, 140, 70)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: 'Еженедельная норма',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["time", "norm", await getPrice(sender, 70, 60, -1)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: '-1 к сроку',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["time", "term", await getPrice(sender, 90, 100, -1)],
                                sender: sender.vk_id
                            }
                        }),
                        Keyboard.callbackButton({
                            label: '-2 к сроку',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["time", "term-2", await getPrice(sender, 160, -1, -1)],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        Keyboard.callbackButton({
                            label: 'Вернуться в главное меню',
                            color: `primary`,
                            payload: {
                                command: "shop",
                                args: ["main"],
                                sender: sender.vk_id
                            }
                        }),
                    ]
                ]
            ).inline(true)
    } else
        if (menu == "unpunish") {
            text += dedent(`🔹 | Какое наказание снимаем:\n\n
        1. Снять выговор - ${await getPrice(sender, 90, 100, 70)} баллов
        2. Снять предупреждения - ${await getPrice(sender, 40, 40, 30)} баллов`)
            keyboard = Keyboard
                .keyboard([
                        [
                            Keyboard.callbackButton({
                                label: 'Снять предупреждения',
                                color: `positive`,
                                payload: {
                                    command: "buy",
                                    args: ["unpunish", "warns", await getPrice(sender, 40, 40, 30)],
                                    sender: sender.vk_id
                                }
                            }),
                        ],
                        [
                            Keyboard.callbackButton({
                                label: 'Снять выговор',
                                color: `negative`,
                                payload: {
                                    command: "buy",
                                    args: ["unpunish", "vigs", await getPrice(sender, 90, 100, 70)],
                                    sender: sender.vk_id
                                }
                            }),
                        ],
                        [
                            Keyboard.callbackButton({
                                label: 'Вернуться в главное меню',
                                color: `primary`,
                                payload: {
                                    command: "shop",
                                    args: ["main"],
                                    sender: sender.vk_id
                                }
                            }),
                        ]
                    ]
                ).inline(true)
        }
        return {text, keyboard}
    }

    export async function getPrice(sender, minister, leader, deputy) {
        if (sender.access == 2) return deputy
        else if (sender.access == 4 && sender.frac != 6) return minister
        else return leader
    }