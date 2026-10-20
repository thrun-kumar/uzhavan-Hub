// Uzhavan Hub - Profit Predictor (Compare Crop Profit) Component

const ProfitPredictorComponent = {
  landArea: 3.0,

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const crops = window.UZHAVAN_DATA.CROPS_DATA;
    const acres = this.landArea;

    // Calculate metrics for all crops based on current land area
    const comparedCrops = crops.map(crop => {
      const investment = Math.round(crop.investmentPerAcre * acres);
      const yieldKg = Math.round(crop.yieldPerAcre * acres);
      const price = crop.marketPrice;
      const revenue = Math.round(yieldKg * price);
      const profit = Math.round(revenue - investment);
      const roi = Math.round((profit / investment) * 100);

      return {
        ...crop,
        investment,
        yieldKg,
        revenue,
        profit,
        roi
      };
    });

    // Find highest profit crop to scale visual comparison bars
    const maxProfit = Math.max(...comparedCrops.map(c => c.profit));

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>💰</span> ${isTa ? "பயிர்களின் லாப ஒப்பீட்டு மாதிரி" : "Comparative Financial Modeling"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "பயிர் லாப ஒப்பீடு (Compare Crop Profit)" : "Compare Crop Profit & Financial ROI"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "பல்வேறு பயிர்களுக்கான முதலீடு, மகசூல், சந்தை விலை மற்றும் நிகர லாபத்தை ஒரே பார்வையில் ஒப்பிடுங்கள்." : "Simulate revenue, cost of cultivation, and net margins across multiple crops for your exact land acreage."}
            </p>
          </div>

          <!-- Interactive Land Size Slider -->
          <div class="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm min-w-[280px]">
            <div class="flex justify-between items-center mb-1 text-xs">
              <span class="font-bold text-slate-700 uppercase">${isTa ? "நிலப் பரப்பு மாற்றி:" : "Simulate Land Size:"}</span>
              <span id="predictorAcreVal" class="font-black text-emerald-800 text-sm">${acres} Acres</span>
            </div>
            <input type="range" min="0.5" max="20" step="0.5" value="${acres}" 
              oninput="window.ProfitPredictorComponent.updateAcreage(this.value)"
              class="w-full h-2 bg-emerald-100 rounded-lg cursor-pointer">
            <div class="flex justify-between text-[10px] text-slate-700 mt-1 font-semibold">
              <span>0.5 Acre</span>
              <span>10 Acres</span>
              <span>20 Acres</span>
            </div>
          </div>
        </div>

        <!-- SECTION 9 COMPARISON TABLE -->
        <div class="agri-card rounded-2xl overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <span>📊</span> ${isTa ? "விரிவான பயிர் லாப ஒப்பீட்டு அட்டவணை" : "Detailed Crop Financial Comparison Table"}
            </h2>
            <span class="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ★ Highlighted = AI Top Recommendation
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/80 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">${isTa ? "பயிர்" : "Crop"}</th>
                  <th class="py-3 px-4">${isTa ? "முதலீடு" : "Investment"}</th>
                  <th class="py-3 px-4">${isTa ? "மகசூல்" : "Expected Yield"}</th>
                  <th class="py-3 px-4">${isTa ? "சந்தை விலை" : "Market Price"}</th>
                  <th class="py-3 px-4">${isTa ? "வருவாய்" : "Expected Revenue"}</th>
                  <th class="py-3 px-4">${isTa ? "நிகர லாபம்" : "Estimated Profit"}</th>
                  <th class="py-3 px-4">${isTa ? "அபாய நிலை" : "Risk Level"}</th>
                  <th class="py-3 px-4 text-center">${isTa ? "செயல்" : "Action"}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${comparedCrops.map((c, i) => {
                  const isRec = c.id === 'groundnut';
                  return `
                    <tr class="transition-colors ${isRec ? 'bg-emerald-50/80 font-bold text-emerald-950 border-l-4 border-emerald-600' : 'hover:bg-slate-50 text-slate-800'}">
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-2.5">
                          <span class="text-2xl">${c.icon}</span>
                          <div>
                            <span class="font-extrabold text-sm block">${isTa ? c.nameTa : c.name}</span>
                            ${isRec ? `<span class="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-700 text-white tracking-wider">AI RECOMMENDED</span>` : `<span class="text-[10px] text-slate-700">${c.category}</span>`}
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-4 font-semibold">
                        ₹${(c.investment / 1000).toFixed(0)}K
                        <span class="text-[10px] text-slate-700 block">₹${c.investment.toLocaleString('en-IN')}</span>
                      </td>
                      <td class="py-3.5 px-4 font-semibold">
                        ${c.yieldKg.toLocaleString('en-IN')} kg
                      </td>
                      <td class="py-3.5 px-4 font-semibold">
                        ₹${c.marketPrice}/kg
                      </td>
                      <td class="py-3.5 px-4 font-semibold">
                        ₹${(c.revenue / 100000).toFixed(2)}L
                        <span class="text-[10px] text-slate-700 block">₹${c.revenue.toLocaleString('en-IN')}</span>
                      </td>
                      <td class="py-3.5 px-4 font-black ${isRec ? 'text-emerald-800 text-base' : 'text-slate-900 text-sm'}">
                        ₹${(c.profit / 100000).toFixed(2)}L
                        <span class="text-[10px] font-bold text-emerald-700 block">${c.roi}% ROI</span>
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.riskLevel === 'LOW' ? 'badge-low' : c.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-high'}">
                          ${c.riskLevel}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-center">
                        <button onclick="window.UzhavanApp.navigate('decisionEngine', { selectedCrop: '${c.id}' })" class="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-sm">
                          ${isTa ? "பகுப்பாய்வு" : "View"}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- VISUAL COMPARATIVE PROFIT BARS -->
        <div class="agri-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <span>📈</span> ${isTa ? "லாபம் vs முதலீடு வரைபட ஒப்பீடு" : "Net Profit Comparison Across Crops"}
            </h3>
            <span class="text-xs text-slate-700 font-medium">Scaled for ${acres} Acres</span>
          </div>

          <div class="space-y-3.5 pt-2">
            ${comparedCrops.map(c => {
              const widthPct = Math.max(12, Math.round((c.profit / maxProfit) * 100));
              const isRec = c.id === 'groundnut';
              return `
                <div class="space-y-1">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-extrabold flex items-center gap-1.5 ${isRec ? 'text-emerald-900' : 'text-slate-700'}">
                      <span>${c.icon}</span>
                      <span>${c.name}</span>
                      ${isRec ? `<span class="text-[9px] px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-black">TOP PICK</span>` : ''}
                    </span>
                    <span class="font-black ${isRec ? 'text-emerald-700 text-sm' : 'text-slate-800'}">
                      ₹${c.profit.toLocaleString('en-IN')} Profit (ROI: ${c.roi}%)
                    </span>
                  </div>
                  <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                    <div class="h-full rounded-full transition-all duration-500 ${isRec ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-slate-400'}" style="width: ${widthPct}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- DISCLAIMER -->
        <div class="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-700 italic">
          * Note: Profit estimates assume standard agro-climatic conditions and average regional mandi pricing without pest losses.
        </div>

      </div>
    `;
  },

  updateAcreage(val) {
    this.landArea = parseFloat(val) || 1.0;
    const acreDisplay = document.getElementById('predictorAcreVal');
    if (acreDisplay) acreDisplay.innerText = this.landArea + ' Acres';
    window.ProfitPredictorComponent.render(document.getElementById('viewContainer'));
  }
};

window.ProfitPredictorComponent = ProfitPredictorComponent;
