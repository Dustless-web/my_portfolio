// === ANIME.JS V4 IMPORT (local ESM build) ===
import { animate, stagger, utils } from './lib/anime.esm.min.js';

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. PRELOADER
    // =========================================================
    const bar      = document.querySelector('.bar-fill');
    const preloader = document.getElementById('preloader');

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width > 100) width = 100;
        bar.style.width = width + '%';

        if (width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                // Animate preloader out with anime v4
                animate(preloader, {
                    opacity: 0,
                    duration: 600,
                    ease: 'outQuad',
                    onComplete() {
                        preloader.style.display = 'none';
                        triggerHeroEntrance();
                    }
                });
            }, 400);
        }
    }, 50);


    // =========================================================
    // 2. SMOOTH SCROLL (Lenis)
    // =========================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', ({ progress }) => {
        document.querySelector('.scroll-progress').style.width = `${progress * 100}%`;
    });

    // Logo → smooth scroll to top
    document.getElementById('logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });


    // =========================================================
    // 3. CUSTOM CURSOR
    // =========================================================
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorDot  = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-item, .menu-btn, .m-link, .menu-x-btn').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });


    // =========================================================
    // 4. HERO ENTRANCE (runs after preloader)
    // =========================================================
    function triggerHeroEntrance() {
        // Scramble the h1 text
        triggerScramble();

        // Nav bar slides in from top
        animate('.fixed-nav', {
            translateY: ['-100%', '0%'],
            opacity:    [0, 1],
            duration:   800,
            ease:       'outExpo',
        });

        // Hero meta tags stagger in
        animate('.hero-meta span', {
            translateY: [20, 0],
            opacity:    [0, 1],
            duration:   700,
            delay:      stagger(120, { start: 200 }),
            ease:       'outExpo',
        });

        // Hero paragraph
        animate('.hero-content p', {
            translateY: [30, 0],
            opacity:    [0, 1],
            duration:   800,
            delay:      600,
            ease:       'outExpo',
        });

        // CTA buttons
        animate('.hero-cta > *', {
            translateY: [20, 0],
            opacity:    [0, 1],
            duration:   700,
            delay:      stagger(120, { start: 750 }),
            ease:       'outExpo',
        });

        // Hero image fades in with scale
        animate('.hero-visual', {
            scale:    [0.92, 1],
            opacity:  [0, 1],
            duration: 1200,
            delay:    300,
            ease:     'outExpo',
        });
    }


    // =========================================================
    // 5. TEXT SCRAMBLE
    // =========================================================
    function triggerScramble() {
        const el    = document.querySelector('.scramble-text');
        if (!el) return;
        const final = "Engineering \n Intelligence.";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let iter = 0;
        const intv = setInterval(() => {
            el.innerText = final.split("").map((letter, index) => {
                if (index < iter) return final[index];
                return chars[Math.floor(Math.random() * 26)];
            }).join("");
            if (iter >= final.length) clearInterval(intv);
            iter += 1 / 2;
        }, 30);
    }


    // =========================================================
    // 6. SCROLL-TRIGGERED ANIMATIONS  (IntersectionObserver)
    // =========================================================

    // Helper — observe elements and fire anime once they enter viewport
    function onEnter(selector, animationFn) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animationFn(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        els.forEach(el => {
            el.style.opacity = '0'; // hide until animated
            observer.observe(el);
        });
    }

    // --- Section headers ---
    onEnter('.section-header', (el) => {
        animate(el.querySelectorAll('*'), {
            translateY: [40, 0],
            opacity:    [0, 1],
            duration:   900,
            delay:      stagger(100),
            ease:       'outExpo',
        });
        el.style.opacity = '1';
    });

    // --- Timeline rows ---
    onEnter('.timeline-row', (el) => {
        animate(el, {
            translateX: [-60, 0],
            opacity:    [0, 1],
            duration:   800,
            ease:       'outExpo',
        });
    });

    // --- Project cards ---
    onEnter('.project-item', (el) => {
        animate(el, {
            scale:    [0.94, 1],
            opacity:  [0, 1],
            duration: 750,
            ease:     'outExpo',
        });
    });

    // --- Marquee section ---
    onEnter('.marquee-wrap', (el) => {
        animate(el, {
            opacity:  [0, 1],
            duration: 800,
            ease:     'outQuad',
        });
    });

    // --- Footer ---
    onEnter('footer', (el) => {
        animate(el.querySelectorAll('.f-top > *, .f-col'), {
            translateY: [50, 0],
            opacity:    [0, 1],
            duration:   800,
            delay:      stagger(80),
            ease:       'outExpo',
        });
        el.style.opacity = '1';
    });


    // =========================================================
    // 7. UI LOGIC — MENU & MODAL
    // =========================================================
    const menuOverlay  = document.getElementById('menu-overlay');
    const menuBtn      = document.getElementById('menu-toggle');
    const menuClose    = document.getElementById('menu-close-btn');
    const menuCloseX   = document.getElementById('menu-close-x');
    const contactModal = document.getElementById('contact-modal');
    const modalClose   = document.querySelector('.modal-close');
    const contactBtns  = document.querySelectorAll('.open-contact-btn');

    let menuOpen = false;

    function openMenu() {
        menuOpen = true;
        menuOverlay.classList.add('active');
        lenis.stop();

        // Animate menu links in with stagger
        animate('.m-link', {
            translateX:  [60, 0],
            opacity:     [0, 1],
            duration:    700,
            delay:       stagger(80, { start: 100 }),
            ease:        'outExpo',
        });

        // Animate menu footer
        animate('.menu-footer', {
            translateY: [20, 0],
            opacity:    [0, 1],
            duration:   600,
            delay:      500,
            ease:       'outExpo',
        });
    }

    function closeMenu() {
        menuOpen = false;
        animate('.m-link', {
            translateX: [0, 60],
            opacity:    [1, 0],
            duration:   400,
            delay:      stagger(50),
            ease:       'inExpo',
            onComplete() {
                menuOverlay.classList.remove('active');
                lenis.start();
            }
        });
    }

    menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    menuClose.addEventListener('click', closeMenu);
    menuCloseX.addEventListener('click', closeMenu);
    document.querySelectorAll('.m-link').forEach(link => {
        link.addEventListener('click', () => {
            if (!link.classList.contains('open-contact-btn')) closeMenu();
        });
    });

    // Modal
    function openModal(e) {
        if (e) e.preventDefault();
        contactModal.classList.add('active');
        lenis.stop();
        if (menuOpen) closeMenu();

        animate('.c-link', {
            translateY: [30, 0],
            opacity:    [0, 1],
            duration:   600,
            delay:      stagger(80, { start: 200 }),
            ease:       'outExpo',
        });

        animate('.modal-top > *', {
            translateY: [20, 0],
            opacity:    [0, 1],
            duration:   500,
            delay:      stagger(80),
            ease:       'outExpo',
        });
    }

    function closeModal() {
        animate('.modal-content', {
            opacity:    [1, 0],
            scale:      [1, 0.96],
            duration:   300,
            ease:       'inQuad',
            onComplete() {
                contactModal.classList.remove('active');
                utils.set('.modal-content', { opacity: 1, scale: 1 });
                lenis.start();
            }
        });
    }

    contactBtns.forEach(btn => btn.addEventListener('click', openModal));
    modalClose.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });


    // =========================================================
    // 8. PROJECT DATA & OVERLAY
    // =========================================================
    const projectData = {
        'proj-1': {
            title: 'Smart Lecture Assistant',
            role:  'AI Engineer',
            stack: 'Python, OpenAI, Pinecone',
            desc:  'Autonomous NLP engine for university lectures. Uses Whisper for transcription and RAG for semantic search.',
            link:  'https://github.com/youruser/smart-lecture-assistant'
        },
        'proj-2': {
            title: 'FluxSync Engine',
            role:  'Systems Architect',
            stack: 'Go, gRPC, Kubernetes',
            desc:  'Distributed job scheduler handling 10k+ concurrent tasks with custom Raft Consensus.',
            link:  'https://github.com/youruser/fluxsync-engine'
        },
        'proj-3': {
            title: 'SGuardian',
            role:  'Mobile Engineer',
            stack: 'Kotlin, TensorFlow Lite',
            desc:  'Edge computing fall detection system running local inference on Android devices.',
            link:  'https://github.com/Dustless-web/SGuardian'
        },
        'proj-4': {
            title: 'Weather Wise',
            role:  'Full Stack',
            stack: 'Node.js, WebSockets',
            desc:  'Real-time weather tracker and lifestyle advisor.',
            link:  'https://github.com/Dustless-web/WeatherWise'
        }
    };

    const projectOverlay  = document.getElementById('project-overlay');
    const closeProjectBtn = document.getElementById('close-project-btn');

    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', () => {
            const data = projectData[item.id];
            if (!data) return;

            document.getElementById('overlay-title').innerText = data.title;
            document.getElementById('overlay-stack').innerText = data.stack;
            document.getElementById('overlay-desc').innerText  = data.desc;
            document.getElementById('overlay-link').href        = data.link;

            projectOverlay.classList.add('active');
            lenis.stop();

            // Animate overlay content in
            animate('.overlay-label, .overlay-content h2, .meta-item, .overlay-body, #overlay-link', {
                translateY: [40, 0],
                opacity:    [0, 1],
                duration:   700,
                delay:      stagger(80, { start: 200 }),
                ease:       'outExpo',
            });
        });
    });

    closeProjectBtn.addEventListener('click', () => {
        animate('.overlay-content', {
            translateY: [0, 40],
            opacity:    [1, 0],
            duration:   400,
            ease:       'inExpo',
            onComplete() {
                projectOverlay.classList.remove('active');
                utils.set('.overlay-content', { translateY: 0, opacity: 1 });
                lenis.start();
            }
        });
    });


    // =========================================================
    // 9. SPOTLIGHT EFFECT (unchanged)
    // =========================================================
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });


    // =========================================================
    // 10. PROJECT CARD HOVER POP
    // =========================================================
    document.querySelectorAll('.project-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            animate(card.querySelector('.p-icon'), {
                rotate:   [0, 15],
                scale:    [1, 1.25],
                duration: 300,
                ease:     'outBack',
            });
        });
        card.addEventListener('mouseleave', () => {
            animate(card.querySelector('.p-icon'), {
                rotate:   [15, 0],
                scale:    [1.25, 1],
                duration: 300,
                ease:     'outBack',
            });
        });
    });


    // =========================================================
    // 11. THREE.JS (unchanged)
    // =========================================================
    initThreeJS();
    initMenu3D();
});


// ─────────────────────────────────────────────────────────────
// THREE.JS — PARTICLE FIELD
// ─────────────────────────────────────────────────────────────
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene     = new THREE.Scene();
    const camera    = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    const geometry  = new THREE.BufferGeometry();
    const count     = 1200;
    const posArray  = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
        if (i % 3 === 1) posArray[i] = (Math.random() - 0.5) * 6;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size:        0.02,
        color:       0xffffff,
        transparent: true,
        opacity:     0.6,
        map:         createCircleTexture(),
        alphaTest:   0.5,
        depthWrite:  false
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth  - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.001;
        mesh.rotation.x = mouseY * 0.1;
        mesh.rotation.z = mouseX * 0.1;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


// ─────────────────────────────────────────────────────────────
// THREE.JS — MENU TORUS KNOT
// ─────────────────────────────────────────────────────────────
function initMenu3D() {
    const container = document.getElementById('menu-3d-container');
    const scene     = new THREE.Scene();
    const camera    = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 });
    const mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 4;

    let targetRotX = 0, targetRotY = 0;

    document.querySelectorAll('.m-link').forEach((link, idx) => {
        link.addEventListener('mouseenter', () => {
            targetRotX = (idx + 1) * 0.5;
            targetRotY = (idx + 1) * 0.5;
        });
    });

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.05;
        mesh.rotation.z += 0.005;

        if (container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        renderer.render(scene, camera);
    }
    animate();
}
