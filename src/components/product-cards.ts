const textureCharacters = ['.', ':', '+', "'", '`'];

function seedFrom(value: string) {
  let seed = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    seed = Math.imul(seed ^ value.charCodeAt(index), 16777619);
  }
  return seed >>> 0;
}

function randomFor(initialSeed: number) {
  let seed = initialSeed;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const textureObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const card = entry.target as HTMLAnchorElement;
    const texture = card.querySelector<HTMLCanvasElement>('.card-texture');
    const context = texture?.getContext('2d');
    if (texture && context) {
      context.font = '8px monospace';
      context.fillStyle = 'rgba(128,128,128,0.42)';
      const random = randomFor(seedFrom(card.dataset.productId ?? ''));
      for (let y = 8; y < texture.height; y += 12) {
        for (let x = 4; x < texture.width; x += 9) {
          if (random() > 0.42) {
            context.fillText(textureCharacters[Math.floor(random() * textureCharacters.length)], x, y);
          }
        }
      }
    }

    const alternate = card.querySelector<HTMLImageElement>('.product-image-alt');
    const alternateSource = alternate?.dataset.src;
    if (alternate && alternateSource) {
      alternate.addEventListener('load', () => card.classList.add('is-alt-ready'), { once: true });
      alternate.addEventListener('error', (error) => {
        console.error(`Unable to preload the alternate image for ${card.dataset.productId ?? 'a product'}.`, error);
      }, { once: true });
      alternate.src = alternateSource;
      delete alternate.dataset.src;
    }
    observer.unobserve(card);
  }
}, { rootMargin: '180px 0px' });

document.querySelectorAll<HTMLAnchorElement>('[data-product-card]').forEach((card) => {
  textureObserver.observe(card);
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const card = target.closest<HTMLAnchorElement>('[data-product-card]');
  if (!card || !matchMedia('(hover: none), (pointer: coarse)').matches) return;

  if (!card.classList.contains('is-touched')) {
    event.preventDefault();
    document.querySelectorAll('[data-product-card].is-touched').forEach((item) => {
      item.classList.remove('is-touched');
    });
    card.classList.add('is-touched');
  } else {
    card.classList.remove('is-touched');
  }
});
