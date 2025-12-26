// === SIMPLIFIED HIGH-END 3D BACKGROUND ===

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Deep fog for that infinite void look
scene.fog = new THREE.FogExp2(0x000000, 0.03); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- THE NEURAL CORE (Single Hero Object) ---
// A complex wireframe structure that looks like a brain/network
const geometry = new THREE.IcosahedronGeometry(4, 2); // Detailed sphere
const material = new THREE.MeshBasicMaterial({ 
    color: 0xd4af37, // Gold
    wireframe: true,
    transparent: true,
    opacity: 0.15 
});

const neuralCore = new THREE.Mesh(geometry, material);
scene.add(neuralCore);

// Inner Core (Solid for contrast)
const innerGeo = new THREE.IcosahedronGeometry(2, 1);
const innerMat = new THREE.MeshBasicMaterial({
    color: 0x10b981, // Green Code Color
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const innerCore = new THREE.Mesh(innerGeo, innerMat);
neuralCore.add(innerCore); // Group them

// Particles around the core
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles wide
    posArray[i] = (Math.random() - 0.5) * 40; 
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// Positioning
camera.position.z = 10;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Constant Rotation
    neuralCore.rotation.y += 0.002;
    neuralCore.rotation.x += 0.001;
    innerCore.rotation.y -= 0.005; // Spin opposite way

    // Mouse Interaction (Smooth lerp)
    targetX = mouseX * 2;
    targetY = mouseY * 2;
    
    neuralCore.rotation.y += 0.05 * (targetX - neuralCore.rotation.y);
    neuralCore.rotation.x += 0.05 * (targetY - neuralCore.rotation.x);

    // Particle Wave Movement
    particlesMesh.rotation.y = -elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === UI LOGIC ===
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const modal = document.getElementById("contact-modal");
const openBtns = document.querySelectorAll(".open-contact-btn");
const closeBtn = document.querySelector(".close-btn");

// Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu function for links
window.closeMenu = function() {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
}

// Modal Logic
openBtns.forEach(btn => btn.onclick = () => { 
    modal.classList.add("active"); 
    document.body.style.overflow="hidden";
});

closeBtn.onclick = () => {
    modal.classList.remove("active"); 
    document.body.style.overflow="auto";
};

// Close on outside click
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow="auto";
    }
}
