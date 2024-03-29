import {userid} from "../../database/database";
import {addHistory} from "../../commands/commands/historyCommand";
import {show_snackbar} from "../../events/eventSystem";
import {saveUser} from "../../database/user";

export async function unpunishBuy(product, sender, price, event) {
    if (product.id == "unvigs" && sender.vigs >= 1) {
        sender.vigs--
        await addHistory(sender, "vigs", 1, `Покупка в магазине`, `-`, userid)
    } else if (product.id == "unwarns" && (sender.warns >= 1 || sender.vigs >= 1)) {
        sender.warns--
        await addHistory(sender, "warns", 1, `Покупка в магазине`, `-`, userid)
    } else {
        sender.score += price
        await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
    }
    await saveUser(sender)
}