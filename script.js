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
    // Eğer yükleme devam ediyorsa, yeni bir yükleme başlatma
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
        
        // Her proje için bir Promise oluştur
        const projectPromises = data.projects.map(async (project) => {
            console.log('Processing project:', project.folder);
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            
            // Başlık ve açıklama için container oluştur
            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-container';
            
            // Başlık
            const title = document.createElement('h2');
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
                <span class="toggle-text">${currentLanguage === 'en' ? 'Info' : 'Detay'}</span>
            `;
            
            // Açıklama
            const description = document.createElement('p');
            description.className = 'project-description';
            description.textContent = project.description[currentLanguage];
            
            // Başlık container'ına başlık ve toggle butonunu ekle
            titleContainer.appendChild(title);
            titleContainer.appendChild(subtitle);
            titleContainer.appendChild(toggleButton);
            
            // Proje içeriği için container
            const projectContent = document.createElement('div');
            projectContent.className = 'project-content';
            
            // Tüm elementleri proje container'ına ekle
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
                            console.log('Media file found:', mediaPath);
                            const mediaElement = document.createElement('div');
                            mediaElement.className = 'project-media';
                            
                            // Dosya uzantısına göre işlem yap
                            const ext = mediaFile.split('.').pop().toLowerCase();
                            if (ext === 'mp4') {
                                // Video için thumbnail oluştur
                                const thumbnailTime = project.videoThumbnailTime || 0;
                                
                                mediaElement.innerHTML = `
                                    <div class="video-container">
                                        <video muted playsinline preload="metadata">
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
                                
                                video.dataset.thumbnailTime = thumbnailTime;
                                
                                // Video yüklendiğinde thumbnail'i ayarla
                                video.addEventListener('loadedmetadata', () => {
                                    video.currentTime = thumbnailTime;
                                    // Mobil için poster oluştur
                                    const canvas = document.createElement('canvas');
                                    canvas.width = video.videoWidth;
                                    canvas.height = video.videoHeight;
                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                    video.poster = canvas.toDataURL();
                                });
                                
                                new VideoHandler(video, playButton, videoContainer);
                            } else {
                                // Resim dosyaları için
                                mediaElement.innerHTML = `
                                    <img src="${mediaPath}" alt="${project.title[currentLanguage]}" loading="lazy" />
                                `;
                            }
                            
                            // Dosya numarasını al (1.gif -> 1)
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
        
        // Tüm projelerin yüklenmesini bekle ve container'a ekle
        const projectElements = await Promise.all(projectPromises);
        projectElements.forEach(element => {
            container.appendChild(element);
        });
        
    } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
    } finally {
        isLoadingProjects = false;
    }
}

// Profil fotoğrafını yükle
async function loadProfileImage() {
    const profileImage = document.getElementById('profileImage');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    for (const ext of imageExtensions) {
        try {
            const response = await fetch(`images/profile${ext}`);
            if (response.ok) {
                const img = document.createElement('img');
                img.src = `images/profile${ext}`;
                img.alt = 'Profile Picture';
                profileImage.appendChild(img);
                break;
            }
        } catch (error) {
            console.log(`Profile image with extension ${ext} not found`);
        }
    }
}

// Sayfa değiştirme fonksiyonu
function showPage(pageId) {
    // Önce tüm sayfaları gizle ve scroll pozisyonlarını sıfırla
    const pages = document.querySelectorAll('.page');
    pages.forEach((page) => {
        page.classList.add('hidden');
        page.classList.remove('visible');
        page.scrollTop = 0;
    });

    // Terminal container'ını bul
    const terminal = document.querySelector('.terminal');
    if (terminal) {
        // Terminal'in scroll pozisyonunu sıfırla
        terminal.scrollTop = 0;
    }

    // Aktif sayfayı göster
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.remove('hidden');
        activePage.classList.add('visible');
        
        // Başlıkları güncelle
        const title = activePage.querySelector('h1');
        if (title) {
            const newText = title.dataset[currentLanguage];
            title.textContent = newText;
        }

        // Sayfanın scroll pozisyonunu sıfırla
        activePage.scrollTop = 0;

        // Sayfanın içindeki tüm scrollable elementlerin pozisyonunu sıfırla
        const scrollableElements = activePage.querySelectorAll('.project-content, .project-description');
        scrollableElements.forEach(element => {
            element.scrollTop = 0;
        });
    }

    // Window scroll pozisyonunu sıfırla
    window.scrollTo(0, 0);
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
    currentLanguage = lang;
    
    // Dil butonlarını güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
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
    loadProjects();
}

// Sayfa yüklendiğinde
window.onload = () => {
    // Önce dili ayarla
    changeLanguage('en');
    // Sonra sayfayı göster
    showPage('about');
    
    // About me ve deneyimleri yükle
    loadAboutInfo();
    
    // İletişim bilgilerini yükle
    loadContactInfo();
    
    // Arka planda projeleri yüklemeye başla
    const loadProjectsPromise = loadProjects();
    
    // Profil fotoğrafını yükle
    loadProfileImage();
    
    // Intersection Observer ile sayfa görünürlüğünü kontrol et
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                if (pageId === 'projects') {
                    // Projects sayfası görünür olduğunda, yükleme tamamlanmamışsa bekle
                    loadProjectsPromise.then(() => {
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
  