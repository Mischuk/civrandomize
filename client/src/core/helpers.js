export function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export function compareInLC(string1, string2) {
    return string1.toLowerCase() === string2.toLowerCase();
}