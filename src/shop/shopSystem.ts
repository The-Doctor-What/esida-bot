import {show_snackbar} from "../events/eventSystem";
import {products} from "./products";
import {getError} from "../commands/commandSystem";
import {works} from "../commands/commands/projectCommand";
import {purchase} from "../events/events/shopEvent";
import {vkGroup} from "../database/bots";
import {getPrice} from "../commands/commands/shopCommand";
import {messageSend} from "../utils/messanges";

export async function shopSystem(event, sender, name) {
    try {
        if (!works) return

        const product = products.find(x => x.id == name)
        if (!product) return await show_snackbar(event, "🚫 Не найден товар с таким названием! 🚫")

        const price = await getPrice(product, sender)
        const payment = await purchase(event, sender, price)
        if (!payment) return

        await product.func(product, sender, price, event)
        await show_snackbar(event, `🛒 Вы успешно купили ${product.name} за ${price}$! 🛒`)
    } catch (error) {
        try {
            const {keyboard} = await getError(error, "shopSystem")
            await messageSend(`🚫 Произошла ошибка при выполнении события! 🚫\n\n${error}`, 41, vkGroup, keyboard)
        } catch {
            console.log(error)
        }
        await show_snackbar(event, "Произошла ошибка при проведении покупки!")
    }
}