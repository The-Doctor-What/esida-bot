import {getPasteUrl, PrivateBinClient} from "@agc93/privatebin";
import request from 'prequest'
import dedent from "dedent-js";

export async function getOnline(nick, server = 16) {
    return await request(`https://admin-tools.ru/vkbot/handler_log.php?func=check_onl&p=${process.env.ADMIN_TOOLS_TOKEN}&server=${server}&name=${nick}`)
}

export async function getAdminInfo(nick) {
    let info = await request(`https://seraphtech.site/api/v2/forum.getAdmins?nick=${nick}&id=&token=${process.env.SERAPH_TOKEN}`)
    if (!info.response[0]) return undefined
    return info.response[0]
}

export async function getStats(nick, server = 16) {
    return await request(`https://api.vprikol.dev/find?server=${server}&nick=${nick}&token=${process.env.VPRIKOL_TOKEN}`)
}

export async function getMembers(fraction_id, server = 16) {
    return await request(`https://api.vprikol.dev/find?server=${server}&fraction_id=${fraction_id}&token=${process.env.VPRIKOL_TOKEN}`)
}

export async function paste(text, header) {
    const eo = "```"
    const client = new PrivateBinClient("https://privatebin.net/");
    const result = await client.uploadContent(dedent`
        #${header}
        
        ${eo}bash
        ${text}
        ${eo}
    `, {
        uploadFormat: 'markdown',
        expiry: '1day'
    });
    return getPasteUrl(result);
}