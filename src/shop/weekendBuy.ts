import {messageSend} from "../others/utils";
import dedent from "dedent-js";
import {vkGroup} from "../bots";
import {getFraction} from "../database";
import {checkBuy} from "../events/shopEvent";

export async function weekendBuy(product, sender, price, event) {
    const chat = await getFraction(sender.fraction, "chat")
    if (product.id == "norm") {
        if (!await checkBuy(event, sender, price, 1, "norm")) return false
    }
    await messageSend(dedent(`${sender.rank} @id${sender.vk_id} (${sender.nick}) приобрел ${product.name} за баллы!`), chat, vkGroup)
}