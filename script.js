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

// Inline SVG ikonları (Font Awesome CDN bağımlılığını kaldırır)
const ICONS = {
    globe: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
    chevronDown: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>',
    externalLink: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
    play: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    envelope: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    linkedin: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
    sketchfab: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.5V7.5l-9-5-9 5v9l9 5 9-5zM12 4.15l6.96 3.87L12 11.89 5.04 8.02 12 4.15zM5 9.87l6 3.33v6.65l-6-3.33V9.87zm8 9.98v-6.65l6-3.33v6.65l-6 3.33z"/></svg>',
    artstation: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
    youtube: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>'
};

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
        // Tıklama play butonunun (veya içindeki ikonun) üzerinde değilse
        if (!this.playButton.contains(e.target)) {
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

// info.json tek seferlik yükleme (önbellek) — tekrar tekrar fetch'i engeller
let cachedInfoData = null;
let infoDataRequest = null;

function getInfoData() {
    if (cachedInfoData) {
        return Promise.resolve(cachedInfoData);
    }
    if (!infoDataRequest) {
        infoDataRequest = fetch('resources/info.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                cachedInfoData = data;
                return data;
            })
            .catch(error => {
                infoDataRequest = null; // Hata sonrası tekrar denenebilsin
                throw error;
            });
    }
    return infoDataRequest;
}

// Bir projeyi DOM elemanına dönüştür (senkron; gereksiz fetch yok)
function createProjectElement(project) {
    const projectElement = document.createElement('div');
    projectElement.className = 'project';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    const title = document.createElement('h3');
    title.textContent = project.title[currentLanguage];

    const subtitle = document.createElement('div');
    subtitle.className = 'project-subtitle';
    subtitle.textContent = project.subtitle[currentLanguage];

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'toggle-description';
    toggleButton.innerHTML = `
        <div class="toggle-icon">${ICONS.chevronDown}</div>
        <span class="toggle-text">${currentLanguage === 'en' ? 'Info' : 'Bilgi'}</span>
    `;

    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description[currentLanguage];

    if (project.link && project.link.trim() !== '') {
        const linkElement = document.createElement('a');
        linkElement.href = project.link;
        linkElement.className = 'project-link';
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.innerHTML = `${ICONS.externalLink} ${currentLanguage === 'tr' ? 'Projeyi Görüntüle' : 'View Project'}`;
        description.appendChild(document.createElement('br'));
        description.appendChild(linkElement);
    }

    titleContainer.appendChild(title);
    titleContainer.appendChild(subtitle);
    titleContainer.appendChild(toggleButton);

    const projectContent = document.createElement('div');
    projectContent.className = 'project-content';

    projectElement.appendChild(titleContainer);
    projectElement.appendChild(description);
    projectElement.appendChild(projectContent);

    // Toggle: yüksekliği gerçek içerik yüksekliğine göre ayarla (kırpma yok)
    toggleButton.addEventListener('click', () => {
        const expanded = description.classList.toggle('expanded');
        toggleButton.classList.toggle('expanded');
        description.style.maxHeight = expanded ? `${description.scrollHeight}px` : '0px';
    });

    // Medya dosyaları (önceden fetch ile indirmeden doğrudan oluştur)
    if (project.media && Array.isArray(project.media)) {
        const mediaItems = [];

        project.media.forEach(mediaFile => {
            const mediaPath = `projects/${project.folder}/${mediaFile}`;
            const mediaElement = document.createElement('div');
            mediaElement.className = 'project-media';

            const ext = mediaFile.split('.').pop().toLowerCase();
            if (ext === 'mp4') {
                const thumbnailPath = `projects/${project.folder}/thumbnail.webp`;
                mediaElement.innerHTML = `
                    <div class="video-container">
                        <video muted playsinline preload="none" poster="${thumbnailPath}">
                            <source src="${mediaPath}" type="video/mp4">
                        </video>
                        <button type="button" class="play-button" aria-label="${currentLanguage === 'tr' ? 'Videoyu oynat' : 'Play video'}">
                            ${ICONS.play}
                        </button>
                    </div>
                `;

                const video = mediaElement.querySelector('video');
                const playButton = mediaElement.querySelector('.play-button');
                const videoContainer = mediaElement.querySelector('.video-container');
                new VideoHandler(video, playButton, videoContainer);
            } else {
                if (ext === 'gif') {
                    mediaElement.classList.add('media-gif');
                }
                mediaElement.innerHTML = `
                    <img src="${mediaPath}" alt="${project.title[currentLanguage]}" loading="lazy" />
                `;
                // Yüklenemeyen medyayı sessizce kaldır
                const img = mediaElement.querySelector('img');
                img.addEventListener('error', () => mediaElement.remove());
            }

            const index = parseInt(mediaFile.split('.')[0], 10) || 0;
            mediaItems.push({ index, element: mediaElement });
        });

        // Sıralı medya öğelerini DOM'a ekle
        mediaItems
            .sort((a, b) => a.index - b.index)
            .forEach(result => {
                projectContent.appendChild(result.element);
            });
    }

    return projectElement;
}

// Projeleri yükle
async function loadProjects() {
    if (isLoadingProjects) {
        return;
    }

    try {
        isLoadingProjects = true;
        const response = await fetch('resources/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

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

            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            const categoryHeader = document.createElement('h2');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = data.categories[categoryKey][currentLanguage];
            categorySection.appendChild(categoryHeader);

            const projectsWrapper = document.createElement('div');
            projectsWrapper.className = 'category-projects';

            categoryProjects.forEach(project => {
                projectsWrapper.appendChild(createProjectElement(project));
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
        terminal.scrollTop = 0;
    }

    // Aktif sayfayı göster
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.remove('hidden');
        activePage.classList.add('visible');

        // Başlığı güncelle
        const title = activePage.querySelector('h1');
        if (title) {
            const newText = title.dataset[currentLanguage];
            if (newText) {
                title.textContent = newText;
            }
        }

        activePage.scrollTop = 0;

        // Sayfa içindeki scrollable elementlerin pozisyonunu sıfırla
        const scrollableElements = activePage.querySelectorAll('.project-content, .project-description');
        scrollableElements.forEach(element => {
            element.scrollTop = 0;
        });
    }

    // Window scroll pozisyonunu sıfırla
    window.scrollTo(0, 0);
}

// Deneyim süresini hesapla (dile göre lokalize)
function calculateExperienceDuration(startDate) {
    const start = new Date(startDate);
    const now = new Date();

    let totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) {
        totalMonths--;
    }
    if (totalMonths < 0) {
        totalMonths = 0;
    }

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    const isTr = currentLanguage === 'tr';

    const parts = [];
    if (years > 0) {
        parts.push(isTr ? `${years} yıl` : `${years} year${years > 1 ? 's' : ''}`);
    }
    if (remainingMonths > 0) {
        parts.push(isTr ? `${remainingMonths} ay` : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`);
    }

    return parts.join(' ') || (isTr ? '0 ay' : '0 months');
}

// About me ve deneyimler bilgilerini yükle
async function loadAboutInfo() {
    try {
        const data = await getInfoData();

        // About me açıklamasını güncelle
        const aboutDescription = document.querySelector('#about p[data-tr]');
        if (aboutDescription) {
            aboutDescription.innerHTML = data.about[currentLanguage].description;
        }

        // Deneyimleri güncelle
        const experienceContainer = document.querySelector('#about p[data-tr]:last-of-type');
        if (experienceContainer) {
            const experienceTitle = currentLanguage === 'tr' ? 'Profesyonel Deneyim:' : 'Professional Experience:';
            let experienceHTML = `<br /><br /><strong>${experienceTitle}</strong><br /><br />`;

            data.about[currentLanguage].experience.forEach(exp => {
                experienceHTML += `<strong>${exp.company}</strong> – ${exp.title}<br />`;

                // Devam eden deneyimlerde süreyi dinamik hesapla
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

// İletişim bilgilerini yükle
async function loadContactInfo() {
    try {
        const data = await getInfoData();

        const contactContainer = document.querySelector('#contact .contact-container');
        if (contactContainer) {
            const contactData = data.contact;

            // İş teklifleri bölümü
            const businessSection = document.createElement('div');
            businessSection.className = 'contact-section';
            businessSection.innerHTML = `
                <h2>${contactData.business.titles[currentLanguage]}</h2>
                <div class="contact-item">
                    ${ICONS.envelope}
                    <a href="mailto:${contactData.business.email}" class="terminal-link">${contactData.business.email}</a>
                </div>
            `;

            // Sosyal medya bölümü (rel="noopener noreferrer" eklendi)
            const socialSection = document.createElement('div');
            socialSection.className = 'contact-section';
            socialSection.innerHTML = `
                <h2>${contactData.social.titles[currentLanguage]}</h2>
                <div class="social-links">
                    ${contactData.social.links.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="terminal-link">
                            ${ICONS[link.icon] || ICONS.globe}
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
    const projectsEl = document.getElementById('projects');
    const projectsScroll = projectsEl ? projectsEl.scrollTop : 0;

    currentLanguage = lang;

    // Dil butonunu güncelle - alternatifi göster
    const langLabel = document.querySelector('.current-lang');
    if (langLabel) {
        langLabel.textContent = lang === 'en' ? 'TR' : 'EN';
    }

    // HTML lang attribute'unu güncelle
    document.documentElement.lang = lang;

    // Tüm çevrilebilir elementleri güncelle (boş çevirileri atla → flash olmaz)
    document.querySelectorAll('[data-tr]').forEach(element => {
        const newText = element.dataset[lang];
        if (newText === undefined || newText === '') {
            return;
        }
        if (element.tagName === 'IMG') {
            element.alt = newText;
        } else if (element.tagName === 'H1') {
            element.textContent = newText;
        } else {
            element.innerHTML = newText;
        }
    });

    // About me ve deneyimleri güncelle
    loadAboutInfo();

    // İletişim bilgilerini güncelle
    loadContactInfo();

    // Projeleri yeniden yükle ve scroll pozisyonlarını geri yükle
    return loadProjects().then(() => {
        window.scrollTo(0, currentScroll);
        if (projectsEl) {
            projectsEl.scrollTop = projectsScroll;
        }
    });
}

// Dil değiştirme toggle fonksiyonu
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'tr' : 'en';
    changeLanguage(newLang);
}

// Uygulama başlatma
function init() {
    // Dili ayarla (dinamik içerikleri de yükler: about, contact, projects)
    changeLanguage('en');

    // Başlangıç sayfasını göster
    showPage('about');

    // Profil fotoğrafını yükle
    loadProfileImage();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}