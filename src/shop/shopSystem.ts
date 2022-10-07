import {works} from "../commands/commandProject";
import {getError} from "../commands/commandSystem";
import {vkGroup} from "../bots";
import {show_snackbar} from "../events/eventSystem";
import {products} from "./products";
import {purchase} from "../events/eventShop";
import {getPrice} from "../commands/commandShop";

export async function shopSystem(event, sender, name) {
    try {
        if (!works) return
        const product = products.find(x => x.id == name)
        if (!product) return await show_snackbar(event, "🚫 Не найден товар с таким названием! 🚫")
        const price = await getPrice(product, sender)
        const payment = await purchase(event, sender, price)
        if (!payment) return
        product.func(product, sender, price, event)
        await show_snackbar(event, `🛒 Вы успешно купили ${product.name} за ${price}$! 🛒`)
    } catch (error) {
        try {
            const {keyboard} = await getError(error, "shopSystem")
            await vkGroup.api.messages.send({
                chat_id: 41,
                message: `🚫 Произошла ошибка при выполнении события! 🚫\n\n${error}`,
                keyboard: keyboard,
                random_id: 0
            })
        } catch {
            console.log(error)
        }
        await show_snackbar(event, "Произошла ошибка при проведении покупки!")
    }
}