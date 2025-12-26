document.addEventListener('DOMContentLoaded', () => {
    
    console.log("SYSTEM READY - STICKMAN ONLINE"); 

    // Global Speed Variable (kept for starfield)
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
            window.targetWarpSpeed = 0.05; // Reset stars on close
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
            if(link.classList.contains('open-contact-btn')) return;
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
    initWarpStars();  // Main Background
    initMenuStickman(); // NEW: Stickman in Menu
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

// --- 3D BACKGROUND: WARP STARFIELD (MAIN PAGE) ---
function initWarpStars() {
    const container = document.getElementById('canvas-container');
    if(!container) return;
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 100; 
        posArray[i*3+1] = (Math.random() - 0.5) * 100;
        posArray[i*3+2] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07 });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);
    camera.position.z = 1;

    function animate() {
        requestAnimationFrame(animate);
        window.warpSpeed += (window.targetWarpSpeed - window.warpSpeed) * 0.05;
        const positions = starGeo.attributes.position.array;
        for(let i=0; i<starCount; i++) {
            positions[i*3+2] += window.warpSpeed; 
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

// --- 3D MENU: STICKMAN CHARACTER ---
function initMenuStickman() {
    const container = document.getElementById('menu-3d-container');
    if(!container) return;
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // === 1. ADD MENU STARS BG ===
    const starGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(1000 * 3);
    for(let i=0; i<1000; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 150;
        posArray[i*3+1] = (Math.random() - 0.5) * 150;
        posArray[i*3+2] = (Math.random() - 0.5) * 150;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.05, transparent: true, opacity: 0.5 });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);

    // === 2. BUILD STICKMAN ===
    const stickman = new THREE.Group();
    const upperBody = new THREE.Group(); // Head, torso, arms will rotate together
    const lowerBody = new THREE.Group(); // Legs stay mostly put
    
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.9 });
    const jointMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); // Solid-ish joints

    // Helper to create lines (limbs)
    function createLimb(length) {
        const geo = new THREE.CylinderGeometry(0.05, 0.05, length, 6);
        return new THREE.Mesh(geo, mat);
    }
    // Helper to create joints
    function createJoint(size) {
        const geo = new THREE.SphereGeometry(size, 8, 8);
        return new THREE.Mesh(geo, jointMat);
    }

    // --- Upper Body ---
    // Head
    const head = createJoint(0.6);
    head.position.y = 1.8;
    upperBody.add(head);

    // Torso
    const torso = createLimb(1.8);
    torso.position.y = 0.6;
    upperBody.add(torso);

    // Arms (Simple pose)
    const leftArm = createLimb(1.5);
    leftArm.position.set(-0.8, 1.2, 0);
    leftArm.rotation.z = Math.PI / 8;
    upperBody.add(leftArm);

    const rightArm = createLimb(1.5);
    rightArm.position.set(0.8, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 8;
    upperBody.add(rightArm);

    // --- Lower Body ---
    // Hips joint
    const hips = createJoint(0.3);
    hips.position.y = -0.3;
    lowerBody.add(hips);

    // Legs (Simple stand pose)
    const leftLeg = createLimb(1.8);
    leftLeg.position.set(-0.5, -1.2, 0);
    leftLeg.rotation.z = -Math.PI / 16;
    lowerBody.add(leftLeg);

    const rightLeg = createLimb(1.8);
    rightLeg.position.set(0.5, -1.2, 0);
    rightLeg.rotation.z = Math.PI / 16;
    lowerBody.add(rightLeg);

    // Combine
    stickman.add(upperBody);
    stickman.add(lowerBody);
    scene.add(stickman);

    // Position Character
    stickman.position.set(-4, -1, 0); // Move left, slightly down
    stickman.scale.set(1.5, 1.5, 1.5);
    camera.position.z = 10;

    // Mouse Tracking for "Look At"
    let mouseX = 0, mouseY = 0;
    // Use menu container specifically for mouse tracking within the overlay scope
    document.getElementById('menu-overlay').addEventListener('mousemove', (e) => {
        // Normalize mouse from -1 to +1
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // 1. Personality: Idle Breathing/Bobbing
        stickman.position.y = -1 + Math.sin(Date.now() * 0.002) * 0.1;
        
        // 2. Personality: Look at Cursor (Smoothly rotate upper body)
        // Limit rotation angles so it doesn't break its neck
        let targetRotY = mouseX * 0.5; // Turn left/right
        let targetRotX = -mouseY * 0.3; // Look up/down

        upperBody.rotation.y += (targetRotY - upperBody.rotation.y) * 0.05;
        upperBody.rotation.x += (targetRotX - upperBody.rotation.x) * 0.05;
        // Slight counter-rotation for head for more natural look
        head.rotation.y += (targetRotY * 0.2 - head.rotation.y) * 0.05;

        // Slowly rotate menu stars bg
        starMesh.rotation.y += 0.0005;

        // Resize
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);
    }
    animate();
}
