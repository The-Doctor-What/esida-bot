import {deleteElement} from "../../database/database";
import {show_snackbar} from "../eventSystem";
import {vkGroup} from "../../database/bots";

export async function deleteEventAccept(msg, args) {
    const table = args[0]
    const id = args[1]
    await deleteElement(id, table, "id")
    await vkGroup.api.messages.edit({
        peer_id: msg.peerId,
        message: `📝 Элемент с id ${id} успешно удалён! 📝`,
        conversation_message_id: msg.conversationMessageId
    })
    await show_snackbar(msg, `📝 Элемент с id ${id} успешно удален из таблицы ${table}! 📝`)
}

export async function deleteEventDecline(msg, args) {
    const table = args[0]
    const id = args[1]
    await vkGroup.api.messages.edit({
        peer_id: msg.peerId,
        message: `📝 Элемент с id ${id} не был удален из таблицы ${table}! 📝`,
        conversation_message_id: msg.conversationMessageId
    })
    await show_snackbar(msg, `📝 Элемент с id ${id} не был удален из таблицы ${table}! 📝`)
}