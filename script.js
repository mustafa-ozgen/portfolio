// Dil ayarları
let currentLanguage = 'en';

// Desteklenen medya dosya uzantıları
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webp'];

// Projeleri yükle
async function loadProjects() {
    try {
        console.log('Loading projects...');
        const response = await fetch('projects.json');
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
        
        container.innerHTML = ''; // Mevcut projeleri temizle
        
        for (const project of data.projects) {
            console.log('Processing project:', project.folder);
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
            
            // Medya dosyalarını toplamak için dizi
            const mediaPromises = [];
            
            // Her uzantı için 1'den 10'a kadar dosya kontrolü yap
            for (let i = 1; i <= 10; i++) {
                for (const ext of supportedExtensions) {
                    const mediaPath = `projects/${project.folder}/${i}${ext}`;
                    
                    // Dosyanın varlığını kontrol et ve promise olarak ekle
                    const mediaPromise = fetch(mediaPath)
                        .then(response => {
                            if (response.ok) {
                                console.log('Media file found:', mediaPath);
                                const isVideo = ext === '.mp4';
                                const mediaElement = document.createElement('div');
                                mediaElement.className = 'project-media';
                                
                                if (isVideo) {
                                    // Video için thumbnail oluştur
                                    const thumbnailTime = project.videoThumbnailTime || 0;
                                    
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
                                    
                                    // Video yüklendiğinde thumbnail'i ayarla
                                    video.addEventListener('loadedmetadata', () => {
                                        video.currentTime = thumbnailTime;
                                    });
                                    
                                    playButton.addEventListener('click', () => {
                                        if (video.paused) {
                                            video.currentTime = 0;
                                            video.play();
                                            playButton.style.display = 'none';
                                        }
                                    });
                                    
                                    // Çift tıklama ile tam ekran
                                    let lastClick = 0;
                                    videoContainer.addEventListener('click', (e) => {
                                        const currentTime = new Date().getTime();
                                        const timeDiff = currentTime - lastClick;
                                        
                                        if (e.target !== playButton && e.target !== playButton.querySelector('i')) {
                                            if (timeDiff < 300) {
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
                                            }
                                            video.pause();
                                            playButton.style.display = 'flex';
                                        }
                                        lastClick = currentTime;
                                    });
                                    
                                    video.addEventListener('ended', () => {
                                        video.currentTime = thumbnailTime;
                                        playButton.style.display = 'flex';
                                    });

                                    video.addEventListener('pause', () => {
                                        playButton.style.display = 'flex';
                                    });
                                } else {
                                    mediaElement.innerHTML = `
                                        <img src="${mediaPath}" alt="${project.title[currentLanguage]}" loading="lazy" />
                                    `;
                                }
                                
                                return { index: i, element: mediaElement };
                            }
                            return null;
                        })
                        .catch(error => {
                            console.log(`Media file not found: ${mediaPath}`, error);
                            return null;
                        });
                    
                    mediaPromises.push(mediaPromise);
                }
            }
            
            // Tüm medya dosyalarının yüklenmesini bekle
            const mediaResults = await Promise.all(mediaPromises);
            
            // Sadece başarılı yüklenen ve null olmayan sonuçları filtrele ve sırala
            const sortedMedia = mediaResults
                .filter(result => result !== null)
                .sort((a, b) => a.index - b.index);
            
            // Sıralı medya öğelerini DOM'a ekle
            sortedMedia.forEach(result => {
                projectContent.appendChild(result.element);
            });
        }
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
  