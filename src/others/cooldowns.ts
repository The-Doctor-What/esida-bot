import {devId, userid} from "../database";

const cooldowns: {user: number, start: number}[] = [];
const cooldownTime = 3000;

export function checkCooldown (user: number): boolean {
    if (user === devId) return true;
    else if (user === userid) return false;

    const cooldownData = cooldowns.filter(c => c.user === user)[0];
    if (cooldownData) {
        if (Date.now() < cooldownData.start + cooldownTime) {
            return false
        }
    }

    const newCooldownData = cooldownData || {
        user,
        start: 0
    };

    if (!cooldownData) cooldowns.push(newCooldownData);
    newCooldownData.start = Date.now();

    return true;
}