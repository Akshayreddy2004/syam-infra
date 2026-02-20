document.addEventListener('DOMContentLoaded', function () {

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500); // 0.5 seconds minimum display
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate Links
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Hamburger Animation
            hamburger.classList.toggle('toggle');
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('toggle');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Ensure it stays visible once triggered
            }
        });
    }, observerOptions);

    // Observe all reveal items
    const revealElements = document.querySelectorAll('.reveal-item');
    revealElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    // Use textContent and trim to avoid issues
                    const finalValueText = target.textContent.trim();

                    // Robust regex to capture number and potential suffix (like +, k, etc.)
                    // Looks for the first sequence of digits
                    const match = finalValueText.match(/(\d+)(.*)/);

                    if (match) {
                        const finalValue = parseInt(match[1]);
                        const suffix = match[2] || '';
                        const duration = 2000; // 2 seconds

                        // Use a start time variable that is initialized on the first frame if possible, 
                        // or just use performance.now() captured here.
                        let startTime = null;

                        const updateCounter = (currentTime) => {
                            if (!startTime) startTime = currentTime;
                            const elapsedTime = currentTime - startTime;

                            // Ensure progress doesn't exceed 1
                            const progress = Math.min(elapsedTime / duration, 1);

                            // Ease Out Quart for smooth deceleration
                            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                            const currentValue = Math.floor(finalValue * easeOutQuart);
                            target.textContent = currentValue + suffix;

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                target.textContent = finalValue + suffix; // Ensure exact final value
                            }
                        };

                        requestAnimationFrame(updateCounter);
                        counterObserver.unobserve(target);
                    }
                }
            });
        }, { threshold: 0.1 }); // Lower threshold to ensure it triggers

        stats.forEach(stat => counterObserver.observe(stat));
    }

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Custom Cursor Logic
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Activate custom cursor (hides default)
    document.body.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth follow for outline (using simple animate for performance)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .project-card, .service-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Contact Form Logic (Web3Forms AJAX)
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('formResult');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            if (formResult) formResult.innerHTML = "Sending...";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        if (formResult) formResult.innerHTML = "Message Sent Successfully!";
                        contactForm.reset();
                    } else {
                        if (formResult) formResult.innerHTML = json.message;
                    }
                })
                .catch(error => {
                    if (formResult) formResult.innerHTML = "Something went wrong!";
                })
                .then(function () {
                    if (formResult) {
                        setTimeout(() => {
                            formResult.style.display = "none";
                        }, 5000);
                    }
                });
        });
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Robust Video Handling for About Section
    const aboutVideo = document.querySelector('.about-video');
    if (aboutVideo) {
        // Ensure standard attributes are set
        aboutVideo.playsInline = true;
        aboutVideo.muted = true;
        aboutVideo.loop = true;
        aboutVideo.autoplay = true;

        // Try to play immediately
        aboutVideo.play().catch(() => { });

        // Use IntersectionObserver to manage play/pause state
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutVideo.play().catch(() => { });
                } else {
                    aboutVideo.pause();
                }
            });
        }, { threshold: 0.1 }); // Play when 10% visible

        videoObserver.observe(aboutVideo);

        // Visibility API fallback (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                aboutVideo.pause();
            } else {
                // Only resume if in viewport (simplified check)
                const rect = aboutVideo.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    aboutVideo.play().catch(() => { });
                }
            }
        });
    }

});

// Team Portfolio Data
const teamData = {
    founder: {
        name: "Mulamreddy Sesha Reddy",
        role: "Founder",
        bio: "Mr. Sesha Reddy is the pillar of Syam Infra, bringing over 30 years of invaluable experience in the construction industry. Since establishing the company in 1995, his unwavering commitment to quality and structural integrity has resulted in the successful completion of over 3000 projects, earning the enduring trust of clients.",
        experience: "30+ Years",
        specialization: "Structural Planning",
        images: [],
        heroBg: "assets/images/hero-bg.jpg"
    },
    ceo: {
        name: "Mulamreddy Megha Syam",
        role: "CEO",
        bio: "As the driving force behind Syam Infra's evolution, Mr. Megha Syam combines his deep expertise in Structural Engineering with modern architectural trends. He is dedicated to implementing advanced construction methodologies that ensure safety, durability, and aesthetic brilliance in every project.",
        experience: "4+ Years",
        specialization: "Structural Engineering",
        images: [],
        heroBg: "assets/images/project-prime-hospital.png"
    },
    architect: {
        name: "Mr. Thatiparthi Hareesh",
        role: "3D Visualizer/Modeler",
        bio: "Hareesh believes that architecture is visual art. With a masters in Sustainable Architecture, he ensures that every Syam Infra project is not just a building, but a landmark. His designs prioritize natural light, ventilation, and aesthetic grandeur.",
        experience: "4+ Years",
        specialization: "3D Modeling & Rendering",
        profileImage: "assets/images/hareesh.jpg",
        images: [
            "assets/images/1.png",
            "assets/images/2.png",
            "assets/images/3.png",
            "assets/images/4.png",
            "assets/images/6.png",
            "assets/images/12.png"
        ],
        heroBg: "assets/images/3.png" // Daylight Perspective
    },
    interior: {
        name: "Mr. Challa Akash Reddy",
        role: "Interior Designer",
        bio: "Akash brings spaces to life. Specializing in luxury residential and functional commercial interiors, he works closely with clients to reflect their personality in their spaces. Innovative use of materials and lighting is his signature.",
        experience: "2+ Years",
        specialization: "Luxury Interiors",
        profileImage: "", // No image provided for Akash, default icon
        images: [
            "assets/images/hall1.png",
            "assets/images/hall2.png",
            "assets/images/bedroom1.png",
            "assets/images/dining1.png",
            "assets/images/kitchen1.png",
            "assets/images/PUJA V1.png",
            "assets/images/hall3.png",
            "assets/images/bedroom2.png"
        ],
        heroBg: "assets/images/hall1.png"
    },
    engineer: {
        name: "Mr. Kotakonda Prasad",
        role: "CAD Draftsman",
        bio: "With a profound mastery of 2D architectural software, Prasad leads the technical drafting phase at Syam Infra. He excels at creating meticulously detailed elevations, sections, and structural floor plans that bring our luxury visions to life on paper. His unwavering precision ensures that contractors have a flawless technical guide, bridging the gap between artistic design and elite construction.",
        experience: "5+ Years",
        specialization: "Technical Drafting",
        profileImage: "assets/images/prasad.png",
        images: [],
        heroBg: "assets/images/hero-bg.jpg"
    },
    manager: {
        name: "Mr. Mahesh",
        role: "CAD Draftsman",
        bio: "Mahesh specializes in the critical phase of 2D layout planning and spatial coordination. By translating complex architectural requirements into perfectly optimized floor plans and structural diagrams, he ensures that every square foot of a Syam Infra property is utilized efficiently. His highly accurate 2D layouts form the backbone of our construction process, guaranteeing seamless integration from the ground up.",
        experience: "3+ Years",
        specialization: "Layout Planning",
        images: [],
        heroBg: "assets/images/hero-bg.jpg"
    }
};

// Load Team Details Page
function loadTeamDetails() {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('id');

    if (!memberId || !teamData[memberId]) {
        // Redirect to home if invalid ID
        // window.location.href = 'index.html';
        document.getElementById('detailName').innerText = "Team Member Not Found";
        return;
    }

    const member = teamData[memberId];

    // Update Hero
    document.getElementById('detailName').innerHTML = `${member.name.split(' ')[0]} <span class="gold-text">${member.name.split(' ').slice(1).join(' ')}</span>`;
    document.getElementById('detailRoleHero').innerText = `${member.role} • Syam Infra`;

    // Update Content
    document.getElementById('detailBio').innerHTML = `<p>${member.bio}</p>`;

    // Update Sidebar
    document.getElementById('detailRole').innerText = member.role;
    document.getElementById('detailExp').innerText = member.experience;
    document.getElementById('detailSpec').innerText = member.specialization;

    // Update Profile Image (if exists in data, otherwise default icon remains)
    if (member.profileImage) {
        const profileContainer = document.querySelector('.profile-placeholder-container');
        if (profileContainer) {
            profileContainer.innerHTML = `<img src="${member.profileImage}" alt="${member.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; object-position: top center; border: 2px solid var(--accent-color);">`;
        }
    }

    // Update Hero Background if exists
    if (member.heroBg) {
        document.querySelector('.project-hero').style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${member.heroBg}') no-repeat center center/cover`;
    }

    // Populate Gallery
    const galleryContainer = document.getElementById('detailGallery');
    const portfolioHeader = document.getElementById('portfolioHeader');
    galleryContainer.innerHTML = '';

    if (member.images && member.images.length > 0) {
        if (portfolioHeader) portfolioHeader.style.display = 'block';
        member.images.forEach(imgSrc => {
            const div = document.createElement('div');
            div.className = 'gallery-img';

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${member.name} Portfolio`;
            img.onerror = function () {
                this.src = 'assets/images/logo.png';
            };

            div.appendChild(img);
            galleryContainer.appendChild(div);
        });
    } else {
        if (portfolioHeader) portfolioHeader.style.display = 'none';
        galleryContainer.innerHTML = '';
    }
}
