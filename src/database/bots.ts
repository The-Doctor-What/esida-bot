import {VK} from "vk-io";
import {HearManager} from "@vk-io/hear";

export const vkUser = new VK({
    token: process.env.VK_USER_TOKEN
})
export const vkGroup = new VK({
    token: process.env.VK_GROUP_TOKEN
})

export const user = new HearManager()
export const group = new HearManager()

vkUser.updates.on('message_new', user.middleware)
vkGroup.updates.on('message_new', group.middleware)