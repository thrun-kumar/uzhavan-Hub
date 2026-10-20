// Uzhavan Hub - "What Should I Plant?" Guided 5-Step Wizard

const PlantWizardComponent = {
  currentStep: 1,
  answers: {
    location: "Madurai District",
    soilType: "Red Soil",
    waterLevel: "Moderate (Well/Borewell)",
    budgetRange: "50000",
    season: "Kharif (Monsoon)"
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';

    container.innerHTML = `
      <div class="max-w-3xl mx-auto py-4 px-2 sm:px-4">
        
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            🌱 ${isTa ? "விரைவு வழிகாட்டி" : "Interactive Guided Wizard"}
          </div>
          <h1 class="text-3xl font-black text-emerald-950">
            ${isTa ? "நான் என்ன பயிரிட வேண்டும்?" : "What Should I Plant?"}
          </h1>
          <p class="text-xs md:text-sm text-slate-700 mt-1 max-w-lg mx-auto">
            ${isTa ? "5 எளிய கேள்விகளுக்கு விடையளித்து உங்கள் பண்ணைக்கு உகந்த முதல் 3 பயிர்களை உடனடியாக கண்டறியவும்." : "Answer 5 simple questions to get immediate AI-calculated top 3 crop recommendations with suitability scores."}
          </p>
        </div>

        <!-- Wizard Step Indicator -->
        <div class="flex items-center justify-between mb-8 max-w-xl mx-auto px-4">
          ${[1, 2, 3, 4, 5].map(stepNum => `
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${this.currentStep === stepNum ? 'bg-emerald-800 text-white ring-4 ring-emerald-200' : this.currentStep > stepNum ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">
                ${this.currentStep > stepNum ? '✓' : stepNum}
              </div>
              ${stepNum < 5 ? `<div class="w-8 sm:w-16 h-1 ${this.currentStep > stepNum ? 'bg-emerald-600' : 'bg-slate-200'}"></div>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Wizard Card Container -->
        <div class="agri-card p-6 md:p-8 rounded-2xl">
          ${this.renderCurrentStepContent(isTa)}

          <!-- Navigation Footer -->
          <div class="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <button onclick="window.PlantWizardComponent.prevStep()" ${this.currentStep === 1 ? 'disabled class="opacity-40 cursor-not-allowed text-xs font-semibold px-4 py-2 text-slate-500"' : 'class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"'}>
              ← ${isTa ? "முந்தையது" : "Previous"}
            </button>

            ${this.currentStep < 5 ? `
              <button onclick="window.PlantWizardComponent.nextStep()" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md">
                ${isTa ? "அடுத்த கேள்வி →" : "Next Question →"}
              </button>
            ` : `
              <button onclick="window.PlantWizardComponent.calculateRecommendations()" class="px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-black shadow-lg hover:shadow-emerald-900/30 flex items-center gap-2">
                <span>⚡</span>
                <span>${isTa ? "முடிவுகளைக் காண்க" : "Show Top 3 Crops"}</span>
              </button>
            `}
          </div>
        </div>

        <!-- Result Container Modal/Placement -->
        <div id="wizardResultContainer" class="mt-8"></div>

      </div>
    `;
  },

  renderCurrentStepContent(isTa) {
    switch (this.currentStep) {
      case 1:
        return `
          <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Question 1 of 5</span>
            <h2 class="text-xl font-bold text-slate-900">
              ${isTa ? "1. உங்கள் பண்ணை எந்த மாவட்டத்தில் அமைந்துள்ளது?" : "1. Where is your farm located?"}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              ${["Madurai District", "Thanjavur District", "Coimbatore District", "Salem District", "Tiruchirappalli District", "Dindigul District", "Tirunelveli District", "Erode District", "Vellore District"].map(loc => `
                <div onclick="window.PlantWizardComponent.setAnswer('location', '${loc}')" class="p-3.5 rounded-xl border cursor-pointer text-center text-xs font-bold transition-all ${this.answers.location === loc ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300 text-slate-700'}">
                  📍 ${loc}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 2:
        return `
          <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Question 2 of 5</span>
            <h2 class="text-xl font-bold text-slate-900">
              ${isTa ? "2. உங்கள் நிலத்தின் மண் வகை என்ன?" : "2. What is your soil type?"}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              ${[
                { id: "Red Soil", ta: "செம்மண்", desc: "Well drained, porous, rich in iron oxide" },
                { id: "Black Soil", ta: "கரிசல் மண்", desc: "High clay content, retains deep moisture" },
                { id: "Alluvial Soil", ta: "வண்டல் மண்", desc: "River delta fertile loam, highly fertile" },
                { id: "Sandy Soil", ta: "மணற்பாங்கான மண்", desc: "Light texture, rapid drainage" },
                { id: "Clay Soil", ta: "களிமண்", desc: "Heavy texture, water retentive" }
              ].map(s => `
                <div onclick="window.PlantWizardComponent.setAnswer('soilType', '${s.id}')" class="p-4 rounded-xl border cursor-pointer transition-all ${this.answers.soilType === s.id ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300'}">
                  <div class="font-bold text-sm text-emerald-950">${s.id} (${s.ta})</div>
                  <div class="text-xs text-slate-700 mt-1">${s.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 3:
        return `
          <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Question 3 of 5</span>
            <h2 class="text-xl font-bold text-slate-900">
              ${isTa ? "3. பாசனத்திற்கு எவ்வளவு தண்ணீர் இருப்பு உள்ளது?" : "3. How much water is available?"}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              ${[
                { id: "Abundant (Canal / Perennial River)", ta: "அதிகம் (வாய்க்கால் பாசனம்)", icon: "🌊", desc: "Sufficient for heavy water crops like paddy or sugarcane" },
                { id: "Moderate (Well/Borewell)", ta: "மிதமானது (போர்வெல் / கிணறு)", icon: "💧", desc: "Reliable for groundnut, cotton, maize, or drip vegetables" },
                { id: "Rain-fed / Scarce", ta: "மழை சார்ந்தது / குறைவு", icon: "🌧️", desc: "Dependent on seasonal monsoon; requires drought-hardy crops" }
              ].map(w => `
                <div onclick="window.PlantWizardComponent.setAnswer('waterLevel', '${w.id}')" class="p-4 rounded-xl border cursor-pointer text-center transition-all ${this.answers.waterLevel === w.id ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300'}">
                  <div class="text-3xl mb-2">${w.icon}</div>
                  <div class="font-bold text-xs text-emerald-950">${w.id}</div>
                  <div class="text-[11px] text-slate-700 mt-1">${w.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 4:
        return `
          <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Question 4 of 5</span>
            <h2 class="text-xl font-bold text-slate-900">
              ${isTa ? "4. உங்கள் விவசாய நிதி பட்ஜெட் என்ன?" : "4. What is your farming budget?"}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              ${[
                { label: "Under ₹25,000", val: "25000", icon: "🪙", desc: "Low investment crops (Maize, Pulses)" },
                { label: "₹25,000 - ₹50,000", val: "50000", icon: "💵", desc: "Groundnut, Paddy, Cotton" },
                { label: "₹50,000 - ₹1,00,000", val: "80000", icon: "💰", desc: "High yield vegetables, Turmeric" },
                { label: "Above ₹1,00,000", val: "120000", icon: "💎", desc: "Intensive horticulture & cash crops" }
              ].map(b => `
                <div onclick="window.PlantWizardComponent.setAnswer('budgetRange', '${b.val}')" class="p-4 rounded-xl border cursor-pointer text-center transition-all ${this.answers.budgetRange === b.val ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300'}">
                  <div class="text-2xl mb-1">${b.icon}</div>
                  <div class="font-bold text-xs text-emerald-950">${b.label}</div>
                  <div class="text-[10px] text-slate-700 mt-1">${b.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 5:
        return `
          <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Question 5 of 5</span>
            <h2 class="text-xl font-bold text-slate-900">
              ${isTa ? "5. சாகுபடி செய்ய உத்தேசித்துள்ள பருவம் எது?" : "5. What is the current season?"}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              ${[
                { id: "Kharif (Monsoon)", ta: "காரிஃப் / பருவமழை", desc: "June to October sowing; warm & humid" },
                { id: "Rabi (Winter)", ta: "ரபி / குளிர்காலம்", desc: "November to March; moderate temperature" },
                { id: "Zaid / Summer", ta: "ஜைத் / கோடைகாலம்", desc: "March to June; dry & sunny" }
              ].map(s => `
                <div onclick="window.PlantWizardComponent.setAnswer('season', '${s.id}')" class="p-4 rounded-xl border cursor-pointer text-center transition-all ${this.answers.season === s.id ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300'}">
                  <div class="font-bold text-xs text-emerald-950">${s.id}</div>
                  <div class="text-xs text-emerald-700 font-semibold">${s.ta}</div>
                  <div class="text-[11px] text-slate-700 mt-1">${s.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      default:
        return '';
    }
  },

  setAnswer(key, val) {
    this.answers[key] = val;
    window.PlantWizardComponent.render(document.getElementById('viewContainer'));
  },

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
      window.PlantWizardComponent.render(document.getElementById('viewContainer'));
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.PlantWizardComponent.render(document.getElementById('viewContainer'));
    }
  },

  calculateRecommendations() {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const analysis = window.UzhavanDecisionEngine.evaluateQuickWizard(this.answers);
    const top3 = analysis.allRecommendations.slice(0, 3);

    const resultBox = document.getElementById('wizardResultContainer');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="agri-card p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 border-2 border-emerald-600 shadow-xl space-y-6">
          <div class="text-center">
            <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-800 text-white uppercase tracking-wider">
              ${isTa ? "பகுப்பாய்வு முடிவுகள்" : "AI WIZARD RECOMMENDATION"}
            </span>
            <h3 class="text-2xl font-black text-emerald-950 mt-2">
              ${isTa ? "உங்கள் பண்ணைக்கு ஏற்ற சிறந்த 3 பயிர்கள்" : "Top 3 Crops Recommended For Your Farm"}
            </h3>
            <p class="text-xs text-slate-700 mt-1">
              Based on ${this.answers.soilType}, ${this.answers.waterLevel}, and ${this.answers.season}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${top3.map((crop, idx) => `
              <div class="bg-white p-5 rounded-xl border ${idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'} shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'}">
                      #${idx + 1} ${idx === 0 ? 'BEST PICK' : 'ALTERNATIVE'}
                    </span>
                    <span class="text-lg font-black text-emerald-800">${crop.suitabilityScore}% Match</span>
                  </div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-3xl">${crop.icon}</span>
                    <div>
                      <h4 class="text-base font-extrabold text-slate-900">${isTa ? crop.nameTa : crop.name}</h4>
                      <span class="text-[11px] text-slate-700">${crop.category} • ${crop.durationDays} Days</span>
                    </div>
                  </div>
                  <div class="text-xs space-y-1.5 py-3 border-y border-slate-100 text-slate-700">
                    <div class="flex justify-between"><span>Est. Investment:</span> <strong class="text-slate-900">₹${crop.estimatedInvestment.toLocaleString('en-IN')}</strong></div>
                    <div class="flex justify-between"><span>Est. Profit:</span> <strong class="text-emerald-700">₹${crop.estimatedProfit.toLocaleString('en-IN')}</strong></div>
                    <div class="flex justify-between"><span>Risk Level:</span> <span class="font-bold ${crop.calculatedRisk === 'LOW' ? 'text-emerald-700' : 'text-amber-700'}">${crop.calculatedRisk}</span></div>
                  </div>
                </div>

                <div class="mt-4">
                  <button onclick="window.UzhavanApp.navigate('decisionEngine', { selectedCrop: '${crop.id}' })" class="w-full py-2 px-3 rounded-lg ${idx === 0 ? 'bg-emerald-800 text-white hover:bg-emerald-900' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'} text-xs font-bold transition-all text-center">
                    ${isTa ? "முழு பகுப்பாய்வைக் காண்க →" : "View Full Analysis →"}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <p class="text-[11px] text-slate-700 text-center italic">
            * Values are simulation predictions based on regional agro-climatic conditions.
          </p>
        </div>
      `;
      resultBox.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.PlantWizardComponent = PlantWizardComponent;
