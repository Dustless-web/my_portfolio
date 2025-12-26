// === THREE.JS NEURAL NEXUS BACKGROUND ===

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Deeper, darker fog for the new palette
scene.fog = new THREE.FogExp2(0x050508, 0.03); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Define Colors based on CSS palette
const colorPrimary = 0x3b82f6; // Cyber Blue
const colorSecondary = 0x06b6d4; // Electric Cyan

// --- THE NEXUS GROUP ---
const nexusGroup = new THREE.Group();
scene.add(nexusGroup);

// 1. Central Core (Glowing Icosahedron)
const coreGeo = new THREE.IcosahedronGeometry(2.5, 1);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: colorPrimary,
    wireframe: true,
    transparent: true,
    opacity: 0.5
});
const core = new THREE.Mesh(coreGeo, coreMat);
nexusGroup.add(core);

// Inner solid core for extra glow
const innerGeo = new THREE.IcosahedronGeometry(1, 0);
const innerMat = new THREE.MeshBasicMaterial({ color: colorSecondary });
const innerCore = new THREE.Mesh(innerGeo, innerMat);
core.add(innerCore);


// 2. Satellite Nodes & Connections
const nodesCount = 30;
const nodesGeo = new THREE.BufferGeometry();
const linePositions = [];
const nodePositions = new Float32Array(nodesCount * 3);

for(let i = 0; i < nodesCount; i++) {
    // Create random spherical positions
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 5 + Math.random() * 5; // Distance from center

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    nodePositions[i*3] = x;
    nodePositions[i*3+1] = y;
    nodePositions[i*3+2] = z;

    // Create connection line from center (0,0,0) to this node point (x,y,z)
    linePositions.push(0,0,0);
    linePositions.push(x,y,z);
}

// Create Nodes (Points)
nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
const nodesMat = new THREE.PointsMaterial({
    size: 0.15,
    color: colorSecondary,
    transparent: true,
    opacity: 0.8
});
const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
nexusGroup.add(nodesMesh);

// Create Lines (Connections)
const linesGeo = new THREE.BufferGeometry().setFromPoints(
    linePositions.map(p => new THREE.Vector3(p, linePositions[p+1], linePositions[p+2]))
);
const linesMat = new THREE.LineBasicMaterial({ 
    color: colorPrimary,
    transparent: true, 
    opacity: 0.15
});
const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
nexusGroup.add(linesMesh);


// Positioning
camera.position.z = 12;

// Mouse Interaction variables
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(animate);

    // Rotate the entire nexus group slowly
    nexusGroup.rotation.y += 0.002;
    nexusGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1; // Gentle tilt

    // Counter-rotate inner core
    innerCore.rotation.y -= 0.01;

    // Subtle mouse influence
    nexusGroup.rotation.x += (mouseY - nexusGroup.rotation.x) * 0.05;
    nexusGroup.rotation.y += (mouseX - nexusGroup.rotation.y) * 0.05;

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === UI INTERACTION LOGIC ===

// Mobile Menu
const menuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

window.closeMenu = function() {
    menuBtn.classList.remove('active');
    navLinks.classList.remove('active');
}

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Modal Logic
const modal = document.getElementById("contact-modal");
document.querySelectorAll(".open-contact-btn").forEach(btn => 
    btn.onclick = () => { modal.classList.add("active"); document.body.style.overflow="hidden";}
);
document.querySelector(".close-btn").onclick = () => {
    modal.classList.remove("active"); document.body.style.overflow="auto";
};
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow="auto";
    }
}

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));
