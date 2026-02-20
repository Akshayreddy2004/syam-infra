// 3D Scene - KINETIC PREMIUM (Living Crystal)
// Aesthetic: Obsidian + Gold + Internal Light
// Logic: Independent rotation layers + Float

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- MATERIALS ---
    const obsidianMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.1,
        metalness: 0.9,
        envMapIntensity: 1.0,
        flatShading: true
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        roughness: 0.2,
        metalness: 1.0,
        emissive: 0x332200,
        emissiveIntensity: 0.2
    });

    const lightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0.8
    });

    // --- GEOMETRY GROUPS ---
    const monolithGroup = new THREE.Group();
    scene.add(monolithGroup);

    // Independent Rotation Groups
    const coreGroup = new THREE.Group();
    monolithGroup.add(coreGroup);

    const cageGroup = new THREE.Group();
    monolithGroup.add(cageGroup);

    // 1. Core Hexagon Tower (Obsidian)
    const towerGeo = new THREE.CylinderGeometry(2.5, 2.5, 20, 6);
    const tower = new THREE.Mesh(towerGeo, obsidianMaterial);
    tower.castShadow = true;
    tower.receiveShadow = true;
    coreGroup.add(tower);

    // 2. Gold Frame (Cage) - Added to cageGroup
    // Struts
    const strutGeo = new THREE.CylinderGeometry(0.05, 0.05, 20, 6);
    const struts = [];
    for (let i = 0; i < 6; i++) {
        const strut = new THREE.Mesh(strutGeo, goldMaterial);
        const angle = (i * Math.PI / 3);
        const r = 2.6; // Wider than core to float
        strut.position.set(Math.sin(angle) * r, 0, Math.cos(angle) * r);
        cageGroup.add(strut);
        struts.push({ mesh: strut, angle: angle, r: r });
    }

    // Rings for the Cage (Top/Bottom)
    const ringGeo = new THREE.TorusGeometry(2.6, 0.05, 16, 6); // Hexagonal ring? Torus is round.
    // Let's stick to simple struts, maybe add horizontal bands in animation loop?
    // Let's add 3 horizontal hexagon rings
    const ringShapes = [];
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.04, 8, 6), goldMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = (i - 1) * 6; // -6, 0, 6
        cageGroup.add(ring);
        ringShapes.push(ring);
    }


    // 3. Internal "Lights" - Added to coreGroup
    const lightGroup = new THREE.Group();
    coreGroup.add(lightGroup);

    for (let i = 0; i < 20; i++) {
        const panelGeo = new THREE.PlaneGeometry(0.8, 1.2);
        const panel = new THREE.Mesh(panelGeo, lightMaterial);

        const face = Math.floor(Math.random() * 6);
        const angle = face * (Math.PI / 3) + (Math.PI / 6);
        const r = 2.51;

        panel.position.set(Math.sin(angle) * r, (Math.random() - 0.5) * 16, Math.cos(angle) * r);
        panel.rotation.y = angle;

        lightGroup.add(panel);
    }


    // 4. Base & Crown - Added to coreGroup for stability
    const baseGeo = new THREE.CylinderGeometry(6, 7, 1, 6);
    const base = new THREE.Mesh(baseGeo, obsidianMaterial);
    base.position.y = -10.5;
    base.castShadow = true;
    base.receiveShadow = true;
    coreGroup.add(base);

    const crownGeo = new THREE.CylinderGeometry(0, 2.6, 2, 6);
    const crown = new THREE.Mesh(crownGeo, goldMaterial);
    crown.position.y = 11;
    coreGroup.add(crown);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeebb, 2.0);
    keyLight.position.set(10, 20, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.SpotLight(0x4455ff, 5.0);
    rimLight.position.set(-10, 10, -10);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // --- PARTICLES ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xFFD700,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- LOGIC ---
    let currentSection = 'hero';

    // Observer
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const morphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'projects') currentSection = 'projects';
                else if (entry.target.id === 'hero') currentSection = 'hero';
            }
        });
    }, observerOptions);

    const projectsSection = document.getElementById('projects');
    const heroSection = document.getElementById('hero') || document.querySelector('.hero-section');
    if (projectsSection) morphObserver.observe(projectsSection);
    if (heroSection) morphObserver.observe(heroSection);

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const projectTop = projectsSection ? projectsSection.offsetTop : 1000;
        if (scrollY > projectTop + 300) {
            currentSection = 'villas';
        } else if (scrollY > projectTop - 300) {
            currentSection = 'projects';
        } else {
            currentSection = 'hero';
        }
    });

    // Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.0005;
        mouseY = (event.clientY - windowHalfY) * 0.0005;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const scrollY = window.scrollY;

        // 1. Kinetic Rotation
        targetRotationY += 0.05 * (mouseX - targetRotationY);
        targetRotationX += 0.05 * (mouseY - targetRotationX);

        // Whole Group moves with mouse
        monolithGroup.rotation.y = targetRotationY + (scrollY * 0.0002);
        monolithGroup.rotation.x = targetRotationX * 0.2;

        // Core spins slowly
        coreGroup.rotation.y = time * 0.1;

        // Cage spins FASTER and Counter-Clockwise
        cageGroup.rotation.y = time * -0.2;

        // Floating Effect (Levitation)
        monolithGroup.position.y = Math.sin(time * 0.5) * 0.5;

        // Pulse Lights
        lightGroup.children.forEach((l, i) => {
            l.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.4;
        });

        // 2. Morph Logic
        let targetScaleX = 1;
        let targetScaleY = 1;
        let targetScaleZ = 1;
        let targetPosY = 0;

        if (currentSection === 'hero') {
            targetScaleX = 1;
            targetScaleY = 1;
            targetScaleZ = 1;
            targetPosY = 0;
        } else if (currentSection === 'projects') {
            targetScaleX = 1.4;
            targetScaleY = 0.8;
            targetScaleZ = 1.4;
            targetPosY = -1;
        } else if (currentSection === 'villas') {
            targetScaleX = 2.0;
            targetScaleY = 0.5;
            targetScaleZ = 2.0;
            targetPosY = -2;
        }

        const alpha = 0.05;
        // Apply scale to BOTH groups separately to maintain relative positions
        // Core
        tower.scale.x += (targetScaleX - tower.scale.x) * alpha;
        tower.scale.y += (targetScaleY - tower.scale.y) * alpha;
        tower.scale.z += (targetScaleZ - tower.scale.z) * alpha;
        tower.position.y += (targetPosY - tower.position.y) * alpha;

        // 3. Update Parts attached to Core
        const currentHalfHeight = (20 * tower.scale.y) / 2;

        // Light Panels follow Tower
        lightGroup.scale.copy(tower.scale);
        lightGroup.position.copy(tower.position);

        // Base
        base.position.y = tower.position.y - currentHalfHeight - 0.5;
        base.scale.x = tower.scale.x;
        base.scale.z = tower.scale.z;

        // Crown
        crown.position.y = tower.position.y + currentHalfHeight + 1;
        crown.scale.x = tower.scale.x;
        crown.scale.z = tower.scale.z;

        // Cage Follows Core Shape but Rotates Independently
        // We need to scale the STRUTS inside the cageGroup
        struts.forEach(s => {
            s.mesh.scale.y = tower.scale.y;
            s.mesh.position.y = tower.position.y;
            const r = s.r * tower.scale.x;
            s.mesh.position.x = Math.sin(s.angle) * r;
            s.mesh.position.z = Math.cos(s.angle) * r;
        });

        ringShapes.forEach((r, i) => {
            // Rings scale with width
            r.scale.x = tower.scale.x;
            r.scale.y = tower.scale.z; // Torus uses x/y for constraints in Z plane

            // Rings position needs to scale with height
            // Original: (i-1)*6. 
            // Scaled: (i-1)*6 * tower.scale.y
            r.position.y = tower.position.y + ((i - 1) * 6 * tower.scale.y);
        });

        // Particles
        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.position.y = -scrollY * 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    function updateCamera() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);

        // Mobile Adjustment
        // Move camera back if screen is narrow to keep object in view
        if (window.innerWidth < 768) {
            camera.position.z = 24; // Further back for mobile
        } else {
            camera.position.z = 18; // Standard desktop
        }
    }

    window.addEventListener('resize', updateCamera);
    updateCamera(); // Call once on load
});
