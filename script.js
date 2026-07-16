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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('section, .about-grid, .book-detail-grid, .newsletter-inner, .hero-inner, .excerpt-card, .praise-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.7s ease-out';
    observer.observe(el);
});

document.querySelectorAll('h1, h2, .hero-label, .section-label').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out 0.1s';
    observer.observe(el);
});
