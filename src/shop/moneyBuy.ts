import {commandSend} from "../others/utils";
import dedent from "dedent-js";
import {getFraction} from "../database";
import {vkGroup} from "../bots";

export async function moneyBuy(product, sender) {
    await commandSend(dedent(`${sender.rank} @id${sender.vk_id} (${sender.nick})
        Приобрел ${product.name} за баллы!
        Фракция: ${await getFraction(sender.frac)}`), 45, vkGroup)
}