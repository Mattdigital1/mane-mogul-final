/* Mane Mogul — interactions */
(function () {
  const doc = document.documentElement;

  // Page-load reveal
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const hero = document.querySelector('.hero');
    if (hero) requestAnimationFrame(() => hero.classList.add('in'));
  });

  // Page leave transition
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    const isInternal = href.endsWith('.html') || href === '/' || href.startsWith('./');
    const sameTarget = !a.target || a.target === '_self';
    if (!isInternal || !sameTarget || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 650);
  });

  // Sticky nav state
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Reveal on scroll (IntersectionObserver)
  const targets = document.querySelectorAll('.reveal, .line-reveal');
  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    targets.forEach(t => io.observe(t));
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  // Custom cursor
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function tick() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll('a, button, .service, .pkg, .slot, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // Hide broken images (graceful fallback to dark frame)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // Year stamp
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Calendar mock interactivity
  document.querySelectorAll('.cal-grid span:not(.head):not(.dim)').forEach(cell => {
    cell.addEventListener('click', () => {
      cell.parentElement.querySelectorAll('span.active').forEach(a => a.classList.remove('active'));
      cell.classList.add('active');
    });
  });
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      slot.parentElement.querySelectorAll('.slot').forEach(s => s.style.background = '');
      slot.style.background = 'var(--white)';
      slot.style.color = 'var(--black)';
    });
  });

  // Float labels for selects (and any field with values)
  document.querySelectorAll('.form select').forEach(sel => {
    const sync = () => sel.closest('.field')?.classList.toggle('filled', !!sel.value);
    sel.addEventListener('change', sync);
    sync();
  });

  // Form fake submit
  document.querySelectorAll('form[data-fake]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const old = btn.innerHTML;
        btn.innerHTML = '<span>Sent — Thank you</span>';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = old; btn.disabled = false; form.reset(); }, 2400);
      }
    });
  });
})();
