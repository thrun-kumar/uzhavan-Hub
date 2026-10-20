// Uzhavan Hub - Main Dashboard Component (Updated with Farm Services & Veterinary Care)

const DashboardComponent = {
  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;
    const weather = window.UZHAVAN_DATA.WEATHER_MOCK;
    const market = window.UZHAVAN_DATA.MARKET_PRICES;
    const workers = window.UZHAVAN_DATA.FARM_WORKERS_DATA;
    const machines = window.UZHAVAN_DATA.MACHINERY_DATA;
    const facilities = window.UZHAVAN_DATA.VETERINARY_FACILITIES_DATA;

    // Quick initial analysis for top preview
    const topAnalysis = window.UzhavanDecisionEngine.analyzeFarm({
      location: profile.location,
      landArea: profile.landArea,
      soilType: profile.soilType,
      waterSource: profile.waterSource,
      budget: profile.budget
    });

    const primaryCrop = topAnalysis.primaryCrop;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header & Profile Strip -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-950">
                ${isTa ? "வணக்கம், " + (profile.nameTa || profile.name) + " 👋" : "Good Morning, " + profile.name + " 👋"}
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ${isTa ? "செயலில் உள்ள உழவர்" : "Active Farmer"}
              </span>
            </div>
            <p class="text-xs md:text-sm text-slate-700 mt-1 flex flex-wrap items-center gap-2">
              <span>📍 <strong class="text-emerald-900">${profile.location}</strong></span>
              <span>•</span>
              <span>📐 <strong class="text-emerald-900">${profile.landArea} Acres</strong></span>
              <span>•</span>
              <span>🌱 <strong class="text-emerald-900">${profile.currentCrop}</strong> (${profile.soilType})</span>
            </p>
          </div>

          <div class="flex items-center gap-2 self-start md:self-auto">
            <button onclick="window.UzhavanApp.openArchitectureModal()" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1.5" title="View 5-Pillar Architecture Diagram">
              <span>🧬</span>
              <span class="hidden sm:inline">${isTa ? "கட்டமைப்பு மாதிரி" : "System Architecture"}</span>
            </button>
            <button onclick="window.UzhavanApp.navigate('profile')" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5">
              <span>⚙️</span>
              <span>${isTa ? "சுயவிவரம் மாற்று" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        <!-- SECTION 18: HOW CAN UZHAVAN HUB HELP YOU TODAY? -->
        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white p-6 md:p-7 rounded-2xl shadow-lg border border-emerald-700/40 relative overflow-hidden">
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
              <button onclick="window.UzhavanApp.openPlantWizard()" class="p-4 rounded-xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-2xl">🌱</span>
                  <span class="text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">Start →</span>
                </div>
                <div class="text-base font-extrabold text-emerald-950">
                  ${isTa ? "நான் என்ன பயிரிட வேண்டும்?" : "What Should I Plant?"}
                </div>
                <div class="text-[11px] text-slate-700 font-medium mt-0.5">
                  ${isTa ? "5 எளிய கேள்விகள் • சிறந்த 3 பயிர்கள்" : "5-step wizard based on soil & water"}
                </div>
              </button>

              <button onclick="window.UzhavanApp.navigate('profitPredictor')" class="p-4 rounded-xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
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

              <button onclick="window.UzhavanApp.navigate('cropRisk')" class="p-4 rounded-xl bg-white/95 hover:bg-white text-emerald-950 font-bold text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all border border-emerald-100 group">
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

        <!-- SECTION 20: VISUALLY PROMINENT AI FARMING DECISION ENGINE CARD -->
        <div class="ai-glow p-6 md:p-8 rounded-2xl border-2 border-emerald-400/40 relative shadow-xl">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-extrabold tracking-wider border border-emerald-500/30">
                <span class="text-emerald-400 text-sm">🤖</span>
                <span>CORE INNOVATION • AI FARMING DECISION ENGINE</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">
                ${isTa ? "AI விவசாய முடிவெடுக்கும் எஞ்சின்" : "AI Farming Decision Engine"}
              </h2>
              <p class="text-sm md:text-base text-emerald-100/90 leading-relaxed">
                ${isTa 
                  ? "உங்கள் பண்ணை நிலம், மண் வகை, நீர் இருப்பு மற்றும் சந்தை போக்கை இணைத்து உங்களுக்கான தனிப்பயனாக்கப்பட்ட சாகுபடி பரிந்துரைகளைப் பெறுங்கள்." 
                  : "Tell us about your farm and get personalized farming guidance. Synthesizes soil chemistry, agro-weather projections, and mandi dynamics into tailored recommendations."
                }
              </p>
              <div class="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200">
                <span class="flex items-center gap-1">✓ ${isTa ? "மண் & நீர் பொருத்தம்" : "Soil & Water Match"}</span>
                <span class="flex items-center gap-1">✓ ${isTa ? "நிகர லாப கணிப்பு" : "Profit Prediction"}</span>
                <span class="flex items-center gap-1">✓ ${isTa ? "வாராந்திர செயல் திட்டம்" : "Weekly Action Plan"}</span>
              </div>
            </div>

            <div class="flex-shrink-0">
              <button onclick="window.UzhavanApp.navigate('decisionEngine')" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl hover:shadow-amber-400/40 transition-all flex items-center justify-center gap-3 tracking-wide">
                <span>⚡</span>
                <span>${isTa ? "என் பண்ணையை பகுப்பாய்வு செய்" : "ANALYZE MY FARM"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TODAY'S FARMING INSIGHT CARD -->
        <div class="bg-amber-50/80 border-l-4 border-amber-500 p-4 md:p-5 rounded-xl shadow-sm flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl flex-shrink-0">
            💡
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-amber-950 uppercase tracking-wide">
                ${isTa ? "இன்றைய விவசாய நுண்ணறிவு" : "Today's Farming Insight"}
              </h3>
              <span class="text-xs font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-full">
                ${isTa ? "செயல் ஆலோசனைகள்" : "Actionable Advice"}
              </span>
            </div>
            <p class="text-sm text-amber-900 mt-1 font-medium leading-relaxed">
              ${isTa 
                ? "நாளை கனமழை பெய்ய வாய்ப்புள்ளதால், இன்று பாசனம் செய்வதை குறைத்துக் கொள்ளவும். வயல் வடிகால் வாய்க்கால்களை உடனே சரிபார்க்கவும்." 
                : "Rain is expected tomorrow in " + profile.location + ". Consider reducing irrigation today and clearing drainage trenches to prevent waterlogging."
              }
            </p>
          </div>
        </div>

        <!-- NEW FARM SERVICES & LIVESTOCK HIGHLIGHT STRIP (SECTION 8 REQUIREMENT) -->
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
            
            <!-- NEW CARD 1: FARM LABOUR -->
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

            <!-- NEW CARD 2: MACHINERY RENTAL -->
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

            <!-- NEW CARD 3: VETERINARY CARE -->
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
                <span class="text-xs font-medium text-slate-700 block">Govt Hospital (3.5 km) • Dr. Sundar</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Emergency:</span>
                <span class="font-bold text-rose-700">Dial 1962 / Mobile Ambulance</span>
              </div>
            </div>

          </div>
        </div>

        <!-- AGRONOMIC & FARM DECISION MODULE CARDS GRID -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>🌱</span>
              <span>${isTa ? "பயிர் மேலாண்மை & நிதி வழிகாட்டல்" : "Agronomy, Finance & AI Decision Support"}</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Card: Recommended Crop / Crop Advisor -->
            <div onclick="window.UzhavanApp.navigate('decisionEngine')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  🌱
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ${primaryCrop.suitabilityScore}% Match
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "பரிந்துரைக்கப்பட்ட பயிர்" : "Crop Advisor"}
              </h3>
              <p class="text-xl font-black text-emerald-950 mt-1 flex items-center gap-2">
                <span>${isTa ? primaryCrop.nameTa : primaryCrop.name}</span>
                <span class="text-base">${primaryCrop.icon}</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>${isTa ? "மதிப்பிடப்பட்ட லாபம்:" : "Est. Profit:"}</span>
                <span class="font-bold text-emerald-700">₹${primaryCrop.estimatedProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- Card: Live Weather -->
            <div onclick="window.UzhavanApp.navigate('weather')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl">
                  🌦️
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  ⚠️ Rain Alert
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "வானிலை & மழை" : "Weather & Alerts"}
              </h3>
              <p class="text-xl font-black text-slate-900 mt-1">
                ${weather.current.temp}°C
                <span class="text-xs font-medium text-slate-700 block">${isTa ? weather.current.conditionTa : weather.current.condition}</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>${isTa ? "மழை வாய்ப்பு:" : "Rain Probability:"}</span>
                <span class="font-bold text-sky-700">${weather.current.rainProbability}%</span>
              </div>
            </div>

            <!-- Card: Mandi Market Prices -->
            <div onclick="window.UzhavanApp.navigate('marketPrice')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
                  💰
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                  ↑ Increasing
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "சந்தை விலை நிலவரம்" : "Market Prices"}
              </h3>
              <p class="text-xl font-black text-slate-900 mt-1">
                Tomato ₹32/kg
                <span class="text-xs font-bold text-emerald-600 block">+14.2% (7 Days)</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>AI Insight:</span>
                <span class="font-bold text-amber-700">Wait & Sell</span>
              </div>
            </div>

            <!-- Card: Crop Risk Warning -->
            <div onclick="window.UzhavanApp.navigate('cropRisk')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl">
                  ⚠️
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full badge-medium">
                  Medium Risk
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "பயிர் அபாய நிலை" : "Crop Risk Alert"}
              </h3>
              <p class="text-lg font-black text-slate-900 mt-1">
                ${isTa ? "கனமழை & வடிகால்" : "Heavy Rain & Runoff"}
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Action:</span>
                <span class="font-bold text-rose-700">${isTa ? "பாசனம் நிறுத்துக" : "Suspend Irrigation"}</span>
              </div>
            </div>

            <!-- Card: Fertilizer Guidance -->
            <div onclick="window.UzhavanApp.navigate('fertilizer')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl">
                  🧪
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  NPK Guide
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "உர வழிகாட்டல்" : "Fertilizer Guidance"}
              </h3>
              <p class="text-sm font-black text-slate-900 mt-1">
                Basal Nutrition Phase
                <span class="text-xs font-medium text-slate-700 block">DAP 45kg + MOP 25kg + Gypsum</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Bio Option:</span>
                <span class="font-bold text-purple-700">Trichoderma</span>
              </div>
            </div>

            <!-- Card: Crop Health / Disease Scanner -->
            <div onclick="window.UzhavanApp.navigate('cropHealth')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl">
                  🐛
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  AI Scanner
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "பயிர் நோய் & பூச்சி" : "Crop Health Scanner"}
              </h3>
              <p class="text-sm font-black text-slate-900 mt-1">
                Instant Leaf Diagnosis
                <span class="text-xs font-medium text-slate-700 block">Early Blight / Tikka Spot Detection</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Accuracy:</span>
                <span class="font-bold text-teal-700">94% Confidence</span>
              </div>
            </div>

            <!-- Card: Farming Action Plan -->
            <div onclick="window.UzhavanApp.navigate('actionPlan')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  📅
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Week 3 Active
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "விவசாய காலண்டர்" : "Farming Action Plan"}
              </h3>
              <p class="text-sm font-black text-slate-900 mt-1">
                ${profile.currentCrop} Cultivation
                <span class="text-xs font-medium text-slate-700 block">Basal Fertilizer Application Due</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Milestones:</span>
                <span class="font-bold text-emerald-800">9 Phased Tasks</span>
              </div>
            </div>

            <!-- Card: Government Schemes -->
            <div onclick="window.UzhavanApp.navigate('schemes')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  5 Active
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "அரசு நலத்திட்டங்கள்" : "Government Schemes"}
              </h3>
              <p class="text-sm font-black text-slate-900 mt-1">
                PM-KISAN & Solar Pump
                <span class="text-xs font-medium text-slate-700 block">Up to 70% Subsidy on Solar Pumps</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Status:</span>
                <span class="font-bold text-indigo-700">Open for Enrollment</span>
              </div>
            </div>

            <!-- Card: Agricultural Loans -->
            <div onclick="window.UzhavanApp.navigate('loans')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl">
                  🏦
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  4% Subvention
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "விவசாயக் கடன்கள்" : "Agricultural Loans"}
              </h3>
              <p class="text-sm font-black text-slate-900 mt-1">
                KCC Crop Credit
                <span class="text-xs font-medium text-slate-700 block">Up to ₹3 Lakhs at 4% Interest</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Channel:</span>
                <span class="font-bold text-blue-700">Local PACCS / Banks</span>
              </div>
            </div>

            <!-- Card: AI Voice Assistant -->
            <div onclick="window.UzhavanApp.navigate('voiceAssistant')" class="agri-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-white">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl shadow-md">
                  🎙️
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 animate-pulse">
                  Live Voice
                </span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
                ${isTa ? "உழவன் AI குரல் உதவி" : "Uzhavan Voice AI"}
              </h3>
              <p class="text-sm font-black text-emerald-950 mt-1">
                "Ask in Tamil or English"
                <span class="text-xs font-medium text-slate-700 block">Speech-to-Text & Speech Response</span>
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 flex justify-between">
                <span>Try:</span>
                <span class="font-bold text-emerald-800">"மழை வருமா?"</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }
};

window.DashboardComponent = DashboardComponent;
