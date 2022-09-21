export const request = require('prequest');

export async function checkUserStats(nick, server = 16) {
    return await request(`https://api.vprikol.dev/find?nick=${nick}&server=${server}&token=${process.env.VPRIKOL_TOKEN}`);
}

export async function membersList(fraction, server = 16) {
    return await request(`https://api.vprikol.dev/members?server=${server}&fraction_id=${fraction}&token=${process.env.VPRIKOL_TOKEN}`)
}

export async function getOnline(nick, server = 16) {
    return await request(`https://admin-tools.ru/vkbot/handler_log.php?func=check_onl&p=${process.env.ADMIN_TOOLS_TOKEN}&server=${server}&name=${nick}`)
}

export async function getAdminInfo(nick) {
    let info = await request(`https://seraphtech.site/api/v2/forum.getAdmins?nick=${nick}&id=&token=${process.env.SERAPH_TOKEN}`)
    if (!info.response[0]) return undefined
    return info.response[0]
}