document.addEventListener('DOMContentLoaded', () => {
    
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
    
    // Connect Scroll Progress
    lenis.on('scroll', ({ progress }) => {
        const progBar = document.querySelector('.scroll-progress');
        if(progBar) progBar.style.width = `${progress * 100}%`;
    });

    // === 3. UI LOGIC: MENU & LINKS ===
    const menuOverlay = document.getElementById('menu-overlay');
    const menuBtn = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close-btn');
    
    // Function to Toggle Menu
    function toggleMenu() {
        if(!menuOverlay) return;
        const isActive = menuOverlay.classList.contains('active');
        
        if (isActive) {
            menuOverlay.classList.remove('active');
            lenis.start(); // Resume scrolling
        } else {
            menuOverlay.classList.add('active');
            lenis.stop(); // Freeze scrolling
        }
    }

    // Bind Click Events
    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(menuClose) menuClose.addEventListener('click', toggleMenu);

    // Handle Menu Link Clicks (Smooth Scroll & Close)
    document.querySelectorAll('.m-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Get target ID (e.g., "#hero")
            const targetId = link.getAttribute('href');
            
            // If it's a page link
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                toggleMenu(); // Close menu
                lenis.scrollTo(targetId); // Smooth scroll to section
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
            // Ensure menu is closed if open
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

    // === 6. THREE.JS BACKGROUND ===
    initBackground3D();
    
    // === 7. THREE.JS MENU ROCKET ===
    initMenuRocket();

}); // End DOMContentLoaded


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

// --- 3D BACKGROUND ---
function initBackground3D() {
    const container = document.getElementById('canvas-container');
    if(!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles
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
}

// --- 3D MENU ROCKET ---
function initMenuRocket() {
    const container = document.getElementById('menu-3d-container');
    if(!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // GROUP FOR ROCKET PARTS
    const rocket = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

    // 1. Main Body (Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 12);
    const bodyWire = new THREE.WireframeGeometry(bodyGeo);
    const body = new THREE.LineSegments(bodyWire, mat);
    rocket.add(body);

    // 2. Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.5, 1, 12);
    const noseWire = new THREE.WireframeGeometry(noseGeo);
    const nose = new THREE.LineSegments(noseWire, mat);
    nose.position.y = 2; // Sit on top of body (1.5 + 0.5)
    rocket.add(nose);

    // 3. Fins (Triangles)
    // Create a triangle shape
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1, -1);
    finShape.lineTo(0, -1);
    finShape.lineTo(0, 0);
    
    const finGeo = new THREE.ShapeGeometry(finShape);
    const finWireGeo = new THREE.WireframeGeometry(finGeo);

    for(let i = 0; i < 3; i++) {
        const fin = new THREE.LineSegments(finWireGeo, mat);
        const finPivot = new THREE.Group();
        
        fin.position.x = 0.5; // Offset from body surface
        fin.position.y = -1;  // Bottom of body
        finPivot.rotation.y = (Math.PI * 2 / 3) * i; // 120 degrees apart
        finPivot.add(fin);
        rocket.add(finPivot);
    }

    // 4. Engine Nozzle
    const engineGeo = new THREE.CylinderGeometry(0.3, 0.6, 0.5, 12, 1, true);
    const engineWire = new THREE.WireframeGeometry(engineGeo);
    const engine = new THREE.LineSegments(engineWire, mat);
    engine.position.y = -1.75;
    rocket.add(engine);

    scene.add(rocket);
    camera.position.z = 7;

    // Initial Tilt
    rocket.rotation.z = Math.PI / 4;
    rocket.rotation.y = -Math.PI / 4;

    // INTERACTION
    let targetRotX = 0;
    let targetRotY = -Math.PI / 4;

    document.querySelectorAll('.m-link').forEach((link, idx) => {
        link.addEventListener('mouseenter', () => {
            // Rocket "Prepares for Launch" effect based on menu item
            // Index 0 (top) = Look up
            // Index 4 (bottom) = Look down
            targetRotX = (idx - 2) * 0.3; 
            targetRotY = -Math.PI / 2 + (idx * 0.2);
        });
    });

    // Reset when leaving menu area
    const menuArea = document.querySelector('.menu-links');
    if(menuArea) {
        menuArea.addEventListener('mouseleave', () => {
            targetRotX = 0;
            targetRotY = -Math.PI / 4;
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth interpolation
        rocket.rotation.z += (targetRotX - rocket.rotation.z + Math.PI / 4) * 0.05;
        rocket.rotation.y += (targetRotY - rocket.rotation.y) * 0.05;
        
        // Idle Float
        rocket.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Dynamic Resize check
        if(container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        renderer.render(scene, camera);
    }
    animate();
}
