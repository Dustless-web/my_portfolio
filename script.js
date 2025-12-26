document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. PRELOADER ===
    const bar = document.querySelector('.bar-fill');
    const preloader = document.getElementById('preloader');
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if(width > 100) width = 100;
        bar.style.width = width + '%';
        
        if(width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    triggerScramble();
                }, 500);
            }, 500);
        }
    }, 50);

    // === 2. SMOOTH SCROLL ===
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ({ progress }) => {
        document.querySelector('.scroll-progress').style.width = `${progress * 100}%`;
    });

    // === 3. CUSTOM CURSOR ===
    const cursor = document.getElementById('cursor');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorDot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

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

    document.querySelectorAll('a, button, .project-item, .menu-btn, .m-link').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // === 4. UI LOGIC (MENU & MODAL) ===
    const menuOverlay = document.getElementById('menu-overlay');
    const menuBtn = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close-btn');
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.querySelector('.modal-close');
    const contactBtns = document.querySelectorAll('.open-contact-btn');

    // Toggle Menu
    function toggleMenu() {
        menuOverlay.classList.toggle('active');
        if(menuOverlay.classList.contains('active')) lenis.stop(); else lenis.start();
    }
    menuBtn.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    document.querySelectorAll('.m-link').forEach(link => {
        link.addEventListener('click', () => {
            if(!link.classList.contains('open-contact-btn')) toggleMenu();
        });
    });

    // Modal
    function openModal(e) {
        if(e) e.preventDefault();
        contactModal.classList.add('active');
        lenis.stop();
        // Close menu if open
        if(menuOverlay.classList.contains('active')) menuOverlay.classList.remove('active');
    }
    function closeModal() {
        contactModal.classList.remove('active');
        lenis.start();
    }
    contactBtns.forEach(btn => btn.addEventListener('click', openModal));
    modalClose.addEventListener('click', closeModal);

    // === 5. PROJECT DATA & OVERLAYS ===
    const projectData = {
        'proj-1': { title: 'Smart Lecture Assistant', role: 'AI Engineer', stack: 'Python, OpenAI, Pinecone', desc: 'Autonomous NLP engine for university lectures. Uses Whisper for transcription and RAG for semantic search.', link: '#' },
        'proj-2': { title: 'FluxSync Engine', role: 'Systems Architect', stack: 'Go, gRPC, Kubernetes', desc: 'Distributed job scheduler handling 10k+ concurrent tasks with custom Raft Consensus.', link: '#' },
        'proj-3': { title: 'SGuardian', role: 'Mobile Engineer', stack: 'Kotlin, TensorFlow Lite', desc: 'Edge computing fall detection system running local inference on Android devices.', link: '#' },
        'proj-4': { title: 'LiveCode Collab', role: 'Full Stack', stack: 'Node.js, WebSockets', desc: 'Real-time collaborative code editor with Operational Transformation.', link: '#' }
    };

    const projectOverlay = document.getElementById('project-overlay');
    const closeProjectBtn = document.getElementById('close-project-btn');

    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', () => {
            const data = projectData[item.id];
            if(data) {
                document.getElementById('overlay-title').innerText = data.title;
                document.getElementById('overlay-stack').innerText = data.stack;
                document.getElementById('overlay-desc').innerText = data.desc;
                document.getElementById('overlay-link').href = data.link;
                projectOverlay.classList.add('active');
                lenis.stop();
            }
        });
    });

    closeProjectBtn.addEventListener('click', () => {
        projectOverlay.classList.remove('active');
        lenis.start();
    });

    // === 6. TEXT SCRAMBLE ===
    function triggerScramble() {
        const el = document.querySelector('.scramble-text');
        if(!el) return;
        const final = "Engineering \n Intelligence.";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let iter = 0;
        const interval = setInterval(() => {
            el.innerText = final.split("").map((letter, index) => {
                if(index < iter) return final[index];
                return chars[Math.floor(Math.random() * 26)];
            }).join("");
            if(iter >= final.length) clearInterval(interval);
            iter += 1/2;
        }, 30);
    }

    // === 7. SPOTLIGHT EFFECT ===
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // === 8. THREE.JS INITIALIZATION ===
    initThreeJS();
    initMenu3D();
});

// --- THREE.JS LOGIC ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 1200;
    const posArray = new Float32Array(count * 3);
    for(let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; 
        if (i % 3 === 1) posArray[i] = (Math.random() - 0.5) * 6; 
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.4 });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
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

// --- 3D MENU LOGIC ---
function initMenu3D() {
    const container = document.getElementById('menu-3d-container');
    const scene = new THREE.Scene();
    // Initially set size, but will resize when menu opens
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geometry, material);
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
        
        // Ensure renderer matches container if size changes
        if (container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
             camera.aspect = container.clientWidth / container.clientHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        renderer.render(scene, camera);
    }
    animate();
}
