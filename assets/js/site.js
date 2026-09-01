(() => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  const chinese = document.documentElement.lang.startsWith('zh');

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem('site-theme', theme);
      } catch (_) {
        // Theme preference remains available for this visit.
      }
    }
    const dark = theme === 'dark';
    themeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? button.dataset.lightLabel : button.dataset.darkLabel);
      button.title = dark ? button.dataset.lightLabel : button.dataset.darkLabel;
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? (chinese ? '浅色' : 'Light') : (chinese ? '深色' : 'Dark');
    });
  };

  setTheme(root.dataset.theme || 'light');

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
