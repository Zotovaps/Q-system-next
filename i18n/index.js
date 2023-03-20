var en = require("./en.json");
var ru = require("./ru.json");

const i18n = {
    translations: {
        en: en,
        ru: ru,
    },
    defaultLang: "ru",
    useBrowserDefault: true,
};

module.exports = i18n;