import {formDelete, getForm, getForumCommand} from "../../commands/commands/forumCommand";
import {show_snackbar} from "../eventSystem";
import {messageSend} from "../../utils/messanges";

export async function eventForumAccept(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return await show_snackbar(msg, "🚫 Заявка не найдена! 🚫")
    else if (form.status) return await show_snackbar(msg, "🚫 Заявка уже обработана! 🚫")
    const formCommand = await getForumCommand(form)
    await messageSend(formCommand)
    await formDelete(form, true)
    await show_snackbar(msg, "📝 Заявка успешно обработана! 📝")
}

export async function eventForumDecline(msg, args) {
    const id = args[0]
    const form = await getForm(id)
    if (!form) return await show_snackbar(msg, "🚫 Заявка не найдена! 🚫")
    else if (form.status) return await show_snackbar(msg, "🚫 Заявка уже обработана! 🚫")
    await formDelete(form, false)
    await show_snackbar(msg, "📝 Заявка успешно обработана! 📝")
}