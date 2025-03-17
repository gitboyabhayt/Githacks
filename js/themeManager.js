// Theme Manager
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.audioEnabled = localStorage.getItem('audioEnabled') === 'true';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupToggle();
        this.setupAudio();
    }

    loadTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.querySelector('.theme-toggle i').className = 
            this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.loadTheme();
        this.playSound('switch');
    }

    setupToggle() {
        const toggle = document.querySelector('.theme-toggle');
        toggle.addEventListener('click', () => this.toggleTheme());
        toggle.addEventListener('mouseenter', () => this.playSound('hover'));
    }

    setupAudio() {
        this.sounds = {
            hover: new Audio('/assets/sounds/hover.mp3'),
            switch: new Audio('/assets/sounds/switch.mp3'),
            click: new Audio('/assets/sounds/click.mp3')
        };

        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.2;
        });
    }

    playSound(type) {
        if (this.audioEnabled && this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(() => {});
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        localStorage.setItem('audioEnabled', this.audioEnabled);
    }
}

export default new ThemeManager();
