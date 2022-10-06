export async function commandShop(msg) {
    const template = JSON.stringify({
        type: "carousel",
        elements: [
            {
                title: "💰 | Стартовый капитал",
                photo_id: "-109837093_457242809",
                description: "5.000.000$\nЦена: 20 баллов",
                buttons: [
                    [{
                        action: {
                            type: "callback",
                            payload: {
                                command: "buy",
                                args: ["start", 1],
                            },
                            label: "Обменять"
                        },
                    }]
                ]
            }
        ]
    })
    await msg.send({message: "🏛 | Обменник баллов", template: template})
}