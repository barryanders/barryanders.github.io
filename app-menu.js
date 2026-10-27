document.querySelectorAll('.gb-app-menu').forEach(menu => {
  const summary = menu.querySelector('summary');
  const tray = menu.querySelector('.gb-app-tray');
  let animation;
  let expanded = menu.open;
  const setExpanded = next => {
    if (next === expanded) return;
    expanded = next;
    const wasOpen = menu.open;
    const current = wasOpen ? getComputedStyle(tray) : null;
    const from = current
      ? { opacity: current.opacity, transform: current.transform }
      : { opacity: 0, transform: 'translateY(-10px) scale(.98)' };
    if (animation) animation.cancel();
    menu.open = true;
    menu.classList.toggle('is-closing', !next);
    tray.inert = !next;
    const to = next
      ? { opacity: 1, transform: 'translateY(0) scale(1)' }
      : { opacity: 0, transform: 'translateY(-10px) scale(.98)' };
    animation = tray.animate([from, to], {
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
      fill: 'both'
    });
    animation.onfinish = () => {
      menu.open = expanded;
      menu.classList.remove('is-closing');
      animation.cancel();
      animation = null;
    };
  };
  summary.addEventListener('click', event => {
    event.preventDefault();
    setExpanded(!expanded);
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) || event.target.closest('a')) setExpanded(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expanded) {
      setExpanded(false);
      summary.focus();
    }
  });
});
