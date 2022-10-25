import {Keyboard} from "vk-io";
import dedent from "dedent-js";
import {products} from "../shop/products";
import {getHomeButton} from "../events/eventSystem";

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
                                    args: ["litrbol"],
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
        2. 10.000.000$ - ${await getPrice("money-2", sender, true)} баллов
        3. 20.000.000$ - ${await getPrice("money-3", sender, true)} баллов`)
        if (sender.access != 2) text += `\n4. 40.000.000$ - ${await getPrice("money-4", sender, true)} баллов`
        text += `\n\nПосле покупки данные отправляются в систему выплат и выдаются вам по вторникам`
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: '5.000.000$',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["money-1"],
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
                                args: ["money-2"],
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
                                args: ["money-3"],
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
                                args: ["money-4"],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        await getHomeButton("shop", sender)
                    ]
                ]
            ).inline(true)
    } else if (menu == "time") {
        text += dedent(`🔹 | Выберите срок:\n\n
        1. 2 выходных дня - ${await getPrice("weekend", sender, true)} баллов
        2. -3 часа к еженедельной норме (максимум 5 раз за срок) - ${await getPrice("norm", sender, true)} баллов
        3. -1 день до срока - ${await getPrice("term-1", sender, true)} баллов
        4. -2 дня к сроку(только для министров) - ${await getPrice("term-2", sender, true)} баллов
        Важно: максимум минус дней за срок 6`)
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: 'Выходные дни',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["weekend"],
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
                                args: ["norm"],
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
                                args: ["term-1"],
                                sender: sender.vk_id
                            }
                        }),
                        Keyboard.callbackButton({
                            label: '-2 к сроку',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["term-2"],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        await getHomeButton("shop", sender)
                    ]
                ]
            ).inline(true)
    } else if (menu == "unpunish") {
        text += dedent(`🔹 | Какое наказание снимаем:\n\n
        1. Снять выговор - ${await getPrice("unvigs", sender, true)} баллов
        2. Снять предупреждения - ${await getPrice("unwarns", sender, true)} баллов`)
        keyboard = Keyboard
            .keyboard([
                    [
                        Keyboard.callbackButton({
                            label: 'Снять предупреждения',
                            color: `positive`,
                            payload: {
                                command: "buy",
                                args: ["unwarns"],
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
                                args: ["unvigs"],
                                sender: sender.vk_id
                            }
                        }),
                    ],
                    [
                        await getHomeButton("shop", sender)
                    ]
                ]
            ).inline(true)
    }
    return {text, keyboard}
}

export async function getPrice(product, sender, find = false) {
    if (find) product = products.find(x => x.id == product)
    const deputy = product.price[2]
    const leader = product.price[1]
    const minister = product.price[0]
    if (sender.access == 2) return deputy
    else if (sender.access == 4 && sender.fraction != 6) return minister
    else return leader
}