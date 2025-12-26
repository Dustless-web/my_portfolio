// === 1. PRELOADER ===
window.addEventListener('load', () => {
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
});

// === 2. SMOOTH SCROLL ===
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

lenis.on('scroll', ({ progress }) => {
    document.querySelector('.scroll-progress').style.width = `${progress * 100}%`;
});

// === 3. PHOTO TILT & SPOTLIGHT ===
// Spotlight
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

// Photo Tilt
const glitchWrapper = document.querySelector('.glitch-wrapper');
const glitchCard = document.querySelector('.glitch-card');
if(glitchWrapper) {
    glitchWrapper.addEventListener('mousemove', (e) => {
        const rect = glitchWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRot = -((y - rect.height/2) / rect.height * 10);
        const yRot = (x - rect.width/2) / rect.width * 10;
        glitchCard.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    glitchWrapper.addEventListener('mouseleave', () => {
        glitchCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    });
}

// === 4. PROJECT OVERLAY LOGIC ===
const projectData = {
    'smart-lecture': { title: 'Smart Lecture Assistant', role: 'AI Engineer', stack: 'Python, OpenAI, Pinecone', desc: 'Autonomous NLP engine for university lectures. Uses Whisper for transcription and RAG for semantic search.', link: '#' },
    'fluxsync': { title: 'FluxSync Engine', role: 'Systems Architect', stack: 'Go, gRPC, Kubernetes', desc: 'Distributed job scheduler handling 10k+ concurrent tasks with custom Raft Consensus.', link: '#' },
    'sguardian': { title: 'SGuardian', role: 'Mobile Engineer', stack: 'Kotlin, TensorFlow Lite', desc: 'Edge computing fall detection system running local inference on Android devices.', link: '#' },
    'livecode': { title: 'LiveCode Collab', role: 'Full Stack', stack: 'Node.js, WebSockets', desc: 'Real-time collaborative code editor with Operational Transformation.', link: '#' }
};

function openProject(id) {
    const data = projectData[id];
    if(!data) return;
    document.getElementById('overlay-title').innerText = data.title;
    document.getElementById('overlay-stack').innerText = data.stack;
    document.getElementById('overlay-desc').innerText = data.desc;
    document.getElementById('overlay-link').href = data.link;
    document.getElementById('project-overlay').classList.add('active');
    lenis.stop();
}
function closeProject() {
    document.getElementById('project-overlay').classList.remove('active');
    lenis.start();
}

// === 5. THREE.JS TERRAIN ===
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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

// === 6. UI LOGIC ===
function toggleMenu() {
    const menu = document.getElementById('menu-overlay');
    menu.classList.toggle('active');
    if(menu.classList.contains('active')) lenis.stop(); else lenis.start();
}
document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

const modal = document.getElementById('contact-modal');
function openModal() { modal.classList.add('active'); lenis.stop(); }
function closeModal() { modal.classList.remove('active'); lenis.start(); }
document.querySelectorAll('.open-contact-btn').forEach(btn => btn.addEventListener('click', openModal));
document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-text, .work-item, .timeline-row').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

// Magnetic Buttons
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0px, 0px)');
});
