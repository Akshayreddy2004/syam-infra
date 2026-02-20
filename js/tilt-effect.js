document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card, .service-card, .team-card');

    cards.forEach(card => {
        let bounds;
        let rotation = { x: 0, y: 0 };
        let isHovering = false;
        let rafId = null;

        function update() {
            if (!isHovering) return;

            // Apply transform in RAF loop
            card.style.transform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`;

            rafId = requestAnimationFrame(update);
        }

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            bounds = card.getBoundingClientRect(); // Cache bounds on enter
            card.style.transition = 'none'; // Remove transition for instant follow
            update();
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovering || !bounds) return;

            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Calculate rotation
            // RotateX is based on Y axis (up/down)
            // RotateY is based on X axis (left/right)
            rotation.x = ((y - centerY) / centerY) * -10; // Max 10 deg
            rotation.y = ((x - centerX) / centerX) * 10;
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            cancelAnimationFrame(rafId);

            // Add transition back for smooth reset
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
