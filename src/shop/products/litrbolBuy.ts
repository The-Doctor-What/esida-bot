import {random} from "../../utils/others";
import {userid} from "../../database/database";
import {addHistory} from "../../commands/commands/historyCommand";
import {saveUser} from "../../database/user";

export async function litrbolBuy(product, sender) {
    const count = await random(100, 200)
    sender.litrbol += count
    await addHistory(sender, `litrbol`, count, `Покупка в магазине`, `+`, userid)
    await saveUser(sender)
}