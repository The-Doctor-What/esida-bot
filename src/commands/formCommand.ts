import {getUserData} from "../database";
import dedent from "dedent-js";
import {Keyboard} from "vk-io";
import {urlButton} from "./statsCommand";

export async function formCommand(msg) {
    const sender = await getUserData(msg.senderId, "candidates")
    if (!sender) return await msg.send(`🚫 | К сожалению вы не числитесь в списке будущих руководителей.`)

    msg.send({
        message: dedent(`
        Чтобы стать руководителем
        Вам нужно для этого перейти по ссылке и заполнить форму`
        ),
        keyboard: Keyboard.keyboard([
                [
                    await urlButton(`https://lite.esida.studio/reg/${sender.code}`, `Перейти`)
                ]
            ]
        ).inline(true)
    })
}