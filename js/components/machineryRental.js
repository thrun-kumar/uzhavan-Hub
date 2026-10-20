// Uzhavan Hub - Agricultural Machinery Rental Component

const MachineryRentalComponent = {
  filterType: "All",
  filterDistance: "All",
  filterPrice: "All",
  filterAvailability: "All",
  activeDetailMachine: null,
  activeRentModal: null,
  activeTab: "machines", // "machines" or "myRentals"
  rentals: [
    {
      id: "RNT-4021",
      machineName: "John Deere 5050D Tractor",
      provider: "Karthik Agri Equipment Hub",
      date: "Tomorrow, 8:00 AM",
      duration: "1 Day (8 hrs)",
      totalCost: 1500,
      status: "Confirmed",
      location: "Madurai Farm"
    }
  ],

  normalizeMachine(m) {
    if (!m) return null;
    const name = m.name || m.machineName || "Farm Equipment";
    const nameTa = m.nameTa || name;
    const cat = m.category || m.machineType || (m.type !== 'Machine' ? m.type : "Tractor");
    const icon = m.icon || (cat.includes('Tractor') ? '🚜' : cat.includes('Harvester') ? '🌾' : cat.includes('Pump') ? '💧' : cat.includes('Sprayer') ? '🧪' : '🌱');
    const provider = m.provider || m.providerName || (m.district ? `${m.district} Agro Custom Hiring Centre (CHS)` : "Custom Hiring Centre");
    const location = m.location || (m.district ? `${m.district} Agri Hub, Tamil Nadu` : "Tamil Nadu");
    const distanceKm = (m.distanceKm !== undefined && m.distanceKm !== null && !isNaN(m.distanceKm)) ? parseFloat(m.distanceKm) : 4.0;
    
    let pricePerDay = 1500;
    let pricePerHour = 250;
    if (m.pricePerDay !== undefined && !isNaN(m.pricePerDay)) {
      pricePerDay = parseInt(m.pricePerDay);
    } else if (m.rateUnit === '/day' && m.rate) {
      pricePerDay = parseInt(m.rate);
    } else if (m.rate) {
      pricePerDay = parseInt(m.rate) * 8;
    }

    if (m.pricePerHour !== undefined && !isNaN(m.pricePerHour)) {
      pricePerHour = parseInt(m.pricePerHour);
    } else if (m.rateUnit === '/hour' && m.rate) {
      pricePerHour = parseInt(m.rate);
    } else if (pricePerDay) {
      pricePerHour = Math.max(150, Math.round(pricePerDay / 8));
    }

    const rating = (m.rating !== undefined && !isNaN(m.rating)) ? parseFloat(m.rating) : 4.7;
    const reviewsCount = (m.reviewsCount !== undefined && !isNaN(m.reviewsCount)) ? parseInt(m.reviewsCount) : (m.completedJobs || 25);
    const availableStatus = m.availableStatus || (m.availability === "Available Tomorrow" ? "busy" : "available");
    const availability = m.availability || (availableStatus === "available" ? "Available Today" : "Available Tomorrow");
    const availabilityTa = m.availabilityTa || (availableStatus === "available" ? "இன்றே கிடைக்கும்" : "நாளை கிடைக்கும்");
    const contact = m.contact || m.phone || "+91 98422 20000";

    return {
      id: m.id || `machine-${Math.random().toString(36).substr(2, 6)}`,
      name,
      nameTa,
      icon,
      type: cat,
      category: cat,
      machineType: cat,
      provider,
      providerName: provider,
      location,
      district: m.district || "Tamil Nadu",
      distanceKm,
      pricePerDay,
      pricePerHour,
      rateFormatted: m.rateFormatted || `₹${pricePerDay} / day`,
      availability,
      availabilityTa,
      availableStatus,
      rating,
      reviewsCount,
      completedJobs: m.completedJobs || reviewsCount,
      contact,
      phone: contact,
      experience: m.experience || "2024 Model, Fully Serviced",
      dataStatus: m.dataStatus || "Demo Data – For Prototype Testing"
    };
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile || { location: 'Madurai' };
    const rawMachines = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MACHINERY_DATA) || [];
    const machines = rawMachines.map(m => this.normalizeMachine(m)).filter(Boolean);

    // Filter machinery defensively
    const filteredMachines = machines.filter(m => {
      if (this.filterType !== "All" && m.type !== this.filterType && m.category !== this.filterType) return false;
      if (this.filterDistance === "5km" && m.distanceKm > 5) return false;
      if (this.filterDistance === "10km" && m.distanceKm > 10) return false;
      if (this.filterPrice === "under1000" && m.pricePerDay >= 1000) return false;
      if (this.filterPrice === "1000-2000" && (m.pricePerDay < 1000 || m.pricePerDay > 2000)) return false;
      if (this.filterPrice === "above2000" && m.pricePerDay <= 2000) return false;
      if (this.filterAvailability === "today" && m.availableStatus !== "available") return false;
      return true;
    });

    const machineCategories = [
      { id: "All", en: "All Machines", ta: "அனைத்து கருவிகள்", icon: "🚜" },
      { id: "Tractor", en: "Tractor", ta: "டிராக்டர்", icon: "🚜" },
      { id: "Harvester", en: "Harvester", ta: "அறுவடை இயந்திரம்", icon: "🌾" },
      { id: "Rotavator", en: "Rotavator", ta: "ரோட்டவேட்டர்", icon: "🚜" },
      { id: "Seed Drill", en: "Seed Drill", ta: "விதைக்கருவி", icon: "🌱" },
      { id: "Water Pump", en: "Water Pump", ta: "நீர் பம்பு", icon: "💧" },
      { id: "Thresher", en: "Thresher", ta: "கதிரடிக்கும் கருவி", icon: "🌾" },
      { id: "Sprayer", en: "Sprayer", ta: "தெளிப்பான்", icon: "🧪" },
      { id: "Cultivator", en: "Cultivator", ta: "கலப்பை", icon: "🌱" }
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🚜</span> ${isTa ? "வேளாண் இயந்திரங்கள் வாடகை" : "Custom Hiring Centre"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "வேளாண் இயந்திர வாடகை (Rent Machinery)" : "Agricultural Machinery Rental"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "விலையுயர்ந்த உபகரணங்களை வாங்காமல், மணி அல்லது நாள் அடிப்படையில் உங்கள் பண்ணைக்கு வாடகைக்கு எடுங்கள்." : "Rent high-horsepower tractors, combine harvesters, rotavators, and sprayers at affordable hourly or daily rates."}
            </p>
          </div>

          <!-- Location Context & Bookings Toggle -->
          <div class="flex items-center gap-2 self-start md:self-auto">
            <div class="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span>📍</span>
              <span>${isTa ? "பண்ணை இருப்பிடம்:" : "Farm Location:"} <strong>${profile.location}</strong></span>
            </div>
            <button onclick="window.MachineryRentalComponent.switchTab('${this.activeTab === 'machines' ? 'myRentals' : 'machines'}')" class="px-4 py-2 rounded-xl ${this.activeTab === 'myRentals' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'} text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
              <span>📋</span>
              <span>${isTa ? "வாடகை நிலை (" + this.rentals.length + ")" : "Rentals (" + this.rentals.length + ")"}</span>
            </button>
          </div>
        </div>

        ${this.activeTab === 'myRentals' ? this.renderRentalsView(isTa) : `
          <!-- FILTER CONTROLS BAR -->
          <div class="agri-card p-4 md:p-5 rounded-2xl space-y-4">
            
            <!-- Category Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              ${machineCategories.map(cat => `
                <button onclick="window.MachineryRentalComponent.setTypeFilter('${cat.id}')" 
                  class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${this.filterType === cat.id ? 'bg-emerald-800 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                  <span>${cat.icon}</span>
                  <span>${isTa ? cat.ta : cat.en}</span>
                </button>
              `).join('')}
            </div>

            <!-- Multi-Filter Dropdowns -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <!-- Distance -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">📍 ${isTa ? "தூரம்:" : "Max Distance:"}</label>
                <select onchange="window.MachineryRentalComponent.setFilter('filterDistance', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterDistance === 'All' ? 'selected' : ''}>${isTa ? "அனைத்து தூரமும்" : "Any Distance"}</option>
                  <option value="5km" ${this.filterDistance === '5km' ? 'selected' : ''}>${isTa ? "5 கி.மீ க்குள்" : "Within 5 km"}</option>
                  <option value="10km" ${this.filterDistance === '10km' ? 'selected' : ''}>${isTa ? "10 கி.மீ க்குள்" : "Within 10 km"}</option>
                </select>
              </div>

              <!-- Rental Price -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">💰 ${isTa ? "வாடகை கட்டணம்:" : "Daily Rate:"}</label>
                <select onchange="window.MachineryRentalComponent.setFilter('filterPrice', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterPrice === 'All' ? 'selected' : ''}>${isTa ? "அனைத்து கட்டணமும்" : "All Rates"}</option>
                  <option value="under1000" ${this.filterPrice === 'under1000' ? 'selected' : ''}>Under ₹1,000 / day</option>
                  <option value="1000-2000" ${this.filterPrice === '1000-2000' ? 'selected' : ''}>₹1,000 – ₹2,000 / day</option>
                  <option value="above2000" ${this.filterPrice === 'above2000' ? 'selected' : ''}>Above ₹2,000 / day</option>
                </select>
              </div>

              <!-- Availability -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">🕒 ${isTa ? "கிடைக்கும் நிலை:" : "Availability:"}</label>
                <select onchange="window.MachineryRentalComponent.setFilter('filterAvailability', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterAvailability === 'All' ? 'selected' : ''}>${isTa ? "அனைத்தும்" : "Any Time"}</option>
                  <option value="today" ${this.filterAvailability === 'today' ? 'selected' : ''}>${isTa ? "இன்றே கிடைக்கும்" : "Available Today"}</option>
                </select>
              </div>

              <!-- Reset -->
              <div class="flex items-end justify-between">
                <span class="text-xs text-slate-700 font-bold mb-2">
                  ${filteredMachines.length} ${isTa ? "இயந்திரங்கள் உள்ளன" : "Machines Found"}
                </span>
                <button onclick="window.MachineryRentalComponent.resetFilters()" class="text-xs font-bold text-emerald-800 hover:underline mb-2">
                  ${isTa ? "வடிகட்டியை மீட்டமை" : "Reset Filters"}
                </button>
              </div>
            </div>
          </div>

          <!-- MACHINE CARDS GRID AS SPECIFIED IN SECTION 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${filteredMachines.map(m => `
              <div class="agri-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all bg-white shadow-sm hover:shadow-md">
                <div class="space-y-3">
                  <!-- Header: Machine Type, Distance, Rating -->
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
                        ${m.icon}
                      </div>
                      <div>
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ${m.type}
                        </span>
                        <h3 class="font-extrabold text-slate-900 text-sm md:text-base mt-1 leading-snug">
                          ${isTa ? m.nameTa : m.name}
                        </h3>
                      </div>
                    </div>

                    <div class="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <span class="text-amber-500 text-xs">⭐</span>
                      <span class="text-xs font-black text-amber-900">${m.rating}</span>
                    </div>
                  </div>

                  <!-- Location & Provider -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div class="flex justify-between items-center">
                      <span class="text-slate-700 font-medium">Provider:</span>
                      <strong class="text-slate-900 font-bold truncate max-w-[170px]">${m.provider}</strong>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-700 font-medium">Distance:</span>
                      <strong class="text-emerald-800 font-bold flex items-center gap-1">📍 ${m.distanceKm} km away</strong>
                    </div>
                  </div>

                  <!-- Price & Availability -->
                  <div class="flex items-center justify-between pt-1">
                    <div>
                      <span class="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">Rental Rates</span>
                      <div class="flex items-baseline gap-1">
                        <span class="text-xl font-black text-emerald-800">₹${m.pricePerDay}</span>
                        <span class="text-[10px] text-slate-700 font-semibold">/ day</span>
                        <span class="text-[10px] text-slate-700 ml-1">(or ₹${m.pricePerHour}/hr)</span>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${m.availableStatus === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        <span>${m.availableStatus === 'available' ? '🟢' : '🟡'}</span>
                        <span>${isTa ? m.availabilityTa : m.availability}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Two Buttons as specified: [ View Details ] [ Rent Now ] -->
                <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button onclick="window.MachineryRentalComponent.openDetailsModal('${m.id}')" class="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all text-center">
                    ${isTa ? "விவரங்கள்" : "View Details"}
                  </button>
                  <button onclick="window.MachineryRentalComponent.openRentModal('${m.id}')" class="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md transition-all text-center flex items-center justify-center gap-1">
                    <span>🚜</span>
                    <span>${isTa ? "வாடகைக்கு எடு" : "Rent Now"}</span>
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        `}

        <!-- MODAL 1: MACHINE DETAILS MODAL -->
        ${this.renderMachineDetailsModal(isTa)}

        <!-- MODAL 2: RENT BOOKING FORM MODAL AS SPECIFIED -->
        ${this.renderRentBookingModal(isTa, profile)}

      </div>
    `;
  },

  renderRentalsView(isTa) {
    return `
      <div class="agri-card p-6 md:p-8 rounded-2xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-xl font-black text-slate-900">${isTa ? "உங்கள் இயந்திர வாடகை முன்பதிவுகள்" : "Your Machinery Rental Bookings"}</h2>
            <p class="text-xs text-slate-700">${isTa ? "முன்பதிவு செய்யப்பட்ட டிராக்டர்கள் மற்றும் உபகரணங்களின் விவரங்கள்." : "Track equipment delivery status, hire dates, and estimated rental costs."}</p>
          </div>
          <button onclick="window.MachineryRentalComponent.switchTab('machines')" class="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-md">
            + ${isTa ? "மேலும் இயந்திரங்களை வாடகைக்கு எடு" : "Rent More Machines"}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/80 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Rental ID</th>
                <th class="py-3 px-4">Machine</th>
                <th class="py-3 px-4">Provider</th>
                <th class="py-3 px-4">Scheduled Date</th>
                <th class="py-3 px-4">Duration</th>
                <th class="py-3 px-4">Estimated Cost</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${this.rentals.map(r => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-slate-800">${r.id}</td>
                  <td class="py-3 px-4 font-extrabold text-slate-900">${r.machineName}</td>
                  <td class="py-3 px-4 text-slate-700">${r.provider}</td>
                  <td class="py-3 px-4 text-slate-700">${r.date}</td>
                  <td class="py-3 px-4 font-bold text-slate-900">${r.duration}</td>
                  <td class="py-3 px-4 font-black text-slate-900">₹${r.totalCost}</td>
                  <td class="py-3 px-4">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${r.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'}">
                      ${r.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    ${r.status === 'Confirmed' ? `
                      <button onclick="window.MachineryRentalComponent.cancelRental('${r.id}')" class="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[10px]">
                        Cancel
                      </button>
                    ` : `
                      <span class="text-slate-700 text-[11px]">—</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderMachineDetailsModal(isTa) {
    if (!this.activeDetailMachine) return '';
    const m = this.activeDetailMachine;

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-lg font-black text-slate-900">${isTa ? "இயந்திர விவரக்குறிப்புகள்" : "Machinery Specifications"}</h3>
            <button onclick="window.MachineryRentalComponent.closeDetailsModal()" class="text-slate-700 hover:text-slate-900 text-lg font-bold">✕</button>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl shadow-inner">
              ${m.icon}
            </div>
            <div>
              <span class="text-xs font-bold text-emerald-700">${m.type}</span>
              <h4 class="text-lg font-black text-slate-900">${isTa ? m.nameTa : m.name}</h4>
              <p class="text-xs text-slate-700">📍 ${m.distanceKm} km away • ${m.provider}</p>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Daily Rental Rate:</span>
              <strong class="text-slate-900 font-black">₹${m.pricePerDay} / day</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Hourly Rental Rate:</span>
              <strong class="text-slate-900 font-bold">₹${m.pricePerHour} / hour</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Operator:</span>
              <strong class="text-emerald-700 font-bold">${m.withOperator ? 'Trained Operator Included' : 'Self Operated / Attachment'}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Fuel Policy:</span>
              <span class="text-slate-800 font-semibold">${m.fuelPolicy}</span>
            </div>
          </div>

          <div class="text-xs space-y-1">
            <strong class="text-slate-900 font-bold block uppercase tracking-wider text-[11px]">Technical Specifications</strong>
            <p class="text-slate-700 leading-relaxed">${m.specs}</p>
          </div>

          <div class="text-xs space-y-1">
            <strong class="text-slate-900 font-bold block uppercase tracking-wider text-[11px]">Best Suited For</strong>
            <p class="text-slate-700 leading-relaxed">${m.suitableFor}</p>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button onclick="window.MachineryRentalComponent.closeDetailsModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold">Close</button>
            <button onclick="window.MachineryRentalComponent.closeDetailsModal(); window.MachineryRentalComponent.openRentModal('${m.id}')" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md">Rent This Machine</button>
          </div>
        </div>
      </div>
    `;
  },

  renderRentBookingModal(isTa, profile) {
    if (!this.activeRentModal) return '';
    const m = this.activeRentModal;

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-emerald-200 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700">Machinery Rental Form</span>
              <h3 class="text-lg font-black text-slate-900">Rent ${m.name}</h3>
            </div>
            <button onclick="window.MachineryRentalComponent.closeRentModal()" class="text-slate-700 hover:text-slate-900 text-lg font-bold">✕</button>
          </div>

          <!-- BOOKING FORM AS SPECIFIED IN SECTION 2 -->
          <form onsubmit="window.MachineryRentalComponent.handleRentalSubmit(event, '${m.id}')" class="space-y-4 text-xs">
            
            <!-- Machine Info -->
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span class="font-extrabold text-emerald-950 block">${m.name}</span>
                <span class="text-[11px] text-slate-700">${m.provider} • ${m.distanceKm} km away</span>
              </div>
              <div class="text-right">
                <span class="font-black text-emerald-800 block text-sm">₹${m.pricePerDay}/day</span>
                <span class="text-[10px] text-slate-700">₹${m.pricePerHour}/hr</span>
              </div>
            </div>

            <!-- Date -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Rental Start Date *</label>
              <input type="date" name="rentalDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
            </div>

            <!-- Rental Duration (Per Hour, Per Day, Multiple Days) -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Rental Duration Unit *</label>
                <select id="rentDurationType" name="durationType" onchange="window.MachineryRentalComponent.recalculateCost(${m.pricePerHour}, ${m.pricePerDay})" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="day">Per Day (8 Hours)</option>
                  <option value="hour">Per Hour</option>
                  <option value="multiDay">Multiple Days</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Duration Quantity *</label>
                <input type="number" id="rentDurationQty" name="durationQty" min="1" max="30" value="1" 
                  oninput="window.MachineryRentalComponent.recalculateCost(${m.pricePerHour}, ${m.pricePerDay})"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
              </div>
            </div>

            <!-- Farm Location -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Farm Delivery Location *</label>
              <input type="text" name="farmLocation" required value="${profile.location}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
            </div>

            <!-- Purpose of Machinery -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Field Purpose / Crop *</label>
              <input type="text" name="purpose" placeholder="e.g. Deep plowing for groundnut / Rotavator tilling" required value="Field Preparation for ${profile.currentCrop}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
            </div>

            <!-- Estimated Rental Cost Display -->
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-amber-900 block">Estimated Rental Cost:</span>
                <span class="text-[10px] text-slate-700">Includes operator & equipment transit</span>
              </div>
              <span id="rentalEstTotal" class="text-lg font-black text-amber-900">₹${m.pricePerDay}</span>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onclick="window.MachineryRentalComponent.closeRentModal()" class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold shadow-md flex items-center gap-1.5">
                <span>✓</span>
                <span>Confirm Rental</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  recalculateCost(hourlyRate, dailyRate) {
    const typeSelect = document.getElementById('rentDurationType');
    const qtyInput = document.getElementById('rentDurationQty');
    const totalEl = document.getElementById('rentalEstTotal');
    if (!typeSelect || !qtyInput || !totalEl) return;

    const qty = parseInt(qtyInput.value) || 1;
    let total = 0;
    if (typeSelect.value === 'hour') {
      total = qty * hourlyRate;
    } else {
      total = qty * dailyRate;
    }
    totalEl.innerText = '₹' + total.toLocaleString('en-IN');
  },

  openDetailsModal(machineId) {
    const rawMachines = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MACHINERY_DATA) || [];
    const found = rawMachines.find(item => item.id === machineId);
    this.activeDetailMachine = this.normalizeMachine(found);
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  closeDetailsModal() {
    this.activeDetailMachine = null;
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  openRentModal(machineId) {
    const rawMachines = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MACHINERY_DATA) || [];
    const found = rawMachines.find(item => item.id === machineId);
    this.activeRentModal = this.normalizeMachine(found);
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  closeRentModal() {
    this.activeRentModal = null;
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  handleRentalSubmit(e, machineId) {
    e.preventDefault();
    const rawMachines = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MACHINERY_DATA) || [];
    const found = rawMachines.find(item => item.id === machineId);
    const m = this.normalizeMachine(found) || { name: 'Farm Equipment', provider: 'Agro CHS', pricePerHour: 250, pricePerDay: 1500 };
    const form = e.target;
    const durationType = form.durationType ? form.durationType.value : 'day';
    const qty = parseInt(form.durationQty ? form.durationQty.value : 1) || 1;
    const date = form.rentalDate ? form.rentalDate.value : new Date().toISOString().split('T')[0];

    const rate = durationType === 'hour' ? (m.pricePerHour || 250) : (m.pricePerDay || 1500);
    const totalCost = qty * rate;
    const durationLabel = durationType === 'hour' ? `${qty} Hours` : `${qty} Days`;

    const newRental = {
      id: "RNT-" + Math.floor(1000 + Math.random() * 9000),
      machineName: m.name,
      provider: m.provider,
      date: date + " (8:00 AM)",
      duration: durationLabel,
      totalCost: totalCost,
      status: "Confirmed",
      location: (form.farmLocation && form.farmLocation.value) || "Farm Location"
    };

    this.rentals.unshift(newRental);
    this.activeRentModal = null;
    this.activeTab = "myRentals";
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
    window.UzhavanApp.showToast(`Machinery booked successfully! Rental ID: ${newRental.id} 🚜`, "success");
  },

  cancelRental(rentalId) {
    const r = this.rentals.find(item => item.id === rentalId);
    if (r) {
      r.status = "Cancelled";
      window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
      window.UzhavanApp.showToast(`Rental ${rentalId} cancelled.`, "info");
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  setTypeFilter(type) {
    this.filterType = type;
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  setFilter(key, val) {
    this[key] = val;
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  },

  resetFilters() {
    this.filterType = "All";
    this.filterDistance = "All";
    this.filterPrice = "All";
    this.filterAvailability = "All";
    window.MachineryRentalComponent.render(document.getElementById('viewContainer'));
  }
};

window.MachineryRentalComponent = MachineryRentalComponent;
