// Uzhavan Hub - Landing Page & Profile Components
// LittleAura-inspired polished agricultural UI with responsive navigation and clean cards

const LandingComponent = {
  render(container) {
    const isTa = window.UzhavanApp && window.UzhavanApp.currentLang === 'ta';
    const auth = window.UzhavanAuth;
    const isAuthed = auth && auth.isAuthenticated();
    const currentUser = auth ? auth.user : null;

    container.innerHTML = `
      <div class="min-h-screen bg-[#f8faf7] text-[#0f2d11] -mt-4 -mx-2 sm:-mx-4">
        
        <!-- TOP LANDING NAVBAR -->
        <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 sm:px-8 py-3.5 transition-all">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <!-- Logo & Tagline -->
            <div onclick="window.UzhavanApp.navigate('landing')" class="flex items-center gap-3 cursor-pointer group">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white shadow-md text-xl group-hover:scale-105 transition-transform">
                🌾
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="brand-title font-black text-xl tracking-tight text-emerald-950">Uzhavan Hub</span>
                  <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">AI</span>
                </div>
                <span class="text-[10px] font-semibold text-slate-500 block -mt-0.5">Your Digital Farming Companion</span>
              </div>
            </div>

            <!-- Desktop Nav Links -->
            <div class="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
              <button onclick="window.UzhavanApp.navigate('landing')" class="hover:text-emerald-800 transition-colors">Home</button>
              <button onclick="window.UzhavanApp.navigate('decisionEngine')" class="hover:text-emerald-800 transition-colors">AI Farming</button>
              <button onclick="window.UzhavanApp.navigate('plantWizard')" class="hover:text-emerald-800 transition-colors">Crop Recommendation</button>
              <button onclick="window.UzhavanApp.navigate('weather')" class="hover:text-emerald-800 transition-colors">Weather</button>
              <button onclick="window.UzhavanApp.navigate('marketPrice')" class="hover:text-emerald-800 transition-colors">Market Prices</button>
              <button onclick="window.UzhavanApp.navigate('farmServices')" class="hover:text-emerald-800 transition-colors">Agricultural Services</button>
            </div>

            <!-- Right CTA Buttons -->
            <div class="flex items-center gap-3">
              <!-- Language Selector -->
              <div class="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-xl text-xs font-semibold">
                <span>🌐</span>
                <select onchange="window.UzhavanApp.setLanguage(this.value)" class="bg-transparent focus:outline-none cursor-pointer">
                  <option value="en" ${!isTa ? 'selected' : ''}>EN</option>
                  <option value="ta" ${isTa ? 'selected' : ''}>தமிழ்</option>
                </select>
              </div>

              ${isAuthed && currentUser ? `
                <button onclick="window.UzhavanApp.navigate('dashboard')" class="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-all flex items-center gap-1.5">
                  <span>👨‍🌾</span> <span>Dashboard (${currentUser.profile?.full_name?.split(' ')[0] || 'Farmer'})</span>
                </button>
                <button onclick="window.UzhavanAuth.logout()" class="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all">
                  Sign Out
                </button>
              ` : `
                <button onclick="window.UzhavanApp.navigate('login')" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all">
                  ${isTa ? "உள்நுழைக" : "Sign In"}
                </button>
                <button onclick="window.UzhavanApp.navigate('registration')" class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all">
                  ${isTa ? "தொடங்குங்கள்" : "Get Started"}
                </button>
              `}
            </div>

          </div>
        </nav>

        <!-- HERO SECTION -->
        <section class="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Hero Content -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold tracking-wide border border-emerald-200/60 shadow-xs">
                <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>${isTa ? "ஸ்மார்ட் டிஜிட்டல் வேளாண்மை சுற்றுச்சூழல்" : "Smart Agricultural Intelligence Platform"}</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.15]">
                ${isTa ? "ஸ்மார்ட் விவசாயம். சிறந்த முடிவுகள். அதிக விளைச்சல்." : "Smart Farming. Better Decisions. Higher Yields."}
              </h1>

              <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                ${isTa 
                  ? "உங்கள் பண்ணையை நிர்வகிக்கவும், நிலத்தின் தன்மையை அறியவும், வேளாண்மை சேவைகளை பெறவும், துல்லியமான விவசாய முடிவுகளை எடுக்கவும் உருவாக்கப்பட்ட ஒரு முழுமையான அறிவார்ந்த தளம்." 
                  : "One intelligent platform to manage your farm, understand your land, access agricultural services, and make informed farming decisions."
                }
              </p>

              <!-- Call to Action Buttons -->
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button onclick="window.UzhavanApp.navigate('registration')" 
                        class="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white font-bold text-sm shadow-lg hover:shadow-emerald-900/25 transition-all flex items-center gap-2">
                  <span>🌾</span>
                  <span>${isTa ? "இலவசமாக தொடங்குங்கள்" : "Get Started Free"}</span>
                  <span>→</span>
                </button>

                <button onclick="window.UzhavanApp.navigate('farmServices')" 
                        class="px-7 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-sm shadow-xs transition-all flex items-center gap-2">
                  <span>🛠️</span>
                  <span>${isTa ? "வேளாண் சேவைகளை ஆராய்க" : "Explore Farming Services"}</span>
                </button>
              </div>

              <!-- Value Statistics Row -->
              <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/70 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div class="text-xl sm:text-2xl font-black text-emerald-950">15+</div>
                  <div class="text-[11px] font-semibold text-slate-500">Tamil Nadu Districts</div>
                </div>
                <div>
                  <div class="text-xl sm:text-2xl font-black text-emerald-950">40,000+</div>
                  <div class="text-[11px] font-semibold text-slate-500">Acres Calibrated</div>
                </div>
                <div>
                  <div class="text-xl sm:text-2xl font-black text-emerald-950">4.9 ★</div>
                  <div class="text-[11px] font-semibold text-slate-500">Farmer Satisfaction</div>
                </div>
              </div>

            </div>

            <!-- Right Hero Visual Card -->
            <div class="lg:col-span-5">
              <div class="relative">
                <div class="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-green-300 rounded-3xl blur-xl opacity-20"></div>
                
                <div class="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-100 space-y-5">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
                        👨‍🌾
                      </div>
                      <div>
                        <h3 class="font-bold text-slate-900 text-sm">Vadipatti North Field</h3>
                        <p class="text-[11px] text-slate-500">Madurai District • 3.0 Acres • Red Soil</p>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      Active Plot
                    </span>
                  </div>

                  <!-- Mini Metric Badges -->
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span class="text-slate-500 text-[10px] uppercase font-bold block">Recommended Crop</span>
                      <strong class="text-emerald-900 text-sm font-black">Groundnut TMV-7</strong>
                      <span class="text-[10px] text-emerald-700 block font-semibold">94% Soil Compatibility</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span class="text-slate-500 text-[10px] uppercase font-bold block">Expected Net Profit</span>
                      <strong class="text-emerald-900 text-sm font-black">₹1,18,000</strong>
                      <span class="text-[10px] text-emerald-700 block font-semibold">ROI +134% in 110 Days</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span class="text-slate-500 text-[10px] uppercase font-bold block">Water & Rain Forecast</span>
                      <strong class="text-slate-800 text-xs font-bold">34 mm (Light Rain)</strong>
                      <span class="text-[10px] text-slate-500 block">Borewell 40 hrs balance</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span class="text-slate-500 text-[10px] uppercase font-bold block">Market Trend (Mandi)</span>
                      <strong class="text-emerald-800 text-xs font-bold">₹6,850 / Quintal</strong>
                      <span class="text-[10px] text-emerald-600 block">▲ 8.4% Bullish (Hold)</span>
                    </div>
                  </div>

                  <!-- Quick Action Button -->
                  <button onclick="window.UzhavanApp.navigate('decisionEngine')" 
                          class="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <span>🤖</span> <span>Launch Full AI Decision Engine →</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- SAMPLE DEMO FARMERS (1-CLICK QUICK ACCESS) -->
        <section class="max-w-7xl mx-auto px-4 sm:px-8 py-10 border-t border-emerald-100">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-1">
                ${isTa ? "உடனடி மாதிரி கணக்குகள்" : "Try Instantly Without Setup"}
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-emerald-950">
                ${isTa ? "முன்னமைக்கப்பட்ட உழவர் சுயவிவரங்கள் (1-Click Login)" : "Select a Sample Farmer Profile"}
              </h2>
            </div>
            <p class="text-xs text-slate-500">
              ${isTa ? "ஒரு கிளிக்கில் நேரடி அனுபவம் பெறுங்கள்" : "Click any farmer card to test with real database plots"}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Murugan Profile Card -->
            <div onclick="window.LoginComponent.fillAndLogin('murugan@uzhavan.hub', 'Farmer@123')"
                 class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                    👨‍🌾
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">Murugan P. (Madurai)</h4>
                    <p class="text-xs text-slate-500">Vadipatti & Sholavandan Blocks</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  2 Farmland Plots
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                <div><span class="text-[10px] text-slate-500 block">Cultivated Land</span><strong>5.5 Acres</strong></div>
                <div><span class="text-[10px] text-slate-500 block">Soil Types</span><strong>Red & Alluvial</strong></div>
                <div><span class="text-[10px] text-slate-500 block">Active Crop</span><strong>Groundnut & Rice</strong></div>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                <span>Sign in as Murugan →</span>
                <span class="text-[10px] font-normal text-slate-400">Password: Farmer@123</span>
              </div>
            </div>

            <!-- Anitha Profile Card -->
            <div onclick="window.LoginComponent.fillAndLogin('anitha@uzhavan.hub', 'Farmer@123')"
                 class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                    👩‍🌾
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">Anitha R. (Thanjavur)</h4>
                    <p class="text-xs text-slate-500">Kumbakonam Delta Basin</p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  1 Farmland Plot
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                <div><span class="text-[10px] text-slate-500 block">Cultivated Land</span><strong>4.0 Acres</strong></div>
                <div><span class="text-[10px] text-slate-500 block">Soil Type</span><strong>Clay Soil</strong></div>
                <div><span class="text-[10px] text-slate-500 block">Active Crop</span><strong>Samba Paddy</strong></div>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                <span>Sign in as Anitha →</span>
                <span class="text-[10px] font-normal text-slate-400">Password: Farmer@123</span>
              </div>
            </div>

          </div>
        </section>

        <!-- 4 CORE SERVICES PILLARS (Clean LittleAura-inspired Cards) -->
        <section class="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div class="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span class="text-xs font-black uppercase tracking-wider text-emerald-800">
              Integrated Capabilities
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-emerald-950">
              Everything Your Farm Needs in One Hub
            </h2>
            <p class="text-xs sm:text-sm text-slate-600">
              From soil-to-market intelligence to machinery rental and livestock health.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div class="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🤖
              </div>
              <h3 class="font-bold text-base text-slate-900">AI Decision Engine</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Connects your land plots with soil texture, weather patterns, and mandi trends to calculate ROI and optimal planting dates.
              </p>
              <button onclick="window.UzhavanApp.navigate('decisionEngine')" class="text-xs font-bold text-emerald-700 hover:underline inline-block pt-1">
                Explore Engine →
              </button>
            </div>

            <div class="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🌾
              </div>
              <h3 class="font-bold text-base text-slate-900">Multi-Plot Land Profile</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Register separate plots with soil pH, water sources, and sowing dates. Measure seamlessly across acres, hectares, or cents.
              </p>
              <button onclick="window.UzhavanApp.navigate('registration')" class="text-xs font-bold text-emerald-700 hover:underline inline-block pt-1">
                Register Farmland →
              </button>
            </div>

            <div class="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🚜
              </div>
              <h3 class="font-bold text-base text-slate-900">Workers & Machinery</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Book skilled agricultural labour teams for harvesting and weeding, and rent tractors and combine harvesters directly.
              </p>
              <button onclick="window.UzhavanApp.navigate('farmServices')" class="text-xs font-bold text-emerald-700 hover:underline inline-block pt-1">
                Book Services →
              </button>
            </div>

            <div class="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                📈
              </div>
              <h3 class="font-bold text-base text-slate-900">Mandi Price Spot Engine</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Daily regulated wholesale market prices across 15 Tamil Nadu districts with AI "Sell or Hold" price trajectory guidance.
              </p>
              <button onclick="window.UzhavanApp.navigate('marketPrice')" class="text-xs font-bold text-emerald-700 hover:underline inline-block pt-1">
                Check Prices →
              </button>
            </div>

          </div>
        </section>

        <!-- FOOTER -->
        <footer class="border-t border-slate-200 py-8 px-4 sm:px-8 bg-white text-center text-xs text-slate-500 space-y-2">
          <div class="flex items-center justify-center gap-2 font-bold text-slate-800">
            <span>🌾 Uzhavan Hub</span> • <span>உழவன் ஹப்</span>
          </div>
          <p>© 2026 Uzhavan Hub Digital Agriculture. Built for the farmers of Tamil Nadu & India.</p>
        </footer>

      </div>
    `;
  }
};

const ProfileComponent = {
  render(container) {
    const isTa = window.UzhavanApp && window.UzhavanApp.currentLang === 'ta';
    const auth = window.UzhavanAuth;
    const user = auth ? auth.user : null;
    const prof = user ? user.profile : (window.UzhavanApp.userProfile || {});

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-6 px-4 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-black text-emerald-950 flex items-center gap-2">
              <span>👤</span> <span>${isTa ? "உழவர் சுயவிவர மேலாண்மை" : "Farmer Profile & Account"}</span>
            </h1>
            <p class="text-xs text-slate-500 mt-1">Manage your personal information, mobile contact, and farm location</p>
          </div>
          <button onclick="window.UzhavanApp.navigate('dashboard')" class="text-xs font-bold text-emerald-700 hover:underline">
            ← Back to Dashboard
          </button>
        </div>

        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-6">
          <div class="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-3xl font-bold shadow-xs">
              ${prof.profile_photo || '👨‍🌾'}
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">${prof.full_name || 'Farmer'}</h2>
              <p class="text-xs text-slate-500">${user ? user.email : 'murugan@uzhavan.hub'}</p>
              <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ${prof.farmer_type || 'Owner'} • ${prof.farming_experience || 10} Years Experience
              </span>
            </div>
          </div>

          <form onsubmit="ProfileComponent.handleSave(event)" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" id="prof_name" value="${prof.full_name || ''}" required
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input type="tel" id="prof_mobile" value="${prof.mobile_number || ''}" required
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">District</label>
                <input type="text" id="prof_district" value="${prof.district || 'Madurai'}" required
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Village / Locality</label>
                <input type="text" id="prof_village" value="${prof.village || ''}"
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Farmer Type</label>
                <select id="prof_farmer_type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="Owner" ${prof.farmer_type === 'Owner' ? 'selected' : ''}>Owner</option>
                  <option value="Tenant" ${prof.farmer_type === 'Tenant' ? 'selected' : ''}>Tenant Farmer</option>
                  <option value="Both" ${prof.farmer_type === 'Both' ? 'selected' : ''}>Both (Owner & Tenant)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Farming Experience (Years)</label>
                <input type="number" id="prof_exp" value="${prof.farming_experience || 5}" min="0" max="60"
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button type="button" onclick="window.UzhavanAuth.logout()" class="text-xs text-red-600 hover:text-red-800 font-bold">
                Sign Out Account
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = document.getElementById('prof_name').value;
    const mobile = document.getElementById('prof_mobile').value;
    const district = document.getElementById('prof_district').value;
    const village = document.getElementById('prof_village').value;
    const farmerType = document.getElementById('prof_farmer_type').value;
    const exp = document.getElementById('prof_exp').value;

    if (window.UzhavanAuth && window.UzhavanAuth.user) {
      const prof = window.UzhavanAuth.user.profile || {};
      prof.full_name = name;
      prof.mobile_number = mobile;
      prof.district = district;
      prof.village = village;
      prof.farmer_type = farmerType;
      prof.farming_experience = parseInt(exp || 0);

      try {
        if (window.UzhavanAuth.token) {
          await fetch(`${window.UzhavanAuth.apiBase}/api/farmer/profile`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${window.UzhavanAuth.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(prof)
          });
        }
      } catch (err) {
        console.warn("Profile update offline fallback", err);
      }

      window.UzhavanAuth.setUser(window.UzhavanAuth.user);
      if (window.UzhavanApp) {
        window.UzhavanApp.showToast("Farmer profile updated successfully! 🌾", "success");
        window.UzhavanApp.navigate('dashboard');
      }
    }
  }
};

window.LandingComponent = LandingComponent;
window.ProfileComponent = ProfileComponent;
