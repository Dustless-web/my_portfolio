document.addEventListener('DOMContentLoaded', () => {
    
    // Global State for Warp Effect
    window.warpSpeed = 0.02; // Base speed
    window.targetWarpSpeed = 0.02;

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

    // === 2. SMOOTH SCROLL (LENIS) ===
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    lenis.on('scroll', ({ progress }) => {
        const progBar = document.querySelector('.scroll-progress');
        if(progBar) progBar.style.width = `${progress * 100}%`;
    });

    // === 3. UI LOGIC: MENU & LINKS ===
    const menuOverlay = document.getElementById('menu-overlay');
    const menuBtn = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close-btn');
    
    function toggleMenu() {
        if(!menuOverlay) return;
        const isActive = menuOverlay.classList.contains('active');
        if (isActive) {
            menuOverlay.classList.remove('active');
            lenis.start(); 
            // Reset warp speed on close
            window.targetWarpSpeed = 0.02;
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

    // === 4. UI LOGIC: MODAL ===
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.querySelector('.modal-close');
    
    function openModal() {
        if(contactModal) {
            contactModal.classList.add('active');
            lenis.stop();
            if(menuOverlay && menuOverlay.classList.contains('active')) {
                menuOverlay.classList.remove('active');
            }
        }
    }
    function closeModal() {
        if(contactModal) {
            contactModal.classList.remove('active');
            lenis.start();
        }
    }

    document.querySelectorAll('.open-contact-btn').forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    }));
    
    if(modalClose) modalClose.addEventListener('click', closeModal);


    // === 5. CUSTOM CURSOR ===
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if(cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // === 6. THREE.JS INITIALIZATION ===
    initStarfield(); // NEW: Infinite Stars
    initMenuRocket(); // NEW: Heavy Lifter Rocket

}); 

// --- HELPERS ---
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

// --- 3D BACKGROUND: INFINITE STARFIELD ---
function initStarfield() {
    const container = document.getElementById('canvas-container');
    if(!container) return;

    const scene = new THREE.Scene();
    // Add subtle fog to fade stars in distance
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create Stars
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    
    // Initial random positions
    for(let i=0; i<starCount; i++) {
        starPos[i*3] = (Math.random() - 0.5) * 50; // X
        starPos[i*3+1] = (Math.random() - 0.5) * 50; // Y
        starPos[i*3+2] = (Math.random() - 0.5) * 50; // Z
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);

    camera.position.z = 1;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // SMOOTH ACCELERATION INTERPOLATION
        // Move actual speed towards target speed
        window.warpSpeed += (window.targetWarpSpeed - window.warpSpeed) * 0.05;

        const positions = starGeo.attributes.position.array;
        
        for(let i=0; i<starCount; i++) {
            // Move stars towards camera (Positive Z)
            positions[i*3+2] += window.warpSpeed;
            
            // If star passes camera (Z > 5), reset it to far back
            if(positions[i*3+2] > 5) {
                positions[i*3+2] = -30; // Reset Z
                positions[i*3] = (Math.random() - 0.5) * 40; // New Random X
                positions[i*3+1] = (Math.random() - 0.5) * 40; // New Random Y
            }
        }
        starGeo.attributes.position.needsUpdate = true;

        // Subtle camera banking based on mouse
        camera.rotation.y += (mouseX - camera.rotation.y) * 0.05;
        camera.rotation.x += (mouseY - camera.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 3D MENU ROCKET ---
function initMenuRocket() {
    const container = document.getElementById('menu-3d-container');
    if(!container) return;

    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // === BUILD SCI-FI HEAVY ROCKET ===
    const rocket = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    const detailMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.25 });

    // 1. Main Fuselage
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.8, 3.5, 16, 4, true); 
    const bodyWire = new THREE.WireframeGeometry(bodyGeo);
    const body = new THREE.LineSegments(bodyWire, mat);
    rocket.add(body);

    // 2. Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.6, 1.5, 16, 2, true);
    const noseWire = new THREE.WireframeGeometry(noseGeo);
    const nose = new THREE.LineSegments(noseWire, mat);
    nose.position.y = 2.5; 
    rocket.add(nose);

    // 3. Engine Cluster
    for(let i = 0; i < 3; i++) {
        const engineGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 12);
        const engineWire = new THREE.WireframeGeometry(engineGeo);
        const engine = new THREE.LineSegments(engineWire, mat);
        const angle = (Math.PI * 2 / 3) * i;
        engine.position.x = Math.cos(angle) * 0.4;
        engine.position.z = Math.sin(angle) * 0.4;
        engine.position.y = -2;
        rocket.add(engine);
    }

    // 4. Swept Fins
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.2, -1.5);
    finShape.lineTo(1.2, -2.2);
    finShape.lineTo(0.5, -1.5);
    finShape.lineTo(0, 0);
    const finGeo = new THREE.ShapeGeometry(finShape);
    const finWireGeo = new THREE.WireframeGeometry(finGeo);

    for(let i = 0; i < 3; i++) {
        const fin = new THREE.LineSegments(finWireGeo, mat);
        const finGroup = new THREE.Group();
        finGroup.rotation.y = (Math.PI * 2 / 3) * i;
        fin.position.x = 0.6; 
        fin.position.y = -0.5;
        finGroup.add(fin);
        rocket.add(finGroup);
    }

    scene.add(rocket);
    rocket.scale.set(1.5, 1.5, 1.5); 

    camera.position.z = 9;
    rocket.rotation.z = Math.PI / 6;
    rocket.rotation.y = -Math.PI / 4;

    // Interaction State
    let targetRotX = 0; 
    let targetRotY = -Math.PI / 4;
    let targetPosZ = 0;

    // Add Listeners to Menu Items
    document.querySelectorAll('.m-link').forEach((link, idx) => {
        link.addEventListener('mouseenter', () => {
            // Rocket Logic: Pitch forward as we go down
            targetRotX = (idx * 0.2); // 0 to 0.8 (Tilts nose down/forward)
            targetRotY = -Math.PI / 2 + (idx * 0.3); // Spin
            targetPosZ = idx * 0.5; // Move closer to camera
            
            // STARFIELD LOGIC: Increase speed based on index
            // Index 0 (Home) = 0.1 Speed
            // Index 4 (Contact) = 0.8 Speed (Fast!)
            window.targetWarpSpeed = 0.1 + (idx * 0.15);
        });
    });

    const menuArea = document.querySelector('.menu-links');
    if(menuArea) {
        menuArea.addEventListener('mouseleave', () => {
            // Reset Rocket
            targetRotX = 0;
            targetRotY = -Math.PI / 4;
            targetPosZ = 0;
            
            // Reset Stars
            window.targetWarpSpeed = 0.02; // Back to idle cruise
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth Rocket Movement
        rocket.rotation.z += (targetRotX - rocket.rotation.z + Math.PI / 6) * 0.05;
        rocket.rotation.y += (targetRotY - rocket.rotation.y) * 0.05;
        rocket.position.z += (targetPosZ - rocket.position.z) * 0.05; // Move forward
        
        // Idle bobbing
        rocket.position.y = Math.sin(Date.now() * 0.001) * 0.15;
        
        // Resize
        if(container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        renderer.render(scene, camera);
    }
    animate();
}
