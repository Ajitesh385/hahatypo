const textSelector = [
  '.wordmark',
  '.theme-toggle',
  '.category-label',
  '.releases h1',
  '.product-section h2',
  '.product-title',
  '.product-description',
  '.product-price',
  '.about-link a',
].join(', ');
const characters = '#%*/\\+:.';
const canvas = document.createElement('canvas');
const contextCandidate = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (!contextCandidate) throw new Error('The shop ASCII overlay could not initialize its canvas.');
const context = contextCandidate;

canvas.className = 'shop-ascii-scribble';
canvas.setAttribute('aria-hidden', 'true');
document.body.append(canvas);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function clearOverlay() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawScribble(event: PointerEvent) {
  if (reducedMotion.matches || event.pointerType !== 'mouse') {
    clearOverlay();
    return;
  }
  const target = event.target;
  if (!(target instanceof Element) || !target.closest(textSelector)) {
    clearOverlay();
    return;
  }

  clearOverlay();
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
  context.font = '700 12px "IBM Plex Mono", monospace';
  context.fillStyle = color;
  context.globalAlpha = 0.68;
  for (let index = 0; index < 7; index += 1) {
    const x = event.clientX + (Math.random() - 0.5) * 36;
    const y = event.clientY + (Math.random() - 0.5) * 22;
    const character = characters[Math.floor(Math.random() * characters.length)];
    context.fillText(character, x, y);
  }
  context.globalAlpha = 1;
}

document.addEventListener('pointermove', drawScribble, { passive: true });
document.addEventListener('pointerleave', clearOverlay);
window.addEventListener('blur', clearOverlay);
window.addEventListener('resize', resizeCanvas, { passive: true });
reducedMotion.addEventListener('change', clearOverlay);
resizeCanvas();
