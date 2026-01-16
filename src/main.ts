import { AsciiRenderer } from './rendering/AsciiRenderer';
import { SnowflakeGenerator } from './core/SnowflakeGenerator';
import type { NormalPoint } from './core/types';
import { copyToClipboard, measureTextMetrics, trimAsciiArt } from './utils';

const renderer = new AsciiRenderer('ascii-output');
const generator = new SnowflakeGenerator();

let mesh: NormalPoint[] = [];
let rotX = 0;
let rotY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let densityMultiplier = 1.7;

function regenerate(): void {
    mesh = generator.generate();
}

function updateSize(): void {
    const baseFontSize = 8;
    const newFontSize = baseFontSize / densityMultiplier;
    const { width: newCharW, height: newCharH } = measureTextMetrics(newFontSize);

    const asciiElement = document.getElementById('ascii-output');
    if (asciiElement) {
        asciiElement.style.fontSize = `${newFontSize}px`;
        asciiElement.style.lineHeight = `${newCharH || newFontSize}px`;
    }

    const cols = Math.floor(window.innerWidth / newCharW) - 1;
    const rows = Math.floor(window.innerHeight / (newCharH || newFontSize)) - 1;

    renderer.setSize(cols, rows);
}

function animate(): void {
    if (!isDragging) {
        const autoRotSpeed = 0.01;
        rotY += autoRotSpeed;
    }
    
    renderer.render(mesh, rotX, rotY);
    requestAnimationFrame(animate);
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Space') {
        regenerate();
    }
    if (e.code === 'KeyC') {
        const text = document.getElementById('ascii-output')?.textContent;
        if (!text) return;

        const finalText = trimAsciiArt(text);
        
        copyToClipboard(finalText, () => {
             const controls = document.getElementById('controls');
             const p = controls?.querySelector('p');
             if (p) {
                 const originalText = p.textContent;
                 p.textContent = "Copied to clipboard!";
                 setTimeout(() => {
                     if (p) p.textContent = originalText;
                 }, 2000);
             }
        });
    }
});

const asciiElement = document.getElementById('ascii-output');
if (asciiElement) {
    asciiElement.addEventListener('mousedown', (e: MouseEvent) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener('mouseup', () => isDragging = false);
    
    window.addEventListener('mousemove', (e: MouseEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            rotY -= deltaX * 0.01;
            rotX -= deltaY * 0.01;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
}

const densitySlider = document.getElementById('density-slider') as HTMLInputElement;
const sizeSlider = document.getElementById('size-slider') as HTMLInputElement;

if (densitySlider) {
    densityMultiplier = parseFloat(densitySlider.value) || 1.7;
    densitySlider.addEventListener('input', (e: Event) => {
        densityMultiplier = parseFloat((e.target as HTMLInputElement).value) || 1;
        updateSize();
    });
}

if (sizeSlider) {
    renderer.setZoom(70 - parseFloat(sizeSlider.value));
    sizeSlider.addEventListener('input', (e: Event) => {
        renderer.setZoom(70 - parseFloat((e.target as HTMLInputElement).value));
    });
}

window.addEventListener('load', () => {
    updateSize();
    regenerate();
    requestAnimationFrame(animate);
});
window.addEventListener('resize', updateSize);
