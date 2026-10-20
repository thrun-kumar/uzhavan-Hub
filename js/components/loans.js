// Uzhavan Hub - Agricultural Loans Component

const LoansComponent = {
  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const loans = window.UZHAVAN_DATA.AGRI_LOANS || [];

    // Helper to get documents list with realistic defaults
    const getDocs = (l) => {
      if (Array.isArray(l.documents) && l.documents.length) return l.documents;
      if (Array.isArray(l.requiredDocuments) && l.requiredDocuments.length) return l.requiredDocuments;
      return isTa
        ? ["ஆதார் அட்டை", "பட்டா / சிட்டா நகல்", "வங்கி பாஸ்புக்", "சாகுபடி சான்றிதழ்", "புகைப்படம்"]
        : ["Aadhaar Card", "Land Patta / Chitta", "Bank Passbook", "Crop Cultivation Certificate", "Passport Photo"];
    };

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🏦</span> ${isTa ? "விவசாய கடன் வழிகாட்டி" : "Institutional Agricultural Credit"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "விவசாயக் கடன்கள் (Agricultural Loans)" : "Agricultural Loans & Institutional Credit Guide"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "பயிர்க்கடன், டிராக்டர் கடன், மற்றும் கால்நடை வளர்ப்புக்கான குறைந்த வட்டி அரசு வங்கிக் கடன்கள்." : "Clear, transparent institutional credit parameters for seasonal crop operations, farm machinery, and post-harvest infrastructure."}
            </p>
          </div>
        </div>

        <!-- FINANCIAL DISCLAIMER NOTICE -->
        <div class="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <span class="text-base flex-shrink-0">ℹ️</span>
          <p class="leading-relaxed">
            <strong>Credit Information Notice:</strong> This module provides general informational guidance regarding nationalized banking norms and NABARD schemes. It is strictly informational and does not constitute personalized financial advice. Final loan sanctions, interest subventions, and limits are determined by respective lending banks based on credit score and land inspection.
          </p>
        </div>

        <!-- LOANS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${loans.map(loan => {
            const title = isTa ? (loan.schemeNameTa || loan.typeTa || loan.schemeName || loan.type || "விவசாயக் கடன்") : (loan.schemeName || loan.type || loan.name || "Agricultural Credit");
            const interest = loan.financialBenefit || loan.interest || "Concessional 4% - 7% per annum with prompt repayment incentive";
            const purpose = loan.purpose || "Short-term cultivation and equipment support";
            const eligibility = loan.basicEligibility || loan.eligibility || "Small & marginal farmers with verified land holdings";
            const authority = loan.authority || loan.application || "Commercial & Regional Rural Banks (PACCS / SBI / Canara Bank)";
            const docs = getDocs(loan);
            const sourceUrl = loan.officialSource || "https://www.nabard.org";
            const shortName = (loan.schemeName || loan.type || "Loan").split(' ')[0];

            return `
              <div class="agri-card p-6 md:p-7 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all bg-white shadow-sm border border-emerald-100">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Institutional Bank Credit
                    </span>
                    <span class="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Subsidized Rate
                    </span>
                  </div>

                  <h3 class="text-xl font-extrabold text-slate-900">
                    ${title}
                  </h3>

                  <!-- Purpose -->
                  <div class="text-xs text-slate-700">
                    <strong class="text-slate-900 font-bold block mb-0.5">🎯 ${isTa ? "நோக்கம் (Purpose):" : "Purpose:"}</strong>
                    <p class="leading-relaxed">${purpose}</p>
                  </div>

                  <!-- Interest Rate / Financial Benefit -->
                  <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-semibold">
                    <strong class="text-emerald-900 font-bold block mb-0.5">⚡ ${isTa ? "வட்டி விகிதம் & நிதி உதவி:" : "Interest Rate & Benefits:"}</strong>
                    <p class="leading-relaxed">${interest}</p>
                  </div>

                  <!-- Eligibility -->
                  <div class="text-xs text-slate-700">
                    <strong class="text-slate-900 font-bold block mb-0.5">👤 ${isTa ? "தகுதி (Eligibility):" : "Eligibility:"}</strong>
                    <p>${eligibility}</p>
                  </div>

                  <!-- Required Documents -->
                  <div class="text-xs text-slate-700 space-y-1">
                    <strong class="text-slate-900 font-bold block">📄 ${isTa ? "தேவையான ஆவணங்கள்:" : "Required Documents:"}</strong>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${docs.map(d => `
                        <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium">${d}</span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- Application Info & Actions -->
                <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-700 space-y-2">
                  <div>
                    <strong class="text-slate-900 font-bold">🏦 ${isTa ? "விண்ணப்பிக்கும் இடம்:" : "Application Channel:"}</strong> ${authority}
                  </div>
                  <div class="flex items-center gap-2 pt-1">
                    <button onclick="window.UzhavanApp.showToast('Connecting with local bank coordinator for ${shortName}...', 'info')" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-800 text-xs font-bold transition-all text-center">
                      ${isTa ? "வங்கி விவரங்களை அணுகுக →" : "Check Nearest Bank →"}
                    </button>
                    <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 text-center transition-all">
                      ${isTa ? "அதிகாரப்பூர்வ தளம் ↗" : "Official Source ↗"}
                    </a>
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }
};

window.LoansComponent = LoansComponent;
