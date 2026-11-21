
/* =========================================================
   AMINOU MOUHAMADOU — ANIMATIONS DU PORTFOLIO
   1. Particules animées en arrière-plan
   2. Apparition progressive des éléments au défilement
========================================================= */


/* =========================================================
   1. PARTICULES ANIMÉES EN ARRIÈRE-PLAN
========================================================= */

const canvas = document.getElementById("particles-background");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame;

    let isMobile = window.innerWidth < 600;

    const CONNECTION_DISTANCE = 135;

    function resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;
        isMobile = width < 600;

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();
    }

    function createParticles() {
        const particleLimit = isMobile ? 45 : 100;

        const amount = Math.min(
            Math.floor((width * height) / 14000),
            particleLimit
        );

        particles = [];

        for (let i = 0; i < amount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.7,
                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.35 + 0.25
            });
        }
    }

    function drawParticles() {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Réapparition de l'autre côté de l'écran
            if (particle.x < -5) particle.x = width + 5;
            if (particle.x > width + 5) particle.x = -5;

            if (particle.y < -5) particle.y = height + 5;
            if (particle.y > height + 5) particle.y = -5;

            // Dessiner la particule
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(73, 196, 147, ${particle.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(73, 196, 147, 0.5)";
            ctx.fill();

            ctx.shadowBlur = 0;

            // Relier les particules proches
            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONNECTION_DISTANCE) {
                    const opacity =
                        0.13 * (1 - distance / CONNECTION_DISTANCE);

                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle = `rgba(73, 196, 147, ${opacity})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        });

        animationFrame = requestAnimationFrame(drawParticles);
    }

    // Arrêter l'animation lorsque l'onglet est masqué
    document.addEventListener("visibilitychange", () => {
        cancelAnimationFrame(animationFrame);

        if (!document.hidden) {
            drawParticles();
        }
    });

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    drawParticles();
}


/* =========================================================
   2. ANIMATIONS D'APPARITION AU DÉFILEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Éléments à animer
    const selectors = [
        ".hero-text",
        ".hero-visual",
        ".section-heading",
        ".skill-card",
        ".project-card",
        ".certification-card",
        ".cv-preview",
        ".cv-parcours",
        ".contact-info",
        ".contact-form-container"
    ];

    const elements = document.querySelectorAll(selectors.join(","));

    // Préparer les animations
    elements.forEach((element) => {

        element.classList.add("reveal-item");

        // Animation venant de la gauche
        if (
            element.classList.contains("hero-text") ||
            element.classList.contains("section-heading")
        ) {
            element.classList.add("reveal-left");
        }

        // Animation venant de la droite
        if (element.classList.contains("hero-visual")) {
            element.classList.add("reveal-right");
        }

        // Décalage progressif des cartes
        if (
            element.matches(
                ".skill-card, .project-card, .certification-card"
            )
        ) {
            const siblings = Array.from(element.parentElement.children);
            const position = siblings.indexOf(element);

            element.style.transitionDelay =
                `${(position % 4) * 120}ms`;
        }
    });

    // Respecter les préférences d'accessibilité
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    // Observer le passage des éléments à l'écran
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    // Ne pas répéter l'animation
                    observer.unobserve(entry.target);
                }

            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });

});
