// Uzhavan Hub - Main Dashboard Component
// Personalized Farmer Dashboard with Multi-Plot Switcher, Acreage Unit Conversions, Active Plot Management & Farm Services

const DashboardComponent = {
  showAddPlotModal: false,
  showEditPlotModal: false,
  editingPlotId: null,
  selectedUnit: 'acres', // 'acres', 'hectares', 'cents'

  render(container) {
    const isTa = window.UzhavanApp && window.UzhavanApp.currentLang === 'ta';
    const auth = window.UzhavanAuth;
    const user = auth ? auth.user : null;
    const prof = user ? user.profile : (window.UzhavanApp.userProfile || {});
    const plots = (user && user.plots) ? user.plots : [];
    const activePlot = auth ? auth.getActivePlot() : (plots[0] || null);

    const weather = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.WEATHER_MOCK) || {};
    const market = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MARKET_PRICES) || [];
    const workers = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.FARM_WORKERS_DATA) || [];
    const machines = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MACHINERY_DATA) || [];
    const facilities = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.VETERINARY_FACILITIES_DATA) || [];

    // Analyze based on active plot or profile
    const plotLocation = activePlot ? `${activePlot.district || prof.district || 'Madurai'}, Tamil Nadu` : `${prof.district || 'Madurai'}, Tamil Nadu`;
    const plotAcreage = activePlot ? activePlot.area_acres : 3.0;
    const plotSoil = activePlot ? activePlot.soil_type : "Red Soil";
    const plotWater = activePlot ? activePlot.irrigation_source : "Borewell";
    const plotBudget = activePlot ? activePlot.farming_budget : 50000;

    const topAnalysis = window.UzhavanDecisionEngine.analyzeFarm({
      location: plotLocation,
      landArea: plotAcreage,
      soilType: plotSoil,
      waterSource: plotWater,
      budget: plotBudget
    });
    const primaryCrop = topAnalysis.primaryCrop;

    // Unit conversions for total acreage
    const totalAcres = user ? (user.total_acres || 0) : 5.5;
    const totalHectares = (totalAcres / 2.47105).toFixed(2);
    const totalCents = Math.round(totalAcres * 100);

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- TOP FARMER WELCOME STRIP & PLOT SELECTOR -->
        <div class="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-emerald-900/10">
                ${prof.profile_photo || '👨‍🌾'}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl sm:text-2xl font-black text-emerald-950">
                    ${isTa ? "வணக்கம், " + (prof.full_name || 'உழவர்') + " 👋" : "Welcome back, " + (prof.full_name || 'Farmer') + " 👋"}
                  </h1>
                  <span class="hidden sm:inline px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ${prof.farmer_type || 'Owner'}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>📍 <strong>${prof.district || 'Madurai'}, Tamil Nadu</strong></span>
                  <span>•</span>
                  <span>📱 ${prof.mobile_number || 'Registered'}</span>
                  <span>•</span>
                  <span>🌾 <strong>${plots.length} ${plots.length === 1 ? 'Plot' : 'Plots'}</strong></span>
                </p>
              </div>
            </div>

            <!-- Plot Switcher Dropdown & Actions -->
            <div class="flex items-center gap-2 self-start md:self-auto flex-wrap">
              ${plots.length > 0 ? `
                <div class="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs">
                  <span class="text-sm">🌾</span>
                  <span class="font-bold text-emerald-900 hidden sm:inline">Active Plot:</span>
                  <select onchange="if(this.value === 'ADD_NEW') { DashboardComponent.openAddPlotModal(); } else { window.UzhavanAuth.setActivePlot(this.value); DashboardComponent.render(document.getElementById('viewContainer')); }"
                          class="bg-transparent font-black text-emerald-950 focus:outline-none cursor-pointer pr-1">
                    ${plots.map(p => `
                      <option value="${p.id}" ${activePlot && activePlot.id === p.id ? 'selected' : ''}>
                        ${p.plot_name} (${p.area} ${p.area_unit})
                      </option>
                    `).join('')}
                    <option value="ADD_NEW">➕ Add New Land Plot...</option>
                  </select>
                </div>
              ` : `
                <button onclick="DashboardComponent.openAddPlotModal()" class="px-3.5 py-2 rounded-2xl bg-emerald-800 text-white font-bold text-xs shadow-xs hover:bg-emerald-900 transition-all flex items-center gap-1.5">
                  <span>➕</span> <span>Register Farmland</span>
                </button>
              `}

              <button onclick="DashboardComponent.openAddPlotModal()" class="px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-all flex items-center gap-1" title="Add Another Farmland Plot">
                <span>➕</span> <span class="hidden sm:inline">Add Plot</span>
              </button>

              <button onclick="window.UzhavanApp.navigate('profile')" class="px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-all flex items-center gap-1">
                <span>⚙️</span> <span class="hidden sm:inline">Profile</span>
              </button>

              <button onclick="window.UzhavanAuth.logout()" class="px-3 py-1.5 rounded-2xl bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold text-xs transition-all" title="Sign Out">
                Sign Out
              </button>
            </div>

          </div>

          <!-- ACREAGE SUMMARY WITH INSTANT UNIT CONVERSIONS -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            
            <div class="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Total Cultivated Area</span>
                <div class="text-xl font-black text-emerald-950 mt-0.5">
                  ${totalAcres} <span class="text-xs font-bold text-emerald-700">Acres</span>
                </div>
              </div>
              <span class="text-2xl">🚜</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Metric Conversion</span>
                <div class="text-base font-black text-slate-800 mt-0.5">
                  ${totalHectares} <span class="text-xs font-bold text-slate-500">Hectares (ha)</span>
                </div>
              </div>
              <span class="text-2xl">📐</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Traditional Unit</span>
                <div class="text-base font-black text-slate-800 mt-0.5">
                  ${totalCents} <span class="text-xs font-bold text-slate-500">Cents (சென்ட்)</span>
                </div>
              </div>
              <span class="text-2xl">🌱</span>
            </div>

          </div>
        </div>

        <!-- ACTIVE PLOT SPOTLIGHT CARD OR EMPTY STATE -->
        ${plots.length === 0 ? `
          <!-- EMPTY STATE CARD -->
          <div class="bg-amber-50 rounded-3xl p-8 border border-amber-200 text-center space-y-3">
            <span class="text-4xl block">🌾</span>
            <h2 class="text-lg font-black text-amber-950">No Agricultural Land Registered Yet</h2>
            <p class="text-xs sm:text-sm text-amber-800 max-w-lg mx-auto">
              Register your first plot to unlock personalized AI farming insights, soil calibration, and crop schedules tailored to your district.
            </p>
            <button onclick="DashboardComponent.openAddPlotModal()" 
                    class="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5">
              <span>➕</span> <span>Register Your First Farmland Plot</span>
            </button>
          </div>
        ` : (activePlot ? `
          <!-- ACTIVE PLOT DETAIL CARD -->
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-md space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-1 rounded-xl bg-emerald-800 text-white text-xs font-black">
                  ACTIVE PLOT
                </span>
                <h2 class="text-lg font-black text-slate-900">
                  ${activePlot.plot_name}
                </h2>
                <span class="text-xs text-slate-500">
                  (${activePlot.area} ${activePlot.area_unit} • ${activePlot.area_acres} Acres)
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="DashboardComponent.openEditPlotModal(${activePlot.id})" 
                        class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all">
                  <span>✏️</span> <span>Edit Plot</span>
                </button>
                <button onclick="DashboardComponent.confirmDeletePlot(${activePlot.id})" 
                        class="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1 transition-all">
                  <span>🗑️</span> <span>Delete Plot</span>
                </button>
              </div>
            </div>

            <!-- Plot Characteristics Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Soil Type</span>
                <strong class="text-emerald-950 font-bold block truncate">${activePlot.soil_type || 'Red Soil'}</strong>
                <span class="text-[10px] text-slate-500">pH: ${activePlot.soil_ph || 'Unknown'}</span>
              </div>

              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Irrigation Source</span>
                <strong class="text-emerald-950 font-bold block truncate">${activePlot.irrigation_source || 'Borewell'}</strong>
                <span class="text-[10px] text-slate-500">${activePlot.water_availability || 'Moderate'}</span>
              </div>

              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Current Crop</span>
                <strong class="text-emerald-950 font-bold block truncate">${activePlot.current_crop || 'Paddy'}</strong>
                <span class="text-[10px] text-slate-500">Sown: ${activePlot.planting_date || 'In season'}</span>
              </div>

              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Planned Crop</span>
                <strong class="text-emerald-950 font-bold block truncate">${activePlot.planned_crop || 'Groundnut TMV-7'}</strong>
                <span class="text-[10px] text-slate-500">Next cycle</span>
              </div>

              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Farming Budget</span>
                <strong class="text-emerald-950 font-bold block truncate">₹${Number(activePlot.farming_budget || 50000).toLocaleString('en-IN')}</strong>
                <span class="text-[10px] text-emerald-700 font-semibold">Allocated</span>
              </div>

              <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
                <span class="text-[10px] uppercase font-bold text-emerald-800 block">AI Match</span>
                <div class="text-base font-black text-emerald-950">${primaryCrop.suitabilityScore}%</div>
                <button onclick="window.UzhavanApp.navigate('decisionEngine')" class="text-[10px] font-bold text-emerald-700 hover:underline text-left">
                  Calibrate →
                </button>
              </div>
            </div>
          </div>
        ` : '')}

        <!-- HOW CAN UZHAVAN HUB HELP YOU TODAY? -->
        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white p-6 md:p-7 rounded-3xl shadow-lg border border-emerald-700/40 relative overflow-hidden">
          <div class="relative z-10 space-y-4">
            <div>
              <div class="inline-block px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-600/40">
                ${isTa ? "உடனடி உதவி & வழிகாட்டல்" : "Quick Action Hub"}
              </div>
              <h2 class="text-xl md:text-2xl font-bold tracking-tight">
                ${isTa ? "இன்று உழவன் ஹப் உங்களுக்கு எவ்வாறு உதவ முடியும்?" : "How can Uzhavan Hub help you today?"}
              </h2>
              <p class="text-xs md:text-sm text-emerald-100/90 max-w-xl">
                ${isTa ? "உங்கள் நிலத்திற்கான உடனடி AI தீர்வுகள் மற்றும் சேவைகளை ஒரே கிளிக்கில் பெறுங்கள்." : "Select an objective below to launch the personalized AI Farming Decision Engine or access farm services."}
              </p>
            </div>

            <!-- THREE LARGE ACTION BUTTONS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              <button onclick="window.UzhavanApp.openPlantWizard()" class="p-4 rounded-2xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-2xl">🌱</span>
                  <span class="text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">Start →</span>
                </div>
                <div class="text-base font-extrabold text-emerald-950">
                  ${isTa ? "நான் என்ன பயிரிட வேண்டும்?" : "What Should I Plant?"}
                </div>
                <div class="text-[11px] text-slate-700 font-medium mt-0.5">
                  ${isTa ? "5 எளிய கேள்விகள் • சிறந்த 3 பயிர்கள்" : "5-step wizard based on active plot soil & water"}
                </div>
              </button>

              <button onclick="window.UzhavanApp.navigate('profitPredictor')" class="p-4 rounded-2xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-2xl">💰</span>
                  <span class="text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">Compare →</span>
                </div>
                <div class="text-base font-extrabold text-emerald-950">
                  ${isTa ? "எந்த பயிர் அதிக லாபம் தரும்?" : "Which Crop Gives Better Profit?"}
                </div>
                <div class="text-[11px] text-slate-700 font-medium mt-0.5">
                  ${isTa ? "செலவு vs நிகர லாபம் ஒப்பீடு" : "Compare net revenue & ROI per acre"}
                </div>
              </button>

              <button onclick="window.UzhavanApp.navigate('cropRisk')" class="p-4 rounded-2xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-2xl">⚠️</span>
                  <span class="text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">Check →</span>
                </div>
                <div class="text-base font-extrabold text-emerald-950">
                  ${isTa ? "என் பயிருக்கு ஏதேனும் ஆபத்து உள்ளதா?" : "Is My Crop at Risk?"}
                </div>
                <div class="text-[11px] text-slate-700 font-medium mt-0.5">
                  ${isTa ? "மழை, பூச்சி மற்றும் நோய் முன்னெச்சரிக்கை" : "Weather hazard & disease prevention"}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- VISUALLY PROMINENT AI FARMING DECISION ENGINE BANNER -->
        <div class="ai-glow p-6 md:p-8 rounded-3xl border-2 border-emerald-400/40 relative shadow-xl">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-extrabold tracking-wider border border-emerald-500/30">
                <span class="text-emerald-400 text-sm">🤖</span>
                <span>AI FARMING DECISION ENGINE • SYNCED WITH ${activePlot ? activePlot.plot_name.toUpperCase() : 'FARM PLOT'}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">
                ${isTa ? "AI விவசாய முடிவெடுக்கும் எஞ்சின்" : "AI Farming Decision Engine"}
              </h2>
              <p class="text-sm md:text-base text-emerald-100/90 leading-relaxed">
                ${isTa 
                  ? "உங்கள் பண்ணை நிலம், மண் வகை, நீர் இருப்பு மற்றும் சந்தை போக்கை இணைத்து உங்களுக்கான தனிப்பயனாக்கப்பட்ட சாகுபடி பரிந்துரைகளைப் பெறுங்கள்." 
                  : "Calibrated to your active land plot (" + (activePlot ? activePlot.area_acres : 3) + " Acres, " + plotSoil + "). Synthesizes soil chemistry, agro-weather projections, and mandi dynamics into tailored recommendations."
                }
              </p>
            </div>

            <div class="flex-shrink-0">
              <button onclick="window.UzhavanApp.navigate('decisionEngine')" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl hover:shadow-amber-400/40 transition-all flex items-center justify-center gap-3 tracking-wide">
                <span>⚡</span>
                <span>${isTa ? "என் பண்ணையை பகுப்பாய்வு செய்" : "ANALYZE MY FARM"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3 FARM SERVICES PILLARS (WORKERS, MACHINERY, VET CARE) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>🛠️</span>
              <span>${isTa ? "பண்ணை சேவைகள் & கால்நடை பராமரிப்பு" : "Farm Services & Livestock Care"}</span>
            </h2>
            <button onclick="window.UzhavanApp.navigate('farmServices')" class="text-xs font-bold text-emerald-700 hover:underline">
              ${isTa ? "அனைத்து சேவைகளையும் காண்க →" : "View Services Hub →"}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- FARM LABOUR -->
            <div onclick="window.UzhavanApp.navigate('farmLabour')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-200">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  👨‍🌾
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ${workers.length} Available
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "விவசாய ஆட்கள் வாடகை" : "Farm Labour Booking"}
              </h3>
              <p class="text-lg font-black text-slate-900 mt-1">
                ${isTa ? "பண்ணை தொழிலாளர்கள்" : "Hire Farm Workers"}
                <span class="text-xs font-medium text-slate-700 block">Planting, Harvesting, Weeding</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Nearest:</span>
                <span class="font-bold text-emerald-700">2.4 km away (₹650/day)</span>
              </div>
            </div>

            <!-- MACHINERY RENTAL -->
            <div onclick="window.UzhavanApp.navigate('machineryRental')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-200">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  🚜
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ${machines.length} Machines
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "வேளாண் இயந்திர வாடகை" : "Machinery Rental"}
              </h3>
              <p class="text-lg font-black text-slate-900 mt-1">
                ${isTa ? "டிராக்டர் & உபகரணங்கள்" : "Rent Tractors & Harvesters"}
                <span class="text-xs font-medium text-slate-700 block">John Deere, Rotavator, Sprayer</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>From:</span>
                <span class="font-bold text-emerald-700">₹400/hr • ₹1,400/day</span>
              </div>
            </div>

            <!-- VETERINARY CARE -->
            <div onclick="window.UzhavanApp.navigate('veterinaryCare')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-white to-rose-50/20 border-rose-200">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl">
                  🐄
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  🚨 24/7 Helpline
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "கால்நடை மருத்துவம்" : "Veterinary Care"}
              </h3>
              <p class="text-lg font-black text-slate-900 mt-1">
                ${isTa ? "மருத்துவமனை & நலம்" : "Nearby Hospitals & Cattle Health"}
                <span class="text-xs font-medium text-slate-700 block">Govt Hospital (${prof.district || 'Madurai'}) • 1962</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Emergency:</span>
                <span class="font-bold text-rose-700">Dial 1962 / Mobile Ambulance</span>
              </div>
            </div>

          </div>
        </div>

        <!-- DISTRICT-SPECIFIC WEATHER & MANDI SPOT PRICES ROW -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- District Weather Card -->
          <div onclick="window.UzhavanApp.navigate('weather')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-0.5 bg-white border border-slate-200">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🌦️</span>
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Weather Forecast</h3>
                  <p class="text-sm font-black text-slate-900">${prof.district || 'Madurai'} District</p>
                </div>
              </div>
              <span class="text-xl font-black text-emerald-950">32°C</span>
            </div>
            <div class="p-3 bg-sky-50 rounded-xl text-xs text-sky-900 space-y-1">
              <div class="flex justify-between font-bold">
                <span>Light Rain Probability:</span>
                <span>35% (Tomorrow)</span>
              </div>
              <p class="text-[11px] text-slate-600">Slight shower expected. Suitable for fertilizer application after rain stops.</p>
            </div>
          </div>

          <!-- District Mandi Spot Card -->
          <div onclick="window.UzhavanApp.navigate('marketPrice')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-0.5 bg-white border border-slate-200">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📈</span>
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Mandi Spot Price</h3>
                  <p class="text-sm font-black text-slate-900">${prof.district || 'Madurai'} Market Regulated Yard</p>
                </div>
              </div>
              <span class="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">BULLISH</span>
            </div>
            <div class="p-3 bg-emerald-50/60 rounded-xl text-xs text-emerald-900 space-y-1">
              <div class="flex justify-between font-bold">
                <span>Groundnut / Paddy:</span>
                <span>₹6,850 / Qtl (▲ +4.2%)</span>
              </div>
              <p class="text-[11px] text-slate-600">AI Advice: <strong>Hold stock for 5 days</strong>. Festival demand likely to push prices higher.</p>
            </div>
          </div>

        </div>

      </div>

      <!-- ADD / EDIT PLOT MODAL -->
      ${this.renderPlotModal(isTa, activePlot)}
    `;
  },

  renderPlotModal(isTa, activePlot) {
    if (!this.showAddPlotModal && !this.showEditPlotModal) return '';

    const isEdit = this.showEditPlotModal;
    const auth = window.UzhavanAuth;
    const user = auth ? auth.user : null;
    let plotToEdit = null;
    if (isEdit && user && user.plots) {
      plotToEdit = user.plots.find(p => p.id === this.editingPlotId) || activePlot;
    }

    const defaultDistrict = user?.profile?.district || 'Madurai';
    const soilTypes = ["Red Soil", "Black Soil", "Alluvial Soil", "Clay Soil", "Sandy Loam", "I don't know"];
    const irrigationSources = ["Borewell", "Canal", "Rainfall", "Pond / Tank", "Open Well", "Other"];

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-emerald-100">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-black text-emerald-950 flex items-center gap-2">
              <span>🌾</span> <span>${isEdit ? "Edit Farmland Plot" : "Register New Farmland Plot"}</span>
            </h3>
            <button onclick="DashboardComponent.closePlotModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
          </div>

          <form onsubmit="DashboardComponent.handlePlotSubmit(event, ${isEdit})" class="space-y-3.5 text-xs">
            
            <div>
              <label class="block font-bold text-slate-700 mb-1">Plot Name *</label>
              <input type="text" id="modal_plot_name" required value="${plotToEdit ? plotToEdit.plot_name : ''}" placeholder="e.g. South Canal Field"
                     class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Land Area *</label>
                <input type="number" step="0.1" min="0.1" id="modal_plot_area" required value="${plotToEdit ? plotToEdit.area : '2.0'}"
                       class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Measurement Unit *</label>
                <select id="modal_plot_unit" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="acres" ${plotToEdit && plotToEdit.area_unit === 'acres' ? 'selected' : ''}>Acres (ஏக்கர்)</option>
                  <option value="hectares" ${plotToEdit && plotToEdit.area_unit === 'hectares' ? 'selected' : ''}>Hectares (ஹெக்டேர்)</option>
                  <option value="cents" ${plotToEdit && plotToEdit.area_unit === 'cents' ? 'selected' : ''}>Cents (சென்ட்)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Soil Type</label>
                <select id="modal_plot_soil" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                  ${soilTypes.map(st => `<option value="${st}" ${plotToEdit && plotToEdit.soil_type === st ? 'selected' : ''}>${st}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Irrigation Source</label>
                <select id="modal_plot_irrigation" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                  ${irrigationSources.map(is => `<option value="${is}" ${plotToEdit && plotToEdit.irrigation_source === is ? 'selected' : ''}>${is}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Current Crop</label>
                <input type="text" id="modal_plot_current" value="${plotToEdit ? (plotToEdit.current_crop || '') : ''}" placeholder="e.g. Paddy"
                       class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Estimated Budget (₹)</label>
                <input type="number" step="5000" id="modal_plot_budget" value="${plotToEdit ? (plotToEdit.farming_budget || 50000) : 50000}"
                       class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" onclick="DashboardComponent.closePlotModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md">
                ${isEdit ? "Update Plot" : "Save Land Plot"}
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  },

  openAddPlotModal() {
    this.showAddPlotModal = true;
    this.showEditPlotModal = false;
    this.reRender();
  },

  openEditPlotModal(plotId) {
    this.editingPlotId = plotId;
    this.showEditPlotModal = true;
    this.showAddPlotModal = false;
    this.reRender();
  },

  closePlotModal() {
    this.showAddPlotModal = false;
    this.showEditPlotModal = false;
    this.editingPlotId = null;
    this.reRender();
  },

  async handlePlotSubmit(e, isEdit) {
    if (e && e.preventDefault) e.preventDefault();

    const name = document.getElementById('modal_plot_name').value;
    const area = parseFloat(document.getElementById('modal_plot_area').value || 1.0);
    const unit = document.getElementById('modal_plot_unit').value;
    const soil = document.getElementById('modal_plot_soil').value;
    const irrigation = document.getElementById('modal_plot_irrigation').value;
    const currentCrop = document.getElementById('modal_plot_current').value;
    const budget = parseFloat(document.getElementById('modal_plot_budget').value || 50000);

    const payload = {
      plot_name: name,
      area: area,
      area_unit: unit,
      soil_type: soil,
      irrigation_source: irrigation,
      water_availability: 'Moderate',
      current_crop: currentCrop,
      farming_budget: budget
    };

    if (isEdit && this.editingPlotId) {
      await window.UzhavanAuth.updatePlot(this.editingPlotId, payload);
      window.UzhavanApp.showToast("Land plot updated successfully! 🌾", "success");
    } else {
      const res = await window.UzhavanAuth.addPlot(payload);
      if (res.success && res.plot) {
        window.UzhavanAuth.setActivePlot(res.plot.id);
      }
      window.UzhavanApp.showToast("New land plot registered! 🌾", "success");
    }

    this.closePlotModal();
  },

  async confirmDeletePlot(plotId) {
    if (confirm("Are you sure you want to delete this farmland plot? This action cannot be undone.")) {
      await window.UzhavanAuth.deletePlot(plotId);
      window.UzhavanApp.showToast("Plot deleted successfully.", "info");
      this.reRender();
    }
  },

  reRender() {
    const container = document.getElementById('viewContainer');
    if (container) {
      this.render(container);
    }
  }
};

window.DashboardComponent = DashboardComponent;
