// Utility functions
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

// Video handling class
class VideoHandler {
    constructor(videoElement, playButton, videoContainer) {
        this.video = videoElement;
        this.playButton = playButton;
        this.videoContainer = videoContainer;
        this.lastClick = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.playButton.addEventListener('click', () => this.handlePlay());
        this.videoContainer.addEventListener('click', (e) => this.handleContainerClick(e));
        this.video.addEventListener('ended', () => this.handleVideoEnd());
        this.video.addEventListener('pause', () => this.handleVideoPause());
    }

    handlePlay() {
        if (this.video.paused) {
            this.video.currentTime = 0;
            this.video.play();
            this.playButton.style.display = 'none';
        }
    }

    handleContainerClick(e) {
        if (e.target !== this.playButton && e.target !== this.playButton.querySelector('i')) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - this.lastClick;
            
            if (timeDiff < 300) {
                this.toggleFullscreen();
            }
            this.video.pause();
            this.playButton.style.display = 'flex';
            this.lastClick = currentTime;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.videoContainer.requestFullscreen) {
                this.videoContainer.requestFullscreen();
            } else if (this.videoContainer.webkitRequestFullscreen) {
                this.videoContainer.webkitRequestFullscreen();
            } else if (this.videoContainer.msRequestFullscreen) {
                this.videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    handleVideoEnd() {
        this.video.currentTime = this.video.dataset.thumbnailTime || 0;
        this.playButton.style.display = 'flex';
    }

    handleVideoPause() {
        this.playButton.style.display = 'flex';
    }
}

// Dil ayarları
let currentLanguage = 'en';
let isLoadingProjects = false; // Yükleme durumunu takip etmek için

// Desteklenen medya dosya uzantıları
const supportedExtensions = ['.gif', '.webp', '.mp4', '.jpg', '.jpeg', '.png'];

// Projeleri yükle
async function loadProjects() {
    if (isLoadingProjects) {
        console.log('Projects are already loading...');
        return;
    }
    
    try {
        isLoadingProjects = true;
        console.log('Loading projects...');
        const response = await fetch('resources/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Projects data loaded:', data);
        
        const container = document.getElementById('projects-container');
        if (!container) {
            console.error('Projects container not found!');
            return;
        }
        
        // Mevcut projeleri temizle
        container.innerHTML = '';
        
        // Projeleri kategorilere göre grupla
        const categorizedProjects = {};
        data.projects.forEach(project => {
            if (!categorizedProjects[project.category]) {
                categorizedProjects[project.category] = [];
            }
            categorizedProjects[project.category].push(project);
        });
        
        // Her kategori için bir bölüm oluştur
        for (const categoryKey in data.categories) {
            const categoryProjects = categorizedProjects[categoryKey];
            if (!categoryProjects || categoryProjects.length === 0) continue;
            
            // Kategori başlığı oluştur
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryHeader = document.createElement('h2');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = data.categories[categoryKey][currentLanguage];
            categorySection.appendChild(categoryHeader);
            
            const projectsWrapper = document.createElement('div');
            projectsWrapper.className = 'category-projects';
            
            // Her bir proje için Promise oluştur
            const projectPromises = categoryProjects.map(async (project) => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project';
                
                // Başlık ve açıklama için container oluştur
                const titleContainer = document.createElement('div');
                titleContainer.className = 'title-container';
                
                // Başlık
                const title = document.createElement('h3');
                title.textContent = project.title[currentLanguage];
                
                // Alt başlık
                const subtitle = document.createElement('div');
                subtitle.className = 'project-subtitle';
                subtitle.textContent = project.subtitle[currentLanguage];
                
                // Açıklama toggle butonu
                const toggleButton = document.createElement('button');
                toggleButton.className = 'toggle-description';
                toggleButton.innerHTML = `
                    <div class="toggle-icon">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <span class="toggle-text">${currentLanguage === 'en' ? 'Info' : 'Bilgi'}</span>
                `;
                
                // Açıklama
                const description = document.createElement('p');
                description.className = 'project-description';
                description.textContent = project.description[currentLanguage];
                
                // Link varsa ekle
                if (project.link && project.link.trim() !== '') {
                    const linkElement = document.createElement('a');
                    linkElement.href = project.link;
                    linkElement.className = 'project-link';
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.innerHTML = `
                        <i class="fas fa-external-link-alt"></i>
                        ${currentLanguage === 'tr' ? 'Projeyi Görüntüle' : 'View Project'}
                    `;
                    description.appendChild(document.createElement('br'));
                    description.appendChild(linkElement);
                }
                
                // Başlık container'ına elementleri ekle
                titleContainer.appendChild(title);
                titleContainer.appendChild(subtitle);
                titleContainer.appendChild(toggleButton);
                
                // Proje içeriği için container
                const projectContent = document.createElement('div');
                projectContent.className = 'project-content';
                
                projectElement.appendChild(titleContainer);
                projectElement.appendChild(description);
                projectElement.appendChild(projectContent);
                
                // Toggle butonu için event listener
                toggleButton.addEventListener('click', () => {
                    description.classList.toggle('expanded');
                    toggleButton.classList.toggle('expanded');
                });
                
                // Medya dosyalarını toplamak için dizi
                const mediaPromises = [];
                
                // Sadece projects.json'da belirtilen medya dosyalarını yükle
                if (project.media && Array.isArray(project.media)) {
                    for (const mediaFile of project.media) {
                        const mediaPath = `projects/${project.folder}/${mediaFile}`;
                        try {
                            const response = await fetch(mediaPath);
                            if (response.ok) {
                                const mediaElement = document.createElement('div');
                                mediaElement.className = 'project-media';
                                
                                const ext = mediaFile.split('.').pop().toLowerCase();
                                if (ext === 'mp4') {                                    // Her proje için özel thumbnail kullan
                                    const thumbnailPath = `projects/${project.folder}/thumbnail.webp`;
                                    
                                    mediaElement.innerHTML = `
                                        <div class="video-container">
                                            <video muted playsinline preload="none" poster="${thumbnailPath}">
                                                <source src="${mediaPath}" type="video/mp4">
                                            </video>
                                            <button class="play-button">
                                                <i class="fas fa-play"></i>
                                            </button>
                                        </div>
                                    `;
                                    
                                    const video = mediaElement.querySelector('video');
                                    const playButton = mediaElement.querySelector('.play-button');
                                    const videoContainer = mediaElement.querySelector('.video-container');
                                    
                                    new VideoHandler(video, playButton, videoContainer);
                                } else {
                                    mediaElement.innerHTML = `
                                        <img src="${mediaPath}" alt="${project.title[currentLanguage]}" loading="lazy" />
                                    `;
                                }
                                
                                const index = parseInt(mediaFile.split('.')[0]);
                                mediaPromises.push({ index, element: mediaElement });
                            }
                        } catch (error) {
                            console.log(`Error loading media file: ${mediaPath}`);
                        }
                    }
                }
                
                // Sıralı medya öğelerini DOM'a ekle
                mediaPromises
                    .sort((a, b) => a.index - b.index)
                    .forEach(result => {
                        projectContent.appendChild(result.element);
                    });
                
                return projectElement;
            });
            
            // Tüm projelerin yüklenmesini bekle ve category-projects'e ekle
            const projectElements = await Promise.all(projectPromises);
            projectElements.forEach(element => {
                projectsWrapper.appendChild(element);
            });
            
            categorySection.appendChild(projectsWrapper);
            container.appendChild(categorySection);
        }
    } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
    } finally {
        isLoadingProjects = false;
    }
}

// Profil fotoğrafını yükle
async function loadProfileImage() {
    const profileImage = document.getElementById('profileImage');
    const imageExtensions = ['.webp', '.jpeg', '.jpg', '.png'];
    const isMobile = window.innerWidth <= 768;
    
    // Mobil cihazlar için farklı bir fotoğraf kullan
    const imageName = isMobile ? 'profile2' : 'profile';
    
    for (const ext of imageExtensions) {
        try {
            const response = await fetch(`images/${imageName}${ext}`);
            if (response.ok) {
                const img = document.createElement('img');
                img.src = `images/${imageName}${ext}`;
                img.alt = 'Profile Picture';
                profileImage.appendChild(img);
                break;
            }
        } catch (error) {
            console.log(`Profile image with extension ${ext} not found`);
        }
    }
}

// Ekran boyutu değiştiğinde profil fotoğrafını güncelle
window.addEventListener('resize', debounce(() => {
    const profileImage = document.getElementById('profileImage');
    profileImage.innerHTML = ''; // Mevcut fotoğrafı temizle
    loadProfileImage(); // Yeni fotoğrafı yükle
}, 250));

// Terminal boot-up animasyonu
function initializeTerminal() {
    const terminal = document.querySelector('.terminal');
    const menu = document.querySelector('.menu');
    const pages = document.querySelectorAll('.page');
    
    // Terminal başlangıç animasyonu
    terminal.style.opacity = '0';
    terminal.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        terminal.style.transition = 'all 0.5s ease';
        terminal.style.opacity = '1';
        terminal.style.transform = 'scale(1)';
        
        // Menü butonlarını sırayla göster
        const buttons = menu.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 500);
}

// Matrix benzeri arka plan efekti
function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const terminal = document.querySelector('.terminal');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.1';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    terminal.appendChild(canvas);
    
    let width = canvas.width = terminal.offsetWidth;
    let height = canvas.height = terminal.offsetHeight;
    
    const columns = Math.floor(width / 20);
    const drops = new Array(columns).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    // Pencere yeniden boyutlandırıldığında canvas'ı güncelle
    window.addEventListener('resize', () => {
        width = canvas.width = terminal.offsetWidth;
        height = canvas.height = terminal.offsetHeight;
    });
}

// Sayfa geçiş animasyonları
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const targetPage = document.getElementById(pageId);
    
    pages.forEach(page => {
        if (page === targetPage) {
            page.style.display = 'block';
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                page.style.transition = 'all 0.5s ease';
                page.style.opacity = '1';
                page.style.transform = 'translateY(0)';
                page.classList.add('visible');
            }, 50);
        } else {
            page.style.opacity = '0';
            page.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                page.style.display = 'none';
                page.classList.remove('visible');
            }, 300);
        }
    });
}

// Proje kartları için hover efektleri
function initializeProjectCards() {
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        project.addEventListener('mousemove', (e) => {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            project.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        project.addEventListener('mouseleave', () => {
            project.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Terminal efekti için yazı animasyonu
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// About me ve deneyimler bilgilerini yükle
async function loadAboutInfo() {
    try {
        const response = await fetch('resources/info.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // About me açıklamasını güncelle
        const aboutDescription = document.querySelector('#about p[data-tr]');
        if (aboutDescription) {
            aboutDescription.innerHTML = data.about[currentLanguage].description;
        }
        
        // Deneyimleri güncelle
        const experienceContainer = document.querySelector('#about p[data-tr]:last-of-type');
        if (experienceContainer) {
            let experienceHTML = '<br /><br /><strong>Profesyonel Deneyim:</strong><br /><br />';
            
            data.about[currentLanguage].experience.forEach(exp => {
                experienceHTML += `<strong>${exp.company}</strong> – ${exp.title}<br />`;
                
                // Eğer bu deneyim devam ediyorsa (startDate varsa), süreyi dinamik hesapla
                if (exp.startDate) {
                    const duration = calculateExperienceDuration(exp.startDate);
                    experienceHTML += `${exp.period} (${duration})<br />`;
                } else {
                    experienceHTML += `${exp.period}<br />`;
                }
                
                exp.responsibilities.forEach(resp => {
                    experienceHTML += `• ${resp}<br />`;
                });
                
                experienceHTML += '<br />';
            });
            
            experienceContainer.innerHTML = experienceHTML;
        }
    } catch (error) {
        console.error('About info yüklenirken hata oluştu:', error);
    }
}

// Deneyim süresini hesapla
function calculateExperienceDuration(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    
    let totalMonths = yearDiff * 12 + monthDiff;
    if (now.getDate() < start.getDate()) {
        totalMonths--;
    }
    
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    
    if (years > 0) {
        return `${years} yıl ${remainingMonths > 0 ? remainingMonths + ' ay' : ''}`;
    } else {
        return `${remainingMonths} ay`;
    }
}

// İletişim bilgilerini yükle
async function loadContactInfo() {
    try {
        const response = await fetch('resources/info.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const contactContainer = document.querySelector('#contact .contact-container');
        if (contactContainer) {
            const contactData = data.contact;
            
            // İş teklifleri bölümü
            const businessSection = document.createElement('div');
            businessSection.className = 'contact-section';
            businessSection.innerHTML = `
                <h2>${contactData.business.titles[currentLanguage]}</h2>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${contactData.business.email}" class="terminal-link">${contactData.business.email}</a>
                </div>
            `;
            
            // Sosyal medya bölümü
            const socialSection = document.createElement('div');
            socialSection.className = 'contact-section';
            socialSection.innerHTML = `
                <h2>${contactData.social.titles[currentLanguage]}</h2>
                <div class="social-links">
                    ${contactData.social.links.map(link => `
                        <a href="${link.url}" target="_blank" class="terminal-link">
                            <i class="${link.icon}"></i>
                            <span>${link.name}</span>
                        </a>
                    `).join('')}
                </div>
            `;
            
            // Mevcut içeriği temizle ve yeni içeriği ekle
            contactContainer.innerHTML = '';
            contactContainer.appendChild(businessSection);
            contactContainer.appendChild(socialSection);
        }
    } catch (error) {
        console.error('Contact info yüklenirken hata oluştu:', error);
    }
}

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    // Mevcut scroll pozisyonunu kaydet
    const currentScroll = window.scrollY;
    const projectsScroll = document.getElementById('projects').scrollTop;
    
    currentLanguage = lang;
    
    // Dil butonunu güncelle
    document.querySelector('.current-lang').textContent = lang.toUpperCase();
    
    // HTML lang attribute'unu güncelle
    document.documentElement.lang = lang;
    
    // Tüm çevrilebilir elementleri güncelle
    document.querySelectorAll('[data-tr]').forEach(element => {
        if (element.tagName === 'IMG') {
            element.alt = element.dataset[lang];
        } else {
            const newText = element.dataset[lang];
            if (element.tagName === 'H1') {
                element.textContent = newText;
            } else {
                element.innerHTML = newText;
            }
        }
    });
    
    // About me ve deneyimleri güncelle
    loadAboutInfo();
    
    // İletişim bilgilerini güncelle
    loadContactInfo();
    
    // Projeleri yeniden yükle
    loadProjects().then(() => {
        // Scroll pozisyonlarını geri yükle
        window.scrollTo(0, currentScroll);
        document.getElementById('projects').scrollTop = projectsScroll;
    });
}

// Dil değiştirme toggle fonksiyonu
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'tr' : 'en';
    changeLanguage(newLang);
}

// Sayfa yüklendiğinde
window.onload = () => {
    // Terminal başlangıç animasyonu
    initializeTerminal();
    
    // Matrix efekti
    createMatrixEffect();
    
    // Proje kartları için hover efektleri
    initializeProjectCards();
    
    // Mevcut işlevleri çağır
    changeLanguage('tr');
    showPage('about');
    loadAboutInfo();
    loadContactInfo();
    loadProjects();
    loadProfileImage();
    
    // Intersection Observer ile sayfa görünürlüğünü kontrol et
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                if (pageId === 'projects') {
                    // Projects sayfası görünür olduğunda, yükleme tamamlanmamışsa bekle
                    loadProjects().then(() => {
                        console.log('Projects page fully loaded');
                    });
                }
            }
        });
    }, { threshold: 0.1 });
    
    // Tüm sayfaları gözlemle
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page);
    });
};
