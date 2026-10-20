// Uzhavan Hub - Landing & Profile Components

const LandingComponent = {
  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    
    container.innerHTML = `
      <div class="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4">
        <!-- Hero Section -->
        <div class="max-w-4xl w-full text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide border border-emerald-200 shadow-sm animate-pulse">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            ${isTa ? "ஸ்மார்ட் வேளாண்மை தளம்" : "AI-Powered Smart Agriculture Platform"}
          </div>

          <h1 class="text-4xl md:text-6xl font-black text-emerald-950 tracking-tight leading-tight">
            Uzhavan Hub <br class="hidden sm:inline" />
            <span class="text-emerald-700 font-extrabold text-3xl md:text-5xl block mt-2">
              ${isTa ? "உங்கள் டிஜிட்டல் விவசாய தோழன்" : "Your Digital Farming Companion"}
            </span>
          </h1>

          <p class="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
            ${isTa 
              ? "தனித்தனி தகவல்கள் அல்ல; உங்கள் நிலம், மண், வானிலை, மற்றும் சந்தை நிலவரத்தை இணைக்கும் ஸ்மார்ட் முடிவுகள்." 
              : "Smart decisions for better farming. Combining farmer profile, soil, weather, and mandi prices into an intelligent AI Farming Decision Engine."
            }
          </p>

          <!-- Core Call to Actions -->
          <div class="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button onclick="window.UzhavanApp.openProfileModal()" class="px-8 py-3.5 rounded-xl bg-emerald-800 text-white font-semibold text-lg hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center gap-2">
              <span>🌾</span>
              <span>${isTa ? "தொடங்குங்கள்" : "Get Started"}</span>
            </button>
            <button onclick="window.UzhavanApp.navigate('dashboard')" class="px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-semibold text-lg border-2 border-emerald-800/30 hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2">
              <span>🚀</span>
              <span>${isTa ? "நேரடி முகப்பு" : "Continue as Farmer"}</span>
            </button>
          </div>

          <!-- Demo Farmer Personas Quick Access -->
          <div class="mt-14 pt-8 border-t border-emerald-200/60 text-left">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-900">
                ${isTa ? "முன்னமைக்கப்பட்ட உழவர் சுயவிவரங்கள் (விரைவு உள்நுழைவு):" : "Select a Sample Farmer Profile (Instant Login):"}
              </h3>
              <span class="text-xs text-slate-500 font-medium">Click to load farmer data</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${window.UZHAVAN_DATA.DEMO_PERSONAS.map(p => `
                <div onclick="window.UzhavanApp.loadDemoProfile('${p.id}')" class="agri-card p-4 rounded-xl cursor-pointer hover:border-emerald-600 border border-slate-200 hover:scale-[1.02] transition-all bg-white group">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      👨‍🌾
                    </div>
                    <div>
                      <h4 class="font-bold text-emerald-950 group-hover:text-emerald-700">${isTa ? p.nameTa : p.name}</h4>
                      <p class="text-xs text-slate-700">${p.location}</p>
                    </div>
                  </div>
                  <div class="text-xs text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div class="flex justify-between"><span>Land / Soil:</span> <span class="font-semibold text-emerald-900">${p.landArea} Ac • ${p.soilType}</span></div>
                    <div class="flex justify-between"><span>Current Crop:</span> <span class="font-semibold text-emerald-900">${p.currentCrop}</span></div>
                    <div class="flex justify-between"><span>Budget:</span> <span class="font-semibold text-emerald-900">₹${p.budget.toLocaleString('en-IN')}</span></div>
                  </div>
                  <div class="mt-2 text-right">
                    <span class="text-xs font-semibold text-emerald-700 group-hover:underline">Login as ${p.name.split(' ')[0]} →</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Feature Highlights Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-center">
            <div class="p-3 bg-white/70 rounded-xl border border-emerald-100">
              <span class="text-2xl block mb-1">🤖</span>
              <p class="text-xs font-bold text-emerald-900">${isTa ? "AI முடிவெடுக்கும் எஞ்சின்" : "AI Decision Engine"}</p>
              <p class="text-[11px] text-slate-700">${isTa ? "மண் & வானிலை பகுப்பாய்வு" : "Soil & Weather Match"}</p>
            </div>
            <div class="p-3 bg-white/70 rounded-xl border border-emerald-100">
              <span class="text-2xl block mb-1">💰</span>
              <p class="text-xs font-bold text-emerald-900">${isTa ? "லாப ஒப்பீடு" : "Profit Predictor"}</p>
              <p class="text-[11px] text-slate-700">${isTa ? "வருவாய் & செலவு கணிப்பு" : "Cost vs Yield ROI"}</p>
            </div>
            <div class="p-3 bg-white/70 rounded-xl border border-emerald-100">
              <span class="text-2xl block mb-1">⚠️</span>
              <p class="text-xs font-bold text-emerald-900">${isTa ? "பயிர் அபாய எச்சரிக்கை" : "Weather Hazard Alert"}</p>
              <p class="text-[11px] text-slate-700">${isTa ? "முன்னெச்சரிக்கை நடவடிக்கைகள்" : "Proactive Farm Action"}</p>
            </div>
            <div class="p-3 bg-white/70 rounded-xl border border-emerald-100">
              <span class="text-2xl block mb-1">🎙️</span>
              <p class="text-xs font-bold text-emerald-900">${isTa ? "உழவன் குரல் AI" : "Uzhavan Voice AI"}</p>
              <p class="text-[11px] text-slate-700">${isTa ? "தமிழ் & ஆங்கில குரல் உதவி" : "Tamil & English Audio"}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

const ProfileComponent = {
  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-4 px-2 sm:px-4">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-emerald-950 flex items-center gap-2">
              <span>👤</span> ${isTa ? "உழவர் சுயவிவரம்" : "Farmer Profile Setup"}
            </h2>
            <p class="text-sm text-slate-700">
              ${isTa ? "இந்த தகவல்கள் AI முடிவெடுக்கும் எஞ்சினில் உங்கள் பரிந்துரைகளை துல்லியமாக்க பயன்படும்." : "This data directly personalizes your AI Farming Decision Engine results and profit estimates."}
            </p>
          </div>
          <button onclick="window.UzhavanApp.navigate('dashboard')" class="text-xs font-bold text-emerald-800 hover:underline">
            ${isTa ? "← முகப்பிற்கு செல்" : "← Back to Dashboard"}
          </button>
        </div>

        <form id="profileForm" onsubmit="window.UzhavanApp.handleProfileSave(event)" class="agri-card p-6 md:p-8 rounded-2xl space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Farmer Name -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "விவசாயி பெயர்" : "Farmer Name"} *
              </label>
              <input type="text" name="farmerName" required value="${profile.name || ''}" placeholder="e.g. Murugan P." 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium">
            </div>

            <!-- Location / District -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "இருப்பிடம் / மாவட்டம்" : "Location / District"} *
              </label>
              <select name="location" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-white">
                ${["Madurai District", "Thanjavur District", "Coimbatore District", "Salem District", "Tiruchirappalli District", "Dindigul District", "Tirunelveli District", "Erode District", "Vellore District", "Theni District"].map(d => `
                  <option value="${d}" ${profile.location === d ? 'selected' : ''}>${d}</option>
                `).join('')}
              </select>
            </div>

            <!-- Land Area -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "நிலப் பரப்பு (ஏக்கர்)" : "Land Area (in Acres)"} *
              </label>
              <input type="number" step="0.5" min="0.5" max="100" name="landArea" required value="${profile.landArea || 3.0}" 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium">
            </div>

            <!-- Soil Type -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "மண் வகை" : "Soil Type"} *
              </label>
              <select name="soilType" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-white">
                ${["Red Soil", "Black Soil", "Alluvial Soil", "Sandy Soil", "Clay Soil", "Other"].map(s => `
                  <option value="${s}" ${profile.soilType === s ? 'selected' : ''}>${s}</option>
                `).join('')}
              </select>
            </div>

            <!-- Water Source -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "பாசன நீர் ஆதாரம்" : "Water Source"} *
              </label>
              <select name="waterSource" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-white">
                ${["Borewell", "Well", "Rain-fed", "Canal", "Other"].map(w => `
                  <option value="${w}" ${profile.waterSource === w ? 'selected' : ''}>${w}</option>
                `).join('')}
              </select>
            </div>

            <!-- Farming Budget -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "விவசாய நிதி பட்ஜெட் (₹)" : "Farming Budget (₹)"} *
              </label>
              <input type="number" step="5000" min="5000" name="budget" required value="${profile.budget || 60000}" 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium">
            </div>

            <!-- Current Crop -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "தற்போதைய பயிர்" : "Current Crop"}
              </label>
              <input type="text" name="currentCrop" value="${profile.currentCrop || 'Groundnut'}" placeholder="e.g. Groundnut" 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium">
            </div>

            <!-- Previous Crop -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                ${isTa ? "முந்தைய பயிர்" : "Previous Crop (Crop Rotation)"}
              </label>
              <input type="text" name="previousCrop" value="${profile.previousCrop || 'Cotton'}" placeholder="e.g. Cotton" 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-medium">
            </div>
          </div>

          <!-- Preferred Language -->
          <div class="pt-4 border-t border-slate-100">
            <label class="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
              ${isTa ? "விருப்ப மொழி" : "Preferred Language"}
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800">
                <input type="radio" name="language" value="ta" ${profile.language === 'ta' ? 'checked' : ''} class="text-emerald-700">
                <span>தமிழ் (Tamil)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800">
                <input type="radio" name="language" value="en" ${profile.language === 'en' ? 'checked' : ''} class="text-emerald-700">
                <span>English</span>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onclick="window.UzhavanApp.navigate('dashboard')" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50">
              ${isTa ? "ரத்து செய்" : "Cancel"}
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-all">
              ${isTa ? "சுயவிவரத்தை சேமிக்கவும்" : "Save Profile & Update Engine"}
            </button>
          </div>
        </form>
      </div>
    `;
  }
};

window.LandingComponent = LandingComponent;
window.ProfileComponent = ProfileComponent;
