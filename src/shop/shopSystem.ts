import {works} from "../commands/commandProject";
import {getError} from "../commands/commandSystem";
import {vkGroup} from "../bots";
import {show_snackbar} from "../events/eventSystem";
import {products} from "./products";
import {purchase} from "../events/eventShop";
import {getPrice} from "../commands/commandShop";
import {commandSend} from "../others/utils";

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
            await commandSend(`🚫 Произошла ошибка при выполнении события! 🚫\n\n${error}`, 41, vkGroup, keyboard)
        } catch {
            console.log(error)
        }
        await show_snackbar(event, "Произошла ошибка при проведении покупки!")
    }
}