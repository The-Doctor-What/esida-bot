import {random} from "../others/utils";
import {addHistory} from "../commands/commandHistory";
import {saveUser, userid} from "../database";

export async function litrbolBuy(product, sender) {
    const count = await random(100, 200)
    sender.litrbol += count
    await addHistory(sender, `litrbol`, count, `Покупка в магазине`, `+`, userid)
    await saveUser(sender)
}