// Uzhavan Hub - Veterinary Care, Cattle Health & Emergency Livestock Assistance Component

const VeterinaryCareComponent = {
  activeTab: "facilities", // "facilities" or "cattleHealth"
  selectedAnimal: "All", // "All", "Cow", "Buffalo", "Goat", "Sheep", "Calf"
  selectedDistrict: "All",
  selectedService: "All",
  searchQuery: "",
  selectedSpecies: "cow",
  activeFacilityDetail: null,
  activeCallModal: null,

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;
    const vetRecords = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.VETERINARY_RECORDS) || [];
    const cattleHealth = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CATTLE_HEALTH_DATA) || {};

    const districts = [
      "All", "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
      "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
      "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
    ];

    const animals = ["All", "Cow", "Buffalo", "Goat", "Sheep", "Calf"];
    const services = ["All", "General Check-up", "Vaccination", "Emergency", "Treatment"];

    // Filter facilities
    const filteredRecords = vetRecords.filter(f => {
      // Animal filter
      if (this.selectedAnimal !== "All") {
        const supports = f.animalsSupported && f.animalsSupported.some(a => a.toLowerCase() === this.selectedAnimal.toLowerCase());
        if (!supports) return false;
      }

      // District filter
      if (this.selectedDistrict !== "All" && f.district.toLowerCase() !== this.selectedDistrict.toLowerCase()) {
        return false;
      }

      // Service filter
      if (this.selectedService !== "All" && f.service.toLowerCase() !== this.selectedService.toLowerCase()) {
        return false;
      }

      // Search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchName = f.centreName && f.centreName.toLowerCase().includes(q);
        const matchDist = f.district && f.district.toLowerCase().includes(q);
        const matchServ = f.service && f.service.toLowerCase().includes(q);
        const matchAnim = f.animalsSupported && f.animalsSupported.some(a => a.toLowerCase().includes(q));
        if (!matchName && !matchDist && !matchServ && !matchAnim) return false;
      }

      return true;
    });

    const currentSpeciesDiseases = cattleHealth[this.selectedSpecies] || cattleHealth.cow || [];

    const speciesList = [
      { id: "cow", en: "Cow / Cattle", ta: "பசு மாடு", icon: "🐄" },
      { id: "buffalo", en: "Buffalo", ta: "எருமை", icon: "🐃" },
      { id: "goat", en: "Goat", ta: "வெள்ளாடு", icon: "🐐" },
      { id: "sheep", en: "Sheep", ta: "செம்மறி ஆடு", icon: "🐑" },
      { id: "calf", en: "Calf", ta: "கன்றுக்குட்டி", icon: "🐮" }
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🐄</span> ${isTa ? "கால்நடை மருத்துவம் & பராமரிப்பு" : "Livestock Healthcare Portal"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "கால்நடை மருத்துவம் & நலம் (Veterinary Care)" : "Veterinary Care & Animal Hospital Directory"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "அருகிலுள்ள கால்நடை மருத்துவமனைகள், மருத்துவர்கள், தடுப்பூசி முகாம்கள் மற்றும் 24 மணி நேர அவசர உதவி." : "Search qualified government and mobile veterinary centres across 15 districts supporting Cow, Buffalo, Goat, Sheep, and Calf."}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo location – verify before deployment
            </span>
          </div>
        </div>

        <!-- MANDATORY DISCLAIMER AS REQUESTED IN SPEC -->
        <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <span class="text-base flex-shrink-0">⚠️</span>
          <p class="leading-relaxed">
            <strong>Important Veterinary Disclaimer – Verify with local department:</strong> Do not generate or rely on automated medical diagnosis. For any clinical symptoms or sick livestock, consult a qualified veterinarian immediately.
          </p>
        </div>

        <!-- EMERGENCY HELPLINE BANNER -->
        <div class="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-6 rounded-2xl shadow-xl border border-red-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider">
              <span class="text-amber-300 animate-pulse text-sm">🚨</span>
              <span>24/7 VETERINARY EMERGENCY DISPATCH</span>
            </div>
            <h2 class="text-2xl font-black">
              ${isTa ? "உங்கள் கால்நடைகளுக்கு அவசர மருத்துவ உதவி தேவையா?" : "Need urgent emergency care for your cattle?"}
            </h2>
            <p class="text-xs text-rose-100 font-medium">
              Dial Toll-Free 1962 for government livestock emergency ambulance dispatch or contact the local taluk veterinary hospital.
            </p>
          </div>

          <div class="flex items-center gap-3 flex-shrink-0">
            <button onclick="window.VeterinaryCareComponent.openCallModal('1962 (Livestock Emergency Ambulance)', '24/7 Dispatch')"
              class="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2">
              <span>📞</span>
              <span>Call Helpline (1962)</span>
            </button>
          </div>
        </div>

        <!-- MAIN TABS: NEARBY HOSPITALS vs CATTLE HEALTH GUIDE -->
        <div class="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button onclick="window.VeterinaryCareComponent.switchTab('facilities')" class="px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${this.activeTab === 'facilities' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}">
            <span>🏥</span>
            <span>${isTa ? "கால்நடை மருத்துவ மையங்கள்" : "Veterinary Care Centres"} (${filteredRecords.length})</span>
          </button>
          <button onclick="window.VeterinaryCareComponent.switchTab('cattleHealth')" class="px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${this.activeTab === 'cattleHealth' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}">
            <span>🐄</span>
            <span>${isTa ? "கால்நடை நலம் & நோய் வழிகாட்டி" : "Livestock Health & Disease Guide"}</span>
          </button>
        </div>

        ${this.activeTab === 'facilities' ? `
          <!-- TAB 1: FILTERS & VETERINARY CENTRES -->
          <div class="space-y-6">
            
            <!-- FILTERS BAR: ANIMAL TYPE, DISTRICT, SERVICE, SEARCH -->
            <div class="agri-card p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Animal Filter -->
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Animal Supported:</label>
                <select id="vetAnimalFilter" onchange="window.VeterinaryCareComponent.updateFilter('animal', this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                  ${animals.map(a => `
                    <option value="${a}" ${this.selectedAnimal === a ? 'selected' : ''}>${a === 'All' ? '-- All Animals --' : a}</option>
                  `).join('')}
                </select>
              </div>

              <!-- District Filter -->
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">District:</label>
                <select id="vetDistrictFilter" onchange="window.VeterinaryCareComponent.updateFilter('district', this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                  ${districts.map(d => `
                    <option value="${d}" ${this.selectedDistrict === d ? 'selected' : ''}>${d === 'All' ? '-- All Districts --' : d + ' District'}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Service Filter -->
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Service Type:</label>
                <select id="vetServiceFilter" onchange="window.VeterinaryCareComponent.updateFilter('service', this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                  ${services.map(s => `
                    <option value="${s}" ${this.selectedService === s ? 'selected' : ''}>${s === 'All' ? '-- All Services --' : s}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Search Box -->
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Search Centre:</label>
                <div class="relative">
                  <input type="text" id="vetSearchInput" placeholder="Search centre name..."
                    value="${this.searchQuery}"
                    oninput="window.VeterinaryCareComponent.updateFilter('search', this.value)"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                  <span class="absolute left-3 top-2.5 text-slate-700 text-xs">🔍</span>
                </div>
              </div>
            </div>

            <!-- CENTRES LISTING GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              ${filteredRecords.map(fac => `
                <div class="agri-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all bg-white shadow-sm border border-slate-200">
                  <div class="space-y-3">
                    <div class="flex items-start justify-between">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${fac.isEmergency ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                        ${fac.service}
                      </span>
                      <span class="text-xs font-bold text-slate-700">★ ${fac.rating}</span>
                    </div>

                    <div>
                      <h3 class="font-black text-slate-900 text-base leading-snug">
                        ${fac.centreName}
                      </h3>
                      <div class="text-xs text-slate-700 mt-1 flex items-center gap-1.5">
                        <span>📍 ${fac.district}</span>
                        <span>•</span>
                        <span>${fac.location}</span>
                      </div>
                    </div>

                    <!-- Animals Supported -->
                    <div>
                      <span class="text-[10px] uppercase font-bold text-slate-700 block mb-1">Animals Supported:</span>
                      <div class="flex flex-wrap gap-1">
                        ${fac.animalsSupported.map(a => `
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            ${a}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <!-- Hours & Availability -->
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div class="flex justify-between">
                        <span class="text-slate-700">Working Hours:</span>
                        <strong class="text-slate-900">${fac.workingHours}</strong>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-700">Emergency:</span>
                        <span class="font-bold ${fac.emergencyAvailability.includes('24/7') ? 'text-rose-700' : 'text-slate-700'}">${fac.emergencyAvailability}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="pt-2 border-t border-slate-100 space-y-2">
                    <button onclick="window.VeterinaryCareComponent.openCallModal('${fac.contact}', '${fac.centreName}')"
                      class="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5">
                      <span>📞</span>
                      <span>Contact / Book Appointment</span>
                    </button>
                    <div class="text-[10px] text-center text-slate-700">
                      Demo location – verify before deployment
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        ` : `
          <!-- TAB 2: CATTLE HEALTH & DISEASE ADVISORY GUIDE -->
          <div class="space-y-6">
            <!-- Advisory Notice -->
            <div class="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium leading-relaxed">
              <strong class="font-bold text-rose-900 block mb-1">⚕️ Clinical Consultation Notice:</strong>
              This guide provides preventive agronomic awareness only. Do not attempt unprescribed medical procedures or administer antibiotics without direct veterinary examination.
            </div>

            <!-- Species Selector Tabs -->
            <div class="flex flex-wrap gap-2">
              ${speciesList.map(s => `
                <button onclick="window.VeterinaryCareComponent.selectSpecies('${s.id}')"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${this.selectedSpecies === s.id ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}">
                  <span>${s.icon}</span>
                  <span>${isTa ? s.ta : s.en}</span>
                </button>
              `).join('')}
            </div>

            <!-- Disease Cards -->
            <div class="space-y-4">
              ${currentSpeciesDiseases.map(d => `
                <div class="agri-card p-6 rounded-2xl space-y-4 border border-slate-200">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 class="text-xl font-black text-slate-900">
                        ${isTa ? d.nameTa : d.name}
                      </h3>
                      <span class="text-xs text-slate-700 font-semibold">${d.name}</span>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-black uppercase ${d.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">
                      Severity: ${d.severity}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <strong class="font-bold text-rose-900 block">⚠️ Clinical Symptoms:</strong>
                      <p class="leading-relaxed text-slate-800">${isTa ? d.symptomsTa : d.symptomsEn}</p>
                    </div>

                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <strong class="font-bold text-emerald-900 block">🛡️ Preventive Hygiene & Vaccination:</strong>
                      <p class="leading-relaxed text-slate-800">${isTa ? d.preventionTa : d.preventionEn}</p>
                    </div>
                  </div>

                  <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                    <strong class="font-bold block text-amber-900 mb-0.5">📞 When to Contact Veterinarian:</strong>
                    ${isTa ? d.whenToContactTa : d.whenToContactEn}
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        `}

      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  selectSpecies(species) {
    this.selectedSpecies = species;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  updateFilter(type, value) {
    if (type === 'animal') this.selectedAnimal = value;
    if (type === 'district') this.selectedDistrict = value;
    if (type === 'service') this.selectedService = value;
    if (type === 'search') this.searchQuery = value;

    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  openCallModal(contact, name) {
    alert(`[Livestock Healthcare Helpline]\n\nFacility: ${name}\nPhone: ${contact}\n\nPrototype information – Verify with the local veterinary department.`);
  }
};

window.VeterinaryCareComponent = VeterinaryCareComponent;
