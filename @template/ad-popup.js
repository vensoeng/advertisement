/**
 * Advertisement Popup Manager
 * Handles showing, hiding, and managing the ad popup
 */

class AdPopupManager {
    constructor(options = {}) {
        // Configuration
        this.overlay = document.getElementById('adPopupOverlay');
        this.container = document.getElementById('adPopupContainer');
        this.closeBtn = document.getElementById('closeBtn');
        this.ctaBtn = document.querySelector('.ad-cta-btn');
        
        // Options
        this.autoShowDelay = options.autoShowDelay || 3000; // 3 seconds
        this.autoShow = options.autoShow !== false; // Default true
        this.onClose = options.onClose || null;
        this.onCTAClick = options.onCTAClick || null;
        this.showAnimation = options.showAnimation || true;
        
        this.init();
    }
    
    init() {
        // Close button event
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        // CTA button event
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => this.handleCTAClick());
        }
        
        // Close on overlay click (outside popup)
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }
        
        // Keyboard escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });
        
        // Auto show if enabled
        if (this.autoShow) {
            setTimeout(() => this.show(), this.autoShowDelay);
        }
    }
    
    show() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('hidden');
        
        if (this.showAnimation && this.container) {
            // Reset animation
            this.container.style.animation = 'none';
            
            // Trigger reflow
            void this.container.offsetWidth;
            
            // Re-apply animation
            this.container.style.animation = 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    hide() {
        if (!this.overlay) return;
        
        // Fade out animation
        this.overlay.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        
        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.overlay.style.animation = '';
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Call callback
            if (this.onClose && typeof this.onClose === 'function') {
                this.onClose();
            }
        }, 300);
    }
    
    isVisible() {
        return this.overlay && !this.overlay.classList.contains('hidden');
    }
    
    handleCTAClick() {
        // Call callback if provided
        if (this.onCTAClick && typeof this.onCTAClick === 'function') {
            this.onCTAClick();
        } else {
            // Default behavior - close the popup
            this.hide();
        }
    }
    
    toggle() {
        this.isVisible() ? this.hide() : this.show();
    }
    
    /**
     * Update configuration options
     */
    setOptions(options = {}) {
        if (options.autoShowDelay !== undefined) this.autoShowDelay = options.autoShowDelay;
        if (options.onClose !== undefined) this.onClose = options.onClose;
        if (options.onCTAClick !== undefined) this.onCTAClick = options.onCTAClick;
    }
    
    /**
     * Update text content
     */
    updateText(textConfig = {}) {
        if (textConfig.label && document.querySelector('.ad-label')) {
            document.querySelector('.ad-label').textContent = textConfig.label;
        }
        if (textConfig.price && document.querySelector('.amount')) {
            document.querySelector('.amount').textContent = textConfig.price;
        }
        if (textConfig.title && document.querySelector('.ad-title')) {
            document.querySelector('.ad-title').textContent = textConfig.title;
        }
        if (textConfig.subtitle && document.querySelector('.ad-subtitle')) {
            document.querySelector('.ad-subtitle').textContent = textConfig.subtitle;
        }
        if (textConfig.ctaText && this.ctaBtn) {
            this.ctaBtn.textContent = textConfig.ctaText;
        }
    }
    
    /**
     * Update features list
     */
    updateFeatures(features = []) {
        const featuresList = document.querySelector('.ad-features');
        if (!featuresList) return;
        
        featuresList.innerHTML = features.map(feature => `
            <li>
                <svg class="checkmark" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.2L4.8 12m-1 1L9 20l11-11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${feature}</span>
            </li>
        `).join('');
    }
}

/**
 * Fade out animation for overlay
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Initialize popup on document load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adPopup = new AdPopupManager({
            autoShowDelay: 1000, // Show after 1 second
            autoShow: true,
            onCTAClick: function() {
                console.log('CTA button clicked!');
                // Customize this callback based on your needs
                alert('Premium Portfolio CTA clicked!');
                this.hide();
            }
        });
    });
} else {
    window.adPopup = new AdPopupManager({
        autoShowDelay: 1000,
        autoShow: true,
        onCTAClick: function() {
            console.log('CTA button clicked!');
            alert('Premium Portfolio CTA clicked!');
            this.hide();
        }
    });
}
