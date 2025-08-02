"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = getMessage;
const bundle_1 = require("@fluent/bundle");
const langneg_1 = require("@fluent/langneg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load .ftl files
const locales = ['en-US', 'ru-RU']; // Add more as needed
const bundles = new Map();
locales.forEach((locale) => {
    const ftlPath = path_1.default.join(__dirname, `${locale}.ftl`);
    const source = fs_1.default.readFileSync(ftlPath, 'utf-8');
    const resource = new bundle_1.FluentResource(source);
    const bundle = new bundle_1.FluentBundle(locale);
    bundle.addResource(resource);
    bundles.set(locale, bundle);
});
// Function to get message
function getMessage(userLocale, messageId, args) {
    var _a;
    const availableLocales = Array.from(bundles.keys());
    const negotiated = (0, langneg_1.negotiateLanguages)([userLocale], availableLocales, { defaultLocale: 'en-US' });
    const locale = (_a = negotiated[0]) !== null && _a !== void 0 ? _a : 'en-US';
    const bundle = bundles.get(locale);
    const message = bundle.getMessage(messageId);
    if (message && message.value) {
        return bundle.formatPattern(message.value, args);
    }
    return messageId; // Fallback
}
