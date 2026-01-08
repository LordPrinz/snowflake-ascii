export async function copyToClipboard(text: string, onSuccess?: () => void): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        if (onSuccess) {
            onSuccess();
        } else {
            console.log('Copied to clipboard!');
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

/**
 * Trims excess whitespace from ASCII art string.
 * Removes empty lines from start/end and trims trailing whitespace from lines.
 * Adjusts indentation to left-align the content.
 */
export function trimAsciiArt(text: string): string {
    const lines = text.split('\n');
    const trimmedRight = lines.map((line: string) => line.trimEnd());

    let start = 0;
    while (start < trimmedRight.length && trimmedRight[start]!.trim() === '') start++;

    let end = trimmedRight.length - 1;
    while (end >= 0 && trimmedRight[end]!.trim() === '') end--;

    if (start > end) return '';

    const finalLines = trimmedRight.slice(start, end + 1);

    let minIndent = Infinity;
    for (const line of finalLines) {
        if (line.trim().length > 0) {
            const currentIndent = line.search(/\S/);
            if (currentIndent !== -1 && currentIndent < minIndent) {
                minIndent = currentIndent;
            }
        }
    }

    if (minIndent !== Infinity && minIndent > 0) {
        for (let i = 0; i < finalLines.length; i++) {
            if (finalLines[i]!.length >= minIndent) {
                finalLines[i] = finalLines[i]!.slice(minIndent);
            }
        }
    }

    return finalLines.join('\n');
}

/**
 * Measures the width and height of a character for a given font family and size.
 * Used for calculating grid dimensions.
 */
export function measureTextMetrics(fontSize: number, fontFamily: string = "'Courier New', Courier, monospace"): { width: number, height: number } {
    const span = document.createElement('span');
    span.style.fontFamily = fontFamily;
    span.style.fontSize = `${fontSize}px`;
    span.style.lineHeight = `${fontSize}px`;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.textContent = 'M'.repeat(100);
    
    document.body.appendChild(span);
    const width = span.offsetWidth / 100;
    const height = span.offsetHeight;
    document.body.removeChild(span);

    return { width, height };
}
