// Uzhavan Hub - Fertilizer Recommendation Component

const FertilizerComponent = {
  selectedCropId: "groundnut",
  selectedDistrict: "All",
  searchQuery: "",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const allCrops = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_DATA) || [];
    const allFertilizers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FERTILIZERS_DATA) || [];

    const districts = [
      "All", "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
      "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
      "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
    ];

    // Filtered records
    const filteredFertilizers = allFertilizers.filter(f => {
      const matchCrop = (this.selectedCropId === "All") || (f.cropId === this.selectedCropId) || (f.crop.toLowerCase().includes(this.selectedCropId.toLowerCase()));
      const matchDistrict = (this.selectedDistrict === "All") || (f.district.toLowerCase() === this.selectedDistrict.toLowerCase());
      const matchSearch = !this.searchQuery.trim() || 
        f.recommendedFertilizer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.nutrientType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.fertilizerGrade.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.crop.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        f.purpose.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return matchCrop && matchDistrict && matchSearch;
    });

    const activeCrop = allCrops.find(c => c.id === this.selectedCropId) || allCrops[0];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🧪</span> ${isTa ? "ஊட்டச்சத்து மேலாண்மை" : "Crop Nutrition Management"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "உர வழிகாட்டல் (Fertilizer Recommendation)" : "Fertilizer & Soil Nutrient Guidance"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "மண் வகை மற்றும் பயிரின் வளர்ச்சி நிலைக்கு ஏற்ப சமச்சீர் ரசாயன மற்றும் இயற்கை உர வழிகாட்டல்." : "Stage-specific N-P-K formulation, Gypsum pod-filling, and biofertilizer alternatives calibrated across 18 crops and 15 districts."}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo Data – For Prototype Testing
            </span>
          </div>
        </div>

        <!-- 3-FILTER INTERACTIVE BAR (CROP, DISTRICT, SEARCH) -->
        <div class="agri-card p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Crop Filter -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">1. ${isTa ? "பயிர் தேர்வு (18 பயிர்கள்):" : "Crop Filter (18 Crops):"}</label>
            <select onchange="window.FertilizerComponent.updateFilter('crop', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <option value="All">-- All 18 Crops --</option>
              ${allCrops.map(c => `
                <option value="${c.id}" ${c.id === this.selectedCropId ? 'selected' : ''}>${c.icon} ${c.name} (${c.nameTa})</option>
              `).join('')}
            </select>
          </div>

          <!-- District Filter -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">2. ${isTa ? "மாவட்டம்:" : "District (15 Districts):"}</label>
            <select onchange="window.FertilizerComponent.updateFilter('district', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${districts.map(d => `
                <option value="${d}" ${d === this.selectedDistrict ? 'selected' : ''}>${d === 'All' ? '-- All Districts --' : d + ' District'}</option>
              `).join('')}
            </select>
          </div>

          <!-- Fertilizer Search Input -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">3. ${isTa ? "உரம் பெயர் தேடல்:" : "Search Fertilizer:"}</label>
            <div class="relative">
              <input type="text" id="fertSearchInput" placeholder="Search Urea, Gypsum, DAP, MOP, NPK..."
                value="${this.searchQuery}"
                oninput="window.FertilizerComponent.updateFilter('search', this.value)"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <span class="absolute left-3 top-3 text-slate-700 text-xs">🔍</span>
            </div>
          </div>
        </div>

        ${this.selectedCropId === "groundnut" ? `
          <!-- GROUNDNUT SPOTLIGHT (GYPSUM CRITICAL SPECIFICATION) -->
          <div class="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 inline-block">
                🥜 Groundnut Critical Nutrition Alert
              </span>
              <h3 class="text-base font-black text-amber-950">
                Gypsum Top-Dressing Essential for Pod Filling (காய் திரட்சிக்கு ஜிப்சம்)
              </h3>
              <p class="text-xs text-amber-900/90 max-w-2xl leading-relaxed font-medium">
                Apply <strong>100 kg/acre Gypsum (29% Calcium + 18% Sulfur)</strong> at the pegging stage (40-45 DAS) followed by earthing up. Calcium ensures high shelling percentage and stops hollow pod (pops) formation.
              </p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-amber-300 text-center min-w-[150px]">
              <span class="text-[10px] font-bold uppercase text-slate-700 block">Dose at Pegging</span>
              <strong class="text-lg font-black text-amber-800">100 kg / acre</strong>
            </div>
          </div>
        ` : ''}

        <!-- DETAILED FERTILIZER PRESCRIPTIONS TABLE -->
        <div class="agri-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-emerald-950">
                ${isTa ? "பரிந்துரைக்கப்பட்ட உரங்கள் மற்றும் ஊட்டச்சத்து விவரங்கள்" : "Prescribed Fertilizer Recommendations & Doses"}
              </h3>
              <p class="text-xs text-slate-700">
                Found ${filteredFertilizers.length} tailored recommendations for this criteria
              </p>
            </div>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
              Per Acre Basis
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th class="py-3 px-3">Crop & District</th>
                  <th class="py-3 px-3">Soil Nutrients (N-P-K & pH)</th>
                  <th class="py-3 px-3">Recommended Fertilizer</th>
                  <th class="py-3 px-3">Nutrient Grade</th>
                  <th class="py-3 px-3">Suggested Dosage</th>
                  <th class="py-3 px-3">Timing & Application</th>
                  <th class="py-3 px-3">Agronomic Purpose</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                ${filteredFertilizers.slice(0, 50).map(f => `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-3 whitespace-nowrap">
                      <strong class="text-slate-900 block">${f.crop}</strong>
                      <span class="text-[10px] text-emerald-700 font-semibold">📍 ${f.district}</span>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap text-[11px] text-slate-700">
                      <div>N: ${f.soilN} • P: ${f.soilP} • K: ${f.soilK}</div>
                      <div class="text-[10px] text-slate-700">pH: ${f.soilPH} (${f.soilType})</div>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1 font-bold ${f.recommendedFertilizer === 'Gypsum' ? 'text-amber-800 bg-amber-100 px-2 py-0.5 rounded' : 'text-slate-900'}">
                        <span>🧪</span>
                        <span>${f.recommendedFertilizer}</span>
                      </span>
                      <span class="text-[10px] text-slate-700 block">${f.nutrientType}</span>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-bold text-emerald-800">
                      ${f.fertilizerGrade}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-black text-slate-900">
                      ${f.suggestedDosage}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap text-[11px]">
                      <span class="font-bold text-slate-900 block">${f.timing}</span>
                      <span class="text-[10px] text-slate-700">${f.applicationMethod}</span>
                    </td>
                    <td class="py-3 px-3 text-[11px] text-slate-700 min-w-[200px]">
                      ${f.purpose}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- BIOFERTILIZER & ORGANIC ALTERNATIVES -->
        <div class="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
          <h3 class="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
            <span>🌿</span> ${isTa ? "சுற்றுச்சூழல் நட்பு இயற்கை & நுண்ணுயிர் உரங்கள்:" : "Eco-Friendly Organic & Biofertilizer Practices:"}
          </h3>
          <p class="text-xs md:text-sm font-semibold text-emerald-900 leading-relaxed">
            Apply <strong>Neem Cake 100-150 kg/acre</strong> to suppress root-knot nematodes and slow down nitrogen leaching. Inoculate seeds with <strong>Trichoderma viride</strong> (4g/kg) and <strong>Phosphobacteria</strong> to solubilize soil-bound phosphorus.
          </p>
        </div>

      </div>
    `;
  },

  updateFilter(type, value) {
    if (type === 'crop') this.selectedCropId = value;
    if (type === 'district') this.selectedDistrict = value;
    if (type === 'search') this.searchQuery = value;

    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.FertilizerComponent = FertilizerComponent;
