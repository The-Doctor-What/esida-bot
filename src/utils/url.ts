import {vkUser} from "../database/bots";

export function isURL(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export async function getShortURL(url) {
    if (!isURL(url)) return false
    const short = await vkUser.api.utils.getShortLink({url: url})
    return `vk.cc/${short.key}`
}