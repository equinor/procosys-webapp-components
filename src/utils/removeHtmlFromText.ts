export function removeHtmlFromText(text?: string): string {
    if (!text) return '';
    return text
        .replace(/<\/[^]>/gm, '\n')
        .replace(/<[^>]>/g, ' ')
        .trimStart();
}
