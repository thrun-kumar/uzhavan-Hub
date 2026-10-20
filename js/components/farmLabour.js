// Uzhavan Hub - Farm Labour Rental / Farm Worker Booking Component

const FarmLabourComponent = {
  filterWorkType: "All",
  filterDistance: "All",
  filterWage: "All",
  filterAvailability: "All",
  activeModalWorker: null,
  activeBookingModal: null,
  activeTab: "workers", // "workers" or "myBookings"
  bookings: [
    {
      id: "BK-1082",
      workerName: "Ravi Kumar",
      workType: "Harvesting",
      date: "Tomorrow, 7:00 AM",
      workersCount: 2,
      totalCost: 1400,
      status: "Confirmed",
      location: "Madurai Farm"
    }
  ],

  normalizeWorker(w) {
    if (!w) return null;
    const name = w.name || w.workerName || "Agricultural Labourer";
    const nameTa = w.nameTa || name;
    const avatar = w.avatar || (w.gender === 'female' ? "👩‍🌾" : "👨‍🌾");
    const location = (w.location && typeof w.location === 'string') ? w.location : (w.district ? `${w.district} Rural, Tamil Nadu` : "Tamil Nadu Farm");
    const distanceKm = (w.distanceKm !== undefined && w.distanceKm !== null && !isNaN(w.distanceKm)) ? parseFloat(w.distanceKm) : 3.5;
    const specialization = w.specialization || w.primaryWork || w.category || w.workType || "General farm work";
    const primaryWork = w.primaryWork || specialization;
    const primaryWorkTa = w.primaryWorkTa || specialization;

    let experienceYears = 5;
    if (w.experienceYears !== undefined && !isNaN(w.experienceYears)) {
      experienceYears = parseInt(w.experienceYears);
    } else if (typeof w.experience === 'string') {
      const match = w.experience.match(/\d+/);
      if (match) experienceYears = parseInt(match[0]);
    } else if (typeof w.experience === 'number') {
      experienceYears = w.experience;
    }

    let dailyWage = 650;
    if (w.dailyWage !== undefined && !isNaN(w.dailyWage)) {
      dailyWage = parseInt(w.dailyWage);
    } else if (w.rate !== undefined && !isNaN(w.rate)) {
      dailyWage = parseInt(w.rate);
    }

    const rating = (w.rating !== undefined && !isNaN(w.rating)) ? parseFloat(w.rating) : 4.6;
    const reviewsCount = (w.reviewsCount !== undefined && !isNaN(w.reviewsCount)) ? parseInt(w.reviewsCount) : (w.completedJobs || 20);
    const verified = Boolean(w.verified);

    let workTypes = [];
    if (Array.isArray(w.allWorkTypes) && w.allWorkTypes.length > 0) {
      workTypes = w.allWorkTypes;
    } else if (Array.isArray(w.workTypes) && w.workTypes.length > 0) {
      workTypes = w.workTypes;
    } else if (typeof w.workType === 'string') {
      workTypes = [w.workType, "General farm work"];
    } else {
      workTypes = [specialization, "General farm work"];
    }

    const availableStatus = w.availableStatus || (w.availability === "Available Tomorrow" ? "busy" : "available");
    const availability = w.availability || (availableStatus === "available" ? "Available Today" : "Available Tomorrow");
    const availabilityTa = w.availabilityTa || (availableStatus === "available" ? "இன்றே கிடைக்கும்" : "நாளை கிடைக்கும்");
    const contact = w.contact || w.phone || "+91 94431 10000";

    return {
      id: w.id || `worker-${Math.random().toString(36).substr(2, 6)}`,
      name,
      nameTa,
      avatar,
      location,
      district: w.district || "Tamil Nadu",
      distanceKm,
      specialization,
      primaryWork,
      primaryWorkTa,
      experienceYears,
      dailyWage,
      rateFormatted: `₹${dailyWage} / day`,
      rating,
      reviewsCount,
      verified,
      allWorkTypes: workTypes,
      workTypes,
      availability,
      availabilityTa,
      availableStatus,
      contact,
      phone: contact,
      dataStatus: w.dataStatus || "Demo Data – For Prototype Testing"
    };
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile || { location: 'Madurai' };
    const rawWorkers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FARM_WORKERS_DATA) || [];
    const workers = rawWorkers.map(w => this.normalizeWorker(w)).filter(Boolean);

    // Filter workers defensively
    const filteredWorkers = workers.filter(w => {
      if (this.filterWorkType !== "All" && !(w.allWorkTypes || []).includes(this.filterWorkType)) return false;
      if (this.filterDistance === "5km" && w.distanceKm > 5) return false;
      if (this.filterDistance === "10km" && w.distanceKm > 10) return false;
      if (this.filterWage === "under650" && w.dailyWage >= 650) return false;
      if (this.filterWage === "650-750" && (w.dailyWage < 650 || w.dailyWage > 750)) return false;
      if (this.filterWage === "above750" && w.dailyWage <= 750) return false;
      if (this.filterAvailability === "today" && w.availableStatus !== "available") return false;
      return true;
    });

    const workTypes = [
      { id: "All", en: "All Work Types", ta: "அனைத்து வேலைகள்", icon: "🌾" },
      { id: "Planting", en: "Planting", ta: "விதைப்பு & நடவு", icon: "🌱" },
      { id: "Harvesting", en: "Harvesting", ta: "அறுவடை", icon: "🌾" },
      { id: "Weeding", en: "Weeding", ta: "களை எடுத்தல்", icon: "🧹" },
      { id: "Irrigation work", en: "Irrigation work", ta: "பாசன பணி", icon: "💧" },
      { id: "Fertilizer application", en: "Fertilizer application", ta: "உரமிடுதல் & தெளிப்பு", icon: "🧪" },
      { id: "Livestock care", en: "Livestock care", ta: "கால்நடை பராமரிப்பு", icon: "🐄" },
      { id: "General farm work", en: "General farm work", ta: "பொது பண்ணை வேலை", icon: "🚜" }
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>👨‍🌾</span> ${isTa ? "விவசாய ஆட்கள் வாடகை & முன்பதிவு" : "Agricultural Workforce Hub"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "பண்ணை ஆட்கள் தேடல் (Find Farm Workers)" : "Find & Book Skilled Farm Workers"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "உங்கள் பண்ணைக்கு அருகில் உள்ள அனுபவம் வாய்ந்த விவசாய தொழிலாளர்களை எளிதாக கண்டுபிடித்து முன்பதிவு செய்யுங்கள்." : "Connect with verified agricultural labourers near your farm for planting, harvesting, weeding, and irrigation."}
            </p>
          </div>

          <!-- Location Context Banner & My Bookings Toggle -->
          <div class="flex items-center gap-2 self-start md:self-auto">
            <div class="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span>📍</span>
              <span>${isTa ? "உங்கள் பண்ணை:" : "Your Farm:"} <strong>${profile.location}</strong></span>
            </div>
            <button onclick="window.FarmLabourComponent.switchTab('${this.activeTab === 'workers' ? 'myBookings' : 'workers'}')" class="px-4 py-2 rounded-xl ${this.activeTab === 'myBookings' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'} text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
              <span>📋</span>
              <span>${isTa ? "முன்பதிவு நிலை (" + this.bookings.length + ")" : "Bookings (" + this.bookings.length + ")"}</span>
            </button>
          </div>
        </div>

        ${this.activeTab === 'myBookings' ? this.renderBookingsView(isTa) : `
          <!-- FILTER CONTROLS BAR -->
          <div class="agri-card p-4 md:p-5 rounded-2xl space-y-4">
            
            <!-- Category Horizontal Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              ${workTypes.map(wt => `
                <button onclick="window.FarmLabourComponent.setWorkTypeFilter('${wt.id}')" 
                  class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${this.filterWorkType === wt.id ? 'bg-emerald-800 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                  <span>${wt.icon}</span>
                  <span>${isTa ? wt.ta : wt.en}</span>
                </button>
              `).join('')}
            </div>

            <!-- Multi-Filter Dropdowns -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <!-- Distance -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">📍 ${isTa ? "தூரம்:" : "Max Distance:"}</label>
                <select onchange="window.FarmLabourComponent.setFilter('filterDistance', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterDistance === 'All' ? 'selected' : ''}>${isTa ? "அனைத்து தூரமும்" : "Any Distance"}</option>
                  <option value="5km" ${this.filterDistance === '5km' ? 'selected' : ''}>${isTa ? "5 கி.மீ க்குள்" : "Within 5 km"}</option>
                  <option value="10km" ${this.filterDistance === '10km' ? 'selected' : ''}>${isTa ? "10 கி.மீ க்குள்" : "Within 10 km"}</option>
                </select>
              </div>

              <!-- Daily Wage -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">💰 ${isTa ? "தினசரி கூலி:" : "Daily Wage:"}</label>
                <select onchange="window.FarmLabourComponent.setFilter('filterWage', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterWage === 'All' ? 'selected' : ''}>${isTa ? "அனைத்து கூலி" : "All Wage Rates"}</option>
                  <option value="under650" ${this.filterWage === 'under650' ? 'selected' : ''}>Under ₹650 / day</option>
                  <option value="650-750" ${this.filterWage === '650-750' ? 'selected' : ''}>₹650 – ₹750 / day</option>
                  <option value="above750" ${this.filterWage === 'above750' ? 'selected' : ''}>Above ₹750 / day</option>
                </select>
              </div>

              <!-- Availability -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">🕒 ${isTa ? "கிடைக்கும் நிலை:" : "Availability:"}</label>
                <select onchange="window.FarmLabourComponent.setFilter('filterAvailability', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="All" ${this.filterAvailability === 'All' ? 'selected' : ''}>${isTa ? "அனைத்து நாட்கள்" : "Any Time"}</option>
                  <option value="today" ${this.filterAvailability === 'today' ? 'selected' : ''}>${isTa ? "இன்றே கிடைக்கும்" : "Available Today"}</option>
                </select>
              </div>

              <!-- Results Count & Reset -->
              <div class="flex items-end justify-between">
                <span class="text-xs text-slate-700 font-bold mb-2">
                  ${filteredWorkers.length} ${isTa ? "ஆட்கள் உள்ளனர்" : "Workers Available"}
                </span>
                <button onclick="window.FarmLabourComponent.resetFilters()" class="text-xs font-bold text-emerald-800 hover:underline mb-2">
                  ${isTa ? "வடிகட்டியை மீட்டமை" : "Reset Filters"}
                </button>
              </div>
            </div>
          </div>

          <!-- WORKER CARDS GRID AS PER SECTION 1 SPEC -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${filteredWorkers.map(w => `
              <div class="agri-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all bg-white shadow-sm hover:shadow-md">
                <div class="space-y-3">
                  <!-- Header: Photo, Name, Rating -->
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl shadow-inner">
                        ${w.avatar}
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <h3 class="font-extrabold text-slate-900 text-base leading-tight">${isTa ? w.nameTa : w.name}</h3>
                          ${w.verified ? `<span class="text-[10px] text-emerald-700" title="Verified Worker">✓</span>` : ''}
                        </div>
                        <span class="text-xs text-slate-700 flex items-center gap-1 mt-0.5 font-medium">
                          <span>📍</span> <strong>${w.distanceKm} km away</strong> (${(w.location || '').split(',')[0] || 'Local'})
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <span class="text-amber-500 text-xs">⭐</span>
                      <span class="text-xs font-black text-amber-900">${w.rating}</span>
                      <span class="text-[10px] text-slate-700">(${w.reviewsCount})</span>
                    </div>
                  </div>

                  <!-- Primary Work & Badge -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="text-slate-700 font-semibold">${isTa ? "முதன்மை பணி:" : "Work Specialization:"}</span>
                      <span class="font-extrabold text-emerald-900 px-2 py-0.5 rounded bg-emerald-100">${isTa ? w.primaryWorkTa : w.primaryWork}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-slate-700 font-semibold">${isTa ? "அனுபவம்:" : "Experience:"}</span>
                      <span class="font-bold text-slate-900">${w.experienceYears} Years</span>
                    </div>
                  </div>

                  <!-- Wage & Availability Bar -->
                  <div class="flex items-center justify-between pt-1">
                    <div>
                      <span class="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">Daily Wage</span>
                      <span class="text-xl font-black text-emerald-800">₹${w.dailyWage}</span>
                      <span class="text-[10px] text-slate-700">/ day (8 hrs)</span>
                    </div>

                    <div class="text-right">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${w.availableStatus === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        <span>${w.availableStatus === 'available' ? '🟢' : '🟡'}</span>
                        <span>${isTa ? w.availabilityTa : w.availability}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Two Buttons as specified: [ View Profile ] [ Book Worker ] -->
                <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button onclick="window.FarmLabourComponent.openProfileModal('${w.id}')" class="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all text-center">
                    ${isTa ? "சுயவிவரம்" : "View Profile"}
                  </button>
                  <button onclick="window.FarmLabourComponent.openBookingModal('${w.id}')" class="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md transition-all text-center flex items-center justify-center gap-1">
                    <span>📅</span>
                    <span>${isTa ? "முன்பதிவு செய்" : "Book Worker"}</span>
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        `}

        <!-- MODAL 1: WORKER PROFILE MODAL -->
        ${this.renderWorkerProfileModal(isTa)}

        <!-- MODAL 2: BOOKING FORM MODAL AS SPECIFIED -->
        ${this.renderBookingModal(isTa, profile)}

      </div>
    `;
  },

  renderBookingsView(isTa) {
    return `
      <div class="agri-card p-6 md:p-8 rounded-2xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-xl font-black text-slate-900">${isTa ? "உங்கள் ஆட்கள் முன்பதிவு நிலை" : "Your Farm Worker Bookings"}</h2>
            <p class="text-xs text-slate-700">${isTa ? "முன்பதிவு செய்யப்பட்ட தொழிலாளர்களின் நிலை மற்றும் விவரங்கள்." : "Track worker arrival status, scheduled dates, and estimated daily wage totals."}</p>
          </div>
          <button onclick="window.FarmLabourComponent.switchTab('workers')" class="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-md">
            + ${isTa ? "மேலும் ஆட்களை முன்பதிவு செய்" : "Book More Workers"}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/80 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Booking ID</th>
                <th class="py-3 px-4">Worker</th>
                <th class="py-3 px-4">Work Type</th>
                <th class="py-3 px-4">Date & Time</th>
                <th class="py-3 px-4">Workers</th>
                <th class="py-3 px-4">Est. Wage</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${this.bookings.map(b => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-slate-800">${b.id}</td>
                  <td class="py-3 px-4 font-extrabold text-slate-900">${b.workerName}</td>
                  <td class="py-3 px-4 font-semibold text-emerald-800">${b.workType}</td>
                  <td class="py-3 px-4 text-slate-700">${b.date}</td>
                  <td class="py-3 px-4 font-bold text-slate-900">${b.workersCount} Workers</td>
                  <td class="py-3 px-4 font-black text-slate-900">₹${b.totalCost}</td>
                  <td class="py-3 px-4">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : b.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' : b.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}">
                      ${b.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    ${b.status === 'Confirmed' ? `
                      <button onclick="window.FarmLabourComponent.cancelBooking('${b.id}')" class="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[10px]">
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

  renderWorkerProfileModal(isTa) {
    if (!this.activeModalWorker) return '';
    const w = this.activeModalWorker;

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-lg font-black text-slate-900">${isTa ? "தொழிலாளி சுயவிவரம்" : "Worker Full Profile"}</h3>
            <button onclick="window.FarmLabourComponent.closeProfileModal()" class="text-slate-700 hover:text-slate-900 text-lg font-bold">✕</button>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl shadow-inner">
              ${w.avatar}
            </div>
            <div>
              <h4 class="text-lg font-black text-slate-900">${isTa ? w.nameTa : w.name}</h4>
              <p class="text-xs text-slate-700">📍 ${w.distanceKm} km away • ${w.location}</p>
              <div class="flex items-center gap-1 mt-1 text-xs text-amber-600 font-bold">
                <span>⭐ ${w.rating} / 5.0</span>
                <span class="text-slate-700">(${w.reviewsCount} farm jobs completed)</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Daily Wage:</span>
              <strong class="text-slate-900 font-black">₹${w.dailyWage} / day (8 hours shift)</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Experience:</span>
              <strong class="text-slate-900 font-bold">${w.experienceYears} Years in Field Agriculture</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-700 font-medium">Contact:</span>
              <strong class="text-emerald-700 font-bold">${w.phone}</strong>
            </div>
          </div>

          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Specialized Skills</span>
            <div class="flex flex-wrap gap-1.5">
              ${w.skills.map(s => `<span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium">${s}</span>`).join('')}
            </div>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button onclick="window.FarmLabourComponent.closeProfileModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold">Close</button>
            <button onclick="window.FarmLabourComponent.closeProfileModal(); window.FarmLabourComponent.openBookingModal('${w.id}')" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md">Book Worker Now</button>
          </div>
        </div>
      </div>
    `;
  },

  renderBookingModal(isTa, profile) {
    if (!this.activeBookingModal) return '';
    const w = this.activeBookingModal;

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-emerald-200 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700">Worker Booking Form</span>
              <h3 class="text-lg font-black text-slate-900">Book ${w.name}</h3>
            </div>
            <button onclick="window.FarmLabourComponent.closeBookingModal()" class="text-slate-700 hover:text-slate-900 text-lg font-bold">✕</button>
          </div>

          <!-- BOOKING FORM FIELDS AS SPECIFIED IN SECTION 1 -->
          <form onsubmit="window.FarmLabourComponent.handleBookingSubmit(event, '${w.id}')" class="space-y-4 text-xs">
            
            <!-- Work Type -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Work Type *</label>
              <select name="workType" required class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                ${w.allWorkTypes.map(wt => `<option value="${wt}">${wt}</option>`).join('')}
              </select>
            </div>

            <!-- Farm Location -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Farm Location *</label>
              <input type="text" name="farmLocation" required value="${profile.location}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Required Workers -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Required Workers *</label>
                <input type="number" id="bookingWorkerCount" name="requiredWorkers" min="1" max="20" value="1" 
                  oninput="document.getElementById('bookingEstTotal').innerText = '₹' + (this.value * ${w.dailyWage}).toLocaleString('en-IN')"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
              </div>

              <!-- Date -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Work Date *</label>
                <input type="date" name="workDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Working Hours -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Working Hours *</label>
                <select name="workingHours" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="Full Day (8 AM - 4 PM)">Full Day (8 AM - 4 PM / 8 hrs)</option>
                  <option value="Half Day Morning (7 AM - 11 AM)">Half Day Morning (7 AM - 11 AM)</option>
                  <option value="Overtime (8 AM - 6 PM)">Overtime (8 AM - 6 PM)</option>
                </select>
              </div>

              <!-- Budget / Daily Rate -->
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Daily Wage Rate</label>
                <div class="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800">
                  ₹${w.dailyWage} / worker / day
                </div>
              </div>
            </div>

            <!-- Total Estimated Wage Box -->
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-900">Total Estimated Daily Wage:</span>
              <span id="bookingEstTotal" class="text-base font-black text-emerald-800">₹${w.dailyWage}</span>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onclick="window.FarmLabourComponent.closeBookingModal()" class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold shadow-md flex items-center gap-1.5">
                <span>✓</span>
                <span>Confirm & Book Worker</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  openProfileModal(workerId) {
    const rawWorkers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FARM_WORKERS_DATA) || [];
    const found = rawWorkers.find(item => item.id === workerId);
    this.activeModalWorker = this.normalizeWorker(found);
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  closeProfileModal() {
    this.activeModalWorker = null;
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  openBookingModal(workerId) {
    const rawWorkers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FARM_WORKERS_DATA) || [];
    const found = rawWorkers.find(item => item.id === workerId);
    this.activeBookingModal = this.normalizeWorker(found);
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  closeBookingModal() {
    this.activeBookingModal = null;
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  handleBookingSubmit(e, workerId) {
    e.preventDefault();
    const rawWorkers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FARM_WORKERS_DATA) || [];
    const found = rawWorkers.find(item => item.id === workerId);
    const w = this.normalizeWorker(found) || { name: 'Agricultural Worker', dailyWage: 650 };
    const form = e.target;
    const count = parseInt(form.requiredWorkers.value) || 1;
    const workType = form.workType ? form.workType.value : "General farm work";
    const date = form.workDate ? form.workDate.value : new Date().toISOString().split('T')[0];
    const totalCost = count * (w.dailyWage || 650);

    const newBooking = {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      workerName: w.name,
      workType: workType,
      date: date + " (8:00 AM)",
      workersCount: count,
      totalCost: totalCost,
      status: "Confirmed",
      location: (form.farmLocation && form.farmLocation.value) || "Farm Location"
    };

    this.bookings.unshift(newBooking);
    this.activeBookingModal = null;
    this.activeTab = "myBookings";
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
    window.UzhavanApp.showToast(`Worker booked successfully! Booking ID: ${newBooking.id} 👨‍🌾`, "success");
  },

  cancelBooking(bookingId) {
    const b = this.bookings.find(item => item.id === bookingId);
    if (b) {
      b.status = "Cancelled";
      window.FarmLabourComponent.render(document.getElementById('viewContainer'));
      window.UzhavanApp.showToast(`Booking ${bookingId} cancelled.`, "info");
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  setWorkTypeFilter(wt) {
    this.filterWorkType = wt;
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  setFilter(key, val) {
    this[key] = val;
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  },

  resetFilters() {
    this.filterWorkType = "All";
    this.filterDistance = "All";
    this.filterWage = "All";
    this.filterAvailability = "All";
    window.FarmLabourComponent.render(document.getElementById('viewContainer'));
  }
};

window.FarmLabourComponent = FarmLabourComponent;
