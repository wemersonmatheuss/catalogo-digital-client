function quad(t: number, start: number, control: number, end: number): number {
  const rest = 1 - t;
  return rest * rest * start + 2 * rest * t * control + t * t * end;
}

export function flyProductToCart(source: HTMLElement, imageUrl: string): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const target = document.querySelector('.bag-link');
  if (!target || !imageUrl) {
    return;
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const startX = from.left;
  const startY = from.top;
  const originX = from.left + from.width / 2;
  const originY = from.top + from.height / 2;
  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;
  const controlX = originX + (endX - originX) * 0.4;
  const controlY = Math.min(originY, endY) - 70;

  const ghost = document.createElement('img');
  ghost.src = imageUrl;
  ghost.alt = '';
  ghost.className = 'fly-to-cart';
  ghost.style.left = `${startX}px`;
  ghost.style.top = `${startY}px`;
  ghost.style.width = `${from.width}px`;
  ghost.style.height = `${from.height}px`;
  document.body.appendChild(ghost);

  const sourcePulse = source.animate(
    [
      { filter: 'brightness(1)', offset: 0 },
      { filter: 'brightness(1.15) saturate(0.7)', offset: 0.28 },
      { filter: 'brightness(1)', offset: 1 },
    ],
    { duration: 520, easing: 'ease-out' },
  );

  const gather = 0.38;
  const keyframes: Keyframe[] = [
    {
      transform: 'translate(0, 0) scale(1, 1) rotate(0deg)',
      borderRadius: '10px',
      opacity: 1,
      offset: 0,
    },
    {
      transform: 'translate(0, 0) scale(0.78, 0.42) rotate(-3deg)',
      borderRadius: '18px',
      opacity: 1,
      offset: 0.18,
    },
    {
      transform: 'translate(0, 0) scale(0.2) rotate(6deg)',
      borderRadius: '50%',
      opacity: 1,
      offset: gather,
    },
  ];

  const flightFrames = 7;
  for (let index = 1; index <= flightFrames; index += 1) {
    const t = index / flightFrames;
    const x = quad(t, originX, controlX, endX) - originX;
    const y = quad(t, originY, controlY, endY) - originY;
    const scale = 0.2 * (1 - t) + 0.04 * t;
    const rotate = 6 + t * 18;
    const opacity = t < 0.82 ? 1 : 1 - (t - 0.82) / 0.18;
    keyframes.push({
      transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
      borderRadius: '50%',
      opacity,
      offset: gather + (1 - gather) * t,
    });
  }

  const motion = ghost.animate(keyframes, {
    duration: 780,
    easing: 'cubic-bezier(0.45, 0, 0.2, 1)',
    fill: 'forwards',
  });

  const finish = () => {
    ghost.remove();
    sourcePulse.cancel();
    target.classList.remove('bump');
    void target.getBoundingClientRect();
    target.classList.add('bump');
  };

  motion.onfinish = finish;
  window.setTimeout(() => {
    if (ghost.isConnected) {
      finish();
    }
  }, 1100);
}
