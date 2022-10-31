import dedent from "dedent-js";
import {getFraction} from "../../database/database";
import {vkGroup} from "../../database/bots";
import {messageSend} from "../../utils/messanges";

export async function moneyBuy(product, sender) {
    await messageSend(dedent(`${sender.rank} @id${sender.vk_id} (${sender.nick})
        Приобрел ${product.name} за баллы!
        Фракция: ${await getFraction(sender.fraction)}`), 45, vkGroup)
}