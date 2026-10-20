// Uzhavan Hub - Combined Farm Services & Rental Component (Human & Machine Rental)

const FarmServicesComponent = {
  rentalType: "All", // "All", "Human", "Machine"
  selectedDistrict: "All",
  selectedCategory: "All",
  selectedAvailability: "All",
  searchQuery: "",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;
    const allRentals = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.RENTALS_DATA) || [];

    const districts = [
      "All", "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
      "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
      "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
    ];

    const humanCategories = [
      "Farm Labour", "Harvesting Worker", "Ploughing Worker", "Pesticide Sprayer",
      "Transplanting Worker", "Irrigation Worker", "Tractor Operator", "Cattle Care Worker"
    ];

    const machineCategories = [
      "Tractor", "Power Tiller", "Rotavator", "Seed Drill", "Cultivator",
      "Harvester", "Sprayer Machine", "Water Pump", "Thresher", "Drone Sprayer"
    ];

    // Determine category dropdown options
    let categoryOptions = ["All"];
    if (this.rentalType === "Human") {
      categoryOptions = ["All", ...humanCategories];
    } else if (this.rentalType === "Machine") {
      categoryOptions = ["All", ...machineCategories];
    } else {
      categoryOptions = ["All", ...humanCategories, ...machineCategories];
    }

    // Filter rentals
    const filteredRentals = allRentals.filter(r => {
      // 1. Type filter
      if (this.rentalType !== "All" && r.type !== this.rentalType) return false;

      // 2. District filter
      if (this.selectedDistrict !== "All" && r.district.toLowerCase() !== this.selectedDistrict.toLowerCase()) return false;

      // 3. Category filter
      if (this.selectedCategory !== "All" && r.category.toLowerCase() !== this.selectedCategory.toLowerCase()) return false;

      // 4. Availability
      if (this.selectedAvailability !== "All" && !r.availability.toLowerCase().includes(this.selectedAvailability.toLowerCase())) return false;

      // 5. Search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchName = r.name && r.name.toLowerCase().includes(q);
        const matchCat = r.category && r.category.toLowerCase().includes(q);
        const matchWork = r.workType && r.workType.toLowerCase().includes(q);
        const matchMach = r.machineType && r.machineType.toLowerCase().includes(q);
        const matchDist = r.district && r.district.toLowerCase().includes(q);
        const matchProv = r.providerName && r.providerName.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchWork && !matchMach && !matchDist && !matchProv) {
          return false;
        }
      }

      return true;
    });

    const humanCount = allRentals.filter(r => r.type === "Human").length;
    const machineCount = allRentals.filter(r => r.type === "Machine").length;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-emerald-700/40 relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider mb-2 border border-emerald-500/30">
                <span>🛠️</span> ${isTa ? "பண்ணை சேவைகள் மையம்" : "INTEGRATED AGRICULTURAL SERVICES & RENTAL"}
              </div>
              <h1 class="text-3xl md:text-4xl font-black tracking-tight">
                ${isTa ? "பண்ணை வாடகை மையம் (Farm Rentals)" : "Farm Services & Equipment Rental"}
              </h1>
              <p class="text-xs md:text-sm text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
                ${isTa 
                  ? "விவசாய தொழிலாளர்கள் மற்றும் இயந்திரங்களை ஒரே இடத்தில் கண்டறியும் வாடகை மையம்." 
                  : "Bridge agricultural labour shortages and eliminate high machinery capital expenditure through hyper-local human and machine rentals."
                }
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                Demo Data – For Prototype Testing
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 5 & 6 SPECIFICATION: UNIFIED SELECTION HIERARCHY -->
        <!-- RENTAL: HUMAN vs MACHINE SELECTOR -->
        <div class="agri-card p-4 rounded-2xl">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>🔄</span> RENTAL SELECTION (வாடகை வகை):
            </span>
            <div class="text-[11px] text-slate-700 font-semibold">
              Showing ${filteredRentals.length} active listings
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <button onclick="window.FarmServicesComponent.setRentalType('All')"
              class="py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${this.rentalType === 'All' ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>🌾</span>
              <span>All Rentals (${allRentals.length})</span>
            </button>

            <button onclick="window.FarmServicesComponent.setRentalType('Human')" id="btnHumanRental"
              class="py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${this.rentalType === 'Human' ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>👨‍🌾</span>
              <span>Human (${humanCount} Workers)</span>
            </button>

            <button onclick="window.FarmServicesComponent.setRentalType('Machine')" id="btnMachineRental"
              class="py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${this.rentalType === 'Machine' ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>🚜</span>
              <span>Machine (${machineCount} Equipment)</span>
            </button>
          </div>
        </div>

        <!-- ADVANCED FILTERS (DISTRICT, CATEGORY, AVAILABILITY, SEARCH) -->
        <div class="agri-card p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- District Filter -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">District:</label>
            <select onchange="window.FarmServicesComponent.updateFilter('district', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${districts.map(d => `
                <option value="${d}" ${d === this.selectedDistrict ? 'selected' : ''}>${d === 'All' ? '-- All Districts --' : d + ' District'}</option>
              `).join('')}
            </select>
          </div>

          <!-- Category / Work Type -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Work / Machine Type:</label>
            <select onchange="window.FarmServicesComponent.updateFilter('category', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${categoryOptions.map(c => `
                <option value="${c}" ${c === this.selectedCategory ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>

          <!-- Availability -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Availability:</label>
            <select onchange="window.FarmServicesComponent.updateFilter('availability', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <option value="All">All Availability</option>
              <option value="Immediate" ${this.selectedAvailability === 'Immediate' ? 'selected' : ''}>Immediate Today</option>
              <option value="Tomorrow" ${this.selectedAvailability === 'Tomorrow' ? 'selected' : ''}>Available Tomorrow</option>
            </select>
          </div>

          <!-- Search Input -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Search Keywords:</label>
            <div class="relative">
              <input type="text" id="rentalSearchInput" placeholder="Search Tractor, Harvester, Worker..."
                value="${this.searchQuery}"
                oninput="window.FarmServicesComponent.updateFilter('search', this.value)"
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <span class="absolute left-3 top-2.5 text-slate-700 text-xs">🔍</span>
            </div>
          </div>
        </div>

        <!-- RENTAL LISTINGS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${filteredRentals.length === 0 ? `
            <div class="col-span-full agri-card p-12 text-center space-y-3">
              <span class="text-4xl">🔍</span>
              <h3 class="text-base font-bold text-slate-800">No rental records matched your filters</h3>
              <p class="text-xs text-slate-700">Try switching between Human and Machine, or clearing the search text.</p>
              <button onclick="window.FarmServicesComponent.resetFilters()" class="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold">
                Reset All Filters
              </button>
            </div>
          ` : filteredRentals.map(r => `
            <div class="agri-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md border ${r.type === 'Human' ? 'border-emerald-100 bg-gradient-to-b from-white to-emerald-50/20' : 'border-blue-100 bg-gradient-to-b from-white to-blue-50/20'}">
              <div class="space-y-3">
                <!-- Top Badge & Type -->
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${r.type === 'Human' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}">
                    ${r.type === 'Human' ? '👨‍🌾 Human Labour' : '🚜 Farm Machine'}
                  </span>
                  <span class="text-xs font-bold text-slate-700">★ ${r.rating} (${r.completedJobs} jobs)</span>
                </div>

                <!-- Name & Category -->
                <div>
                  <h3 class="text-lg font-black text-slate-900 leading-snug">
                    ${r.name}
                  </h3>
                  <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-700">
                    <span class="font-bold text-emerald-800">${r.category}</span>
                    <span>•</span>
                    <span>📍 ${r.district}</span>
                  </div>
                </div>

                <!-- Experience / Specs -->
                <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div class="flex justify-between text-slate-700">
                    <span>${r.type === 'Human' ? 'Experience:' : 'Specification:'}</span>
                    <strong class="text-slate-900">${r.experience}</strong>
                  </div>
                  <div class="flex justify-between text-slate-700">
                    <span>Provider:</span>
                    <span class="text-slate-900 truncate max-w-[160px]">${r.providerName}</span>
                  </div>
                </div>

                <!-- Rate & Availability -->
                <div class="flex items-baseline justify-between pt-1">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-slate-700 block">Rental Rate</span>
                    <strong class="text-xl font-black text-emerald-950">${r.rateFormatted}</strong>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${r.availability === 'Immediate' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${r.availability}
                  </span>
                </div>
              </div>

              <!-- Action / Contact Button -->
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button onclick="window.FarmServicesComponent.showContactModal('${r.name}', '${r.contact}', '${r.rateFormatted}')"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5">
                  <span>📞</span>
                  <span>Contact / Book</span>
                </button>
                <span class="text-[10px] text-slate-700 italic">Prototype</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  setRentalType(type) {
    this.rentalType = type;
    this.selectedCategory = "All";
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  updateFilter(type, value) {
    if (type === 'district') this.selectedDistrict = value;
    if (type === 'category') this.selectedCategory = value;
    if (type === 'availability') this.selectedAvailability = value;
    if (type === 'search') this.searchQuery = value;

    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  resetFilters() {
    this.rentalType = "All";
    this.selectedDistrict = "All";
    this.selectedCategory = "All";
    this.selectedAvailability = "All";
    this.searchQuery = "";
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  showContactModal(name, contact, rate) {
    alert(`[Uzhavan Hub Booking]\n\nProvider: ${name}\nRate: ${rate}\nDirect Contact: ${contact}\n\nNote: Demo Data – For Prototype Testing.`);
  }
};

window.FarmServicesComponent = FarmServicesComponent;
