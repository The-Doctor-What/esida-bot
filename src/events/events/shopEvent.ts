import {shopSystem} from "../../shop/shopSystem";
import {getShopMenu} from "../../commands/commands/shopCommand";
import {checkData} from "../../commands/commands/warnCommand";
import {vkGroup} from "../../database/bots";
import {userid} from "../../database/database";
import {show_snackbar} from "../eventSystem";
import {addHistory} from "../../commands/commands/historyCommand";
import {saveUser} from "../../database/user";

export async function eventShop(event, args, sender) {
    const {text, keyboard} = await getShopMenu(sender, args[0])
    await vkGroup.api.messages.edit({
        peer_id: event.peerId,
        message: text,
        keyboard: keyboard,
        conversation_message_id: event.conversationMessageId
    })
}

export async function eventShopBuy(event, args, sender) {
    const name = args[0]
    if (sender.access >= 5 && sender.access <= 60) {
        await show_snackbar(event, "Ты думал переиграть меня? Нет!")
        return
    }
    await shopSystem(event, sender, name)
    if (sender.access < 5) await checkData(sender)
}

export async function purchase(event, sender, price) {
    if (price == -1) await show_snackbar(event, "Этот товар нельзя купить!")
    else if (sender.score < price) await show_snackbar(event, "У вас недостаточно средств для покупки!")
    else {
        sender.score -= price
        await addHistory(sender, `score`, price, `Покупка в магазине`, `-`, userid)
        await saveUser(sender)
        return true
    }
    return false
}

export async function checkBuy(event, sender, price, limit, value) {
    if (sender.limitShop[value] >= limit) {
        sender.limitShop[value] --
        await saveUser(sender)
        return true
    }
    else {
        sender.score += price
        await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
        return false
    }
}
