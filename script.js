// ══════════════════════════════════════════════════
// ELGIN CAFE — Animation Engine
// GSAP + Lenis + ScrollTrigger, Universal (No Mobile Gates)
// ══════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// Set hero initial states via JS (not CSS) so content is visible if JS fails
gsap.set('.hero-eyebrow', { opacity: 0 });
gsap.set('.hero-title .line-one, .hero-title .line-two, .hero-title .line-three', { opacity: 0, y: 60 });
gsap.set('.hero-cta', { opacity: 0, y: 30 });

// ── LENIS SMOOTH SCROLL ──
let lenis;
try {
    lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    const rafFn = (time) => { lenis.raf(time); requestAnimationFrame(rafFn); };
    requestAnimationFrame(rafFn);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
} catch(e) {
    console.warn('Lenis failed, using native scroll:', e);
    lenis = { stop: () => {}, start: () => {} };
}

// ── CUSTOM CURSOR ──
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0, cX = 0, cY = 0;

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

gsap.ticker.add(() => {
    cX += (mouseX - cX) * 0.12;
    cY += (mouseY - cY) * 0.12;
    gsap.set(cursor, { x: cX, y: cY });
});

document.querySelectorAll('a, button, .menu-item, .gallery-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover-active'));
});

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    trigger: document.body,
    start: "60px top",
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
});

// ── MOBILE MENU ──
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
        navLinks.classList.contains('active') ? lenis.stop() : lenis.start();
    });

    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
            lenis.start();
        });
    });
}

// ══════════════════════════════════════════════════
// CINEMATIC LOADER
// ══════════════════════════════════════════════════
const loaderTL = gsap.timeline({
    onComplete: () => {
        document.body.classList.remove('loading');
        initScrollAnimations();
    }
});

loaderTL
    .to('.loader-label', {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
        from: { opacity: 0, y: 15 }
    })
    .to('.loader-text', {
        opacity: 1, y: 0, duration: 1.1, ease: "expo.out",
    }, "-=0.4")
    .to('.loader-bar', {
        width: '100%', duration: 1.0, ease: "power2.inOut"
    }, "-=0.5")
    .to('#loader', {
        height: 0, duration: 1.1, ease: "expo.inOut", delay: 0.2
    })
    // Hero entrance — staggered
    .to('.hero-eyebrow', {
        opacity: 1, y: 0, duration: 1, ease: "expo.out"
    }, "-=0.4")
    .to('.hero-title .line-one', {
        opacity: 1, y: 0, duration: 1.2, ease: "expo.out"
    }, "-=0.7")
    .to('.hero-title .line-two', {
        opacity: 1, y: 0, duration: 1.2, ease: "expo.out"
    }, "-=0.9")
    .to('.hero-title .line-three', {
        opacity: 1, y: 0, duration: 1.2, ease: "expo.out"
    }, "-=0.9")
    .to('.hero-cta', {
        opacity: 1, y: 0, duration: 1, ease: "expo.out"
    }, "-=0.7")
    .fromTo('.hero-bg', { scale: 1.08 }, {
        scale: 1, duration: 2.5, ease: "power2.out"
    }, "-=3");

// ══════════════════════════════════════════════════
// ALL SCROLL ANIMATIONS
// ══════════════════════════════════════════════════
function initScrollAnimations() {

    // ── Hero Parallax ──
    gsap.to('.hero-bg', {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // ── Section Labels ──
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: "top 88%" },
            y: 20, opacity: 0, duration: 0.9, ease: "power3.out"
        });
    });

    // ── Section Titles ──
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 85%" },
            y: 50, opacity: 0, duration: 1.3, ease: "expo.out"
        });
    });

    // ── Body Texts ──
    gsap.utils.toArray('.body-text').forEach(text => {
        gsap.from(text, {
            scrollTrigger: { trigger: text, start: "top 87%" },
            y: 25, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // ── Text Links ──
    gsap.utils.toArray('.text-link').forEach(link => {
        gsap.from(link, {
            scrollTrigger: { trigger: link, start: "top 90%" },
            x: -15, opacity: 0, duration: 0.9, ease: "power3.out"
        });
    });

    // ── About Image: clip-path reveal ──
    gsap.fromTo('.about-image',
        { clipPath: 'inset(12% 0% 12% 0%)' },
        {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6, ease: 'expo.out',
            scrollTrigger: { trigger: '.about-image', start: 'top 82%' }
        }
    );

    // ── About badge ──
    gsap.from('.about-badge', {
        scrollTrigger: { trigger: '.about-badge', start: 'top 90%' },
        x: -20, opacity: 0, duration: 1, ease: "expo.out"
    });

    // ── About Image Parallax ──
    gsap.to('.parallax-img', {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
            trigger: ".about-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // ── MANIFESTO: Word-by-word reveal ──
    const manifestoWords = gsap.utils.toArray('.m-word');

    gsap.to(manifestoWords, {
        scrollTrigger: {
            trigger: ".manifesto",
            start: "top 65%",
        },
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.07,
        ease: "expo.out",
    });

    // ── Stats Strip ──
    gsap.from('.stat', {
        scrollTrigger: { trigger: '.stats-strip', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out"
    });

    // ── Menu Items ──
    gsap.utils.toArray('.menu-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            y: 30, opacity: 0, duration: 0.7, delay: i * 0.06, ease: "power3.out"
        });

        // Auto-open on scroll (stays open)
        ScrollTrigger.create({
            trigger: item,
            start: "top 82%",
            once: true,
            onEnter: () => item.classList.add('active'),
        });

        // Desktop hover still works
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) item.classList.add('active');
        });
    });

    // ── Gallery: Stacking Cards ──
    const cards = gsap.utils.toArray('.gallery-card');

    cards.forEach((card) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 30%",
            toggleActions: "play none none reverse",
            onEnter: () => card.classList.add('card-active'),
            onLeaveBack: () => card.classList.remove('card-active'),
        });
    });

    // Scale-down as next card stacks
    cards.forEach((card, index) => {
        if (index === cards.length - 1) return;
        gsap.to(card, {
            scale: 0.92,
            filter: "brightness(0.75)",
            ease: "none",
            scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 80%",
                end: "top 15%",
                scrub: true
            }
        });
    });

    // ── Contact section ──
    gsap.from('.contact-info', {
        scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        y: 40, opacity: 0, duration: 1.1, ease: "power3.out"
    });

    gsap.from('.contact-map', {
        scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        y: 40, opacity: 0, duration: 1.1, delay: 0.2, ease: "power3.out"
    });

    // ── Footer ──
    gsap.from('.footer-inner', {
        scrollTrigger: { trigger: '.footer', start: 'top 85%' },
        y: 30, opacity: 0, duration: 1, ease: "power3.out"
    });
}
