// ══════════════════════════════════════════════════
// ELGIN CAFE — Awwwards-Level Animations (All Devices)
// Inspired by amrit-egg: ZERO mobile gates, universal animations
// ══════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL (requestAnimationFrame — works perfectly on mobile) ──
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ── CUSTOM CURSOR (auto-hidden on touch via CSS) ──
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0, cX = 0, cY = 0;

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
gsap.ticker.add(() => {
    cX += (mouseX - cX) * 0.15;
    cY += (mouseY - cY) * 0.15;
    gsap.set(cursor, { x: cX, y: cY });
});

document.querySelectorAll('a, button, .menu-item, .nav-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover-active'));
});

// ── CINEMATIC LOADER ──
const loaderTL = gsap.timeline({
    onComplete: () => {
        document.body.classList.remove('loading');
        initAnimations();
    }
});

loaderTL.to('.loader-text', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
    .to('.loader-text', { opacity: 0, y: -20, duration: 0.8, delay: 0.5, ease: "power3.in" })
    .to('#loader', { height: 0, duration: 1, ease: "expo.inOut" })
    .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.2")
    .fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")
    .fromTo('.hero-cta a', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.6")
    .fromTo('.hero-bg', { scale: 1.1 }, { scale: 1, duration: 2, ease: "power2.out" }, "-=2");

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    trigger: document.body,
    start: "50px top",
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
});

// ── MOBILE MENU ──
const menuBtn = document.getElementById('menu-btn');
const navLinksList = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        menuBtn.classList.toggle('active');
        if (navLinksList.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('active');
            menuBtn.classList.remove('active');
            lenis.start();
        });
    });
}

// ══════════════════════════════════════════════════
// ALL SCROLL ANIMATIONS — UNIVERSAL (NO WIDTH GATES)
// ══════════════════════════════════════════════════
function initAnimations() {

    // ── Hero Parallax ──
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // ── About Image: clipPath inset reveal (amrit-egg style) ──
    gsap.fromTo('.about-image', 
        { clipPath: 'inset(15%)' },
        { clipPath: 'inset(0%)', duration: 1.5, ease: 'expo.out',
          scrollTrigger: { trigger: '.about-image', start: 'top 80%' }
        }
    );

    // ── About Image Parallax ──
    gsap.to('.parallax-img', {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".about-image", start: "top bottom", end: "bottom top", scrub: true }
    });

    // ── Section Labels ──
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: "top 90%" },
            y: 20, opacity: 0, duration: 0.8, ease: "power3.out"
        });
    });

    // ── Section Titles ──
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 85%" },
            y: 50, opacity: 0, duration: 1.2, ease: "expo.out"
        });
    });

    // ── Body Texts ──
    gsap.utils.toArray('.body-text').forEach(text => {
        gsap.from(text, {
            scrollTrigger: { trigger: text, start: "top 85%" },
            y: 30, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // ── Text Links ──
    gsap.utils.toArray('.text-link').forEach(link => {
        gsap.from(link, {
            scrollTrigger: { trigger: link, start: "top 90%" },
            x: -20, opacity: 0, duration: 0.8, ease: "power3.out"
        });
    });

    // ── Menu Items Reveal ──
    gsap.utils.toArray('.menu-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            y: 40, opacity: 0, duration: 0.8, delay: i * 0.08, ease: "power3.out"
        });
    });

    // ── Menu Accordion: Ultra-Sensitive Auto-Reveal ──
    // This ensures that even if you scroll fast, the images pop open the moment they enter view.
    gsap.utils.toArray('.menu-item').forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: "top 85%", // Opens very early as it enters from the bottom
            once: true,       // Stays open once triggered
            onEnter: () => {
                item.classList.add('active');
            }
        });

        // Desktop also supports immediate hover for extra responsiveness
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.classList.add('active');
            }
        });
    });

    // ── Awwwards 3D Stacking Gallery ──
    const cards = gsap.utils.toArray('.gallery-card');
    
    // Animate text reveal when card becomes sticky
    cards.forEach(card => {
        gsap.to(card.querySelector('h3'), {
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
                trigger: card,
                start: "top 25%", // when it gets close to the top
                toggleActions: "play none none reverse"
            }
        });
    });

    // 3D Scale-down effect as next card stacks on top
    cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Last card doesn't scale

        // Scale down slightly as the NEXT card scrolls over it, with a very subtle fade to maintain photo vividness
        gsap.to(card, {
            scale: 0.9,
            filter: "brightness(0.8)", // Far less aggressive tint
            ease: "none",
            scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 80%", // when the next card starts pushing up
                end: "top 18%",   // right before the next card hits the sticky point
                scrub: true
            }
        });
    });

    // ── Contact Reveal ──
    gsap.from('.contact-info, .contact-map', {
        scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        y: 50, opacity: 0, duration: 1, stagger: 0.3, ease: "power3.out"
    });
}
