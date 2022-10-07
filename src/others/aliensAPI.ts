export const request = require('prequest');
import Pastebin from 'pastebin-ts';

const pastebin = new Pastebin({
    'api_dev_key' : process.env.PASTEBIN_KEY,
    'api_user_name' : process.env.PASTEBIN_NAME,
    'api_user_password' : process.env.PASTEBIN_PASS
});


export async function getOnline(nick, server = 16) {
    return await request(`https://admin-tools.ru/vkbot/handler_log.php?func=check_onl&p=${process.env.ADMIN_TOOLS_TOKEN}&server=${server}&name=${nick}`)
}

export async function getAdminInfo(nick) {
    let info = await request(`https://seraphtech.site/api/v2/forum.getAdmins?nick=${nick}&id=&token=${process.env.SERAPH_TOKEN}`)
    if (!info.response[0]) return undefined
    return info.response[0]
}

export async function paste(text, header) {
    return await pastebin.createPaste({
        text: text,
        title: header,
    });
}