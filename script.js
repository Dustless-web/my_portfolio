// === 1. SMOOTH SCROLL (LENIS) ===
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

// === 2. THREE.JS COMPLEX TERRAIN ===
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Create Particles
const geometry = new THREE.BufferGeometry();
const count = 2000;
const posArray = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    // Spread X and Z wide, keep Y somewhat flat for a "floor" look
    posArray[i] = (Math.random() - 0.5) * 20; // X
    if (i % 3 === 1) posArray[i] = (Math.random() - 0.5) * 5; // Y (Height)
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material - clean white dots
const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 5;
camera.position.y = 1;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the entire field slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    
    // Tilt based on mouse
    particlesMesh.rotation.x = mouseY * 0.5;
    particlesMesh.rotation.z = mouseX * 0.5;

    // Wave effect
    // We can't easily modify buffer geometry positions in loop without big perf cost
    // So we rotate the camera/mesh to create movement feeling
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === 3. MENU & MODAL LOGIC ===
const menuOverlay = document.getElementById('menu-overlay');
function toggleMenu() {
    menuOverlay.classList.toggle('active');
    // Stop Lenis scrolling when menu is open
    if(menuOverlay.classList.contains('active')) {
        lenis.stop();
    } else {
        lenis.start();
    }
}
document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

// Contact Modal
const modal = document.getElementById('contact-modal');
document.querySelectorAll('.open-contact-btn').forEach(btn => {
    btn.addEventListener('click', openModal);
});

function openModal() {
    modal.classList.add('active');
    lenis.stop();
}

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
}

// === 4. ANIMATION REVEALS ===
// Simple Intersection Observer to fade in text
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-text, .timeline-row, .project-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});
