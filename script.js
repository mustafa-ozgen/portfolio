// Dil ayarları
let currentLanguage = 'en';

// Desteklenen medya dosya uzantıları
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webp'];

// Projeleri yükle
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const container = document.getElementById('projects-container');
        container.innerHTML = ''; // Mevcut projeleri temizle
        
        data.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            
            // Önce başlık ve açıklamayı ekle
            projectElement.innerHTML = `
                <h2>${project.title[currentLanguage]}</h2>
                <p>${project.description[currentLanguage]}</p>
                <div class="project-content"></div>
            `;
            
            container.appendChild(projectElement);
            
            // Proje klasöründeki medya dosyalarını kontrol et
            const projectContent = projectElement.querySelector('.project-content');
            
            // Her uzantı için 1'den 10'a kadar dosya kontrolü yap
            for (let i = 1; i <= 10; i++) {
                supportedExtensions.forEach(ext => {
                    const mediaPath = `projects/${project.folder}/${i}${ext}`;
                    
                    // Dosyanın varlığını kontrol et
                    fetch(mediaPath)
                        .then(response => {
                            if (response.ok) {
                                const isVideo = ext === '.mp4';
                                const mediaElement = document.createElement('div');
                                mediaElement.className = 'project-media';
                                
                                if (isVideo) {
                                    mediaElement.innerHTML = `
                                        <div class="video-container">
                                            <video muted>
                                                <source src="${mediaPath}" type="video/mp4">
                                            </video>
                                            <button class="play-button">
                                                <i class="fas fa-terminal"></i>
                                            </button>
                                        </div>
                                    `;
                                    
                                    const video = mediaElement.querySelector('video');
                                    const playButton = mediaElement.querySelector('.play-button');
                                    const videoContainer = mediaElement.querySelector('.video-container');
                                    
                                    playButton.addEventListener('click', () => {
                                        if (video.paused) {
                                            video.play();
                                            playButton.style.display = 'none';
                                        }
                                    });
                                    
                                    // Çift tıklama ile tam ekran
                                    let lastClick = 0;
                                    videoContainer.addEventListener('click', (e) => {
                                        const currentTime = new Date().getTime();
                                        const timeDiff = currentTime - lastClick;
                                        
                                        // Eğer tıklanan element play butonu değilse
                                        if (e.target !== playButton && e.target !== playButton.querySelector('i')) {
                                            if (timeDiff < 300) { // 300ms içinde çift tıklama
                                                if (!document.fullscreenElement) {
                                                    if (videoContainer.requestFullscreen) {
                                                        videoContainer.requestFullscreen();
                                                    } else if (videoContainer.webkitRequestFullscreen) {
                                                        videoContainer.webkitRequestFullscreen();
                                                    } else if (videoContainer.msRequestFullscreen) {
                                                        videoContainer.msRequestFullscreen();
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
                                            } else if (!video.paused) {
                                                video.pause();
                                                playButton.style.display = 'flex';
                                            }
                                        }
                                        lastClick = currentTime;
                                    });
                                    
                                    video.addEventListener('ended', () => {
                                        video.currentTime = 0; // Videoyu başa sar
                                        playButton.style.display = 'flex';
                                    });

                                    video.addEventListener('pause', () => {
                                        playButton.style.display = 'flex';
                                    });
                                } else {
                                    mediaElement.innerHTML = `
                                        <img src="${mediaPath}" alt="${project.title[currentLanguage]}" />
                                    `;
                                }
                                
                                projectContent.appendChild(mediaElement);
                            }
                        })
                        .catch(() => {
                            // Dosya bulunamadı, sessizce devam et
                        });
                });
            }
        });
    } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
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
    const pages = document.querySelectorAll('.page');
    pages.forEach((page) => {
        page.classList.add('hidden');
        page.classList.remove('visible');
    });

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
    }
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
    
    // Projeleri yeniden yükle
    loadProjects();
}

// Sayfa yüklendiğinde
window.onload = () => {
    // Önce dili ayarla
    changeLanguage('en');
    // Sonra sayfayı göster
    showPage('about');
    loadProjects();
    loadProfileImage();
};
  