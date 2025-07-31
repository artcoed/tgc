import { FluentBundle, FluentResource, FluentVariable } from '@fluent/bundle';
import { negotiateLanguages } from '@fluent/langneg';
import fs from 'fs';
import path from 'path';

// Load .ftl files
const locales = ['en-US', 'ru-RU']; // Add more as needed
const bundles: Map<string, FluentBundle> = new Map();

locales.forEach((locale) => {
    const ftlPath = path.join(__dirname, `${locale}.ftl`);
    const source = fs.readFileSync(ftlPath, 'utf-8');
    const resource = new FluentResource(source);
    const bundle = new FluentBundle(locale);
    bundle.addResource(resource);
    bundles.set(locale, bundle);
});

// Function to get message
export function getMessage(userLocale: string, messageId: string, args?: Record<string, FluentVariable>): string {
    const availableLocales = Array.from(bundles.keys());
    const negotiated = negotiateLanguages([userLocale], availableLocales, { defaultLocale: 'en-US' });
    const locale = negotiated[0] ?? 'en-US';
    const bundle = bundles.get(locale)!;
    const message = bundle.getMessage(messageId);
    if (message && message.value) {
        return bundle.formatPattern(message.value, args);
    }
    return messageId; // Fallback
}