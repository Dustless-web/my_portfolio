// Lenis smooth scroll
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis.stop();
}

// Three.js background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 1800;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 20;
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, opacity: 0.6, transparent: true });
const particles = new THREE.Points(geometry, material);
scene.add(particles);
camera.position.z = 5;

function animate() {
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Menu & Modal
const menu = document.getElementById('menu-overlay');
document.getElementById('menu-toggle').onclick = () => menu.classList.toggle('active');
document.querySelector('.menu-close').onclick = () => menu.classList.remove('active');

const modal = document.getElementById('contact-modal');
document.querySelectorAll('.open-contact-btn').forEach(btn =>
    btn.onclick = () => modal.classList.add('active')
);
document.querySelector('.modal-close').onclick = () => modal.classList.remove('active');
