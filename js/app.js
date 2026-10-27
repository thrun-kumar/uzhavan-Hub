// Uzhavan Hub - Main Application Controller & Router

class UzhavanApp {
  constructor() {
    this.currentView = 'landing';
    this.currentLang = 'en'; // 'en' or 'ta'
    this.userProfile = this.loadProfile();
    this.activeParams = {};
  }

  async init() {
    // Check if user has saved language
    const savedLang = localStorage.getItem('uzhavan_lang');
    if (savedLang) this.currentLang = savedLang;

    // Check if user came via direct start or demo
    const hasVisited = localStorage.getItem('uzhavan_visited');
    if (hasVisited) {
      this.currentView = 'dashboard';
    }

    // Dynamically load datasets from data/*.json if available
    if (window.UZHAVAN_DATA && typeof window.UZHAVAN_DATA.loadFromJSON === 'function') {
      try {
        await window.UZHAVAN_DATA.loadFromJSON();
      } catch (err) {
        console.log("Data loader handled in fallback mode", err);
      }
    }

    // Initialize Persistent Authentication & Plot Layer
    if (window.UzhavanAuth && typeof window.UzhavanAuth.init === 'function') {
      try {
        await window.UzhavanAuth.init();
      } catch (err) {
        console.warn("[UzhavanApp] Auth init note:", err);
      }
    }

    this.renderNavigation();
    this.navigate(this.currentView);
    this.setupListeners();

    // Register Progressive Web App (PWA) Service Worker for offline access
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          console.log('[Uzhavan PWA] Service worker active:', reg.scope);
        }).catch((err) => {
          console.log('[Uzhavan PWA] Service worker note:', err);
        });
      });
    }
  }

  loadProfile() {
    const saved = localStorage.getItem('uzhavan_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Profile parse error", e);
      }
    }
    // Default fallback to Murugan profile
    return { ...window.UZHAVAN_DATA.DEMO_PERSONAS[0] };
  }

  saveProfile(profileData) {
    this.userProfile = { ...this.userProfile, ...profileData };
    localStorage.setItem('uzhavan_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('uzhavan_visited', 'true');
    this.renderNavigation();
    this.showToast("Profile successfully updated & AI calibrated! 🌾", "success");
  }

  loadDemoProfile(personaId) {
    const persona = window.UZHAVAN_DATA.DEMO_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      this.saveProfile(persona);
      if (persona.language) {
        this.setLanguage(persona.language);
      }
      this.navigate('dashboard');
    }
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('uzhavan_lang', lang);
    const langSelect = document.getElementById('langToggle');
    if (langSelect) langSelect.value = lang;
    this.renderNavigation();
    this.navigate(this.currentView, this.activeParams);
    this.showToast(lang === 'ta' ? "தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது 🇮🇳" : "Switched to English 🌐", "info");
  }

  navigate(viewName, params = {}) {
    this.currentView = viewName;
    this.activeParams = params;

    // Highlight active nav item
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
        link.classList.remove('text-slate-700', 'hover:bg-emerald-50');
      } else {
        link.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        link.classList.add('text-slate-700', 'hover:bg-emerald-50');
      }
    });

    const container = document.getElementById('viewContainer');
    if (!container) return;

    // Hide/show sidebar for full-width views
    const sidebar = document.getElementById('mainSidebar');
    const header = document.getElementById('mainHeader');
    const fullWidthViews = ['landing', 'login', 'registration'];
    if (fullWidthViews.includes(viewName)) {
      if (sidebar) sidebar.classList.add('hidden');
      if (viewName === 'landing' && header) header.classList.add('hidden');
      else if (header) header.classList.remove('hidden');
    } else {
      if (sidebar) sidebar.classList.remove('hidden');
      if (header) header.classList.remove('hidden');
    }

    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Component Registry with defensive lookups to prevent 'Cannot read properties of undefined (reading render)'
    const componentMap = {
      landing: window.LandingComponent,
      registration: window.RegistrationComponent,
      login: window.LoginComponent,
      dashboard: window.DashboardComponent,
      decisionEngine: window.DecisionEngineComponent,
      plantWizard: window.PlantWizardComponent,
      farmServices: window.FarmServicesComponent,
      farmLabour: window.FarmLabourComponent,
      machineryRental: window.MachineryRentalComponent,
      veterinaryCare: window.VeterinaryCareComponent,
      weather: window.WeatherComponent,
      cropRisk: window.CropRiskComponent,
      profitPredictor: window.FarmFinanceComponent || window.ProfitPredictorComponent,
      farmFinance: window.FarmFinanceComponent || window.ProfitPredictorComponent,
      marketPrice: window.MarketPriceComponent,
      actionPlan: window.ActionPlanComponent,
      fertilizer: window.FertilizerComponent,
      cropHealth: window.CropHealthComponent,
      schemes: window.SchemesComponent,
      loans: window.LoansComponent,
      community: window.CommunityComponent,
      farmManagement: window.FarmManagementComponent || window.ProfileComponent,
      farmLingo: window.FarmLingoComponent,
      voiceAssistant: window.VoiceAssistantComponent,
      profile: window.ProfileComponent || window.FarmManagementComponent
    };

    const targetComponent = componentMap[viewName] || window.DashboardComponent;

    // Parameter passing for views that need it
    if (viewName === 'decisionEngine' && params.selectedCrop && targetComponent && targetComponent.selectCrop) {
      targetComponent.selectCrop(params.selectedCrop);
    }
    if (viewName === 'cropRisk' && params.cropId && targetComponent) {
      targetComponent.selectedCropId = params.cropId;
    }
    if (viewName === 'actionPlan' && params.cropId && targetComponent) {
      targetComponent.selectedCropId = params.cropId;
    }
    if (viewName === 'fertilizer' && params.cropId && targetComponent) {
      targetComponent.selectedCropId = params.cropId;
    }

    if (targetComponent && typeof targetComponent.render === 'function') {
      try {
        targetComponent.render(container);
      } catch (err) {
        console.error(`[Uzhavan App] Error rendering module "${viewName}":`, err);
        container.innerHTML = `
          <div class="agri-card p-8 rounded-2xl max-w-xl mx-auto text-center space-y-4 my-12 bg-white border border-emerald-200 shadow-lg">
            <span class="text-4xl">⚠️</span>
            <h2 class="text-xl font-black text-slate-900">Module Display Notice</h2>
            <p class="text-xs text-slate-600">This module is currently initializing. Please refresh or return to Dashboard.</p>
            <button onclick="window.UzhavanApp.navigate('dashboard')" class="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow-md">Return to Dashboard</button>
          </div>
        `;
      }
    } else {
      console.warn(`[Uzhavan App] Component for "${viewName}" missing valid render(). Falling back to Dashboard.`);
      if (window.DashboardComponent && typeof window.DashboardComponent.render === 'function') {
        window.DashboardComponent.render(container);
      }
    }
  }

  renderNavigation() {
    const isTa = this.currentLang === 'ta';
    const profile = this.userProfile || { name: 'Murugan', location: 'Madurai' };

    // Update Header
    const farmerBadge = document.getElementById('headerFarmerName');
    if (farmerBadge) {
      if (window.UzhavanAuth && window.UzhavanAuth.user) {
        const u = window.UzhavanAuth.user;
        const name = u.profile?.full_name || 'Farmer';
        const dist = u.profile?.district || 'Madurai';
        farmerBadge.innerText = `${name} (${dist})`;
      } else {
        const loc = (profile.location || 'Madurai').split(' ')[0];
        farmerBadge.innerText = (isTa ? (profile.nameTa || profile.name) : profile.name) + ` (${loc})`;
      }
    }

    // Complete Navigation list incorporating all 10 core modules + FarmLingo innovation + Auth
    const navItems = [
      { id: 'dashboard', icon: '🏠', labelEn: 'Dashboard', labelTa: 'முகப்பு' },
      { id: 'decisionEngine', icon: '🤖', labelEn: 'AI Decision Engine', labelTa: 'AI முடிவு எஞ்சின்', badge: 'Core' },
      { id: 'farmLingo', icon: '🌐', labelEn: 'FarmLingo (Translator)', labelTa: 'ஃபார்ம்லிங்கோ (மொழிபெயர்ப்பு)', badge: 'Innovation' },
      { id: 'plantWizard', icon: '🌱', labelEn: 'Crop Advisor', labelTa: 'பயிர் வழிகாட்டி' },
      { id: 'cropHealth', icon: '🐛', labelEn: 'Crop Doctor (Scanner)', labelTa: 'பயிர் மருத்துவர் (ஸ்கேனர்)' },
      { id: 'weather', icon: '🌦️', labelEn: 'Weather & Smart Alerts', labelTa: 'வானிலை & எச்சரிக்கை' },
      { id: 'marketPrice', icon: '💰', labelEn: 'Market Prices & Selling', labelTa: 'சந்தை விலை & விற்பனை' },
      { id: 'farmFinance', icon: '📊', labelEn: 'Farm Finance & Profit', labelTa: 'பண்ணை நிதி & லாபம்' },
      { id: 'farmServices', icon: '🛠️', labelEn: 'Farm Services Hub', labelTa: 'பண்ணை சேவைகள்' },
      { id: 'farmLabour', icon: '👨‍🌾', labelEn: 'Farm Labour Booking', labelTa: 'ஆட்கள் வாடகை' },
      { id: 'machineryRental', icon: '🚜', labelEn: 'Machinery Rental', labelTa: 'இயந்திர வாடகை' },
      { id: 'veterinaryCare', icon: '🐄', labelEn: 'Veterinary Care', labelTa: 'கால்நடை மருத்துவம்', badge: '24/7' },
      { id: 'community', icon: '👥', labelEn: 'Farmer Community (Q&A)', labelTa: 'உழவர் களம் (சமூகம்)' },
      { id: 'schemes', icon: '🏛️', labelEn: 'Government Schemes', labelTa: 'அரசு நலத்திட்டங்கள்' },
      { id: 'fertilizer', icon: '🧪', labelEn: 'Fertilizer Guide', labelTa: 'உர வழிகாட்டல்' },
      { id: 'farmManagement', icon: '📋', labelEn: 'Farm Management', labelTa: 'பண்ணை மேலாண்மை' },
      { id: 'actionPlan', icon: '📅', labelEn: 'Farming Plan', labelTa: 'விவசாய காலண்டர்' },
      { id: 'voiceAssistant', icon: '🎙️', labelEn: 'Uzhavan AI (Voice)', labelTa: 'உழவன் AI (குரல்)' },
      { id: 'profile', icon: '👤', labelEn: 'Farmer Profile', labelTa: 'சுயவிவரம்' },
      { id: 'registration', icon: '🌱', labelEn: 'Register Farmland', labelTa: 'புதிய பண்ணை பதிவு' },
      { id: 'login', icon: '🔑', labelEn: 'Farmer Sign In', labelTa: 'உழவர் உள்நுழைவு' }
    ];

    const navContainer = document.getElementById('sidebarNavList');
    if (navContainer) {
      navContainer.innerHTML = navItems.map(item => `
        <li>
          <button onclick="window.UzhavanApp.navigate('${item.id}'); window.UzhavanApp.closeMobileMenu();" 
            data-view="${item.id}"
            class="nav-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-700 hover:bg-emerald-50">
            <div class="flex items-center gap-2.5">
              <span class="text-base">${item.icon}</span>
              <span>${isTa ? item.labelTa : item.labelEn}</span>
            </div>
            ${item.badge ? `<span class="px-1.5 py-0.2 ${item.badge === 'Core' ? 'bg-amber-400 text-slate-950' : item.badge === '24/7' ? 'bg-rose-500 text-white' : 'bg-emerald-700 text-white'} rounded text-[9px] font-black uppercase">${item.badge}</span>` : ''}
          </button>
        </li>
      `).join('');
    }

    // Mobile Bottom Bar Quick Icons
    const mobileBottomBar = document.getElementById('mobileBottomNav');
    if (mobileBottomBar) {
      const quickItems = [
        { id: 'dashboard', icon: '🏠', label: isTa ? 'முகப்பு' : 'Home' },
        { id: 'decisionEngine', icon: '🤖', label: 'AI Engine' },
        { id: 'farmServices', icon: '🛠️', label: isTa ? 'சேவைகள்' : 'Services' },
        { id: 'veterinaryCare', icon: '🐄', label: isTa ? 'கால்நடை' : 'Vet Care' },
        { id: 'voiceAssistant', icon: '🎙️', label: 'Voice AI' }
      ];

      mobileBottomBar.innerHTML = quickItems.map(item => `
        <button onclick="window.UzhavanApp.navigate('${item.id}')" class="flex flex-col items-center justify-center py-1 text-slate-700 hover:text-emerald-800">
          <span class="text-lg">${item.icon}</span>
          <span class="text-[10px] font-bold mt-0.5">${item.label}</span>
        </button>
      `).join('');
    }
  }

  openPlantWizard() {
    this.navigate('plantWizard');
  }

  openProfileModal() {
    this.navigate('profile');
  }

  handleProfileSave(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const updated = {
      name: formData.get('farmerName'),
      location: formData.get('location'),
      landArea: parseFloat(formData.get('landArea')) || 2.5,
      soilType: formData.get('soilType'),
      waterSource: formData.get('waterSource'),
      budget: parseFloat(formData.get('budget')) || 50000,
      currentCrop: formData.get('currentCrop'),
      previousCrop: formData.get('previousCrop'),
      language: formData.get('language') || 'ta'
    };

    this.saveProfile(updated);
    if (updated.language && updated.language !== this.currentLang) {
      this.setLanguage(updated.language);
    }
    this.navigate('dashboard');
  }

  openArchitectureModal() {
    const isTa = this.currentLang === 'ta';
    const modal = document.getElementById('architectureModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeArchitectureModal() {
    const modal = document.getElementById('architectureModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  openShareModal() {
    const modal = document.getElementById('shareModal');
    if (!modal) return;

    // Detect actual host or fall back to local IP for mobile LAN access
    let shareUrl = 'http://192.168.29.117:8000';
    if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      shareUrl = window.location.origin + window.location.pathname;
    }

    const input = document.getElementById('mobileShareUrl');
    const qrImg = document.getElementById('qrCodeImg');
    if (input) input.value = shareUrl;
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  async copyShareUrl() {
    const input = document.getElementById('mobileShareUrl');
    const url = input ? input.value : 'http://192.168.29.117:8000';
    try {
      await navigator.clipboard.writeText(url);
      this.showToast('Link copied to clipboard! Open in mobile browser 📱', 'success');
    } catch (e) {
      if (input) {
        input.select();
        document.execCommand('copy');
        this.showToast('Link copied to clipboard! 📱', 'success');
      }
    }
  }

  triggerPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('Uzhavan Hub installed successfully! 🌾', 'success');
        }
        this.deferredPrompt = null;
        const btn = document.getElementById('pwaInstallBtn');
        if (btn) btn.classList.add('hidden');
      });
    } else {
      this.showToast('Tap your browser menu and choose "Add to Home Screen"', 'info');
    }
  }

  toggleMobileMenu() {
    const sidebar = document.getElementById('mainSidebar');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  }

  closeMobileMenu() {
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('mainSidebar');
      if (sidebar) sidebar.classList.add('hidden');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastText) return;

    toastText.innerText = message;
    if (type === 'success') {
      toastIcon.innerText = '✅';
      toast.className = 'fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transition-all border border-emerald-500';
    } else if (type === 'warning') {
      toastIcon.innerText = '⚠️';
      toast.className = 'fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-amber-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transition-all border border-amber-500';
    } else {
      toastIcon.innerText = 'ℹ️';
      toast.className = 'fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 transition-all border border-slate-700';
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }

  setupListeners() {
    if (typeof window.addEventListener === 'function') {
      // Global ESC key to close modals
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeArchitectureModal();
          this.closeShareModal();
        }
      });

      // PWA install prompt event handler
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        const pwaBtn = document.getElementById('pwaInstallBtn');
        if (pwaBtn) pwaBtn.classList.remove('hidden');
      });
    }
  }
}

// Instantiate global app
window.UzhavanApp = new UzhavanApp();
document.addEventListener('DOMContentLoaded', () => {
  window.UzhavanApp.init();
});
