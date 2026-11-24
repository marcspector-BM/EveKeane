(function () {
    'use strict';

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mobileNav = window.matchMedia('(max-width: 860px)');

    const header = document.querySelector('header');
    const nav = document.getElementById('nav');
    const menuBtn = document.querySelector('.menu-toggle');
    const indicator = nav.querySelector('.nav-indicator');
    const bar = document.getElementById('progress-bar');
    const hero = document.querySelector('.hero');
    const heroStars = hero.querySelector('.hero-stars');
    const heroImage = hero.querySelector('.hero-image');
    const heroCover = hero.querySelector('.hero-cover');
    const heroText = hero.querySelector('.hero-text');

    /* ---------- Mobile menu ---------- */
    nav.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));

    function setMenu(open, focusToggle) {
        nav.classList.toggle('is-open', open);
        header.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (!open && focusToggle) menuBtn.focus();
    }
    const menuIsOpen = () => nav.classList.contains('is-open');

    menuBtn.addEventListener('click', () => setMenu(!menuIsOpen()));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuIsOpen()) setMenu(false, true); });
    document.addEventListener('click', e => { if (menuIsOpen() && !header.contains(e.target)) setMenu(false); });
    mobileNav.addEventListener('change', () => { setMenu(false); moveIndicator(); });

    /* ---------- Star fields ---------- */
    document.querySelectorAll('.star-field').forEach(field => {
        const count = Number(field.dataset.stars) || 40;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const s = document.createElement('span');
            const bright = Math.random() < 0.12;
            const size = bright ? 2.4 + Math.random() : 1 + Math.random() * 1.4;
            s.className = bright ? 'star is-bright' : 'star';
            s.style.width = s.style.height = size.toFixed(1) + 'px';
            s.style.left = (Math.random() * 100).toFixed(2) + '%';
            s.style.top = (Math.random() * 100).toFixed(2) + '%';
            s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
            s.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
            frag.appendChild(s);
        }
        field.appendChild(frag);
    });

    /* ---------- Scroll: progress, header, hero parallax, scroll spy ---------- */
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const linkFor = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const aliases = { reviews: 'praise' };
    const spySections = Array.from(document.querySelectorAll('main section[id]'));
    let current = null;

    function moveIndicator() {
        if (!current || mobileNav.matches) {
            indicator.classList.remove('is-visible');
            return;
        }
        const pad = parseFloat(getComputedStyle(current).paddingLeft) || 0;
        indicator.style.setProperty('--ix', (current.offsetLeft + pad) + 'px');
        indicator.style.setProperty('--iw', String(current.offsetWidth - pad * 2));
        indicator.classList.add('is-visible');
    }

    function spy() {
        const line = window.innerHeight * 0.35;
        let id = null;
        for (const s of spySections) {
            if (s.getBoundingClientRect().top <= line) id = s.id; else break;
        }
        const link = id ? linkFor.get(aliases[id] || id) || null : null;
        if (link === current) return;
        if (current) current.removeAttribute('aria-current');
        current = link;
        if (current) current.setAttribute('aria-current', 'true');
        moveIndicator();
    }

    let ticking = false;
    function onScroll() {
        const y = window.scrollY;
        const max = root.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4) + ')';
        header.classList.toggle('is-scrolled', y > 24);

        if (!reduceMotion.matches && y < window.innerHeight * 1.2) {
            heroStars.style.translate = '0 ' + (y * 0.35).toFixed(1) + 'px';
            heroCover.style.translate = '0 ' + (y * 0.12).toFixed(1) + 'px';
            heroText.style.translate = '0 ' + (y * 0.06).toFixed(1) + 'px';
            heroText.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)).toFixed(3));
        } else if (reduceMotion.matches) {
            heroStars.style.translate = heroCover.style.translate = heroText.style.translate = '';
            heroText.style.opacity = '';
        }
        spy();
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    }, { passive: true });
    window.addEventListener('resize', () => { moveIndicator(); onScroll(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
    onScroll();

    /* ---------- Hero: cover tilts toward the pointer, sky drifts ---------- */
    let tx = 0, ty = 0, cx = 0, cy = 0, tiltFrame = 0;

    function tiltStep() {
        tiltFrame = 0;
        cx += (tx - cx) * 0.09;
        cy += (ty - cy) * 0.09;
        heroCover.style.setProperty('--ry', (cx * 9).toFixed(2) + 'deg');
        heroCover.style.setProperty('--rx', (-cy * 7).toFixed(2) + 'deg');
        heroCover.style.setProperty('--mx', (50 + cx * 50).toFixed(1) + '%');
        heroCover.style.setProperty('--my', (50 + cy * 50).toFixed(1) + '%');
        heroStars.style.transform = 'translate(' + (cx * -14).toFixed(1) + 'px,' + (cy * -10).toFixed(1) + 'px)';
        if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) tiltFrame = requestAnimationFrame(tiltStep);
    }
    const queueTilt = () => { if (!tiltFrame) tiltFrame = requestAnimationFrame(tiltStep); };
    const clamp = v => Math.max(-1, Math.min(1, v));

    hero.addEventListener('pointermove', e => {
        if (!finePointer.matches || reduceMotion.matches) return;
        const r = heroCover.getBoundingClientRect();
        tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 1.4));
        ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 1.4));
        heroImage.classList.add('is-tilting');
        queueTilt();
    });
    hero.addEventListener('pointerleave', () => {
        tx = ty = 0;
        heroImage.classList.remove('is-tilting');
        queueTilt();
    });

    /* ---------- Hero: an occasional shooting star ---------- */
    let heroVisible = true;
    let shootTimer = 0;

    function scheduleShoot() {
        clearTimeout(shootTimer);
        if (reduceMotion.matches || !heroVisible || document.hidden || !heroStars.animate) return;
        shootTimer = setTimeout(shoot, 3500 + Math.random() * 6500);
    }
    function shoot() {
        const s = document.createElement('span');
        s.className = 'shooting-star';
        heroStars.appendChild(s);
        const w = hero.clientWidth, h = hero.clientHeight;
        const x = w * (0.35 + Math.random() * 0.6);
        const y = h * (0.08 + Math.random() * 0.3);
        const angle = 150 + Math.random() * 20;
        const dist = Math.max(220, w * 0.28);
        const rad = angle * Math.PI / 180;
        const dx = Math.cos(rad) * dist, dy = Math.sin(rad) * dist;
        const anim = s.animate([
            { transform: 'translate(' + x + 'px,' + y + 'px) rotate(' + angle + 'deg) scaleX(0.2)', opacity: 0 },
            { opacity: 1, offset: 0.2 },
            { transform: 'translate(' + (x + dx) + 'px,' + (y + dy) + 'px) rotate(' + angle + 'deg) scaleX(1)', opacity: 0 }
        ], { duration: 1200, easing: 'cubic-bezier(0.3, 0, 0.7, 1)' });
        anim.onfinish = anim.oncancel = () => { s.remove(); scheduleShoot(); };
    }

    /* ---------- Pause looping animation offscreen / in background tabs ---------- */
    if ('IntersectionObserver' in window) {
        const loopIO = new IntersectionObserver(entries => {
            entries.forEach(en => {
                en.target.classList.toggle('is-paused', !en.isIntersecting);
                if (en.target === hero) {
                    heroVisible = en.isIntersecting;
                    scheduleShoot();
                }
            });
        });
        document.querySelectorAll('.hero, .farthest').forEach(el => loopIO.observe(el));
    }
    document.addEventListener('visibilitychange', scheduleShoot);
    reduceMotion.addEventListener('change', () => { scheduleShoot(); onScroll(); });
    scheduleShoot();

    /* ---------- Scroll reveals (content stays visible without JS/IO) ---------- */
    const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
    if ('IntersectionObserver' in window && revealEls.length) {
        revealEls.forEach(el => {
            if (el.dataset.reveal === 'stagger') {
                Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 5)));
            }
        });

        // Wrap each word in spans, walking text nodes so inline markup (<cite>) survives.
        const splitWords = (el, masked) => {
            let n = 0;
            const walk = node => {
                Array.from(node.childNodes).forEach(child => {
                    if (child.nodeType === 1) { walk(child); return; }
                    if (child.nodeType !== 3 || !child.textContent.trim()) return;
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                        const word = document.createElement('span');
                        word.className = 'word';
                        word.style.setProperty('--w', Math.min(n++, 14));
                        if (masked) {
                            const inner = document.createElement('span');
                            inner.className = 'word-inner';
                            inner.textContent = part;
                            word.appendChild(inner);
                        } else {
                            word.textContent = part;
                        }
                        frag.appendChild(word);
                    });
                    child.replaceWith(frag);
                });
            };
            walk(el);
        };

        // Every section heading rises word by word out of a mask.
        document.querySelectorAll('main h2').forEach(h => {
            splitWords(h, true);
            h.dataset.reveal = 'words';
            if (!revealEls.includes(h)) revealEls.push(h);
        });
        // Quotes come into focus word by word.
        document.querySelectorAll('.farthest blockquote, .praise-lead').forEach(q => splitWords(q, false));
        // Excerpt paragraphs arrive one at a time, as if being read.
        document.querySelectorAll('.excerpt-text p').forEach(p => {
            p.dataset.reveal = 'line';
            revealEls.push(p);
        });

        const revealIO = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                en.target.classList.add('is-in');
                revealIO.unobserve(en.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

        // Anything already scrolled past (reload mid-page, deep link) shows at once.
        revealEls.forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-in');
            else revealIO.observe(el);
        });
        root.classList.add('js-reveal');
    }

    /* ---------- FAQ ---------- */
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const open = item.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(open));
        });
    });
})();
