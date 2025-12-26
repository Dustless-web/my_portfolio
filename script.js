// === THREE.JS HIGH-END 3D BACKGROUND ===

// 1. SETUP SCENE
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002); // Deep fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
container.appendChild(renderer.domElement);

// 2. POST PROCESSING (BLOOM EFFECT - The "Expensive" Look)
const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1.2; // Intensity of glow
bloomPass.radius = 0;

const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// 3. CREATE PROCEDURAL MODELS

// --- OBJECT 1: THE NEURAL SPHERE (AI Project) ---
// A cloud of particles forming a brain/sphere
const sphereGeo = new THREE.IcosahedronGeometry(2, 4);
const sphereMat = new THREE.PointsMaterial({
    color: 0xd4af37, // Gold
    size: 0.02,
    transparent: true,
    opacity: 0.8
});
const aiSphere = new THREE.Points(sphereGeo, sphereMat);
scene.add(aiSphere);

// --- OBJECT 2: THE CYBER CORE (Systems Project) ---
// A complex wireframe structure
const coreGeo = new THREE.OctahedronGeometry(2, 0);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0x10b981, // Green
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const coreInnerGeo = new THREE.IcosahedronGeometry(1, 0);
const coreInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

const cyberCore = new THREE.Group();
cyberCore.add(new THREE.Mesh(coreGeo, coreMat));
cyberCore.add(new THREE.Mesh(coreInnerGeo, coreInnerMat));
scene.add(cyberCore);

// --- OBJECT 3: THE FLUID RING (Mobile Project) ---
// A torus knot
const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
const torusMat = new THREE.MeshBasicMaterial({ 
    color: 0x3b82f6, // Blue
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const mobileRing = new THREE.Mesh(torusGeo, torusMat);
scene.add(mobileRing);

// 4. POSITIONING LOGIC
// We place objects far apart on the Z axis
aiSphere.position.set(0, 0, -10); // Start hidden
cyberCore.position.set(0, 0, -20);
mobileRing.position.set(0, 0, -30);

// 5. LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 6. ANIMATION LOOP
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // ROTATIONS (Constant "Alive" movement)
    aiSphere.rotation.y += 0.002;
    aiSphere.rotation.x += 0.001;
    
    cyberCore.rotation.y -= 0.005;
    cyberCore.rotation.z += 0.002;
    
    mobileRing.rotation.x += 0.003;
    mobileRing.rotation.y += 0.003;

    // Pulse effect for Sphere
    const scale = 1 + Math.sin(time * 2) * 0.05;
    aiSphere.scale.set(scale, scale, scale);

    composer.render();
}
animate();

// 7. SCROLL INTERACTION (THE MAGIC PART)
// We move the objects based on scroll percentage
const sections = document.querySelectorAll('.scene-section');
const documentHeight = document.body.scrollHeight;
const windowHeight = window.innerHeight;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Calculate which section is active
    // This creates a "Timeline" effect where models fly in and out
    
    // Project 1 Logic (AI Sphere)
    // Moves from back to front, then disappears
    const p1Offset = scrollY * 0.01;
    aiSphere.position.z = -5 + p1Offset; 
    aiSphere.rotation.z = scrollY * 0.001;
    // Fade out logic could be added with materials, but Z-fog handles it mostly

    // Project 2 Logic (Cyber Core)
    const p2Start = windowHeight; 
    if (scrollY > p2Start * 0.5) {
        cyberCore.position.z = -15 + (scrollY - p2Start) * 0.015;
        cyberCore.position.x = Math.sin(scrollY * 0.001) * 2; // Spiral motion
    } else {
        cyberCore.position.z = -50; // Hide
    }

    // Project 3 Logic (Mobile Ring)
    const p3Start = windowHeight * 2;
    if (scrollY > p3Start * 0.5) {
        mobileRing.position.z = -15 + (scrollY - p3Start) * 0.015;
    } else {
        mobileRing.position.z = -50;
    }
});

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// === UI LOGIC (Menu & Modal) ===
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const modal = document.getElementById("contact-modal");
const openBtns = document.querySelectorAll(".open-contact-btn");
const closeBtn = document.querySelector(".close-btn");

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

openBtns.forEach(btn => btn.onclick = () => { 
    modal.classList.add("active"); 
    document.body.style.overflow="hidden";
});

closeBtn.onclick = () => {
    modal.classList.remove("active"); 
    document.body.style.overflow="auto";
};
