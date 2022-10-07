import {getShopMenu} from "../commands/commandShop";
import {vkGroup} from "../bots";
import {show_snackbar} from "./eventSystem";
import {commandSend, random} from "../others/utils";
import dedent from "dedent-js";
import {getFraction, saveUser, userid} from "../database";
import {checkData} from "../commands/commandWarn";
import {addHistory} from "../commands/commandHistory";

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
            if (await checkBuy(event, sender, price, 1, "days")) sender.term--
        } else if (value == "term-2") {
            if (await checkBuy(event, sender, price, 2, "days")) sender.term -= 2
        } else if (value == "norm") {
            if (await checkBuy(event, sender, price, 1, "norm")) await vkGroup.api.messages.send({
                chat_id: chat,
                message: `${sender.rank} @id${sender.vk_id} (${sender.nick}) приобрел -3 часа к норме за баллы!`,
                dont_parse_links: 1,
                disable_mentions: 1,
                random_id: 0
            })
        }
    } else if (section == "unpunish") {
        if (value == "vigs" && (await checkBuy(event, sender, price, 1, "vigs"))) {
            sender[value]--
            await addHistory(sender, value, 1, `Покупка в магазине`, `-`, userid)
        } else if (value == "warns") {
            if (sender.warns >= 1 || sender.vigs >= 1){
                sender[value]--
                await addHistory(sender, value, 1, `Покупка в магазине`, `-`, userid)
            } else {
                sender.score += price
                await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
            }
        }
    } else if (section == "litrbol") {
        const count = await random(100, 200)
        sender.litrbol += count
        await addHistory(sender, `litrbol`, count, `Покупка в магазине`, `+`, userid)
    }
    await saveUser(sender)
    if (sender.access < 5) await checkData(sender)
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
        await addHistory(sender, `score`, price, `Покупка в магазине`, `-`, userid)
        await saveUser(sender)
        return true
    }
}

export async function checkBuy(event, sender, price, limit, value) {
    if (sender.limitShop[value] >= limit) return true
    else {
        sender.score += price
        await show_snackbar(event, "Вы больше не можете приобрести этот предмет!")
        return false
    }
}