import dedent from "dedent-js";
import {Keyboard} from "vk-io";
import {urlButton} from "./statsCommand";

export async function aboutCommand(msg) {
    msg.send({
            message: dedent`
                Esida это следующее поколение сервисов для Arizona RP. 
                Для граждан, лидеров и правительства.`,
            keyboard: Keyboard
                .keyboard([
                        [
                            await urlButton("https://lite.esida.studio", "Перейти на наш сайт")
                        ]
                    ]
                ).inline(true)
        }
    )
}