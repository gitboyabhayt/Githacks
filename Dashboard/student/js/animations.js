// GSAP Animations and Effects
class AnimationManager {
    constructor() {
        this.initLoadingAnimation();
        this.initHoverEffects();
        this.initScrollAnimations();
    }

    initLoadingAnimation() {
        gsap.timeline()
            .from('.loading-bar', {
                scaleX: 0,
                duration: 0.8,
                ease: 'power2.inOut'
            })
            .to('.loading-bar', {
                opacity: 0,
                duration: 0.3,
                delay: 0.2
            })
            .from('.sidebar', {
                x: -100,
                opacity: 0,
                duration: 0.5
            })
            .from('.main-content > *', {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4
            });
    }

    // ... Rest of your animation methods ...
} 