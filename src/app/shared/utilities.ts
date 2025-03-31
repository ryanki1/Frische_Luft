export function replaceUmlauts(input: string) {
  const umlaut_ss = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss",
  };

  return input.replace(/[äöüÄÖÜß]/g, (char) => umlaut_ss[char as keyof typeof umlaut_ss]);
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
