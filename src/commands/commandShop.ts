import dedent from "dedent-js";

export async function commandShop(msg) {
    const template = JSON.stringify({
        type: "carousel",
        elements: [
            {
                title: "💰 | Стартовый капитал",
                photo_id: "-109837093_457242809",
                description: "5.000.000$\nЦена: 20 баллов",
                buttons: [
                    {
                        action: {
                            type: "buy",
                            payload: "{\"button\": \"1\"}",
                            label: "Обменять"
                        },
                    }
                ]
            },
            {
                title: "💰 | Начинающий магнат",
                photo_id: "-109837093_457242809",
                description: "40.000.000$",
                buttons: [
                    {
                        action: {
                            type: "text",
                            payload: "{\"button\": \"1\"}",
                            label: "140 баллов"
                        },
                    }
                ]
            },
            {
                title: "💰 | Коррупционный приём",
                photo_id: "-109837093_457242809",
                description: dedent(`Вы сможете избавится от 1 предупреждения`),
                buttons: [
                    {
                        action: {
                            type: "text",
                            payload: "{\"button\": \"1\"}",
                            label: "40 баллов"
                        },
                    }
                ]
            }
        ]
    })
    await msg.send({message: "🏛 | Обменник баллов", template: template})
}