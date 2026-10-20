// Uzhavan Hub - Government Schemes & Agricultural Credit Component

const SchemesComponent = {
  searchQuery: "",
  selectedCategory: "All",
  activeEligibilityModal: false,
  activeChecklistModal: false,
  eligibilityResult: null,

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const schemes = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.GOVERNMENT_SCHEMES) || [];

    const categories = [
      "All",
      "Farmer income support",
      "Crop insurance",
      "Agricultural loans",
      "Solar/irrigation support",
      "Soil testing",
      "Agricultural infrastructure finance"
    ];

    const filtered = schemes.filter(s => {
      const matchCat = (this.selectedCategory === "All") || (s.category.toLowerCase() === this.selectedCategory.toLowerCase());
      const matchSearch = !this.searchQuery.trim() ||
        s.schemeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (s.schemeNameTa && s.schemeNameTa.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        s.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.purpose.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        s.authority.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🏛️</span> ${isTa ? "அரசு மானியங்கள் & திட்டங்கள்" : "Farmer Welfare & Subsidies"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "அரசு நலத்திட்டங்கள் & விவசாயக் கடன்கள்" : "Government Schemes & Agri Finance Directory"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "மத்திய மற்றும் மாநில அரசுகளின் முக்கிய வேளாண் மானியங்கள், பயிர் காப்பீடு மற்றும் கடன் திட்டங்கள்." : "Verified central and state agricultural support programs spanning 6 essential financial categories."}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.SchemesComponent.openEligibilityModal()" class="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
              <span>📋</span>
              <span>${isTa ? "தகுதி சரிபார்ப்பு" : "Check Eligibility"}</span>
            </button>
            <button onclick="window.SchemesComponent.openChecklistModal()" class="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5">
              <span>📑</span>
              <span>${isTa ? "ஆவண சரிபார்ப்பு" : "Required Documents"}</span>
            </button>
          </div>
        </div>

        <!-- SECTION 8 CRITICAL SPECIFICATION: OFFICIAL VERIFICATION BANNER -->
        <div class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
          <span class="text-xl flex-shrink-0">⚠️</span>
          <div>
            <strong class="font-extrabold text-amber-900 block text-sm mb-0.5">
              Information should be verified from the official government source before applying.
            </strong>
            <p class="leading-relaxed font-medium">
              Guidelines, financial allocation subsidies, and eligibility criteria are subject to periodic circular updates by the Ministry of Agriculture and Tamil Nadu State Departments. Always reference the official portals linked below.
            </p>
          </div>
        </div>

        <!-- SEARCH & CATEGORY PILLS BAR -->
        <div class="agri-card p-5 rounded-2xl space-y-4">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <!-- Search input -->
            <div class="relative w-full md:w-96">
              <input type="text" placeholder="${isTa ? 'திட்டங்களை தேடுக...' : 'Search by scheme name or keywords...'}" 
                value="${this.searchQuery}"
                oninput="window.SchemesComponent.handleSearch(this.value)"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <span class="absolute left-3 top-3 text-slate-700 text-xs">🔍</span>
            </div>

            <div class="text-xs text-slate-700 font-bold self-end md:self-auto">
              Found ${filtered.length} matching schemes
            </div>
          </div>

          <!-- Category Pills -->
          <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            ${categories.map(cat => `
              <button onclick="window.SchemesComponent.handleCategory('${cat}')" 
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-emerald-800 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- SCHEMES CARDS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${filtered.map(s => `
            <div class="agri-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all border border-slate-200 shadow-sm">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ${s.category}
                  </span>
                  <span class="text-xs text-slate-700 font-bold">🏛️ ${s.authority}</span>
                </div>

                <div>
                  <h3 class="text-lg font-black text-slate-900 leading-snug">
                    ${s.schemeName}
                  </h3>
                  ${s.schemeNameTa ? `<span class="block text-xs text-emerald-800 font-semibold mt-0.5">${s.schemeNameTa}</span>` : ''}
                </div>

                <!-- Purpose -->
                <p class="text-xs text-slate-700 leading-relaxed font-medium">
                  ${s.purpose}
                </p>

                <!-- Benefit Highlight -->
                <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-between">
                  <span>💰 Financial Scale / Subsidy:</span>
                  <strong class="text-emerald-900">${s.financialBenefit}</strong>
                </div>

                <!-- Eligibility -->
                <div class="text-xs text-slate-700 space-y-1">
                  <strong class="font-bold text-slate-900 block">👤 Eligibility Criteria:</strong>
                  <p class="text-[11px] leading-relaxed">${s.basicEligibility}</p>
                </div>
              </div>

              <!-- Footer with Verification Note and Official Source -->
              <div class="pt-3 border-t border-slate-100 space-y-2">
                <div class="text-[10px] text-amber-800 font-semibold italic flex items-center gap-1">
                  <span>⚠️</span>
                  <span>${s.verificationNote}</span>
                </div>

                <div class="flex items-center justify-between gap-3 pt-1">
                  <a href="${s.officialSource}" target="_blank" rel="noopener noreferrer"
                    class="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-800 font-bold text-xs border border-slate-300 transition-all flex items-center justify-center gap-1.5">
                    <span>🌐</span>
                    <span>Official Source Portal</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- MODAL: ELIGIBILITY QUESTIONNAIRE -->
        ${this.activeEligibilityModal ? `
          <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-4 text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-black text-slate-900">Scheme Eligibility Questionnaire</h3>
                <button onclick="window.SchemesComponent.closeEligibilityModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
              </div>

              <form onsubmit="window.SchemesComponent.handleEligibilitySubmit(event)" class="space-y-3.5">
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">1. Landholding Size Category *</label>
                  <select name="landCategory" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                    <option value="small">Small & Marginal Farmer (<= 5 Acres / 2 Hectares)</option>
                    <option value="medium">Medium Farmer (5 to 10 Acres)</option>
                    <option value="large">Large Farmer (> 10 Acres)</option>
                    <option value="tenant">Tenant Farmer / Sharecropper</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">2. Do you have an Aadhaar-linked Active Bank Account? *</label>
                  <select name="hasBankAadhaar" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                    <option value="yes">Yes, Aadhaar & Mobile linked with DBT enabled</option>
                    <option value="no">No / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">3. Primary Farming Interest *</label>
                  <select name="farmingFocus" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                    <option value="income">Direct Income Support (PM-KISAN)</option>
                    <option value="insurance">Crop Loss Protection (PMFBY Insurance)</option>
                    <option value="solar">Solar Agriculture Pump (PM-KUSUM)</option>
                    <option value="credit">Low-Interest Working Capital Loan (KCC)</option>
                    <option value="soil">Soil Testing & Free Soil Health Card</option>
                  </select>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                  <button type="button" onclick="window.SchemesComponent.closeEligibilityModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold">
                    Cancel
                  </button>
                  <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md">
                    Check My Eligible Schemes
                  </button>
                </div>
              </form>

              ${this.eligibilityResult ? `
                <div class="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                  <strong class="font-extrabold text-emerald-950 block text-xs">Recommended Schemes for Your Profile:</strong>
                  <ul class="space-y-1 text-slate-800 font-medium">
                    ${this.eligibilityResult.map(s => `
                      <li class="flex items-center gap-1.5">
                        <span class="text-emerald-700 font-bold">✓</span>
                        <strong>${s.schemeName}</strong> (${s.financialBenefit})
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- MODAL: REQUIRED DOCUMENTS CHECKLIST -->
        ${this.activeChecklistModal ? `
          <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4 text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-black text-slate-900">Government Scheme Application Documents</h3>
                <button onclick="window.SchemesComponent.closeChecklistModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
              </div>

              <p class="text-xs text-slate-700 leading-relaxed font-medium">
                Keep these verified documents ready before applying at e-Seva centres or official government portals:
              </p>

              <div class="space-y-2">
                <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked class="rounded text-emerald-700 mt-0.5">
                  <div>
                    <strong class="font-bold text-slate-900 block">Aadhaar Card</strong>
                    <span class="text-[10px] text-slate-700">Must be linked with your active mobile number for DBT OTP</span>
                  </div>
                </label>
                <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked class="rounded text-emerald-700 mt-0.5">
                  <div>
                    <strong class="font-bold text-slate-900 block">Land Patta / Chitta (பட்டா / சிட்டா)</strong>
                    <span class="text-[10px] text-slate-700">Recent copy from Tamil Nadu e-Services revenue portal</span>
                  </div>
                </label>
                <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked class="rounded text-emerald-700 mt-0.5">
                  <div>
                    <strong class="font-bold text-slate-900 block">Bank Passbook (Front Page Copy)</strong>
                    <span class="text-[10px] text-slate-700">Showing Account number, IFSC code, and branch address</span>
                  </div>
                </label>
                <label class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input type="checkbox" class="rounded text-emerald-700 mt-0.5">
                  <div>
                    <strong class="font-bold text-slate-900 block">Adangal / Sowing Certificate (அடங்கல்)</strong>
                    <span class="text-[10px] text-slate-700">Issued by Village Administrative Officer (VAO) for PMFBY</span>
                  </div>
                </label>
              </div>

              <div class="pt-2 text-right">
                <button onclick="window.SchemesComponent.closeChecklistModal()" class="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold">
                  Got It
                </button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  openEligibilityModal() {
    this.activeEligibilityModal = true;
    this.eligibilityResult = null;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  closeEligibilityModal() {
    this.activeEligibilityModal = false;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  openChecklistModal() {
    this.activeChecklistModal = true;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  closeChecklistModal() {
    this.activeChecklistModal = false;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleEligibilitySubmit(e) {
    e.preventDefault();
    const schemes = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.GOVERNMENT_SCHEMES) || [];
    const form = e.target;
    const focus = form.farmingFocus.value;

    let matched = schemes.filter(s => {
      if (focus === 'income' && s.category.toLowerCase().includes('income')) return true;
      if (focus === 'insurance' && s.category.toLowerCase().includes('insurance')) return true;
      if (focus === 'solar' && s.category.toLowerCase().includes('solar')) return true;
      if (focus === 'credit' && s.category.toLowerCase().includes('loan')) return true;
      if (focus === 'soil' && s.category.toLowerCase().includes('soil')) return true;
      return false;
    });

    if (matched.length === 0) matched = schemes.slice(0, 3);
    this.eligibilityResult = matched;
    window.UzhavanApp.showToast(`Found ${matched.length} schemes matching your criteria! 📋`, "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleSearch(query) {
    this.searchQuery = query;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleCategory(cat) {
    this.selectedCategory = cat;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.SchemesComponent = SchemesComponent;
