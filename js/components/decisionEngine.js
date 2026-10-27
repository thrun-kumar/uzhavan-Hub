// Uzhavan Hub - AI Farming Decision Engine Component (Main Innovation)

const DecisionEngineComponent = {
  state: {
    isAnalyzing: false,
    analysisStep: 0,
    result: null,
    selectedCropId: null
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;
    const allCrops = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_DATA) || [];

    // Run initial analysis if not yet run
    if (!this.state.result) {
      this.state.result = window.UzhavanDecisionEngine.analyzeFarm({
        location: profile.location || "Madurai District",
        landArea: profile.landArea || 3.0,
        soilType: profile.soilType || "Red Soil",
        waterSource: profile.waterSource || "Borewell",
        budget: profile.budget || 60000,
        preferredCrop: profile.currentCrop ? profile.currentCrop.toLowerCase() : ""
      });
      this.state.selectedCropId = this.state.result.primaryCrop.id;
    }

    const displayedCrop = this.state.result.allRecommendations.find(c => c.id === this.state.selectedCropId) || this.state.result.primaryCrop;
    const isPrimary = displayedCrop.id === this.state.result.primaryCrop.id;

    const districts = [
        "Coimbatore District", "Tiruppur District", "Erode District", "Salem District", "Namakkal District",
        "Thanjavur District", "Madurai District", "Dindigul District", "Trichy District", "Karur District",
        "Dharmapuri District", "Krishnagiri District", "Villupuram District", "Cuddalore District", "Tirunelveli District"
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-emerald-700/40 relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider mb-2 border border-emerald-500/30">
                <span>🤖</span> ${isTa ? "முதன்மை கண்டுபிடிப்பு" : "FLAGSHIP AI MODULE"}
              </div>
              <h1 class="text-3xl md:text-4xl font-black tracking-tight">
                ${isTa ? "AI விவசாய முடிவெடுக்கும் எஞ்சின்" : "AI Farming Decision Engine"}
              </h1>
              <p class="text-xs md:text-sm text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
                ${isTa 
                  ? "மண், வானிலை, பாசன நீர், பருவம், பட்ஜெட் மற்றும் சந்தை விலை ஆகிய 6 காரணிகளையும் ஒருங்கிணைத்து உழவருக்கு உகந்த சிறந்த பயிரை பரிந்துரைக்கும் நுண்ணறிவு எஞ்சின்." 
                  : "Synthesizes 6 critical dimensions: Soil Chemistry + Agro-Weather Forecast + Water Budget + Current Season + Capital + Live Mandi Trends to deliver precision farm decisions."
                }
              </p>
            </div>
            <div class="flex-shrink-0 flex items-center gap-2">
              <span class="px-3 py-1 rounded-lg bg-emerald-800/80 border border-emerald-600 text-emerald-200 text-xs font-bold">
                18 Crops • 15 Districts
              </span>
              <button onclick="window.UzhavanApp.openArchitectureModal()" class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2">
                <span>📊</span> ${isTa ? "கட்டமைப்பு மாதிரி வரைபடம்" : "View Engine Logic"}
              </button>
            </div>
          </div>
        </div>

        <!-- QUICK CROP SELECTOR BAR (18 CROPS) -->
        <div class="agri-card p-4 rounded-2xl">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>🌾</span> ${isTa ? "விரைவு பயிர் வடிகட்டி (Quick Crop Selector):" : "Quick Crop Selector (Instant 18-Crop Switch):"}
            </span>
            <span class="text-[11px] text-emerald-700 font-semibold">
              ${isTa ? "கிளிக் செய்து உடனே பார்க்கவும்" : "Click any crop to switch recommendation"}
            </span>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            ${allCrops.map(c => `
              <button onclick="window.DecisionEngineComponent.selectQuickCrop('${c.id}')"
                class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${this.state.selectedCropId === c.id ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
                <span>${c.icon}</span>
                <span>${isTa ? c.nameTa : c.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT COLUMN: INPUT FORM (4 COLS) -->
          <div class="lg:col-span-4 space-y-6">
            <div class="agri-card p-5 md:p-6 rounded-2xl">
              <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h2 class="text-base font-bold text-emerald-950 flex items-center gap-2">
                  <span>⚙️</span> ${isTa ? "பண்ணை உள்ளீடுகள்" : "Farm Parameters"}
                </h2>
                <button onclick="window.DecisionEngineComponent.resetToProfile()" class="text-xs font-semibold text-emerald-700 hover:underline">
                  ${isTa ? "சுயவிவரத்திலிருந்து" : "Load Profile"}
                </button>
              </div>

              <!-- CONNECTED REGISTERED LAND PLOTS SELECTOR (SECTION 6 REQUIREMENT) -->
              ${(window.UzhavanAuth && window.UzhavanAuth.user && window.UzhavanAuth.user.plots && window.UzhavanAuth.user.plots.length > 0) ? `
                <div class="mb-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                      <span>🌾</span> <span>Selected Farmland Plot:</span>
                    </label>
                    <span class="text-[10px] text-emerald-700 font-bold">Auto-Calibrated</span>
                  </div>
                  <select id="engineSelectedPlot" onchange="window.DecisionEngineComponent.loadPlot(this.value)"
                          class="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-black text-emerald-950 focus:ring-2 focus:ring-emerald-500">
                    ${window.UzhavanAuth.user.plots.map(p => `
                      <option value="${p.id}" ${window.UzhavanAuth.activePlotId === p.id ? 'selected' : ''}>
                        🌾 ${p.plot_name} (${p.area} ${p.area_unit} • ${p.soil_type})
                      </option>
                    `).join('')}
                  </select>
                </div>
              ` : ''}

              <form id="engineForm" onsubmit="window.DecisionEngineComponent.handleAnalyze(event)" class="space-y-4">
                <!-- Crop Filter / Selection -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "பயிர் வடிகட்டி / விருப்பம்" : "Target / Preferred Crop"}
                  </label>
                  <select id="enginePreferredCrop" onchange="window.DecisionEngineComponent.handleCropDropdownChange(this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                    <option value="">${isTa ? "-- AI அனைத்து 18 பயிர்களையும் பகுப்பாய்வு செய்யட்டும் --" : "-- Let AI Analyze All 18 Crops --"}</option>
                    ${allCrops.map(c => `
                      <option value="${c.id}" ${this.state.selectedCropId === c.id ? 'selected' : ''}>${c.icon} ${c.name} (${c.nameTa})</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Location / District -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "இருப்பிடம் / மாவட்டம்" : "Location / District"}
                  </label>
                  <select id="engineLocation" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                    ${districts.map(d => `
                      <option value="${d}" ${(profile.location === d || (this.state.result && this.state.result.queryMeta.location === d)) ? 'selected' : ''}>${d}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Land Area -->
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
                      ${isTa ? "நிலப்பரப்பு (ஏக்கர்)" : "Land Area (Acres)"}
                    </label>
                    <span id="landAreaVal" class="text-xs font-extrabold text-emerald-800">${profile.landArea || 3} Acres</span>
                  </div>
                  <input type="range" id="engineLandArea" min="0.5" max="25" step="0.5" value="${profile.landArea || 3}" 
                    oninput="document.getElementById('landAreaVal').innerText = this.value + ' Acres'"
                    class="w-full h-2 bg-slate-200 rounded-lg cursor-pointer">
                </div>

                <!-- Soil Type -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "மண் வகை" : "Soil Type"}
                  </label>
                  <select id="engineSoilType" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                    ${["Red Soil", "Black Soil", "Alluvial Soil", "Sandy Soil", "Clay Soil", "Laterite Soil"].map(s => `
                      <option value="${s}" ${profile.soilType === s ? 'selected' : ''}>${s}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Water Availability -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "பாசன நீர் ஆதாரம்" : "Water Availability"}
                  </label>
                  <select id="engineWater" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                    ${["Borewell", "Well", "Rain-fed", "Canal", "Other"].map(w => `
                      <option value="${w}" ${profile.waterSource === w ? 'selected' : ''}>${w}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Current Season -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "தற்போதைய பருவம்" : "Current Season"}
                  </label>
                  <select id="engineSeason" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                    ${["Kharif (Monsoon)", "Rabi (Winter)", "Zaid / Summer", "Kuruvai", "Samba", "Navarai"].map(s => `
                      <option value="${s}">${s}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Farming Budget -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ${isTa ? "விவசாய பட்ஜெட் (₹)" : "Farming Budget (₹)"}
                  </label>
                  <input type="number" id="engineBudget" step="5000" min="10000" value="${profile.budget || 60000}" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                  <button type="submit" id="analyzeBtn" class="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2">
                    <span>⚡</span>
                    <span>${isTa ? "பண்ணையை பகுப்பாய்வு செய்" : "ANALYZE MY FARM"}</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Prototype Safety Badge -->
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <span class="text-sm">⚠️</span>
              <span class="font-bold">Demo Data – For Prototype Testing</span>
            </div>
          </div>

          <!-- RIGHT COLUMN: AI REASONING / RESULTS (8 COLS) -->
          <div class="lg:col-span-8 space-y-6" id="engineResultContainer">
            ${this.renderResultView(displayedCrop, isPrimary, isTa)}
          </div>

        </div>

      </div>
    `;
  },

  selectQuickCrop(cropId) {
    this.state.selectedCropId = cropId;
    const prefSelect = document.getElementById('enginePreferredCrop');
    if (prefSelect) prefSelect.value = cropId;
    
    // Run analyze for this crop
    const location = document.getElementById('engineLocation') ? document.getElementById('engineLocation').value : "Madurai District";
    const landArea = document.getElementById('engineLandArea') ? document.getElementById('engineLandArea').value : 3.0;
    const soilType = document.getElementById('engineSoilType') ? document.getElementById('engineSoilType').value : "Red Soil";
    const waterSource = document.getElementById('engineWater') ? document.getElementById('engineWater').value : "Borewell";
    const season = document.getElementById('engineSeason') ? document.getElementById('engineSeason').value : "Kharif (Monsoon)";
    const budget = document.getElementById('engineBudget') ? document.getElementById('engineBudget').value : 60000;

    this.state.result = window.UzhavanDecisionEngine.analyzeFarm({
      location,
      landArea,
      soilType,
      waterSource,
      season,
      budget,
      preferredCrop: cropId
    });

    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleCropDropdownChange(cropId) {
    this.selectQuickCrop(cropId);
  },

  renderResultView(crop, isPrimary, isTa) {
    if (this.state.isAnalyzing) {
      return this.renderLoadingAnimation(isTa);
    }

    const meta = this.state.result.queryMeta;

    return `
      <!-- PRIMARY RECOMMENDED CROP CARD -->
      <div class="agri-card p-6 md:p-8 rounded-2xl border-2 ${isPrimary ? 'border-emerald-600 bg-gradient-to-b from-white to-emerald-50/20' : 'border-slate-300'} shadow-lg space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-black tracking-wide ${isPrimary ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}">
                ${isPrimary ? (isTa ? "🌱 முதன்மை பரிந்துரை" : "🌱 RECOMMENDED CROP") : (isTa ? "மாற்று விருப்பம்" : "ALTERNATIVE OPTION")}
              </span>
              <span class="text-xs text-slate-700">Analyzed for ${meta.location} • ${meta.landArea} Acres</span>
            </div>
            <div class="flex items-baseline gap-3 mt-2">
              <h2 class="text-3xl md:text-4xl font-black text-emerald-950">
                ${isTa ? crop.nameTa : crop.name}
              </h2>
              <span class="text-3xl">${crop.icon}</span>
              <span class="text-xs px-2 py-0.5 rounded-md font-bold uppercase ${crop.calculatedRisk === 'LOW' ? 'badge-low' : crop.calculatedRisk === 'MEDIUM' ? 'badge-medium' : 'badge-high'}">
                ${crop.calculatedRisk} Risk
              </span>
            </div>
          </div>

          <!-- Suitability Gauge -->
          <div class="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200 self-start sm:self-auto">
            <div class="text-center">
              <div class="text-3xl font-black text-emerald-800 leading-none">
                ${crop.suitabilityScore}%
              </div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mt-1">
                ${isTa ? "பொருத்தம்" : "Suitability Score"}
              </div>
            </div>
          </div>
        </div>

        <!-- KEY METRICS 4-BOX GRID -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-700 tracking-wider block mb-1">
              ${isTa ? "மதிப்பிடப்பட்ட முதலீடு" : "Est. Investment"}
            </span>
            <span class="text-xl font-extrabold text-slate-900">
              ₹${crop.estimatedInvestment.toLocaleString('en-IN')}
            </span>
            <span class="text-[10px] text-slate-700 block mt-0.5">₹${crop.investmentPerAcre.toLocaleString('en-IN')}/acre</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-700 tracking-wider block mb-1">
              ${isTa ? "எதிர்பார்க்கப்படும் மகசூல்" : "Expected Yield"}
            </span>
            <span class="text-xl font-extrabold text-slate-900">
              ${crop.expectedYield.toLocaleString('en-IN')} kg
            </span>
            <span class="text-[10px] text-slate-700 block mt-0.5">${crop.yieldPerAcre.toLocaleString('en-IN')} kg/acre</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-700 tracking-wider block mb-1">
              ${isTa ? "சந்தை விலை" : "Market Price"}
            </span>
            <span class="text-xl font-extrabold text-slate-900">
              ₹${crop.marketPrice}/kg
            </span>
            <span class="text-[10px] font-semibold text-emerald-700 block mt-0.5">Mandi spot rate</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-700 tracking-wider block mb-1">
              ${isTa ? "எதிர்பார்க்கப்படும் வருவாய்" : "Expected Revenue"}
            </span>
            <span class="text-xl font-extrabold text-slate-900">
              ₹${crop.expectedRevenue.toLocaleString('en-IN')}
            </span>
            <span class="text-[10px] text-slate-700 block mt-0.5">${meta.landArea} acres total</span>
          </div>
        </div>

        <!-- ESTIMATED PROFIT HIGHLIGHT BANNER -->
        <div class="bg-emerald-900 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
              ${isTa ? "மதிப்பிடப்பட்ட நிகர லாபம் (வருவாய் - முதலீடு)" : "ESTIMATED NET PROFIT (Revenue – Investment)"}
            </span>
            <div class="text-3xl font-black text-emerald-100 mt-0.5">
              ₹${crop.estimatedProfit.toLocaleString('en-IN')}
            </div>
            <p class="text-xs text-emerald-200/80 mt-0.5">
              ROI: <strong class="text-amber-300">${crop.roiPercent}%</strong> return on capital over ${crop.durationDays} days.
            </p>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1 bg-emerald-800 rounded-lg text-xs font-bold text-emerald-200 border border-emerald-700">
              Risk: <strong class="text-white">${crop.calculatedRisk}</strong>
            </span>
          </div>
        </div>

        <!-- GRANULAR AGRONOMIC PARAMETERS (SECTION 1 CRITICAL SPECIFICATIONS) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-700 block">Soil pH Target</span>
            <strong class="text-slate-900 text-sm">${crop.soilPH}</strong>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-700 block">N-P-K Recommendation</span>
            <strong class="text-slate-900 text-sm">${crop.nitrogen || '45kg'} : ${crop.phosphorus || '25kg'} : ${crop.potassium || '25kg'}</strong>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-700 block">Rainfall Requirement</span>
            <strong class="text-slate-900 text-sm">${crop.rainfall}</strong>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-700 block">Optimal Climate</span>
            <strong class="text-slate-900 text-sm">${crop.temperature} • ${crop.humidity}</strong>
          </div>
        </div>

        <!-- IRRIGATION & FERTILIZER ADVICE -->
        <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700">
          <div>
            <strong class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span>💧</span> ${isTa ? "பாசன ஆலோசனை:" : "Irrigation Requirement & Advisory:"}
            </strong>
            <p class="leading-relaxed">${crop.irrigationAdvice}</p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <strong class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span>🧪</span> ${isTa ? "பரிந்துரைக்கப்பட்ட உரம்:" : "Prescribed Fertilizer Schedule:"}
            </strong>
            <p class="leading-relaxed font-medium text-emerald-950">${crop.recommendedFertilizer}</p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <strong class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <span>🛡️</span> ${isTa ? "நோய் பாதுகாப்பு முன்னெச்சரிக்கை:" : "Disease Risk & Prevention:"}
            </strong>
            <p class="leading-relaxed">${crop.diseaseRiskPrevention}</p>
          </div>
        </div>

        <!-- MISSING DATA / CONFIDENCE NOTICE -->
        ${meta.missingInputs && meta.missingInputs.length > 0 ? `
          <div class="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
            <span class="text-base flex-shrink-0">ℹ️</span>
            <div>
              <strong class="font-bold text-sky-900">${isTa ? "முழுமையான துல்லியத்திற்கு கூடுதல் தகவல் தேவை:" : "Information Notice:"}</strong>
              <span class="block mt-0.5">${isTa ? "பரிந்துரை துல்லியத்தை உயர்த்த பின்வரும் உள்ளீடுகளை சுயவிவரத்தில் சேர்க்கவும்:" : "To increase recommendation precision, provide:"} <strong>${meta.missingInputs.join(", ")}</strong>. ${isTa ? "மதிப்பீட்டு நம்பிக்கை 10% குறைக்கப்பட்டுள்ளது." : "Scoring confidence reduced accordingly."}</span>
            </div>
          </div>
        ` : ''}

        <!-- PREFERRED CROP SAFETY WARNING IF ANY -->
        ${crop.preferenceWarning ? `
          <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
            <span class="text-base flex-shrink-0">⚠️</span>
            <div>
              <strong class="font-bold text-amber-900">${isTa ? "விருப்ப பயிர் எச்சரிக்கை:" : "Crop Feasibility Warning:"}</strong>
              <p class="mt-0.5 leading-relaxed">${crop.preferenceWarning}</p>
            </div>
          </div>
        ` : ''}

        <!-- REASONS FOR RECOMMENDATION -->
        <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-2">
            <span>🎯</span> ${isTa ? "பரிந்துரைக்கான AI காரணங்கள் (மண் + வானிலை + சந்தை)" : "Why AI Recommends This Crop (Synthesis Rationale)"}
          </h3>
          <ul class="space-y-2 text-xs md:text-sm text-slate-700">
            ${(isTa ? crop.reasonsTa : crop.reasonsEn).map(reason => `
              <li class="flex items-start gap-2.5">
                <span class="text-emerald-700 font-black mt-0.5">✓</span>
                <span class="leading-relaxed font-medium">${reason}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- MANDATORY DISCLAIMER AS REQUESTED -->
        <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <span class="text-base flex-shrink-0">⚠️</span>
          <p class="leading-relaxed">
            <strong class="font-bold">${isTa ? "முக்கிய அறிவிப்பு:" : "IMPORTANT DISCLAIMER:"}</strong> 
            ${isTa 
              ? "லாபம், மகசூல் மற்றும் சந்தை விலை ஆகியவை மாதிரி கணிப்புகள் மற்றும் மதிப்பீடுகள் மட்டுமே; இவை உத்திரவாதம் அல்ல. தட்பவெப்ப நிலை மற்றும் களப் பராமரிப்பைப் பொறுத்து மாறுபடலாம்." 
              : "Profit, yield, and market price values are AI-assisted estimates/demo predictions based on agro-climatic models and mandi historical averages. They are not guaranteed financial returns."
            }
          </p>
        </div>

        <!-- DIRECT ACTIONS -->
        <div class="flex flex-wrap gap-3 pt-2">
          <button onclick="window.UzhavanApp.navigate('actionPlan', { cropId: '${crop.id}' })" class="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
            <span>📅</span> ${isTa ? "வாராந்திர செயல் திட்டத்தைக் காண்க" : "View Farming Action Plan"}
          </button>
          <button onclick="window.UzhavanApp.navigate('profitPredictor', { cropId: '${crop.id}' })" class="px-5 py-2.5 rounded-xl bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <span>📊</span> ${isTa ? "லாப ஒப்பீட்டு அட்டவணை" : "Compare in Profit Predictor"}
          </button>
          <button onclick="window.UzhavanApp.navigate('fertilizer', { cropId: '${crop.id}' })" class="px-5 py-2.5 rounded-xl bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <span>🧪</span> ${isTa ? "உர வழிகாட்டல்" : "Fertilizer Schedule"}
          </button>
        </div>

      </div>

      <!-- SECTION: ALTERNATIVE CROPS -->
      <div class="agri-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-bold text-emerald-950">
              ${isTa ? "மாற்று பயிர்கள் (Alternative Crop Options)" : "Top Alternative Crop Options"}
            </h3>
            <p class="text-xs text-slate-700">
              ${isTa ? "சுழற்சி அல்லது வேறு விருப்பத்திற்கு தகுதியான பயிர்கள் (கிளிக் செய்து விவரங்களை காண்க):" : "Click on any alternative crop to view its full financial and suitability breakdown above:"}
            </p>
          </div>
          <span class="text-xs font-semibold text-slate-700">Ranked by AI</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${this.state.result.alternativeCrops.map(alt => `
            <div onclick="window.DecisionEngineComponent.selectQuickCrop('${alt.id}')" 
              class="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 cursor-pointer transition-all space-y-2 shadow-sm hover:shadow">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${alt.icon}</span>
                  <strong class="text-sm font-bold text-slate-900">${isTa ? alt.nameTa : alt.name}</strong>
                </div>
                <span class="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ${alt.suitabilityScore}%
                </span>
              </div>
              <div class="text-[11px] text-slate-700 flex justify-between">
                <span>Profit: <strong class="text-emerald-800">₹${alt.estimatedProfit.toLocaleString('en-IN')}</strong></span>
                <span>ROI: <strong>${alt.roiPercent}%</strong></span>
              </div>
              <div class="text-[10px] text-slate-700">
                Risk: <span class="font-bold">${alt.calculatedRisk}</span> • ${alt.durationDays} days
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  handleAnalyze(e) {
    if (e) e.preventDefault();
    
    const location = document.getElementById('engineLocation').value;
    const landArea = document.getElementById('engineLandArea').value;
    const soilType = document.getElementById('engineSoilType').value;
    const waterSource = document.getElementById('engineWater').value;
    const season = document.getElementById('engineSeason').value;
    const budget = document.getElementById('engineBudget').value;
    const preferredCrop = document.getElementById('enginePreferredCrop').value;

    this.state.isAnalyzing = true;
    this.render(document.getElementById('viewContainer'));

    setTimeout(() => {
      this.state.result = window.UzhavanDecisionEngine.analyzeFarm({
        location,
        landArea,
        soilType,
        waterSource,
        season,
        budget,
        preferredCrop
      });

      this.state.selectedCropId = this.state.result.primaryCrop.id;
      this.state.isAnalyzing = false;
      this.render(document.getElementById('viewContainer'));
      window.UzhavanApp.showToast("Farm analyzed with real-time agro data! 🌾", "success");
    }, 400);
  },

  loadPlot(plotId) {
    if (!window.UzhavanAuth || !window.UzhavanAuth.user || !window.UzhavanAuth.user.plots) return;
    const plot = window.UzhavanAuth.user.plots.find(p => p.id === parseInt(plotId));
    if (!plot) return;

    window.UzhavanAuth.setActivePlot(plot.id);

    // Auto-populate form
    const locElem = document.getElementById('engineLocation');
    if (locElem) {
      const matchOpt = Array.from(locElem.options).find(o => o.value.toLowerCase().includes((plot.district || 'madurai').toLowerCase()));
      if (matchOpt) locElem.value = matchOpt.value;
    }

    const areaElem = document.getElementById('engineLandArea');
    if (areaElem) {
      areaElem.value = plot.area_acres || 3.0;
      const lbl = document.getElementById('landAreaVal');
      if (lbl) lbl.innerText = `${plot.area_acres || 3.0} Acres (${plot.area} ${plot.area_unit})`;
    }

    const soilElem = document.getElementById('engineSoilType');
    if (soilElem) {
      const matchSoil = Array.from(soilElem.options).find(o => o.value.toLowerCase().includes((plot.soil_type || '').toLowerCase()));
      if (matchSoil) soilElem.value = matchSoil.value;
    }

    const waterElem = document.getElementById('engineWater');
    if (waterElem) {
      const matchWater = Array.from(waterElem.options).find(o => o.value.toLowerCase().includes((plot.irrigation_source || '').toLowerCase()));
      if (matchWater) waterElem.value = matchWater.value;
    }

    const budgetElem = document.getElementById('engineBudget');
    if (budgetElem) {
      budgetElem.value = plot.farming_budget || 50000;
    }

    window.UzhavanApp.showToast(`Calibrated AI Engine to "${plot.plot_name}"! 🌾`, 'success');
    this.handleAnalyze();
  },

  resetToProfile() {
    const profile = window.UzhavanApp.userProfile;
    document.getElementById('engineLocation').value = profile.location;
    document.getElementById('engineLandArea').value = profile.landArea;
    document.getElementById('landAreaVal').innerText = profile.landArea + ' Acres';
    document.getElementById('engineSoilType').value = profile.soilType;
    document.getElementById('engineWater').value = profile.waterSource;
    document.getElementById('engineBudget').value = profile.budget;
    if (document.getElementById('enginePreferredCrop')) {
      document.getElementById('enginePreferredCrop').value = "";
    }
    window.UzhavanApp.showToast("Loaded values from farmer profile 📋", "info");
  },

  renderLoadingAnimation(isTa) {
    return `
      <div class="agri-card p-12 rounded-2xl text-center space-y-4">
        <div class="inline-block animate-spin text-5xl">⚙️</div>
        <h3 class="text-xl font-bold text-emerald-950">
          ${isTa ? "பண்ணை தரவுகளை ஒருங்கிணைக்கிறது..." : "Synthesizing 6 Farm Dimensions..."}
        </h3>
        <p class="text-xs text-slate-700 max-w-md mx-auto">
          ${isTa ? "மண் வகை, வானிலை எச்சரிக்கை, பாசன நீர் மற்றும் மண்டி விலை தரவுகளை ஆராய்கிறது." : "Evaluating soil chemistry, local agro-weather forecast, crop duration, and market prices across all 18 crops."}
        </p>
      </div>
    `;
  }
};

window.DecisionEngineComponent = DecisionEngineComponent;
