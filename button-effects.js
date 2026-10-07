(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = 'button, a.nav-button, a.home-shortcut, a.launch-card, a.primary-button, a.ghost-button';
  const timers = new WeakMap();
  function feedback(event, centered = false) {
    if (reducedMotion.matches || (!centered && event.button !== 0)) return;
    const button = event.target.closest(selector);
    if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
    if (button.matches('#home [data-view], #departments [data-view]')) return;
    button.classList.add('button-feedback');
    button.classList.remove('button-feedback-playing');
    void button.offsetWidth;
    button.classList.add('button-feedback-playing');
    window.clearTimeout(timers.get(button));
    timers.set(button, window.setTimeout(() => button.classList.remove('button-feedback-playing'), 240));
    const bounds = button.getBoundingClientRect();
    const wave = document.createElement('span');
    const diameter = Math.hypot(bounds.width, bounds.height) * 2;
    wave.className = 'button-feedback-wave';
    wave.setAttribute('aria-hidden', 'true');
    Object.assign(wave.style, {
      width: `${diameter}px`, height: `${diameter}px`,
      left: `${centered ? bounds.width / 2 : event.clientX - bounds.left}px`,
      top: `${centered ? bounds.height / 2 : event.clientY - bounds.top}px`
    });
    button.append(wave);
    window.setTimeout(() => wave.remove(), 460);
  }
  document.addEventListener('pointerdown', event => feedback(event), { passive: true });
  document.addEventListener('click', event => { if (event.detail === 0) feedback(event, true); });
})();
