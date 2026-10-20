// Uzhavan Hub - Farm Finance & Cultivation Cost Calculator Component
// Module 6: Cultivation Cost Calculator, Income & Expense Tracker, Break-Even Estimator, LocalStorage Persistence Disclaimer

const FarmFinanceComponent = {
  activeTab: "calculator", // "calculator", "ledger", "breakeven"
  landArea: 3.0,
  selectedCropId: "groundnut",
  ledger: [],

  initLedger() {
    try {
      const saved = localStorage.getItem('uzhavan_finance_ledger');
      if (saved) {
        this.ledger = JSON.parse(saved);
      } else {
        // Initial sample seed transactions
        this.ledger = [
          { id: "TX-101", type: "Expense", category: "Seeds & Nursery", amount: 4500, date: "2026-10-01", notes: "Groundnut TMV-7 Certified Seeds (30kg)" },
          { id: "TX-102", type: "Expense", category: "Fertilizer", amount: 3200, date: "2026-10-05", notes: "DAP 50kg + Gypsum 100kg Basal" },
          { id: "TX-103", type: "Expense", category: "Farm Labour", amount: 2800, date: "2026-10-12", notes: "Sowing & Furrow preparation workers" },
          { id: "TX-104", type: "Income", category: "Crop Sale", amount: 25000, date: "2026-09-20", notes: "Advance payment from Madurai Mandi trader" }
        ];
        this.saveLedger();
      }
    } catch (e) {
      console.error("Ledger parse error", e);
    }
  },

  saveLedger() {
    try {
      localStorage.setItem('uzhavan_finance_ledger', JSON.stringify(this.ledger));
    } catch (e) {
      console.error("Ledger save error", e);
    }
  },

  render(container) {
    if (this.ledger.length === 0) this.initLedger();
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const crops = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_DATA) || [];
    const currentCrop = crops.find(c => c.id === this.selectedCropId) || crops[0] || {
      id: "groundnut",
      name: "Groundnut",
      nameTa: "நிலக்கடலை",
      icon: "🥜",
      investmentPerAcre: 18500,
      yieldPerAcre: 1100,
      marketPrice: 74,
      durationDays: 105
    };

    const acres = this.landArea;
    const totalInvestment = Math.round(currentCrop.investmentPerAcre * acres);
    const totalYield = Math.round(currentCrop.yieldPerAcre * acres);
    const totalRevenue = Math.round(totalYield * currentCrop.marketPrice);
    const netProfit = Math.round(totalRevenue - totalInvestment);
    const roi = totalInvestment > 0 ? Math.round((netProfit / totalInvestment) * 100) : 0;

    // Cost Breakdown breakdown estimates (standard agronomic shares)
    const costSeeds = Math.round(totalInvestment * 0.22);
    const costFertilizer = Math.round(totalInvestment * 0.28);
    const costLabour = Math.round(totalInvestment * 0.25);
    const costIrrigation = Math.round(totalInvestment * 0.12);
    const costHarvestTransport = Math.round(totalInvestment * 0.13);

    // Ledger totals
    const totalExpenses = this.ledger.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = this.ledger.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0);
    const netCashflow = totalIncome - totalExpenses;

    // Break-even metrics
    const breakEvenYieldPerAcre = currentCrop.marketPrice > 0 ? Math.round(currentCrop.investmentPerAcre / currentCrop.marketPrice) : 0;
    const breakEvenPricePerKg = currentCrop.yieldPerAcre > 0 ? Math.round((currentCrop.investmentPerAcre / currentCrop.yieldPerAcre) * 10) / 10 : 0;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>📊</span> ${isTa ? "பண்ணை நிதி & லாப கணக்கீடு" : "Farm Finance & Cultivation Economics"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "பண்ணை நிதி மேலாண்மை (Farm Finance & Profit)" : "Farm Finance & Profit Calculator"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa 
                ? "சாகுபடி செலவு, வரவு-செலவு பதிவேடு மற்றும் லாப வரம்பு பகுப்பாய்வுக்கான ஒருங்கிணைந்த நிதி மேலாளர்." 
                : "Interactive cultivation budgeting, local income/expense cashflow ledger, and break-even thresholds for your farm."
              }
            </p>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl self-start md:self-auto text-xs font-bold">
            <button onclick="window.FarmFinanceComponent.switchTab('calculator')" 
              class="px-3.5 py-2 rounded-lg transition-all ${this.activeTab === 'calculator' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-700 hover:text-slate-900'}">
              ${isTa ? "சாகுபடி செலவு" : "Cost Calculator"}
            </button>
            <button onclick="window.FarmFinanceComponent.switchTab('ledger')" 
              class="px-3.5 py-2 rounded-lg transition-all ${this.activeTab === 'ledger' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-700 hover:text-slate-900'}">
              ${isTa ? "வரவு-செலவு பதிவேடு" : "Cashflow Ledger"}
            </button>
            <button onclick="window.FarmFinanceComponent.switchTab('breakeven')" 
              class="px-3.5 py-2 rounded-lg transition-all ${this.activeTab === 'breakeven' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-700 hover:text-slate-900'}">
              ${isTa ? "லாப வரம்பு புள்ளி" : "Break-Even"}
            </button>
          </div>
        </div>

        <!-- ESTIMATE DISCLAIMER BANNER -->
        <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-sm">
          <span class="text-base flex-shrink-0">⚠️</span>
          <div>
            <strong class="font-bold text-amber-900">${isTa ? "நிதி அறிவிப்பு:" : "Financial Planning Notice:"}</strong>
            <span class="block mt-0.5">${isTa ? "மதிப்பிடப்பட்ட செலவு மற்றும் லாபம் விவசாய மாதிரி கணிப்புகள் மட்டுமே; இவை உறுதியான நிதி உத்தரவாதங்கள் அல்ல. கள மேலாண்மை மற்றும் சந்தை மாற்றங்களுக்கு ஏற்ப மாறுபடலாம்." : "All calculations are planning estimates based on benchmark agro-climatic packages of practices. They do not constitute guaranteed financial outcomes."}</span>
          </div>
        </div>

        ${this.activeTab === 'calculator' ? `
          <!-- TAB 1: CULTIVATION COST & PROFIT CALCULATOR -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- LEFT: INPUTS & SLIDERS (4 COLS) -->
            <div class="lg:col-span-4 space-y-4">
              <div class="agri-card p-5 rounded-2xl space-y-4">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
                  ${isTa ? "பயிரை தேர்வு செய்யவும்:" : "Select Crop to Simulate:"}
                </h3>

                <select onchange="window.FarmFinanceComponent.selectCrop(this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  ${crops.map(c => `
                    <option value="${c.id}" ${c.id === currentCrop.id ? 'selected' : ''}>
                      ${c.icon} ${c.name} (${c.nameTa})
                    </option>
                  `).join('')}
                </select>

                <!-- Land Area Slider -->
                <div class="space-y-2 pt-2 border-t border-slate-100">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-700 uppercase">${isTa ? "நிலப் பரப்பு:" : "Farm Land Area:"}</span>
                    <span class="font-black text-emerald-800 text-sm">${acres} Acres</span>
                  </div>
                  <input type="range" min="0.5" max="20" step="0.5" value="${acres}"
                    oninput="window.FarmFinanceComponent.updateAcreage(this.value)"
                    class="w-full h-2 bg-emerald-100 rounded-lg cursor-pointer">
                  <div class="flex justify-between text-[10px] text-slate-700 font-semibold">
                    <span>0.5 Acre</span>
                    <span>10 Acres</span>
                    <span>20 Acres</span>
                  </div>
                </div>

                <!-- Benchmarks Overview -->
                <div class="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-200">
                  <div class="flex justify-between">
                    <span class="text-slate-700">Cost per Acre:</span>
                    <strong class="text-slate-900 font-bold">₹${currentCrop.investmentPerAcre.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-700">Benchmark Yield:</span>
                    <strong class="text-slate-900 font-bold">${currentCrop.yieldPerAcre.toLocaleString('en-IN')} kg/acre</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-700">Reference Mandi Price:</span>
                    <strong class="text-emerald-800 font-bold">₹${currentCrop.marketPrice} / kg</strong>
                  </div>
                </div>

              </div>
            </div>

            <!-- RIGHT: SUMMARY & COST BREAKDOWN (8 COLS) -->
            <div class="lg:col-span-8 space-y-5">
              
              <!-- 4-Box Financial Metrics -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span class="text-[10px] font-bold uppercase text-slate-700 block">Est. Investment</span>
                  <span class="text-xl font-extrabold text-slate-900">₹${totalInvestment.toLocaleString('en-IN')}</span>
                  <span class="text-[10px] text-slate-700 block mt-0.5">${acres} acres</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span class="text-[10px] font-bold uppercase text-slate-700 block">Expected Yield</span>
                  <span class="text-xl font-extrabold text-slate-900">${totalYield.toLocaleString('en-IN')} kg</span>
                  <span class="text-[10px] text-slate-700 block mt-0.5">${(totalYield / 100).toFixed(1)} Quintals</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span class="text-[10px] font-bold uppercase text-slate-700 block">Est. Gross Revenue</span>
                  <span class="text-xl font-extrabold text-slate-900">₹${totalRevenue.toLocaleString('en-IN')}</span>
                  <span class="text-[10px] text-slate-700 block mt-0.5">@ ₹${currentCrop.marketPrice}/kg</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-xs">
                  <span class="text-[10px] font-bold uppercase text-emerald-800 block">Est. Net Profit</span>
                  <span class="text-xl font-black text-emerald-800">₹${netProfit.toLocaleString('en-IN')}</span>
                  <span class="text-[10px] font-bold text-amber-700 block mt-0.5">ROI: ${roi}%</span>
                </div>
              </div>

              <!-- Itemized Cultivation Cost Breakdown -->
              <div class="agri-card p-6 rounded-2xl space-y-4">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
                  ${isTa ? "சாகுபடி செலவு விவரம் (Itemized Cultivation Expenditure):" : "Itemized Cost of Cultivation Breakdown:"}
                </h3>

                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-semibold">🌱 Seeds & Nursery Preparation (22%)</span>
                    <strong class="text-slate-900">₹${costSeeds.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-semibold">🧪 Basal & Top-Dressing Fertilizers (28%)</span>
                    <strong class="text-slate-900">₹${costFertilizer.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-semibold">👨‍🌾 Labour, Sowing & Weeding (25%)</span>
                    <strong class="text-slate-900">₹${costLabour.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-semibold">💧 Irrigation & Power / Diesel (12%)</span>
                    <strong class="text-slate-900">₹${costIrrigation.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-semibold">🚜 Harvesting, Bagging & Transport (13%)</span>
                    <strong class="text-slate-900">₹${costHarvestTransport.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex justify-between text-xs font-black text-emerald-950">
                  <span>TOTAL ESTIMATED CULTIVATION EXPENDITURE:</span>
                  <span class="text-sm">₹${totalInvestment.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </div>
        ` : this.activeTab === 'ledger' ? `
          <!-- TAB 2: FARM INCOME & EXPENSE LEDGER -->
          <div class="space-y-6">
            
            <!-- Ledger Overview Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                <span class="text-xs font-bold uppercase text-slate-700 block">Total Expenses Incurred</span>
                <span class="text-2xl font-black text-rose-700 mt-1 block">₹${totalExpenses.toLocaleString('en-IN')}</span>
                <span class="text-[11px] text-slate-700">${this.ledger.filter(t => t.type === 'Expense').length} recorded entries</span>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                <span class="text-xs font-bold uppercase text-slate-700 block">Total Realized Revenue</span>
                <span class="text-2xl font-black text-emerald-800 mt-1 block">₹${totalIncome.toLocaleString('en-IN')}</span>
                <span class="text-[11px] text-slate-700">${this.ledger.filter(t => t.type === 'Income').length} sales receipts</span>
              </div>
              <div class="bg-white p-5 rounded-2xl border ${netCashflow >= 0 ? 'border-emerald-300 bg-emerald-50/50' : 'border-rose-300 bg-rose-50/50'} shadow-sm">
                <span class="text-xs font-bold uppercase text-slate-700 block">Net Farm Operating Margin</span>
                <span class="text-2xl font-black ${netCashflow >= 0 ? 'text-emerald-900' : 'text-rose-900'} mt-1 block">₹${netCashflow.toLocaleString('en-IN')}</span>
                <span class="text-[11px] font-semibold text-slate-700">Cash-in-hand position</span>
              </div>
            </div>

            <!-- LOCAL STORAGE DISCLAIMER AS REQUESTED -->
            <div class="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
              <span class="text-base flex-shrink-0">💾</span>
              <div>
                <strong class="font-bold text-blue-900">Local Browser Storage Notice:</strong>
                <span class="block mt-0.5">These financial entries are stored securely in your current browser's local cache. They are not synchronized across multiple devices or uploaded to an external server. Clearing browser history will reset these records.</span>
              </div>
            </div>

            <!-- Add Entry Form & Transactions Table -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- Add Transaction Card (4 cols) -->
              <div class="lg:col-span-4">
                <form onsubmit="window.FarmFinanceComponent.handleAddTransaction(event)" class="agri-card p-5 rounded-2xl space-y-3.5 text-xs">
                  <h3 class="font-black text-slate-900 text-sm">Add Financial Record</h3>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Transaction Type *</label>
                    <select name="txType" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-emerald-600">
                      <option value="Expense">Expense (பண்ணை செலவு)</option>
                      <option value="Income">Income (பயிர் விற்பனை வரவு)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                    <select name="txCategory" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                      <option value="Seeds & Nursery">Seeds & Nursery</option>
                      <option value="Fertilizer">Fertilizer & Chemicals</option>
                      <option value="Farm Labour">Farm Labour Wages</option>
                      <option value="Machinery Rental">Machinery / Diesel</option>
                      <option value="Irrigation">Irrigation / Electricity</option>
                      <option value="Crop Sale">Crop Sale Proceeds</option>
                      <option value="Govt Subsidy">Government Subsidy</option>
                      <option value="Other">Other Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Amount (₹) *</label>
                    <input type="number" name="txAmount" min="1" step="1" required placeholder="e.g. 2500" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600">
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Date *</label>
                    <input type="date" name="txDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
                    <input type="text" name="txNotes" placeholder="e.g. 2 bags Urea from Co-op" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-600">
                  </div>

                  <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md transition-all flex items-center justify-center gap-1.5">
                    <span>+</span>
                    <span>Save Transaction</span>
                  </button>
                </form>
              </div>

              <!-- Transactions History Table (8 cols) -->
              <div class="lg:col-span-8">
                <div class="agri-card p-5 rounded-2xl space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 class="font-black text-slate-900 text-sm">Transaction Ledger</h3>
                    <button onclick="window.FarmFinanceComponent.clearAllTransactions()" class="text-rose-700 text-xs font-bold hover:underline">
                      Reset Ledger
                    </button>
                  </div>

                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                        <tr>
                          <th class="py-2.5 px-3">Date</th>
                          <th class="py-2.5 px-3">Category</th>
                          <th class="py-2.5 px-3">Description</th>
                          <th class="py-2.5 px-3">Type</th>
                          <th class="py-2.5 px-3 text-right">Amount</th>
                          <th class="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        ${this.ledger.map(t => `
                          <tr class="hover:bg-slate-50 transition-colors">
                            <td class="py-2.5 px-3 text-slate-700">${t.date}</td>
                            <td class="py-2.5 px-3 font-bold text-slate-900">${t.category}</td>
                            <td class="py-2.5 px-3 text-slate-700">${t.notes || '—'}</td>
                            <td class="py-2.5 px-3">
                              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                                ${t.type}
                              </span>
                            </td>
                            <td class="py-2.5 px-3 text-right font-black ${t.type === 'Income' ? 'text-emerald-800' : 'text-rose-700'}">
                              ${t.type === 'Income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
                            </td>
                            <td class="py-2.5 px-3 text-center">
                              <button onclick="window.FarmFinanceComponent.deleteTransaction('${t.id}')" class="text-slate-400 hover:text-rose-600 font-bold">✕</button>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>

          </div>
        ` : `
          <!-- TAB 3: BREAK-EVEN ESTIMATOR -->
          <div class="agri-card p-6 md:p-8 rounded-2xl space-y-6">
            <div>
              <h2 class="text-xl font-black text-slate-900">
                ${isTa ? "லாப வரம்பு புள்ளி பகுப்பாய்வு (Break-Even Thresholds)" : "Break-Even Yield & Market Price Thresholds"}
              </h2>
              <p class="text-xs text-slate-700 mt-0.5">
                Calculate the minimum production and mandi price required to avoid agricultural financial loss for <strong>${currentCrop.name}</strong>.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Metric 1: Break-even Yield -->
              <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <span class="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                  1. Minimum Break-Even Yield Required:
                </span>
                <div class="text-3xl font-black text-emerald-800">
                  ${breakEvenYieldPerAcre} kg / acre
                </div>
                <p class="text-xs text-emerald-950 leading-relaxed font-medium">
                  At the benchmark spot price of <strong>₹${currentCrop.marketPrice}/kg</strong>, your farm must harvest at least <strong>${breakEvenYieldPerAcre} kg/acre</strong> to fully recover total input and labour expenditure of ₹${currentCrop.investmentPerAcre.toLocaleString('en-IN')}/acre.
                </p>
                <div class="pt-2 border-t border-emerald-200 text-[11px] text-emerald-800">
                  Normal Target: ${currentCrop.yieldPerAcre} kg/acre (Buffer: +${Math.round(currentCrop.yieldPerAcre - breakEvenYieldPerAcre)} kg profit zone)
                </div>
              </div>

              <!-- Metric 2: Break-even Market Price -->
              <div class="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <span class="text-xs font-black uppercase tracking-wider text-blue-900 block">
                  2. Minimum Break-Even Market Price:
                </span>
                <div class="text-3xl font-black text-blue-800">
                  ₹${breakEvenPricePerKg} / kg
                </div>
                <p class="text-xs text-blue-950 leading-relaxed font-medium">
                  If your field produces the expected <strong>${currentCrop.yieldPerAcre} kg/acre</strong>, you must sell at or above <strong>₹${breakEvenPricePerKg}/kg</strong> in the mandi to break even.
                </p>
                <div class="pt-2 border-t border-blue-200 text-[11px] text-blue-800">
                  Current Mandi Spot Rate: ₹${currentCrop.marketPrice}/kg (Margin: +₹${Math.round((currentCrop.marketPrice - breakEvenPricePerKg) * 10) / 10}/kg)
                </div>
              </div>

            </div>

          </div>
        `}

      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  selectCrop(cropId) {
    this.selectedCropId = cropId;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  updateAcreage(val) {
    this.landArea = parseFloat(val) || 1.0;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleAddTransaction(e) {
    e.preventDefault();
    const form = e.target;
    const newTx = {
      id: "TX-" + Math.floor(100 + Math.random() * 900),
      type: form.txType.value,
      category: form.txCategory.value,
      amount: parseFloat(form.txAmount.value) || 0,
      date: form.txDate.value,
      notes: form.txNotes.value
    };

    this.ledger.unshift(newTx);
    this.saveLedger();
    window.UzhavanApp.showToast(`Transaction ${newTx.id} saved to local ledger! 💰`, "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  deleteTransaction(txId) {
    this.ledger = this.ledger.filter(t => t.id !== txId);
    this.saveLedger();
    window.UzhavanApp.showToast("Transaction deleted.", "info");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  clearAllTransactions() {
    if (confirm("Reset financial ledger to defaults?")) {
      localStorage.removeItem('uzhavan_finance_ledger');
      this.initLedger();
      window.UzhavanApp.showToast("Ledger reset to defaults.", "info");
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
    }
  }
};

window.FarmFinanceComponent = FarmFinanceComponent;
// Backward compatibility alias for ProfitPredictorComponent
window.ProfitPredictorComponent = FarmFinanceComponent;