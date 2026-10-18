const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const overlay = document.createElement('span');
overlay.className = 'ascii-hover';
overlay.setAttribute('aria-hidden', 'true');
overlay.hidden = true;
document.body.append(overlay);

const glyphs = ' .:-=+*#%@';
let activeText: HTMLElement | null = null;
let frame = 0;

function textElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  if (target.closest('[aria-hidden="true"], canvas, svg, script, style')) return null;

  const hasText = (element: Element) => Boolean(element.textContent?.trim());
  const directText = Array.from(target.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (directText && hasText(target)) return target as HTMLElement;

  const parent = target.closest('a, button, h1, h2, h3, h4, p, span, label, li, small, strong, em, code, summary');
  return parent && hasText(parent) ? parent as HTMLElement : null;
}

function animateFrame() {
  const width = 11;
  const rows = Array.from({ length: 3 }, () =>
    Array.from({ length: width }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join(''),
  );
  overlay.textContent = rows.join('\n');
}

function stop() {
  activeText = null;
  overlay.hidden = true;
  window.clearInterval(frame);
}

document.addEventListener('pointerover', (event) => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const next = textElement(event.target);
  if (!next || next === activeText) return;
  activeText = next;
  overlay.hidden = false;
  animateFrame();
  window.clearInterval(frame);
  frame = window.setInterval(animateFrame, 90);
});

document.addEventListener('pointermove', (event) => {
  if (!activeText) return;
  overlay.style.left = `${event.clientX + 14}px`;
  overlay.style.top = `${event.clientY + 14}px`;
});

document.addEventListener('pointerout', (event) => {
  if (!activeText || !(event.target instanceof Node)) return;
  if (event.relatedTarget instanceof Node && activeText.contains(event.relatedTarget)) return;
  if (activeText.contains(event.target)) stop();
});

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) stop();
});
