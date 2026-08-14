document.querySelectorAll('.animate-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('nav').classList.remove('is-open');
        const btn = document.querySelector('.menu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    });
});

function toggle() {
    const nav = document.getElementById('nav');
    const btn = document.querySelector('.menu-toggle');
    const open = nav.classList.toggle('is-open');
    if (btn) btn.setAttribute('aria-expanded', open);
}

(function() {
    const progressBar = document.getElementById('progress-bar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + '%';
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollTop > 400);
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    const heroStars = document.querySelector('.hero-stars');
    if (heroStars) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 28; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = size.toFixed(2) + 'px';
            star.style.height = size.toFixed(2) + 'px';
            star.style.left = (Math.random() * 100) + '%';
            star.style.top = (Math.random() * 100) + '%';
            star.style.animationDelay = (Math.random() * 4) + 's';
            star.style.animationDuration = (Math.random() * 3 + 2.5) + 's';
            fragment.appendChild(star);
        }
        heroStars.appendChild(fragment);
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const reveal = (selector, { offset = 30, stagger = 0, delay = 0 } = {}) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (el.closest('.hero')) return;
            el.classList.add('reveal');
            el.style.setProperty('--reveal-offset', offset + 'px');
            el.style.setProperty('--reveal-delay', (delay + i * stagger) + 's');
            observer.observe(el);
        });
    };

    reveal('section, .about-grid, .book-detail-grid, .newsletter-inner, .excerpt-card, .faq-list');
    reveal('.praise-card', { stagger: 0.12 });
    reveal('.about-text p, .book-detail-text p, .excerpt-text p', { offset: 20, stagger: 0.08 });
    reveal('.section-header, h1, h2, .section-label, .about-role, .faq-item', { offset: 20 });
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', isOpen);
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
    });
});