import {getShopMenu} from "../commands/commandShop";
import {vkGroup} from "../bots";
import {show_snackbar} from "./eventSystem";
import {commandSend, random} from "../others/utils";
import dedent from "dedent-js";
import {getFraction, saveUser} from "../database";

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
    const section = args[0]
    const value = args[1]
    const price = args[2]
    const payment = await purchase(event, sender, price)
    if (!payment) return
    if (sender.access >= 5 && sender.access <= 60) {
        await show_snackbar(event, "Ты думал переиграть меня? Нет!")
        return
    }
    if (section == "money") {
        await commandSend(dedent(`${sender.rank} @id${sender.vk_id} (${sender.nick})
        Приобрел ${value}$ за баллы!
        Фракция: ${await getFraction(sender.frac)}`), 45, vkGroup)
    } else if (section == "time") {
        const chat = await getFraction(sender.frac, "chat")
        if (value == "weekend") {
            await vkGroup.api.messages.send({
                chat_id: chat,
                message: `${sender.rank} @id${sender.vk_id} (${sender.nick}) приобрел 2 выходных дня за баллы!`,
                dont_parse_links: 1,
                disable_mentions: 1,
                random_id: 0
            })
        } else if (value == "term") {
            if (sender.limitShop.days >= 1) sender.term--
            else {
                sender.score += price
                await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
            }
        } else if (value == "term-2") {
            if (sender.limitShop.days >= 2) sender.term -= 2
            else {
                sender.score += price
                await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
            }
        } else if (value == "norm") {
            if (sender.limitShop.norm >= 1) await vkGroup.api.messages.send({
                chat_id: chat,
                message: `${sender.rank} @id${sender.vk_id} (${sender.nick}) приобрел -3 часа к норме за баллы!`,
                dont_parse_links: 1,
                disable_mentions: 1,
                random_id: 0
            })
            else {
                sender.score += price
                await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
            }
        }
    } else if (section == "unpunish") {
        if (sender.warns >= 1 || sender.vigs >= 1) {
            sender[value]--
        } else {
            sender.score += price
            await show_snackbar(event, "У вас нет ни одного предупреждения или выговора!")
        }
    } else if (section == "litrbol") {
        sender.litrbol += await random(100, 200)
    }
    await saveUser(sender)
    await show_snackbar(event, "Покупка прошла успешно!")
}

export async function purchase(event, sender, price) {
    if (price == -1) {
        await show_snackbar(event, "Этот товар нельзя купить!")
        return false
    } else if (sender.score < price) {
        await show_snackbar(event, "У вас недостаточно средств для покупки!")
        return false
    } else if (sender.access <= 0) {
        await show_snackbar(event, "Вам запрещено покупать что либо в магазине!")
        return false
    } else {
        sender.score -= price
        await saveUser(sender)
        return true
    }
}