const allowedHosts = [
    'example.com',
    'www.example.com',
];

if (!allowedHosts.includes(window.location.hostname)) {
    console.warn('Script blocked: unauthorized host', window.location.hostname);
    throw new Error('Unauthorized host');
}

const advertisement = `<section class="advertisement" style="position: fixed; height: max-content; z-index: 100000; right: 1.5rem; bottom: 1.5rem;">
        <div class="avtm" style="position: relative;">
            <div class="avtm-action" style="position: absolute; width: 1.8rem; height: 1.8rem; border-radius: 50rem; background: #9553DD; display: flex; align-items: center; justify-content: center; right: -0.5rem; top: -1rem; cursor: pointer;">
                <svg style="rotate: 45deg;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M12 18V6" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
            <a href="https://t.me/vensoeng" class="avtm-box" style="display: block;">
                <img id="adImage" src="https://github.com/vensoeng/My-photo/blob/main/vensoeng/card_portfolio.png?raw=true" alt="Premium portfolio ad" style="width: 100%; height: auto; display: block;" loading="lazy">
            </a>
        </div>
        <style> 
            .advertisement {opacity: 0; transform: translateY(24px) scale(0.92);transition: opacity 0.45s ease, transform 0.45s ease;will-change: opacity, transform;pointer-events: none;width: 300px !important;max-width: calc(100vw - 2rem);} 
            .advertisement.visible { opacity: 1;transform: translateY(0) scale(1);pointer-events: auto;} 
            .advertisement .avtm-box {border-radius: 24px;overflow: hidden;} 
            .advertisement img {display: block;width: 100%;height: auto;} 
            .avtm-action { transition: transform 0.2s ease, background 0.2s ease;} 
            .avtm-action:hover { transform: scale(1.06); background: #b069ff;}
        </style>
    </section>`;

async function waitForImageLoad(img) {
    if (img.complete && img.naturalWidth > 0) {
        return;
    }
    return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', () => reject(new Error('Image failed to load')), { once: true });
    });
}
async function animateAdvertisementPopup() {
    const ad = document.querySelector('.advertisement');
    const image = document.getElementById('adImage');
    if (!ad || !image) return;

    try {
        await waitForImageLoad(image);
    } catch (error) {
        console.warn('Advertisement image failed to load, showing popup anyway.', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 120));
    ad.classList.add('visible');
}
document.addEventListener('DOMContentLoaded', () => {
    var div = document.createElement('div');
    div.innerHTML = advertisement;
    document.body.append(div);
    animateAdvertisementPopup();

    const closeButton = document.querySelector('.avtm-action');
    closeButton?.addEventListener('click', () => {
        const ad = document.querySelector('.advertisement');
        if (!ad) return;
        ad.classList.remove('visible');
        ad.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        ad.style.opacity = '0';
        ad.style.transform = 'translateY(16px) scale(0.96)';
        setTimeout(() => ad.remove(), 300);
    });
});