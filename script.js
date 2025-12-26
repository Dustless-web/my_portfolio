// === 1. PRELOADER ===
window.addEventListener('load', () => {
    const bar = document.querySelector('.bar-fill');
    const preloader = document.getElementById('preloader');
    
    // Simulate Load
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
                    triggerScramble(); // Start text animation
                }, 500);
            }, 500);
        }
    }, 50);
});

// === 2. PROJECT DATA & OVERLAYS ===
const projectData = {
    'smart-lecture': {
        title: 'Smart Lecture Assistant',
        role: 'AI Engineer',
        stack: 'Python, OpenAI, Pinecone',
        desc: 'Built an autonomous NLP engine that ingests raw audio streams from university lectures. It uses Whisper for transcription and LangChain to chunk data into semantic vector embeddings. Students can query the system ("What did the professor say about X?") and receive context-aware answers via RAG pipelines.',
        link: '#'
    },
    'fluxsync': {
        title: 'FluxSync Engine',
        role: 'Systems Architect',
        stack: 'Go, gRPC, Kubernetes',
        desc: 'Designed a distributed job scheduler capable of handling 10,000+ concurrent tasks. Implemented a custom Raft Consensus algorithm to ensure fault tolerance across 5+ nodes. Optimized for low-latency using gRPC for inter-service communication.',
        link: '#'
    },
    'sguardian': {
        title: 'SGuardian',
        role: 'Mobile Engineer',
        stack: 'Kotlin, TensorFlow Lite',
        desc: 'A real-time edge computing solution for elderly care. The Android app runs a quantized TensorFlow Lite model directly on the device to analyze accelerometer data in real-time, detecting falls with 96% accuracy without needing cloud connectivity.',
        link: '#'
    }
};

function openProject(id) {
    const data = projectData[id];
    if(!data) return;
    
    document.getElementById('overlay-title').innerText = data.title;
    document.getElementById('overlay-stack').innerText = data.stack;
    document.getElementById('overlay-desc').innerText = data.desc;
    document.getElementById('overlay-link').href = data.link;
    
    document.getElementById('project-overlay').classList.add('active');
    lenis.stop(); // Stop background scroll
}

function closeProject() {
    document.getElementById('project-overlay').classList.remove('active');
    lenis.start();
}

// === 3. SMOOTH SCROLL (LENIS) ===
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Update Scroll Progress Bar
lenis.on('scroll', ({ progress }) => {
    document.querySelector('.scroll-progress').style.width = `${progress * 100}%`;
});

// === 4. THREE.JS TERRAIN ===
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

// === 5. UI LOGIC (Menus/Modals) ===
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

// === 7. REVEAL ON SCROLL ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-text, .work-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});
