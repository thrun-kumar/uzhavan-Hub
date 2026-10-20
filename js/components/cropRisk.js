// Uzhavan Hub - Crop Risk Alert Module

const CropRiskComponent = {
  selectedCropId: "groundnut",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const crops = window.UZHAVAN_DATA.CROPS_DATA;
    const selectedCrop = crops.find(c => c.id === this.selectedCropId) || crops[0];

    // Determine risk badge and color
    const isLow = selectedCrop.riskLevel === 'LOW';
    const isMed = selectedCrop.riskLevel === 'MEDIUM';

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950 flex items-center gap-2">
              <span>⚠️</span> ${isTa ? "பயிர் அபாய பகுப்பாய்வு & தடுப்பு முறைகள்" : "Crop Risk Alert & Hazard Mitigation"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "உங்கள் பயிர் மற்றும் நடப்பு வானிலையை அடிப்படையாகக் கொண்ட ஆபத்து மதிப்பீடு." : "Dynamic risk assessment correlating your specific crop agronomy with atmospheric anomalies."}
            </p>
          </div>

          <!-- Crop Selector -->
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase">${isTa ? "பயிர் தேர்வு:" : "Crop:"}</label>
            <select onchange="window.CropRiskComponent.changeCrop(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${crops.map(c => `
                <option value="${c.id}" ${c.id === selectedCrop.id ? 'selected' : ''}>${c.name} (${c.nameTa})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- RISK GAUGE OVERVIEW -->
        <div class="agri-card p-6 md:p-8 rounded-2xl border-2 ${isLow ? 'border-emerald-500' : isMed ? 'border-amber-500' : 'border-rose-500'}">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div class="flex items-center gap-4">
              <div class="text-4xl p-3 rounded-2xl ${isLow ? 'bg-emerald-100 text-emerald-800' : isMed ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                ${selectedCrop.icon}
              </div>
              <div>
                <span class="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  ${isTa ? "தற்போதைய மதிப்பீடு" : "Current Risk Profile For"}
                </span>
                <h2 class="text-2xl font-black text-slate-900">${selectedCrop.name} (${selectedCrop.nameTa})</h2>
                <p class="text-xs text-slate-700 mt-0.5">Growing Cycle: ${selectedCrop.durationDays} Days • Category: ${selectedCrop.category}</p>
              </div>
            </div>

            <!-- Risk Status Pill -->
            <div class="text-left md:text-right">
              <span class="text-xs font-bold uppercase text-slate-700 tracking-wider block mb-1">
                ${isTa ? "ஒட்டுமொத்த அபாய நிலை" : "Overall Risk Index"}
              </span>
              <span class="inline-block px-5 py-2 rounded-xl text-lg font-black tracking-wide ${isLow ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : isMed ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}">
                ${selectedCrop.riskLevel} RISK
              </span>
            </div>
          </div>

          <!-- 5 SPECIFIC RISK VECTORS AS PER SECTION 8 -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3.5 my-6 text-xs">
            
            <!-- Risk 1: Heavy Rain -->
            <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-slate-900">🌧️ Heavy Rain</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">HIGH</span>
              </div>
              <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                Tomorrow's predicted thunderstorm poses waterlogging hazard in furrow root zones.
              </p>
            </div>

            <!-- Risk 2: Drought -->
            <div class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-slate-900">☀️ Drought</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">LOW</span>
              </div>
              <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                Adequate soil moisture and ground recharge available across region.
              </p>
            </div>

            <!-- Risk 3: High Temperature -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-slate-900">🌡️ High Temp</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">MODERATE</span>
              </div>
              <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                31-33°C range. Within safe physiological threshold for ${selectedCrop.name}.
              </p>
            </div>

            <!-- Risk 4: Pest Risk -->
            <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-slate-900">🐛 Pest Risk</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">MEDIUM</span>
              </div>
              <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                Leaf miners and spodoptera caterpillar sightings reported in adjacent farm clusters.
              </p>
            </div>

            <!-- Risk 5: Disease Risk -->
            <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-slate-900">🍄 Disease</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">MEDIUM</span>
              </div>
              <p class="text-[11px] text-slate-700 mt-1 leading-relaxed">
                Elevated 78% relative humidity promotes foliar fungal spores.
              </p>
            </div>

          </div>

          <!-- RECOMMENDED PREVENTIVE ACTIONS CHECKLIST -->
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 class="text-xs font-black uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-2">
              <span>🛡️</span> ${isTa ? "பரிந்துரைக்கப்பட்ட தடுப்பு நடவடிக்கைகள் (சரிபார்க்கவும்):" : "Recommended Preventive Actions (Interactive Checklist):"}
            </h3>
            
            <div class="space-y-2.5 text-xs text-slate-800">
              <label class="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-400 transition-all">
                <input type="checkbox" class="mt-0.5 accent-emerald-700 rounded">
                <span>
                  <strong class="font-bold text-slate-900">${isTa ? "வடிகால் வாய்க்கால்களை சுத்தம் செய்தல்:" : "Clear Field Drainage Runoffs:"}</strong>
                  ${isTa ? "கனமழைக்கு முன் வரப்பு மற்றும் வாய்க்கால்களில் உள்ள அடைப்புகளை நீக்கி நீர் வடிய வழி செய்யவும்." : "Ensure excess surface rainwater can drain smoothly within 6-8 hours of rainfall."}
                </span>
              </label>

              <label class="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-400 transition-all">
                <input type="checkbox" class="mt-0.5 accent-emerald-700 rounded">
                <span>
                  <strong class="font-bold text-slate-900">${isTa ? "பாசனத்தை நிறுத்துதல்:" : "Withhold Irrigation Cycles:"}</strong>
                  ${isTa ? "மழை கணிப்பு உள்ளதால் உடனடியாக போர்வெல்/கிணற்று பாசனத்தை தற்காலிகமாக நிறுத்தவும்." : "Cease scheduled pump irrigation to avoid saturating root zones."}
                </span>
              </label>

              <label class="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-400 transition-all">
                <input type="checkbox" class="mt-0.5 accent-emerald-700 rounded">
                <span>
                  <strong class="font-bold text-slate-900">${isTa ? "வேப்ப எண்ணெய் கரைசல் தயாரிப்பு:" : "Prophylactic Bio-Spray:"}</strong>
                  ${isTa ? "மழை நின்ற பிறகு இலைகளில் பூஞ்சை மற்றும் பூச்சி தாக்குதலை தடுக்க 3% வேப்ப எண்ணெய் தெளிக்கவும்." : "Keep 3% Neem oil extract or Trichoderma viride ready for post-rain leaf spray."}
                </span>
              </label>

              <label class="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-emerald-400 transition-all">
                <input type="checkbox" class="mt-0.5 accent-emerald-700 rounded">
                <span>
                  <strong class="font-bold text-slate-900">${isTa ? "பயிர் காப்பீடு பதிவு:" : "Check Crop Insurance Validity:"}</strong>
                  ${isTa ? "இயற்கை பேரிடர் இழப்பீட்டிற்கு PMFBY பயிர் காப்பீட்டு பிரீமியம் செலுத்தப்பட்டுள்ளதை உறுதி செய்யவும்." : "Verify PMFBY crop insurance enrolment to safeguard against localized inundation losses."}
                </span>
              </label>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  changeCrop(cropId) {
    this.selectedCropId = cropId;
    window.CropRiskComponent.render(document.getElementById('viewContainer'));
  }
};

window.CropRiskComponent = CropRiskComponent;
