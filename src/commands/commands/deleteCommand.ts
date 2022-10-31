import {supabase} from "../../database/database";
import dedent from "dedent-js";
import {Keyboard} from "vk-io";
import {paste} from "../../others/aliensAPI";
import {urlButton} from "./statsCommand";

export async function deleteCommand(msg, args, sender) {
    const table = args[0]
    const id = args[1]
    const {data, error} = await supabase
        .from(table)
        .select("*")
        .eq('id', id).maybeSingle()
    if (error || !data) {
        return await msg.send(`🚫 Нет данных о элементе с id ${id} в таблице ${table}! 🚫`)
    }
    const text = dedent`
    Вы уверены, что хотите удалить элемент с id ${id} из таблицы ${table}?`
    const url = await paste(JSON.stringify(data, null, 4), `Подробнее об элементе с id ${id} в таблице ${table}`)
    const keyboard = Keyboard
        .keyboard([
                [
                    await urlButton(url, 'Информация об элементе')
                ],
                [
                    Keyboard.callbackButton({
                        label: 'Удалить',
                        color: `negative`,
                        payload: {
                            command: "deleteaccept",
                            args: [table, id],
                            sender: sender.vk_id
                        }
                    }),
                    Keyboard.callbackButton({
                        label: 'Оставить',
                        color: `positive`,
                        payload: {
                            command: 'deletedecline',
                            args: [table, id],
                            sender: sender.vk_id
                        },
                    })
                ],
            ]
        ).inline(true)
    await msg.send({message: text, keyboard})
}