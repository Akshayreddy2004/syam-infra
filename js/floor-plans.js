document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.fp-tab-btn');
    const tabContents = document.querySelectorAll('.fp-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Lightbox functionality
    const images = document.querySelectorAll('.fp-image-container img');

    if (images.length > 0) {
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.classList.add('lightbox-overlay');

        const content = document.createElement('div');
        content.classList.add('lightbox-content');

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.classList.add('lightbox-close');

        const img = document.createElement('img');

        content.appendChild(closeBtn);
        content.appendChild(img);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Open Lightbox
        images.forEach(image => {
            image.addEventListener('click', () => {
                img.src = image.src;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close Lightbox
        const closeLightbox = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});
