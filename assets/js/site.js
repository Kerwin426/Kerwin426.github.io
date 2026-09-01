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

  const mapElement = document.querySelector('#travel-map');
  if (mapElement && typeof window.jsVectorMap === 'function') {
    const zh = mapElement.dataset.mapLanguage === 'zh';
    const places = [
      {
        name: zh ? '中国广州' : 'Guangzhou, China',
        coords: [23.1291, 113.2644],
        note: zh ? '现居城市 · 北纬 23.1291°，东经 113.2644°' : 'Current base · 23.1291° N, 113.2644° E'
      }
    ];

    try {
      const travelMap = new window.jsVectorMap({
        selector: '#travel-map',
        map: 'world',
        backgroundColor: 'transparent',
        draggable: true,
        zoomButtons: true,
        zoomOnScroll: false,
        showTooltip: true,
        markers: places,
        markerStyle: {
          initial: { r: 5, fill: '#0759a5', stroke: '#ffffff', strokeWidth: 1.6 },
          hover: { fill: '#004783', stroke: '#ffffff' }
        },
        regionStyle: {
          initial: { fill: '#d7dde0', stroke: '#f7f5f0', strokeWidth: 0.65 },
          hover: { fill: '#c5cdd1', fillOpacity: 1 }
        },
        onMarkerTooltipShow: (_event, tooltip, index) => {
          const place = places[index];
          if (place) tooltip.text(`${place.name} — ${place.note}`);
        }
      });

      let resizeFrame = 0;
      const resizeMap = () => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => travelMap.updateSize());
      };

      if ('ResizeObserver' in window) {
        const mapResizeObserver = new ResizeObserver(resizeMap);
        mapResizeObserver.observe(mapElement);
      } else {
        window.addEventListener('resize', resizeMap, { passive: true });
      }

      resizeMap();
      mapElement.classList.add('is-ready');
    } catch (_) {
      mapElement.classList.add('has-error');
    }
  }
})();
