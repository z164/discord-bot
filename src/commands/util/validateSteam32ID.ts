export default function validateSteam32ID(steamID: string): false | number {
    if (isNaN(Number(steamID))) {
        return false;
    }
    return Number(steamID);
}
