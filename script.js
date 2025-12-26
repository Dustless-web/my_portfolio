document.addEventListener('DOMContentLoaded', () => {
    
    console.log("WARP DRIVE ACTIVE - V99"); // Look for this in Console (F12)

    // Global Speed Variable
    window.warpSpeed = 0.05; 
    window.targetWarpSpeed = 0.05;

    // === 1. PRELOADER ===
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.bar-fill');
    if(preloader) {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 10;
            if(width > 100) width = 100;
            if(bar) bar.style.width = width + '%';
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
    }

    // === 2. SMOOTH SCROLL ===
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ({ progress }) => {
        const progBar = document.querySelector('.scroll-progress');
        if(progBar) progBar.style.width = `${progress * 100}%`;
    });

    // === 3. UI LOGIC ===
    const menuOverlay = document.getElementById('menu-overlay');
    const menuBtn = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close-btn');
    
    function toggleMenu() {
        if(!menuOverlay) return;
        const isActive = menuOverlay.classList.contains('active');
        if (isActive) {
            menuOverlay.classList.remove('active');
            lenis.start(); 
            window.targetWarpSpeed = 0.05; // Reset warp on close
        } else {
            menuOverlay.classList.add('active');
            lenis.stop(); 
        }
    }

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(menuClose) menuClose.addEventListener('click', toggleMenu);

    document.querySelectorAll('.m-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                toggleMenu();
                lenis.scrollTo(targetId);
            }
        });
    });

    // === 4. MODAL LOGIC ===
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.querySelector('.modal-close');
    function openModal() {
        if(contactModal) {
            contactModal.classList.add('active');
            lenis.stop();
            if(menuOverlay && menuOverlay.classList.contains('active')) menuOverlay.classList.remove('active');
        }
    }
    function closeModal() {
        if(contactModal) {
            contactModal.classList.remove('active');
            lenis.start();
        }
    }
    document.querySelectorAll('.open-contact-btn').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    if(modalClose) modalClose.addEventListener('click', closeModal);

    // === 5. CURSOR ===
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if(cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`; });
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // === 6. INITIALIZE 3D ===
    initWarpStars();  // Background
    initHeavyRocket(); // Menu
});

// --- HELPER ---
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

// --- 3D BACKGROUND: WARP STARFIELD ---
function initWarpStars() {
    const container = document.getElementById('canvas-container');
    if(!container) return;
    
    // Clear old
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    
    for(let i=0; i<starCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 100; // X
        posArray[i*3+1] = (Math.random() - 0.5) * 100; // Y
        posArray[i*3+2] = (Math.random() - 0.5) * 100; // Z
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07 });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);
    
    camera.position.z = 1;

    function animate() {
        requestAnimationFrame(animate);
        
        // ACCELERATE when interacting
        window.warpSpeed += (window.targetWarpSpeed - window.warpSpeed) * 0.05;

        const positions = starGeo.attributes.position.array;
        for(let i=0; i<starCount; i++) {
            // Move stars forward (Warp Effect)
            positions[i*3+2] += window.warpSpeed; 
            
            // Reset if behind camera
            if(positions[i*3+2] > 10) {
                positions[i*3+2] = -100; 
                positions[i*3] = (Math.random() - 0.5) * 80;
                positions[i*3+1] = (Math.random() - 0.5) * 80;
            }
        }
        starGeo.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 3D MENU: HEAVY LIFTER ROCKET ---
function initHeavyRocket() {
    const container = document.getElementById('menu-3d-container');
    if(!container) return;

    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // === BUILD ROCKET (CYAN COLOR TO CONFIRM CHANGE) ===
    const rocket = new THREE.Group();
    // Using CYAN (0x00ffff) wireframe to prove code update
    const mat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const hullMat = new THREE.LineBasicMaterial({ color: 0x0088aa, transparent: true, opacity: 0.3 });

    // 1. Fuselage
    const bodyGeo = new THREE.CylinderGeometry(0.7, 1, 4.5, 16, 4, true);
    const bodyWire = new THREE.WireframeGeometry(bodyGeo);
    const body = new THREE.LineSegments(bodyWire, mat);
    rocket.add(body);

    // 2. Nose
    const noseGeo = new THREE.ConeGeometry(0.7, 1.5, 16, 2, true);
    const noseWire = new THREE.WireframeGeometry(noseGeo);
    const nose = new THREE.LineSegments(noseWire, mat);
    nose.position.y = 3;
    rocket.add(nose);

    // 3. Engine Cluster (Heavy)
    for(let i = 0; i < 4; i++) {
        const engineGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.2, 12);
        const engineWire = new THREE.WireframeGeometry(engineGeo);
        const engine = new THREE.LineSegments(engineWire, mat);
        
        const angle = (Math.PI / 2) * i;
        engine.position.x = Math.cos(angle) * 0.6;
        engine.position.z = Math.sin(angle) * 0.6;
        engine.position.y = -2.8;
        rocket.add(engine);
    }

    // 4. Large Swept Fins
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.8, -2.5);
    finShape.lineTo(1.8, -3.5);
    finShape.lineTo(0.8, -2.5);
    finShape.lineTo(0, 0);
    const finGeo = new THREE.ShapeGeometry(finShape);
    const finWireGeo = new THREE.WireframeGeometry(finGeo);

    for(let i = 0; i < 4; i++) {
        const fin = new THREE.LineSegments(finWireGeo, hullMat);
        const finGroup = new THREE.Group();
        finGroup.rotation.y = (Math.PI / 2) * i;
        fin.position.x = 0.8;
        fin.position.y = -0.5;
        finGroup.add(fin);
        rocket.add(finGroup);
    }

    scene.add(rocket);
    rocket.scale.set(1.8, 1.8, 1.8); // BIGGER

    camera.position.z = 10;
    rocket.rotation.z = Math.PI / 4;
    rocket.rotation.y = -Math.PI / 4;

    // Interaction Variables
    let targetRotX = 0;
    let targetRotY = -Math.PI / 4;
    let targetPosZ = 0; // Forward movement

    // Link Interaction
    document.querySelectorAll('.m-link').forEach((link, idx) => {
        link.addEventListener('mouseenter', () => {
            // WARP SPEED UP
            window.targetWarpSpeed = 0.8 + (idx * 0.2); // Super fast

            // ROCKET PITCHES FORWARD
            targetRotX = (idx * 0.2); 
            targetRotY = -Math.PI / 2 + (idx * 0.1);
            
            // ROCKET MOVES CLOSER (Simulates moving forward)
            targetPosZ = 2 + (idx * 0.5); 
        });
    });

    const menuArea = document.querySelector('.menu-links');
    if(menuArea) {
        menuArea.addEventListener('mouseleave', () => {
            window.targetWarpSpeed = 0.05; // Slow down
            targetRotX = 0;
            targetRotY = -Math.PI / 4;
            targetPosZ = 0;
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Physics Interpolation
        rocket.rotation.z += (targetRotX - rocket.rotation.z + Math.PI / 4) * 0.05;
        rocket.rotation.y += (targetRotY - rocket.rotation.y) * 0.05;
        rocket.position.z += (targetPosZ - rocket.position.z) * 0.05; // Move Forward
        
        // Engine Rumble
        rocket.position.x = (Math.random() - 0.5) * 0.02;
        rocket.position.y = (Math.random() - 0.5) * 0.02;

        // Resize
        if (container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
             camera.aspect = container.clientWidth / container.clientHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(container.clientWidth, container.clientHeight);
        }

        renderer.render(scene, camera);
    }
    animate();
}
