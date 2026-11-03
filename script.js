const nav = document.getElementById('nav');
const menuBtn = document.querySelector('.menu-toggle');

function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
}

menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

document.querySelectorAll('.animate-link').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
        setMenu(false);
    });
});

(function () {
    const bar = document.getElementById('progress-bar');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
            ticking = false;
        });
    }, { passive: true });
})();

(function () {
    const field = document.querySelector('.hero-stars');
    if (!field) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
        const s = document.createElement('span');
        s.className = 'star';
        const size = Math.random() * 2 + 1;
        s.style.width = s.style.height = size.toFixed(1) + 'px';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 4 + 's';
        s.style.animationDuration = Math.random() * 3 + 3 + 's';
        frag.appendChild(s);
    }
    field.appendChild(frag);
})();

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const open = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
        answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0';
    });
});
