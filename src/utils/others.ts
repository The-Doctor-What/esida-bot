export async function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function sleep(second) {
    return new Promise(resolve => setTimeout(resolve, second * 1000))
}

export async function genCode() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 12;

    let code = "";

    for (let i = 0; i <= length; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        code += chars.substring(randomNumber, randomNumber + 1);
    }

    return code
}