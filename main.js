// =====================================
// SYED JAVID PORTFOLIO — MAIN JS
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNav();
    initScrollReveal();
    initCounters();
    initTypingAnimation();
    initActiveNav();
    initSmoothScroll();
});

// ─── NAVIGATION ───
function initNav() {
    const nav = document.querySelector('.nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ─── ACTIVE NAV LINK ───
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(s => observer.observe(s));
}

// ─── SMOOTH SCROLL ───
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ─── SCROLL REVEAL ───
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

// ─── COUNTER ANIMATION ───
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const animateCount = (el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = prefix + target.toLocaleString() + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(c => observer.observe(c));
}

// ─── TYPING ANIMATION ───
function initTypingAnimation() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
        'products people actually use.',
        'experiences that scale.',
        'tools that reduce friction.',
        'systems with real impact.',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    const type = () => {
        const phrase = phrases[phraseIdx];

        if (!deleting) {
            el.textContent = phrase.slice(0, charIdx + 1);
            charIdx++;

            if (charIdx === phrase.length) {
                deleting = true;
                clearTimeout(pauseTimer);
                pauseTimer = setTimeout(type, 2000);
                return;
            }
        } else {
            el.textContent = phrase.slice(0, charIdx - 1);
            charIdx--;

            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }

        setTimeout(type, deleting ? 40 : 70);
    };

    setTimeout(type, 800);
}

// ─── HERO SCROLL BUTTON ───
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
});

// ─── CARD TILT EFFECT ───
function initTilt() {
    const cards = document.querySelectorAll('.impact-card, .skill-group');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

window.addEventListener('load', () => {
    initTilt();
    // Stagger hero elements in
    const heroEls = document.querySelectorAll('.hero-animate');
    heroEls.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.12}s`;
        el.classList.add('hero-in');
    });
});

// ─── UX LOADER ───
function initLoader() {
    const loader = document.getElementById('ux-loader');
    if (!loader) return;

    const bar = loader.querySelector('.loader-bar');
    const text = document.getElementById('loader-text');

    // Session aware - only run once per session
    if (sessionStorage.getItem('sj_portfolio_loaded')) {
        loader.style.display = 'none';
        document.body.classList.remove('locked');
        return;
    }

    // Define the fast boot sequence
    const steps = [
        { progress: 20, text: 'Fetching Assets...', delay: 100 },
        { progress: 60, text: 'Compiling UX...', delay: 400 },
        { progress: 90, text: 'Optimizing Delivery...', delay: 700 },
        { progress: 100, text: 'System Ready', delay: 1000 }
    ];

    steps.forEach(step => {
        setTimeout(() => {
            bar.style.width = `${step.progress}%`;
            text.textContent = step.text;
        }, step.delay);
    });

    // Fade out loader and unlock scroll after sequence
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('locked');
        sessionStorage.setItem('sj_portfolio_loaded', 'true');
    }, 1300);
}
