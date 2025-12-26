// === 1. PRELOADER ===
window.addEventListener('load', () => {
    const progress = document.querySelector('.loader-progress');
    const preloader = document.getElementById('preloader');
    
    // Counter Animation
    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1;
        if(count > 100) count = 100;
        progress.innerText = count + '%';
        
        if(count === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger Text Scramble after load
                    triggerScramble();
                }, 500);
            }, 500);
        }
    }, 50);
});

// === 2. SMOOTH SCROLL (LENIS) ===
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// === 3. SPOTLIGHT EFFECT (MOUSE TRACKING) ===
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

// === 4. HACKER TEXT SCRAMBLE ===
function triggerScramble() {
    const element = document.querySelector('.scramble-text');
    const originalText = "Engineering \n The Abstract.";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iterations = 0;
    
    const interval = setInterval(() => {
        element.innerText = element.innerText.split("").map((letter, index) => {
            if(index < iterations) {
                return originalText[index];
            }
            return letters[Math.floor(Math.random() * 26)];
        }).join("");
        
        if(iterations >= originalText.length) {
            clearInterval(interval);
            element.innerText = originalText; // Fix final string
        }
        
        iterations += 1 / 2;
    }, 30);
}

// === 5. MAGNETIC BUTTONS ===
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// === 6. THREE.JS TERRAIN ===
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 1500;
const posArray = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25; // Wider spread
    if (i % 3 === 1) posArray[i] = (Math.random() - 0.5) * 8; // Y variation
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({
    size: 0.02, color: 0xffffff, transparent: true, opacity: 0.5
});
const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 6;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x = mouseY * 0.2;
    particlesMesh.rotation.z = mouseX * 0.2;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === 7. MENU & MODAL ===
const menuOverlay = document.getElementById('menu-overlay');
function toggleMenu() {
    menuOverlay.classList.toggle('active');
    if(menuOverlay.classList.contains('active')) lenis.stop();
    else lenis.start();
}
document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

const modal = document.getElementById('contact-modal');
function openModal() { modal.classList.add('active'); lenis.stop(); }
function closeModal() { modal.classList.remove('active'); lenis.start(); }
document.querySelectorAll('.open-contact-btn').forEach(btn => btn.addEventListener('click', openModal));
