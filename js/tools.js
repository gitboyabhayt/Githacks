// Tools Data
const tools = {
    free: [
        {
            id: 'nmap',
            name: 'Nmap',
            category: 'network',
            description: 'Powerful network scanning and security auditing tool.',
            icon: 'fas fa-network-wired',
            os: ['windows', 'linux', 'mac'],
            rating: 4.8,
            features: [
                'Network discovery and security auditing',
                'Port scanning and service detection',
                'OS detection and version detection',
                'Scriptable interaction with target'
            ],
            installation: {
                windows: 'choco install nmap',
                linux: 'sudo apt-get install nmap',
                mac: 'brew install nmap'
            }
        },
        {
            id: 'wireshark',
            name: 'Wireshark',
            category: 'network',
            description: 'World\'s foremost network protocol analyzer.',
            icon: 'fas fa-chart-line',
            os: ['windows', 'linux', 'mac'],
            rating: 4.9,
            features: [
                'Deep inspection of hundreds of protocols',
                'Live capture and offline analysis',
                'Standard three-pane packet browser',
                'Multi-platform support'
            ],
            installation: {
                windows: 'choco install wireshark',
                linux: 'sudo apt-get install wireshark',
                mac: 'brew install wireshark'
            }
        },
        // Add more free tools here
    ],
    premium: [
        {
            id: 'burpsuite-pro',
            name: 'Burp Suite Professional',
            category: 'web',
            description: 'Advanced web vulnerability scanner and security testing tool.',
            icon: 'fas fa-spider',
            os: ['windows', 'linux', 'mac'],
            rating: 4.9,
            price: 399,
            features: [
                'Advanced web vulnerability scanner',
                'Automated security testing',
                'Manual testing tools',
                'Enterprise-grade reporting'
            ]
        },
        {
            id: 'cobalt-strike',
            name: 'Cobalt Strike',
            category: 'pentesting',
            description: 'Advanced threat emulation and red team operations platform.',
            icon: 'fas fa-user-secret',
            os: ['windows', 'linux'],
            rating: 4.8,
            price: 3600,
            features: [
                'Advanced threat emulation',
                'Post-exploitation capabilities',
                'Team collaboration features',
                'Extensive reporting'
            ]
        },
        // Add more premium tools here
    ]
};

// Tool sections data
const toolSections = {
    standard: [
        {
            name: "Metasploit Framework",
            category: "Exploit",
            icon: "fas fa-bug",
            description: "Advanced penetration testing and exploit development framework",
            downloads: "15.2k",
            rating: 4.8
        },
        {
            name: "Burp Suite Community",
            category: "Web Security",
            icon: "fas fa-spider",
            description: "Web vulnerability scanner and proxy tool",
            downloads: "18.5k",
            rating: 4.7
        },
        {
            name: "Wireshark Pro",
            category: "Network",
            icon: "fas fa-network-wired",
            description: "Professional network protocol analyzer",
            downloads: "20.1k",
            rating: 4.9
        },
        {
            name: "SQLMap",
            category: "Database",
            icon: "fas fa-database",
            description: "Automated SQL injection and database takeover tool",
            downloads: "12.3k",
            rating: 4.6
        },
        {
            name: "John the Ripper",
            category: "Password",
            icon: "fas fa-key",
            description: "Advanced password cracker and recovery tool",
            downloads: "14.7k",
            rating: 4.5
        },
        {
            name: "Aircrack-ng",
            category: "Wireless",
            icon: "fas fa-wifi",
            description: "Complete suite for wireless network assessment",
            downloads: "16.8k",
            rating: 4.7
        },
        {
            name: "Hydra",
            category: "Password",
            icon: "fas fa-unlock",
            description: "Fast network authentication cracker",
            downloads: "11.9k",
            rating: 4.4
        },
        {
            name: "Nikto",
            category: "Web Security",
            icon: "fas fa-globe",
            description: "Web server scanner and vulnerability assessment",
            downloads: "13.5k",
            rating: 4.3
        },
        {
            name: "Maltego",
            category: "OSINT",
            icon: "fas fa-sitemap",
            description: "Open source intelligence and forensics tool",
            downloads: "10.8k",
            rating: 4.6
        },
        {
            name: "BeEF",
            category: "Web Security",
            icon: "fas fa-browser",
            description: "Browser exploitation framework",
            downloads: "9.7k",
            rating: 4.5
        },
        {
            name: "Nessus",
            category: "Vulnerability Scanner",
            icon: "fas fa-shield-alt",
            description: "Comprehensive vulnerability scanning tool",
            downloads: "22.3k",
            rating: 4.9
        },
        {
            name: "OpenVAS",
            category: "Vulnerability Scanner",
            icon: "fas fa-bug",
            description: "Open-source vulnerability scanner",
            downloads: "18.7k",
            rating: 4.8
        },
        {
            name: "Snort",
            category: "Intrusion Detection",
            icon: "fas fa-exclamation-triangle",
            description: "Network intrusion detection system",
            downloads: "20.5k",
            rating: 4.7
        },
        {
            name: "Suricata",
            category: "Intrusion Detection",
            icon: "fas fa-shield-virus",
            description: "High-performance network IDS, IPS, and NSM",
            downloads: "17.9k",
            rating: 4.6
        },
        {
            name: "Kali Linux",
            category: "Operating System",
            icon: "fas fa-laptop-code",
            description: "Penetration testing and security auditing OS",
            downloads: "25.4k",
            rating: 4.9
        },
        {
            name: "Parrot Security OS",
            category: "Operating System",
            icon: "fas fa-desktop",
            description: "Security-focused operating system",
            downloads: "19.2k",
            rating: 4.7
        },
        {
            name: "Nexpose",
            category: "Vulnerability Scanner",
            icon: "fas fa-search",
            description: "Real-time vulnerability management",
            downloads: "16.3k",
            rating: 4.6
        },
        {
            name: "Acunetix",
            category: "Web Security",
            icon: "fas fa-globe",
            description: "Web vulnerability scanner",
            downloads: "14.8k",
            rating: 4.7
        },
        {
            name: "OWASP ZAP",
            category: "Web Security",
            icon: "fas fa-spider",
            description: "Open-source web application security scanner",
            downloads: "21.1k",
            rating: 4.8
        },
        {
            name: "Ncat",
            category: "Network",
            icon: "fas fa-network-wired",
            description: "Feature-packed networking utility",
            downloads: "13.4k",
            rating: 4.5
        }
    ],
    advanced: [
        {
            name: "Volatility",
            category: "Forensics",
            icon: "fas fa-memory",
            description: "Advanced memory forensics framework",
            downloads: "12.4k",
            rating: 4.9
        },
        {
            name: "IDA Pro",
            category: "Reverse Engineering",
            icon: "fas fa-microchip",
            description: "Professional disassembler and debugger",
            downloads: "9.8k",
            rating: 4.8
        },
        {
            name: "Ghidra",
            category: "Reverse Engineering",
            icon: "fas fa-code",
            description: "Software reverse engineering framework",
            downloads: "15.6k",
            rating: 4.7
        },
        {
            name: "Immunity Debugger",
            category: "Debugging",
            icon: "fas fa-bug",
            description: "Powerful debugging and exploitation tool",
            downloads: "8.9k",
            rating: 4.6
        },
        {
            name: "Radare2",
            category: "Reverse Engineering",
            icon: "fas fa-terminal",
            description: "Advanced reverse engineering framework",
            downloads: "11.3k",
            rating: 4.5
        },
        {
            name: "Binary Ninja",
            category: "Binary Analysis",
            icon: "fas fa-file-code",
            description: "Binary analysis platform",
            downloads: "7.8k",
            rating: 4.7
        },
        {
            name: "Hopper",
            category: "Disassembler",
            icon: "fas fa-microchip",
            description: "Reverse engineering tool for binary files",
            downloads: "6.9k",
            rating: 4.4
        },
        {
            name: "x64dbg",
            category: "Debugging",
            icon: "fas fa-bug",
            description: "Open source x64/x32 debugger for Windows",
            downloads: "13.2k",
            rating: 4.6
        },
        {
            name: "FRIDA",
            category: "Dynamic Analysis",
            icon: "fas fa-mobile-alt",
            description: "Dynamic instrumentation toolkit",
            downloads: "10.5k",
            rating: 4.8
        },
        {
            name: "Cutter",
            category: "Reverse Engineering",
            icon: "fas fa-cut",
            description: "Free and open source RE platform",
            downloads: "9.1k",
            rating: 4.5
        }
    ],
    premium: [
        {
            name: "Enterprise Scanner Pro",
            category: "Security",
            icon: "fas fa-shield-alt",
            description: "Enterprise-grade vulnerability scanner",
            price: "$299/mo",
            rating: 4.9
        },
        {
            name: "Network Guardian Elite",
            category: "Network Security",
            icon: "fas fa-network-wired",
            description: "Advanced network monitoring suite",
            price: "$399/mo",
            rating: 4.8
        },
        {
            name: "Threat Hunter Pro",
            category: "Threat Detection",
            icon: "fas fa-search",
            description: "Advanced threat detection platform",
            price: "$499/mo",
            rating: 4.9
        },
        {
            name: "Forensics Master",
            category: "Digital Forensics",
            icon: "fas fa-microscope",
            description: "Professional digital forensics suite",
            price: "$599/mo",
            rating: 4.7
        },
        {
            name: "Pentest Suite Elite",
            category: "Penetration Testing",
            icon: "fas fa-user-secret",
            description: "Complete penetration testing platform",
            price: "$799/mo",
            rating: 4.8
        },
        {
            name: "Cloud Guardian Pro",
            category: "Cloud Security",
            icon: "fas fa-cloud",
            description: "Cloud infrastructure security suite",
            price: "$699/mo",
            rating: 4.6
        },
        {
            name: "Mobile Security Pro",
            category: "Mobile Security",
            icon: "fas fa-mobile-alt",
            description: "Enterprise mobile security platform",
            price: "$449/mo",
            rating: 4.7
        },
        {
            name: "Web App Defender",
            category: "Web Security",
            icon: "fas fa-globe-americas",
            description: "Advanced web application firewall",
            price: "$549/mo",
            rating: 4.8
        },
        {
            name: "Malware Analysis Pro",
            category: "Malware Analysis",
            icon: "fas fa-virus",
            description: "Professional malware analysis platform",
            price: "$649/mo",
            rating: 4.9
        },
        {
            name: "Security Dashboard Elite",
            category: "Security Management",
            icon: "fas fa-tachometer-alt",
            description: "Enterprise security management console",
            price: "$899/mo",
            rating: 4.7
        }
    ]
};

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});

// Matrix background effect
const initMatrix = () => {
    const canvas = document.getElementById('matrixBg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1; 
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            
            drops[i]++;
        }
    }

    setInterval(draw, 35);
};

// Initialize animations
const initAnimations = () => {
    // Animate tool cards on scroll
    gsap.from('.tool-card', {
        scrollTrigger: {
            trigger: '.tool-card',
            start: 'top bottom',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2
    });
};

// Initialize Tools Page
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeFilters();
    renderTools();
    initializeModal();
    initMatrix();
    initAnimations();
    initializeToolCards();
    initializeSectionSwitching();
    
    // Show basic section by default
    document.querySelector('a[href="#basic"]').click();
});

document.addEventListener('DOMContentLoaded', () => {
    // Add any JavaScript interactions for the tools page here
    console.log('Tools page loaded');
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('toolSearch');
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        filterTools(query);
    }, 300));
}

// Filter Functionality
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const osFilter = document.getElementById('osFilter');
    const typeFilter = document.getElementById('typeFilter');

    categoryFilter.addEventListener('change', () => filterTools());
    osFilter.addEventListener('change', () => filterTools());
    typeFilter.addEventListener('change', () => filterTools());
}

// Render Tools
function renderTools(filteredTools = tools) {
    const freeGrid = document.getElementById('freeToolsGrid');
    const premiumGrid = document.getElementById('premiumToolsGrid');

    freeGrid.innerHTML = '';
    premiumGrid.innerHTML = '';

    filteredTools.free.forEach(tool => {
        freeGrid.appendChild(createToolCard(tool, 'free'));
    });

    filteredTools.premium.forEach(tool => {
        premiumGrid.appendChild(createToolCard(tool, 'premium'));
    });
}

// Create Tool Card
function createToolCard(tool, type) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.toolId = tool.id;
    card.dataset.toolType = type;

    card.innerHTML = `
        <div class="tool-icon">
            <i class="${tool.icon}"></i>
        </div>
        <span class="tool-type ${type}">${type}</span>
        <h3 class="tool-name">${tool.name}</h3>
        <div class="tool-category">${capitalizeFirstLetter(tool.category)}</div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-meta">
            <div class="tool-os">
                ${tool.os.map(os => `<i class="fab fa-${os}" title="${capitalizeFirstLetter(os)}"></i>`).join('')}
            </div>
            <div class="tool-rating">
                ${createRatingStars(tool.rating)}
                <span>${tool.rating.toFixed(1)}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openToolModal(tool, type));
    return card;
}

// Create Rating Stars
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

// Filter Tools
function filterTools(searchQuery = '') {
    const category = document.getElementById('categoryFilter').value;
    const os = document.getElementById('osFilter').value;
    const type = document.getElementById('typeFilter').value;

    let filtered = {
        free: [...tools.free],
        premium: [...tools.premium]
    };

    // Apply search filter
    if (searchQuery) {
        filtered.free = filtered.free.filter(tool => 
            tool.name.toLowerCase().includes(searchQuery) ||
            tool.description.toLowerCase().includes(searchQuery) ||
            tool.category.toLowerCase().includes(searchQuery)
        );
        filtered.premium = filtered.premium.filter(tool => 
            tool.name.toLowerCase().includes(searchQuery) ||
            tool.description.toLowerCase().includes(searchQuery) ||
            tool.category.toLowerCase().includes(searchQuery)
        );
    }

    // Apply category filter
    if (category !== 'all') {
        filtered.free = filtered.free.filter(tool => tool.category === category);
        filtered.premium = filtered.premium.filter(tool => tool.category === category);
    }

    // Apply OS filter
    if (os !== 'all') {
        filtered.free = filtered.free.filter(tool => tool.os.includes(os));
        filtered.premium = filtered.premium.filter(tool => tool.os.includes(os));
    }

    // Apply type filter
    if (type === 'free') {
        filtered.premium = [];
    } else if (type === 'premium') {
        filtered.free = [];
    }

    renderTools(filtered);
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('toolModal');
    const closeButton = modal.querySelector('.close-modal');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Open Tool Modal
function openToolModal(tool, type) {
    const modal = document.getElementById('toolModal');
    const detail = modal.querySelector('.tool-detail');

    detail.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-info">
                <h2>${tool.name}</h2>
                <div class="tool-category">${capitalizeFirstLetter(tool.category)}</div>
            </div>
        </div>
        <div class="tool-content">
            <p>${tool.description}</p>
            
            <div class="tool-features">
                <h3>Key Features</h3>
                <ul class="feature-list">
                    ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            ${type === 'free' ? `
                <div class="installation-guide">
                    <h3>Installation Guide</h3>
                    <div class="installation-steps">
                        <pre>
# Windows
${tool.installation.windows}

# Linux
${tool.installation.linux}

# macOS
${tool.installation.mac}</pre>
                    </div>
                </div>
            ` : ''}

            <div class="tool-actions">
                ${type === 'free' ? 
                    `<a href="#" class="cyber-button">
                        <i class="fas fa-download"></i> Download Now
                    </a>` :
                    `<button class="cyber-button premium-btn">
                        <i class="fas fa-crown"></i> Purchase for $${tool.price}
                    </button>`
                }
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Utility Functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize tool cards
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const downloadButtons = document.querySelectorAll('.download-btn');

    // Add hover effects
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Handle favorite button clicks
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            if (icon.classList.contains('fas')) {
                gsap.from(icon, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'back.out'
                });
            }
        });
    });

    // Handle download button clicks
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const span = btn.querySelector('span');
            const originalText = span.textContent;
            
            // Animate button click
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            // Show downloading state
            span.textContent = 'Downloading...';
            setTimeout(() => {
                span.textContent = originalText;
            }, 2000);
        });
    });
}

// Section switching functionality
function initializeSectionSwitching() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('.tools-section');

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = button.dataset.section;
            
            // Update active state with animation
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3
                });
            });
            
            button.classList.add('active');
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3
            });
            
            // Hide all sections with fade out
            sections.forEach(section => {
                gsap.to(section, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        section.style.display = 'none';
                    }
                });
            });
            
            // Show and animate target section
            const targetSection = document.getElementById(targetId);
            targetSection.style.display = 'block';
            
            // Create tool cards if they don't exist
            if (targetId !== 'basic') {
                createToolCards(targetId);
            }
            
            // Animate section and cards
            gsap.to(targetSection, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });

            // Animate cards with stagger
            const cards = targetSection.querySelectorAll('.tool-card');
            gsap.from(cards, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            });

            // Initialize card interactions
            initializeToolCards();
        });
    });

    // Add hover effect animation
    categoryButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3
                });
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3
                });
            }
        });
    });
}

// Add this function to create tool cards dynamically
function createToolCards(section) {
    const toolsGrid = document.querySelector(`#${section} .tools-grid`);
    toolsGrid.innerHTML = ''; // Clear existing content

    toolSections[section].forEach(tool => {
        const card = document.createElement('div');
        card.className = `tool-card${section === 'premium' ? ' premium' : ''}`;
        card.dataset.category = section;

        card.innerHTML = `
            <div class="card-header">
                <i class="${tool.icon}"></i>
                <span class="tool-type${section === 'premium' ? ' premium' : ''}">${tool.category}</span>
            </div>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <div class="tool-stats">
                ${section === 'premium' 
                    ? `<span class="price"><i class="fas fa-tag"></i> ${tool.price}</span>`
                    : `<span class="downloads"><i class="fas fa-download"></i> ${tool.downloads}</span>`
                }
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${tool.rating}</span>
                </div>
            </div>
            <div class="card-actions">
                ${section === 'premium' 
                    ? `<button class="premium-action-btn">
                        <span>Try Premium</span>
                        <i class="fas fa-crown"></i>
                       </button>`
                    : `<button class="download-btn">
                        <span>Download</span>
                        <i class="fas fa-download"></i>
                       </button>
                       <button class="favorite-btn">
                        <i class="far fa-heart"></i>
                       </button>`
                }
            </div>
        `;

        toolsGrid.appendChild(card);
    });
}

document.querySelector('.premium-unlock-btn').addEventListener('click', () => {
    alert('Upgrade to access premium tools!');
});

document.getElementById('toolSearch').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const toolName = card.querySelector('h3').textContent.toLowerCase();
        if (toolName.includes(searchValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

document.querySelectorAll('.cyber-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.cyber-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const section = this.getAttribute('data-section');
        document.querySelectorAll('.tools-section').forEach(sec => {
            if (sec.id === section) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    });
});

document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.documentElement.toggleAttribute('data-theme', 'dark');
    this.querySelector('i').classList.toggle('fa-moon');
    this.querySelector('i').classList.toggle('fa-sun');
});

// GSAP animations
gsap.from('.cyber-header', { duration: 1, y: -100, opacity: 0, ease: 'bounce' });
gsap.from('.tools-nav', { duration: 1, y: -100, opacity: 0, delay: 0.5, ease: 'bounce' });
gsap.from('.tools-container', { duration: 1, opacity: 0, delay: 1, ease: 'power2.inOut' });
