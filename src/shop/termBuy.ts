import {checkBuy} from "../events/eventShop";

export async function termBuy(product, sender, price, event) {
    if (product.id == "term-1") {
        if (await checkBuy(event, sender, price, 1, "days")) sender.term--
    } else if (product.id == "term-2") {
        if (await checkBuy(event, sender, price, 2, "days")) sender.term -= 2
    }
}