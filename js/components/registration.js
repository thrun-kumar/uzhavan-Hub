// Uzhavan Hub - Guided Farmer Registration Component (4 Steps)
// Multi-plot land registration, validation, PBKDF2 hashing via backend, and LittleAura-inspired UI

const RegistrationComponent = {
  currentStep: 1,
  hasLand: true,
  formData: {
    // Step 1
    full_name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    preferred_language: 'ta',
    state: 'Tamil Nadu',
    district: 'Madurai',
    village: '',
    // Step 2
    farmer_type: 'Owner',
    farming_experience: 5,
    primary_activity: 'Grain & Oilseed Cultivation',
    profile_photo: '👨‍🌾',
    // Step 3 (Plots array)
    plots: [
      {
        plot_name: 'Main Cultivation Plot',
        area: 2.5,
        area_unit: 'acres',
        ownership_status: 'owned',
        soil_type: 'Red Soil',
        soil_ph: 'Unknown',
        fertility_details: '',
        irrigation_source: 'Borewell',
        water_availability: 'Moderate',
        current_crop: 'Paddy',
        previous_crop: '',
        planned_crop: '',
        planting_date: '',
        farming_budget: 50000,
        soil_report_file: ''
      }
    ]
  },
  errors: {},
  isSubmitting: false,

  render(container) {
    const isTa = window.UzhavanApp && window.UzhavanApp.currentLang === 'ta';

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-8 px-4">
        
        <!-- Header & Breadcrumb -->
        <div class="text-center space-y-2 mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-200">
            <span>🌱</span> ${isTa ? "புதிய உழவர் பதிவு" : "New Farmer Account Registration"}
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-emerald-950">
            ${isTa ? "உழவன் ஹப்பில் இணையுங்கள்" : "Join Uzhavan Hub Ecosystem"}
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            ${isTa 
              ? "உங்கள் நிலத்தை பதிவு செய்து, AI விவசாய பரிந்துரைகள் மற்றும் சந்தை சேவைகளை இலவசமாக பெறுங்கள்." 
              : "Register your farm plots to unlock personalized AI crop advisory, weather alerts, labour & machinery booking."
            }
          </p>
        </div>

        <!-- 4-Step Progress Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-between relative max-w-xl mx-auto">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full -z-0"></div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-700 transition-all duration-300 -z-0" 
                 style="width: ${(this.currentStep - 1) * 33.33}%"></div>

            ${[
              { step: 1, title: isTa ? "தனிநபர்" : "Personal", icon: "👤" },
              { step: 2, title: isTa ? "விவரக்குறிப்பு" : "Profile", icon: "👨‍🌾" },
              { step: 3, title: isTa ? "நில விவரங்கள்" : "Farmland", icon: "🌾" },
              { step: 4, title: isTa ? "சரிபார்ப்பு" : "Review", icon: "✅" }
            ].map(s => `
              <div class="relative z-10 flex flex-col items-center">
                <button type="button" 
                        onclick="RegistrationComponent.goToStep(${s.step})"
                        class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all
                               ${this.currentStep === s.step 
                                 ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 scale-110' 
                                 : this.currentStep > s.step 
                                   ? 'bg-emerald-600 text-white' 
                                   : 'bg-white text-slate-400 border-2 border-slate-200'}">
                  ${this.currentStep > s.step ? '✓' : s.step}
                </button>
                <span class="text-[11px] font-bold mt-1.5 ${this.currentStep === s.step ? 'text-emerald-900' : 'text-slate-500'}">
                  ${s.title}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step Content Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 relative">
          
          <!-- Error Alert Banner -->
          <div id="regErrorBanner" class="${this.getErrorMessage() ? '' : 'hidden'} mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <span class="text-lg">⚠️</span>
            <div id="regErrorMessage" class="font-semibold">${this.getErrorMessage()}</div>
          </div>

          <!-- Wizard Body -->
          <div id="stepBody">
            ${this.renderStepContent(isTa)}
          </div>

          <!-- Wizard Bottom Controls -->
          <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            ${this.currentStep > 1 
              ? `<button type="button" onclick="RegistrationComponent.prevStep()" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5">
                   <span>←</span> <span>${isTa ? "முந்தைய படி" : "Previous"}</span>
                 </button>`
              : `<div><button type="button" onclick="window.UzhavanApp.navigate('login')" class="text-xs font-semibold text-emerald-700 hover:underline">
                   ${isTa ? "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்" : "Already have an account? Sign In"}
                 </button></div>`
            }

            ${this.currentStep < 4
              ? `<button type="button" onclick="RegistrationComponent.nextStep()" class="ml-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
                   <span>${isTa ? "அடுத்த படி" : "Continue"}</span> <span>→</span>
                 </button>`
              : `<button type="button" onclick="RegistrationComponent.submitRegistration()" ${this.isSubmitting ? 'disabled' : ''} class="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white font-bold text-sm shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center gap-2">
                   ${this.isSubmitting ? `<span>⏳</span> <span>${isTa ? "பதிவு செய்யப்படுகிறது..." : "Creating Account..."}</span>` : `<span>🌾</span> <span>${isTa ? "கணக்கை உறுதிசெய்க" : "Confirm & Register Farm"}</span>`}
                 </button>`
            }
          </div>

        </div>

      </div>
    `;
  },

  getErrorMessage() {
    return this.errors._general || '';
  },

  renderStepContent(isTa) {
    if (this.currentStep === 1) return this.renderStep1(isTa);
    if (this.currentStep === 2) return this.renderStep2(isTa);
    if (this.currentStep === 3) return this.renderStep3(isTa);
    if (this.currentStep === 4) return this.renderStep4(isTa);
    return '';
  },

  // -----------------------------------------------------------
  // STEP 1: Personal Details
  // -----------------------------------------------------------
  renderStep1(isTa) {
    const districts = [
      "Madurai", "Thanjavur", "Coimbatore", "Tiruchirappalli", "Salem", 
      "Dindigul", "Theni", "Virudhunagar", "Erode", "Tirunelveli", 
      "Cuddalore", "Villupuram", "Kallakurichi", "Nagapattinam", "Thiruvarur"
    ];

    return `
      <div class="space-y-5">
        <div class="border-b border-slate-100 pb-3">
          <h2 class="text-lg font-black text-emerald-950 flex items-center gap-2">
            <span>👤</span> <span>${isTa ? "படி 1: உங்கள் தனிநபர் விவரங்கள்" : "Step 1: Personal Details & Security"}</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">${isTa ? "அனைத்து முக்கிய தொடர்பு தகவல்களையும் நிரப்பவும்." : "Enter your contact and account login credentials."}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "முழு பெயர் *" : "Full Name *"}
            </label>
            <input type="text" id="reg_full_name" value="${this.formData.full_name}" 
                   oninput="RegistrationComponent.updateField('full_name', this.value)"
                   placeholder="e.g. Murugan Palanisamy"
                   class="w-full px-3.5 py-2.5 rounded-xl border ${this.errors.full_name ? 'border-red-400 bg-red-50/50' : 'border-slate-300'} text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            ${this.errors.full_name ? `<p class="text-[11px] text-red-600 mt-1 font-semibold">${this.errors.full_name}</p>` : ''}
          </div>

          <!-- Email Address -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "மின்னஞ்சல் முகவரி *" : "Email Address *"}
            </label>
            <input type="email" id="reg_email" value="${this.formData.email}" 
                   oninput="RegistrationComponent.updateField('email', this.value)"
                   placeholder="farmer@example.com"
                   class="w-full px-3.5 py-2.5 rounded-xl border ${this.errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-300'} text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            ${this.errors.email ? `<p class="text-[11px] text-red-600 mt-1 font-semibold">${this.errors.email}</p>` : ''}
          </div>

          <!-- Mobile Number -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "கைபேசி எண் (10 இலக்கம்) *" : "Mobile Number (10 Digits) *"}
            </label>
            <input type="tel" id="reg_mobile_number" value="${this.formData.mobile_number}" 
                   oninput="RegistrationComponent.updateField('mobile_number', this.value)"
                   placeholder="9876543210" maxlength="10"
                   class="w-full px-3.5 py-2.5 rounded-xl border ${this.errors.mobile_number ? 'border-red-400 bg-red-50/50' : 'border-slate-300'} text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            ${this.errors.mobile_number ? `<p class="text-[11px] text-red-600 mt-1 font-semibold">${this.errors.mobile_number}</p>` : ''}
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "கடவுச்சொல் (குறைந்தது 6 எழுத்துக்கள்) *" : "Password (Min 6 characters) *"}
            </label>
            <input type="password" id="reg_password" value="${this.formData.password}" 
                   oninput="RegistrationComponent.updateField('password', this.value)"
                   placeholder="••••••••"
                   class="w-full px-3.5 py-2.5 rounded-xl border ${this.errors.password ? 'border-red-400 bg-red-50/50' : 'border-slate-300'} text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            ${this.errors.password ? `<p class="text-[11px] text-red-600 mt-1 font-semibold">${this.errors.password}</p>` : ''}
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "கடவுச்சொல்லை உறுதிப்படுத்தவும் *" : "Confirm Password *"}
            </label>
            <input type="password" id="reg_confirm_password" value="${this.formData.confirm_password}" 
                   oninput="RegistrationComponent.updateField('confirm_password', this.value)"
                   placeholder="••••••••"
                   class="w-full px-3.5 py-2.5 rounded-xl border ${this.errors.confirm_password ? 'border-red-400 bg-red-50/50' : 'border-slate-300'} text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            ${this.errors.confirm_password ? `<p class="text-[11px] text-red-600 mt-1 font-semibold">${this.errors.confirm_password}</p>` : ''}
          </div>

          <!-- Preferred Language -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "விருப்பமான மொழி" : "Preferred Language"}
            </label>
            <select id="reg_preferred_language" 
                    onchange="RegistrationComponent.updateField('preferred_language', this.value)"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="ta" ${this.formData.preferred_language === 'ta' ? 'selected' : ''}>தமிழ் (Tamil)</option>
              <option value="en" ${this.formData.preferred_language === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>

          <!-- State -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "மாநிலம்" : "State"}
            </label>
            <input type="text" value="${this.formData.state}" readonly
                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 cursor-not-allowed" />
          </div>

          <!-- District -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "மாவட்டம் *" : "District *"}
            </label>
            <select id="reg_district" 
                    onchange="RegistrationComponent.updateField('district', this.value)"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
              ${districts.map(d => `<option value="${d}" ${this.formData.district === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>

          <!-- Village or Town -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "கிராமம் அல்லது ஊர்" : "Village or Town"}
            </label>
            <input type="text" id="reg_village" value="${this.formData.village}" 
                   oninput="RegistrationComponent.updateField('village', this.value)"
                   placeholder="e.g. Vadipatti"
                   class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        </div>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // STEP 2: Farmer Profile Details
  // -----------------------------------------------------------
  renderStep2(isTa) {
    const avatars = ['👨‍🌾', '👩‍🌾', '🌾', '🚜', '🌱', '☀️'];

    return `
      <div class="space-y-5">
        <div class="border-b border-slate-100 pb-3">
          <h2 class="text-lg font-black text-emerald-950 flex items-center gap-2">
            <span>👨‍🌾</span> <span>${isTa ? "படி 2: உழவர் சுயவிவரம்" : "Step 2: Farmer Profile"}</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">${isTa ? "உங்கள் விவசாய முறை மற்றும் அனுபவத்தை குறிப்பிடவும்." : "Specify your farming role, experience, and primary crops."}</p>
        </div>

        <div class="space-y-4">
          <!-- Farmer Type -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">
              ${isTa ? "உழவர் வகை (Farmer Type) *" : "Farmer Type *"}
            </label>
            <div class="grid grid-cols-3 gap-3">
              ${[
                { id: 'Owner', title: isTa ? 'நில உரிமையாளர்' : 'Owner', desc: isTa ? 'சொந்த நிலம்' : 'Owns land' },
                { id: 'Tenant', title: isTa ? 'குத்தகை உழவர்' : 'Tenant Farmer', desc: isTa ? 'குத்தகை' : 'Leased land' },
                { id: 'Both', title: isTa ? 'இரண்டும்' : 'Both', desc: isTa ? 'சொந்தம் + குத்தகை' : 'Owner & Tenant' }
              ].map(t => `
                <div onclick="RegistrationComponent.updateField('farmer_type', '${t.id}'); RegistrationComponent.reRender();"
                     class="p-3 rounded-2xl border cursor-pointer text-center transition-all
                            ${this.formData.farmer_type === t.id 
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs' 
                              : 'border-slate-200 hover:border-emerald-300 text-slate-700'}">
                  <div class="text-xs font-bold">${t.title}</div>
                  <div class="text-[10px] text-slate-500 mt-0.5">${t.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Farming Experience -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-bold text-slate-700">
                ${isTa ? "விவசாய அனுபவம் (ஆண்டுகள்)" : "Farming Experience (Years)"}
              </label>
              <span class="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ${this.formData.farming_experience} ${isTa ? "ஆண்டுகள்" : "Years"}
              </span>
            </div>
            <input type="range" min="0" max="50" step="1" value="${this.formData.farming_experience}" 
                   oninput="RegistrationComponent.updateField('farming_experience', this.value); document.getElementById('expBadge').innerText = this.value + ' Years';"
                   class="w-full accent-emerald-700 cursor-pointer" />
          </div>

          <!-- Primary Activity -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              ${isTa ? "முதன்மை விவசாய நடவடிக்கை" : "Primary Farming Activity"}
            </label>
            <select id="reg_primary_activity" 
                    onchange="RegistrationComponent.updateField('primary_activity', this.value)"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="Grain & Oilseed Cultivation" ${this.formData.primary_activity === 'Grain & Oilseed Cultivation' ? 'selected' : ''}>🌾 Paddy, Millets & Oilseeds</option>
              <option value="Horticulture & Vegetables" ${this.formData.primary_activity === 'Horticulture & Vegetables' ? 'selected' : ''}>🥦 Vegetables & Fruits</option>
              <option value="Cash Crops (Cotton, Sugarcane)" ${this.formData.primary_activity.includes('Cash') ? 'selected' : ''}>🌱 Cotton & Sugarcane</option>
              <option value="Spices & Plantation" ${this.formData.primary_activity.includes('Spices') ? 'selected' : ''}>🥥 Coconut, Turmeric & Spices</option>
              <option value="Mixed Farming with Dairy" ${this.formData.primary_activity.includes('Dairy') ? 'selected' : ''}>🐄 Mixed Crop + Livestock / Dairy</option>
            </select>
          </div>

          <!-- Choose Farmer Avatar -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">
              ${isTa ? "விவசாயி சின்னம் (Avatar)" : "Choose Profile Avatar"}
            </label>
            <div class="flex items-center gap-3">
              ${avatars.map(av => `
                <button type="button" onclick="RegistrationComponent.updateField('profile_photo', '${av}'); RegistrationComponent.reRender();"
                        class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all
                               ${this.formData.profile_photo === av ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 scale-110 shadow-sm' : 'bg-slate-100 hover:bg-slate-200'}">
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // STEP 3: Agricultural Land Details (Multi-Plot Support)
  // -----------------------------------------------------------
  renderStep3(isTa) {
    const districts = [
      "Madurai", "Thanjavur", "Coimbatore", "Tiruchirappalli", "Salem", 
      "Dindigul", "Theni", "Virudhunagar", "Erode", "Tirunelveli", 
      "Cuddalore", "Villupuram", "Kallakurichi", "Nagapattinam", "Thiruvarur"
    ];

    const soilTypes = ["Red Soil", "Black Soil", "Alluvial Soil", "Clay Soil", "Sandy Loam", "I don't know"];
    const irrigationSources = ["Borewell", "Canal", "Rainfall", "Pond / Tank", "Open Well", "Other"];

    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 class="text-lg font-black text-emerald-950 flex items-center gap-2">
              <span>🌾</span> <span>${isTa ? "படி 3: விவசாய நில விவரங்கள்" : "Step 3: Agricultural Land Details"}</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">${isTa ? "பல நிலங்களை நீங்கள் பதிவு செய்யலாம். மண்ணின் விவரங்கள் தெரியாவிட்டால் 'தெரியாது' என தேர்வு செய்யலாம்." : "Register multiple plots under your account. Soil technical details are optional."}</p>
          </div>

          <!-- Land ownership toggle -->
          <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button type="button" 
                    onclick="RegistrationComponent.setHasLand(true)"
                    class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${this.hasLand ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'}">
              ${isTa ? "நிலம் உள்ளது" : "I Have Farmland"}
            </button>
            <button type="button" 
                    onclick="RegistrationComponent.setHasLand(false)"
                    class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${!this.hasLand ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600'}">
              ${isTa ? "இப்போது நிலம் இல்லை" : "I Don't Own Land Yet"}
            </button>
          </div>
        </div>

        ${!this.hasLand ? `
          <div class="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
            <span class="text-4xl">🌾</span>
            <h3 class="text-sm font-black text-amber-950">
              ${isTa ? "நிலமில்லாத உழவர் / புதிய தொடக்க உழவர் முறை" : "Registered as Aspiring Farmer / Service Beneficiary"}
            </h3>
            <p class="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
              ${isTa 
                ? "கவலைப்பட வேண்டாம்! நில விவரங்கள் இல்லாமலும் உழவன் ஹப் சந்தை விலைகள், அரசு திட்டங்கள், மற்றும் விவசாய பணிகளை நீங்கள் அணுகலாம்." 
                : "No problem at all! You can still access Mandi market spot prices, agricultural government schemes, tractor rentals, and community discussions."
              }
            </p>
            <p class="text-[11px] text-slate-500">${isTa ? "பின்பு உங்கள் டாஷ்போர்டில் எந்த நேரத்திலும் நிலத்தை சேர்க்கலாம்." : "You can add farm plots anytime later from your Dashboard."}</p>
          </div>
        ` : `
          <!-- Plots Container -->
          <div class="space-y-5">
            ${this.formData.plots.map((plot, pIdx) => `
              <div class="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4 relative">
                
                <div class="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                      ${pIdx + 1}
                    </span>
                    <span class="text-xs font-bold text-emerald-950">
                      ${plot.plot_name || (isTa ? `நிலம் #${pIdx + 1}` : `Plot #${pIdx + 1}`)}
                    </span>
                  </div>

                  ${this.formData.plots.length > 1 ? `
                    <button type="button" onclick="RegistrationComponent.removePlot(${pIdx})"
                            class="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 hover:underline">
                      <span>🗑️</span> <span>${isTa ? "நீக்கு" : "Remove Plot"}</span>
                    </button>
                  ` : ''}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <!-- Plot Name -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "நிலத்தின் பெயர் *" : "Plot Name *"}
                    </label>
                    <input type="text" value="${plot.plot_name}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'plot_name', this.value)"
                           placeholder="e.g. North Field"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Area Value -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "மொத்த பரப்பளவு *" : "Total Land Area *"}
                    </label>
                    <input type="number" step="0.1" min="0.1" value="${plot.area}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'area', this.value)"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Area Unit -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "அளவு அலகு (Unit) *" : "Measurement Unit *"}
                    </label>
                    <select onchange="RegistrationComponent.updatePlotField(${pIdx}, 'area_unit', this.value)"
                            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="acres" ${plot.area_unit === 'acres' ? 'selected' : ''}>Acres (ஏக்கர்)</option>
                      <option value="hectares" ${plot.area_unit === 'hectares' ? 'selected' : ''}>Hectares (ஹெக்டேர்)</option>
                      <option value="cents" ${plot.area_unit === 'cents' ? 'selected' : ''}>Cents (சென்ட் - 100 cent = 1 ac)</option>
                    </select>
                  </div>

                  <!-- Ownership Status -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "உரிமை நிலை" : "Ownership Status"}
                    </label>
                    <select onchange="RegistrationComponent.updatePlotField(${pIdx}, 'ownership_status', this.value)"
                            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="owned" ${plot.ownership_status === 'owned' ? 'selected' : ''}>Owned (சொந்தம்)</option>
                      <option value="leased" ${plot.ownership_status === 'leased' ? 'selected' : ''}>Leased (குத்தகை)</option>
                      <option value="rented" ${plot.ownership_status === 'rented' ? 'selected' : ''}>Rented (வாடகை)</option>
                    </select>
                  </div>

                  <!-- Soil Type -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "மண் வகை" : "Soil Type"}
                    </label>
                    <select onchange="RegistrationComponent.updatePlotField(${pIdx}, 'soil_type', this.value)"
                            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                      ${soilTypes.map(st => `<option value="${st}" ${plot.soil_type === st ? 'selected' : ''}>${st}</option>`).join('')}
                    </select>
                  </div>

                  <!-- Soil pH -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "மண் pH (தெரியவில்லை என்றால் விட்டுவிடலாம்)" : "Soil pH (Optional)"}
                    </label>
                    <input type="text" value="${plot.soil_ph}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'soil_ph', this.value)"
                           placeholder="e.g. 6.8 or Unknown"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Irrigation Source -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "பாசன ஆதாரம்" : "Irrigation Source"}
                    </label>
                    <select onchange="RegistrationComponent.updatePlotField(${pIdx}, 'irrigation_source', this.value)"
                            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                      ${irrigationSources.map(is => `<option value="${is}" ${plot.irrigation_source === is ? 'selected' : ''}>${is}</option>`).join('')}
                    </select>
                  </div>

                  <!-- Water Availability -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "நீர் இருப்பு" : "Water Availability"}
                    </label>
                    <select onchange="RegistrationComponent.updatePlotField(${pIdx}, 'water_availability', this.value)"
                            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="Abundant / Year-round" ${plot.water_availability === 'Abundant / Year-round' ? 'selected' : ''}>Abundant / Year-round</option>
                      <option value="Moderate" ${plot.water_availability === 'Moderate' ? 'selected' : ''}>Moderate (சீசனுக்கு ஏற்ப)</option>
                      <option value="Seasonal / Deficit" ${plot.water_availability === 'Seasonal / Deficit' ? 'selected' : ''}>Seasonal / Deficit</option>
                    </select>
                  </div>

                  <!-- Farming Budget -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "விவசாய பட்ஜெட் (₹)" : "Estimated Budget (₹)"}
                    </label>
                    <input type="number" step="5000" value="${plot.farming_budget}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'farming_budget', this.value)"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Current Crop -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "தற்போதைய பயிர்" : "Current Crop"}
                    </label>
                    <input type="text" value="${plot.current_crop}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'current_crop', this.value)"
                           placeholder="e.g. Paddy, Groundnut, Cotton"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Previous Crop -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "முந்தைய பயிர்" : "Previous Crop"}
                    </label>
                    <input type="text" value="${plot.previous_crop}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'previous_crop', this.value)"
                           placeholder="e.g. Blackgram"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                  <!-- Planned Crop -->
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">
                      ${isTa ? "திட்டமிடும் பயிர்" : "Planned Crop"}
                    </label>
                    <input type="text" value="${plot.planned_crop}" 
                           oninput="RegistrationComponent.updatePlotField(${pIdx}, 'planned_crop', this.value)"
                           placeholder="e.g. TMV-7 Groundnut"
                           class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white" />
                  </div>

                </div>

              </div>
            `).join('')}

            <div class="flex items-center justify-between pt-2">
              <button type="button" onclick="RegistrationComponent.addAnotherPlot()" 
                      class="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all">
                <span>➕</span> <span>${isTa ? "மற்றொரு நிலத்தை சேர்க்க" : "Add Another Farmland Plot"}</span>
              </button>
              <span class="text-xs font-semibold text-slate-500">
                ${this.formData.plots.length} ${this.formData.plots.length === 1 ? 'Plot' : 'Plots'} configured
              </span>
            </div>
          </div>
        `}

      </div>
    `;
  },

  // -----------------------------------------------------------
  // STEP 4: Review and Submit
  // -----------------------------------------------------------
  renderStep4(isTa) {
    const totalAcres = this.hasLand 
      ? this.formData.plots.reduce((acc, p) => {
          const area = parseFloat(p.area || 0);
          const unit = (p.area_unit || 'acres').toLowerCase();
          if (unit.includes('hectare')) return acc + (area * 2.47105);
          if (unit.includes('cent')) return acc + (area * 0.01);
          return acc + area;
        }, 0).toFixed(2)
      : 0;

    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-3">
          <h2 class="text-lg font-black text-emerald-950 flex items-center gap-2">
            <span>✅</span> <span>${isTa ? "படி 4: உங்கள் விவரங்களை சரிபார்க்கவும்" : "Step 4: Review & Confirm Registration"}</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">${isTa ? "அனைத்து தகவல்களையும் ஒருமுறை சரிபார்த்து உறுதி செய்யவும். தேவைப்பட்டால் திருத்தலாம்." : "Review your details. You can click 'Edit' to adjust any section before submission."}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Summary Card: Personal & Account -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                <span>👤</span> <span>Personal Details</span>
              </h3>
              <button type="button" onclick="RegistrationComponent.goToStep(1)" class="text-xs text-emerald-700 font-bold hover:underline">Edit</button>
            </div>
            <div class="text-xs text-slate-700 space-y-1">
              <div><span class="text-slate-500">Name:</span> <strong class="text-slate-900">${this.formData.full_name}</strong></div>
              <div><span class="text-slate-500">Email:</span> <strong class="text-slate-900">${this.formData.email}</strong></div>
              <div><span class="text-slate-500">Mobile:</span> <strong class="text-slate-900">${this.formData.mobile_number}</strong></div>
              <div><span class="text-slate-500">Location:</span> <strong class="text-slate-900">${this.formData.village ? this.formData.village + ', ' : ''}${this.formData.district}, ${this.formData.state}</strong></div>
            </div>
          </div>

          <!-- Summary Card: Farmer Profile -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                <span>👨‍🌾</span> <span>Farmer Profile</span>
              </h3>
              <button type="button" onclick="RegistrationComponent.goToStep(2)" class="text-xs text-emerald-700 font-bold hover:underline">Edit</button>
            </div>
            <div class="text-xs text-slate-700 space-y-1">
              <div><span class="text-slate-500">Type:</span> <strong class="text-slate-900">${this.formData.farmer_type}</strong></div>
              <div><span class="text-slate-500">Experience:</span> <strong class="text-slate-900">${this.formData.farming_experience} Years</strong></div>
              <div><span class="text-slate-500">Activity:</span> <strong class="text-slate-900">${this.formData.primary_activity}</strong></div>
              <div><span class="text-slate-500">Avatar:</span> <span class="text-lg">${this.formData.profile_photo}</span></div>
            </div>
          </div>

          <!-- Summary Card: Farmland Plots -->
          <div class="md:col-span-2 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                <span>🌾</span> <span>Registered Plots (${this.hasLand ? this.formData.plots.length : 0}) • Total Area: ${totalAcres} Acres</span>
              </h3>
              <button type="button" onclick="RegistrationComponent.goToStep(3)" class="text-xs text-emerald-700 font-bold hover:underline">Edit</button>
            </div>

            ${!this.hasLand ? `
              <p class="text-xs text-slate-600 italic">No farmland registered at this stage. Plots can be added later anytime from the Dashboard.</p>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${this.formData.plots.map((p, idx) => `
                  <div class="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div class="font-bold text-emerald-950 flex justify-between">
                      <span>${idx + 1}. ${p.plot_name}</span>
                      <span class="text-emerald-700">${p.area} ${p.area_unit}</span>
                    </div>
                    <div class="text-slate-600 text-[11px]">
                      Soil: <strong>${p.soil_type}</strong> • Water: <strong>${p.water_availability}</strong> (${p.irrigation_source})
                    </div>
                    <div class="text-slate-600 text-[11px]">
                      Current Crop: <strong>${p.current_crop || 'None'}</strong> • Budget: <strong>₹${Number(p.farming_budget).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

        <div class="p-3 bg-emerald-100/50 rounded-xl text-center text-xs text-emerald-900 font-medium">
          🔒 Your personal details and land data are securely stored in our persistent database with PBKDF2 encryption.
        </div>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // Action Handlers & Validations
  // -----------------------------------------------------------
  updateField(field, value) {
    this.formData[field] = value;
    if (this.errors[field]) {
      delete this.errors[field];
    }
  },

  updatePlotField(idx, field, value) {
    if (this.formData.plots[idx]) {
      this.formData.plots[idx][field] = value;
    }
  },

  addAnotherPlot() {
    const nextNum = this.formData.plots.length + 1;
    this.formData.plots.push({
      plot_name: `Farmland Plot ${nextNum}`,
      area: 2.0,
      area_unit: 'acres',
      ownership_status: 'owned',
      soil_type: 'Red Soil',
      soil_ph: 'Unknown',
      fertility_details: '',
      irrigation_source: 'Borewell',
      water_availability: 'Moderate',
      current_crop: '',
      previous_crop: '',
      planned_crop: '',
      planting_date: '',
      farming_budget: 45000,
      soil_report_file: ''
    });
    this.reRender();
  },

  removePlot(idx) {
    if (this.formData.plots.length > 1) {
      this.formData.plots.splice(idx, 1);
      this.reRender();
    }
  },

  setHasLand(val) {
    this.hasLand = val;
    this.reRender();
  },

  goToStep(step) {
    if (step < this.currentStep || this.validateStep(this.currentStep)) {
      this.currentStep = step;
      this.reRender();
    }
  },

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep = Math.min(4, this.currentStep + 1);
      this.reRender();
    }
  },

  prevStep() {
    this.currentStep = Math.max(1, this.currentStep - 1);
    this.reRender();
  },

  validateStep(step) {
    this.errors = {};

    if (step === 1) {
      if (!this.formData.full_name.trim()) {
        this.errors.full_name = "Full name is required.";
      }
      if (!this.formData.email.trim() || !this.formData.email.includes('@') || !this.formData.email.includes('.')) {
        this.errors.email = "Please enter a valid email address.";
      }
      const cleanPhone = this.formData.mobile_number.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        this.errors.mobile_number = "Please enter a valid 10-digit mobile number.";
      }
      if (!this.formData.password || this.formData.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters long.";
      }
      if (this.formData.password !== this.formData.confirm_password) {
        this.errors.confirm_password = "Password and confirmation password do not match.";
      }
    }

    if (step === 3 && this.hasLand) {
      if (this.formData.plots.length === 0) {
        this.errors._general = "Please configure at least one plot or choose 'I Don't Own Land Yet'.";
      } else {
        for (let i = 0; i < this.formData.plots.length; i++) {
          const p = this.formData.plots[i];
          if (!p.plot_name.trim()) {
            this.errors._general = `Plot #${i + 1} requires a valid name.`;
            break;
          }
          if (isNaN(parseFloat(p.area)) || parseFloat(p.area) <= 0) {
            this.errors._general = `Plot #${i + 1} requires an area greater than 0.`;
            break;
          }
        }
      }
    }

    const hasErrors = Object.keys(this.errors).length > 0;
    if (hasErrors) {
      this.reRender();
      return false;
    }
    return true;
  },

  async submitRegistration() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.reRender();

    const payload = {
      full_name: this.formData.full_name.trim(),
      email: this.formData.email.trim().toLowerCase(),
      mobile_number: this.formData.mobile_number.trim(),
      password: this.formData.password,
      confirm_password: this.formData.confirm_password,
      preferred_language: this.formData.preferred_language,
      state: this.formData.state,
      district: this.formData.district,
      village: this.formData.village.trim(),
      farmer_type: this.formData.farmer_type,
      farming_experience: parseInt(this.formData.farming_experience || 0),
      primary_activity: this.formData.primary_activity,
      profile_photo: this.formData.profile_photo,
      plots: this.hasLand ? this.formData.plots : []
    };

    const res = await window.UzhavanAuth.register(payload);
    this.isSubmitting = false;

    if (res.success) {
      if (window.UzhavanApp) {
        window.UzhavanApp.showToast(`🌾 Welcome, ${payload.full_name}! Registration completed.`, 'success');
        window.UzhavanApp.navigate('dashboard');
      }
    } else {
      this.errors._general = res.error || "Registration failed. Please check your data.";
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

window.RegistrationComponent = RegistrationComponent;
