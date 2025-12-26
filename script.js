document.addEventListener('DOMContentLoaded', () => {
    console.log("ROCKET ENGINE V2 STARTED"); // Check console to confirm new file loaded

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
            // Allow opening modal without closing menu immediately or special handling
            if(link.classList.contains('open-contact-btn')) return;

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
    initBackground3D();
    initMenuRocket();

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

// --- 3D MENU ROCKET (REDESIGNED & LARGER) ---
function initMenuRocket() {
    const container = document.getElementById('menu-3d-container');
    if(!container) return;

    // Clean up existing canvas if any (Fixes duplication issues)
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // === BUILD SCI-FI ROCKET ===
    const rocket = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const detailMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.25 });

    // 1. Main Fuselage (Long Tapered Cylinder)
    // RadiusTop, RadiusBottom, Height, RadialSegments, HeightSegments, OpenEnded
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 16, 4, true); 
    const bodyWire = new THREE.WireframeGeometry(bodyGeo);
    const body = new THREE.LineSegments(bodyWire, mat);
    rocket.add(body);

    // 2. Cockpit/Nose (Sharp Cone)
    const noseGeo = new THREE.ConeGeometry(0.5, 1.5, 16, 2, true);
    const noseWire = new THREE.WireframeGeometry(noseGeo);
    const nose = new THREE.LineSegments(noseWire, mat);
    nose.position.y = 2.75; // 4/2 + 1.5/2
    rocket.add(nose);

    // 3. Engine Cluster (3 Cylinders)
    for(let i = 0; i < 3; i++) {
        const engineGeo = new THREE.CylinderGeometry(0.25, 0.4, 1, 12);
        const engineWire = new THREE.WireframeGeometry(engineGeo);
        const engine = new THREE.LineSegments(engineWire, mat);
        
        const angle = (Math.PI * 2 / 3) * i;
        engine.position.x = Math.cos(angle) * 0.5;
        engine.position.z = Math.sin(angle) * 0.5;
        engine.position.y = -2.5;
        rocket.add(engine);
    }

    // 4. Large Swept Fins (Wings)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.5, -2); // Wing tip out
    finShape.lineTo(1.5, -3); // Wing tip down
    finShape.lineTo(0.5, -2); // Back to body
    finShape.lineTo(0, 0);
    
    const finGeo = new THREE.ShapeGeometry(finShape);
    const finWireGeo = new THREE.WireframeGeometry(finGeo);

    for(let i = 0; i < 3; i++) {
        const fin = new THREE.LineSegments(finWireGeo, mat);
        const finGroup = new THREE.Group();
        
        finGroup.rotation.y = (Math.PI * 2 / 3) * i;
        fin.position.x = 0.7; // Offset from body center
        fin.position.y = -0.5;
        finGroup.add(fin);
        rocket.add(finGroup);
    }

    // 5. Tech Rings (Details)
    const ringGeo = new THREE.TorusGeometry(0.85, 0.02, 2, 32);
    const ringWire = new THREE.WireframeGeometry(ringGeo);
    
    const ring1 = new THREE.LineSegments(ringWire, detailMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 1;
    rocket.add(ring1);

    const ring2 = new THREE.LineSegments(ringWire, detailMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -1;
    rocket.add(ring2);

    scene.add(rocket);
    
    // MAKE IT BIGGER
    rocket.scale.set(1.5, 1.5, 1.5); 

    // Initial Position
    camera.position.z = 9;
    rocket.rotation.z = Math.PI / 5; // Mild tilt
    rocket.rotation.y = -Math.PI / 4;

    // Interaction State
    let targetRotX = 0; 
    let targetRotY = -Math.PI / 4;

    // Add Listeners to Menu Items
    document.querySelectorAll('.m-link').forEach((link, idx) => {
        link.addEventListener('mouseenter', () => {
            // Logic: 
            // idx 0 (Top) -> Pitch Up (Negative X rot)
            // idx 4 (Bottom) -> Pitch Down (Positive X rot)
            // Spin constantly (Y rot)
            targetRotX = (idx - 2) * 0.4; 
            targetRotY = -Math.PI / 2 + (idx * 0.5);
        });
    });

    const menuArea = document.querySelector('.menu-links');
    if(menuArea) {
        menuArea.addEventListener('mouseleave', () => {
            targetRotX = 0;
            targetRotY = -Math.PI / 4;
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Interpolate rotation
        rocket.rotation.z += (targetRotX - rocket.rotation.z + Math.PI / 5) * 0.05;
        rocket.rotation.y += (targetRotY - rocket.rotation.y) * 0.05;
        
        // Idle bobbing
        rocket.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        
        // Resize check
        if(container.clientWidth > 0 && (renderer.domElement.width !== container.clientWidth * window.devicePixelRatio)) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        renderer.render(scene, camera);
    }
    animate();
}
