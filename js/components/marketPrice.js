// Uzhavan Hub - Market Prices & "Sell or Wait?" Component

const MarketPriceComponent = {
  selectedCrop: "All",
  selectedDistrict: "All",
  searchQuery: "",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const allPrices = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MARKET_PRICES) || [];
    const allCrops = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_DATA) || [];

    const districts = [
      "All", "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
      "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
      "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
    ];

    // Filter prices
    const filteredPrices = allPrices.filter(p => {
      const matchCrop = (this.selectedCrop === "All") || (p.crop.toLowerCase().includes(this.selectedCrop.toLowerCase())) || (p.cropId === this.selectedCrop.toLowerCase());
      const matchDistrict = (this.selectedDistrict === "All") || (p.district.toLowerCase() === this.selectedDistrict.toLowerCase());
      const matchSearch = !this.searchQuery.trim() ||
        p.crop.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.marketName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.variety && p.variety.toLowerCase().includes(this.searchQuery.toLowerCase()));

      return matchCrop && matchDistrict && matchSearch;
    });

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>📈</span> ${isTa ? "மண்டி சந்தை நிலவரம்" : "Market Price Intelligence"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "சந்தை விலை நிலவரம் & விற்கவா / காத்திருக்கவா?" : "Wholesale Market Prices & Arrival Insights"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "தமிழகத்தின் 15 மாவட்ட ஒழுங்குமுறை விற்பனைக் கூடங்களின் விலை நிலவரங்கள் மற்றும் விலை போக்கு." : "Tracking mandi quotes across 18 crops in 15 Tamil Nadu regulated markets with AI 'Sell or Wait?' decision metrics."}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo/Synthetic Market Data
            </span>
          </div>
        </div>

        <!-- MANDATORY DISCLAIMER AS REQUESTED IN SPEC -->
        <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5">
          <span class="text-base flex-shrink-0">⚠️</span>
          <span>
            <strong>Demo/Synthetic Market Data:</strong> All commodity rates and recommendations are synthetic simulation figures for prototype testing. Do not use as live commercial trading quotes.
          </span>
        </div>

        <!-- FILTERS BAR: CROP, DISTRICT, SEARCH -->
        <div class="agri-card p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Crop Filter -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">1. ${isTa ? "பயிர் தேர்வு:" : "Crop Filter (18 Crops):"}</label>
            <select onchange="window.MarketPriceComponent.updateFilter('crop', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <option value="All">-- All 18 Crops --</option>
              ${allCrops.map(c => `
                <option value="${c.id}" ${this.selectedCrop.toLowerCase() === c.id.toLowerCase() ? 'selected' : ''}>${c.icon} ${c.name} (${c.nameTa})</option>
              `).join('')}
            </select>
          </div>

          <!-- District Filter -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">2. ${isTa ? "மாவட்டம் / மண்டி:" : "District / Mandi:"}</label>
            <select onchange="window.MarketPriceComponent.updateFilter('district', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${districts.map(d => `
                <option value="${d}" ${this.selectedDistrict === d ? 'selected' : ''}>${d === 'All' ? '-- All 15 Districts --' : d + ' District'}</option>
              `).join('')}
            </select>
          </div>

          <!-- Search Input -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 mb-1">3. ${isTa ? "தேடல்:" : "Search Commodity / Market:"}</label>
            <div class="relative">
              <input type="text" placeholder="Search crop or mandi name..."
                value="${this.searchQuery}"
                oninput="window.MarketPriceComponent.updateFilter('search', this.value)"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              <span class="absolute left-3 top-3 text-slate-700 text-xs">🔍</span>
            </div>
          </div>
        </div>

        <!-- AI "SELL OR WAIT?" SPOTLIGHT -->
        <div class="agri-card p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-green-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-600">
              🤖 AI MANDI INSIGHT SPOTLIGHT
            </span>
            <h2 class="text-2xl font-black">
              Groundnut (நிலக்கடலை) – ₹7,400 / Quintal
            </h2>
            <p class="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Steady demand from regional edible oil extraction solvent units in Tiruppur and Madurai. Arrival volumes are balanced (+4.8% price growth this week).
            </p>
          </div>
          <div class="bg-amber-400 text-slate-950 px-6 py-4 rounded-xl text-center self-start md:self-auto min-w-[160px] shadow-lg">
            <span class="text-[10px] font-black uppercase tracking-wider block">RECOMMENDATION</span>
            <span class="text-xl font-black block my-0.5">HOLD / WAIT</span>
            <span class="text-[10px] font-bold block text-slate-900">Wait 3-5 days for peak</span>
          </div>
        </div>

        <!-- MARKET PRICES TABLE -->
        <div class="agri-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-emerald-950">
                ${isTa ? "பயிர்களின் மாதிரி மண்டி விலை நிலவரம்" : "Wholesale Commodity Price Records"}
              </h3>
              <p class="text-xs text-slate-700">
                Showing ${filteredPrices.length} records matching your filter
              </p>
            </div>
            <span class="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
              Demo/Synthetic Market Data
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th class="py-3 px-3">Commodity & Variety</th>
                  <th class="py-3 px-3">District & Mandi</th>
                  <th class="py-3 px-3">Min Price</th>
                  <th class="py-3 px-3">Max Price</th>
                  <th class="py-3 px-3">Modal Price</th>
                  <th class="py-3 px-3">Unit</th>
                  <th class="py-3 px-3">Price Trend</th>
                  <th class="py-3 px-3">Last Updated</th>
                  <th class="py-3 px-3">Status Label</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                ${filteredPrices.map(p => `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-3 whitespace-nowrap">
                      <strong class="text-slate-900 text-sm block">${p.crop}</strong>
                      <span class="text-[10px] text-slate-700">${p.variety || 'Standard FAQ Grade'}</span>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      <div class="font-bold text-emerald-950">📍 ${p.district}</div>
                      <span class="text-[10px] text-slate-700">${p.marketName}</span>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-bold text-slate-700">
                      ₹${p.minPrice.toLocaleString('en-IN')}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-bold text-slate-700">
                      ₹${p.maxPrice.toLocaleString('en-IN')}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-black text-emerald-800 text-sm">
                      ₹${p.modalPrice.toLocaleString('en-IN')}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap text-slate-700">
                      ${p.unit}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap font-bold">
                      <span class="inline-flex items-center gap-1 ${p.trend === 'up' ? 'text-emerald-700' : p.trend === 'down' ? 'text-rose-700' : 'text-slate-700'}">
                        <span>${p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'}</span>
                        <span class="capitalize">${p.trend}</span>
                      </span>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap text-slate-700 text-[11px]">
                      ${p.lastUpdated}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Demo/Synthetic Data
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <!-- CROP LISTING FOR SALE & HARVEST PROCEEDS CALCULATOR (MODULE 4) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            
            <!-- Harvest Calculator (5 cols) -->
            <div class="lg:col-span-5 space-y-4">
              <div class="agri-card p-5 rounded-2xl space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>⚖️</span> Harvest Quantity & Selling Calculator
                  </h3>
                  <span class="text-[10px] text-emerald-800 font-bold">Smart Proceeds</span>
                </div>

                <div class="space-y-3 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Harvested Commodity</label>
                    <input type="text" id="calcCropName" value="Groundnut (நிலக்கடலை)" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900">
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Quantity (Quintals / 100 kg bags) *</label>
                    <input type="number" id="calcQuantity" value="35" min="1" step="1" 
                      oninput="window.MarketPriceComponent.calculateProceeds()"
                      class="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-slate-900">
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Mandi Modal Rate (₹/Quintal) *</label>
                    <input type="number" id="calcRate" value="7400" min="500" step="50" 
                      oninput="window.MarketPriceComponent.calculateProceeds()"
                      class="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-emerald-800">
                  </div>

                  <div id="calcResultsBox" class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                    <span class="text-[10px] uppercase font-bold text-emerald-900 block">Estimated Gross Mandi Value:</span>
                    <span class="text-2xl font-black text-emerald-800 block">₹2,59,000</span>
                    <span class="text-[10px] text-slate-600 block">Net after APMC cess & handling: ~₹2,55,115</span>
                  </div>

                  <button onclick="window.MarketPriceComponent.openListingModal()" class="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md transition-all flex items-center justify-center gap-1.5">
                    <span>📢</span>
                    <span>List This Produce for Sale</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Selling Options Comparison (7 cols) -->
            <div class="lg:col-span-7 space-y-4">
              <div class="agri-card p-5 rounded-2xl space-y-3.5">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🤝</span> Selling Channels Comparison
                  </h3>
                  <span class="text-[10px] text-slate-600 font-semibold">Pre-Harvest & Spot Channels</span>
                </div>

                <div class="space-y-2 text-xs">
                  <div class="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-start justify-between gap-3">
                    <div>
                      <strong class="font-bold text-emerald-950 block">1. Regulated Mandi (APMC / ஒழுங்குமுறை கூடம்)</strong>
                      <p class="text-slate-700 text-[11px] mt-0.5">Government-supervised electronic auction. Weighment guaranteed; payment released within 24 hours.</p>
                    </div>
                    <span class="text-xs font-black text-emerald-800 whitespace-nowrap">Benchmark</span>
                  </div>

                  <div class="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start justify-between gap-3">
                    <div>
                      <strong class="font-bold text-blue-950 block">2. Farmer Producer Organisation (FPO / உழவர் உற்பத்தியாளர் நிறுவனம்)</strong>
                      <p class="text-slate-700 text-[11px] mt-0.5">Collective aggregation and direct supply to edible oil mills. Typically offers <strong>+3% to 5% premium</strong> for uniform quality.</p>
                    </div>
                    <span class="text-xs font-black text-blue-800 whitespace-nowrap">+4% Premium</span>
                  </div>

                  <div class="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3">
                    <div>
                      <strong class="font-bold text-amber-950 block">3. Farmgate Local Trader / Broker</strong>
                      <p class="text-slate-700 text-[11px] mt-0.5">Immediate farm pickup with zero loading/transport cost, but offering ~4-7% discount below APMC modal rates.</p>
                    </div>
                    <span class="text-xs font-bold text-amber-900 whitespace-nowrap">-5% Discount</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-slate-700 font-medium">Need cross-state buyer negotiation?</span>
                  <button onclick="window.UzhavanApp.navigate('farmLingo')" class="font-black text-emerald-800 hover:underline flex items-center gap-1">
                    <span>Open FarmLingo Bilingual Chat →</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- MODAL: LIST CROP FOR SALE -->
        ${this.activeListingModal ? `
          <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4 text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-black text-slate-900">List Produce for Direct Buyers</h3>
                <button onclick="window.MarketPriceComponent.closeListingModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
              </div>

              <form onsubmit="window.MarketPriceComponent.handleListingSubmit(event)" class="space-y-3">
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">Crop & Variety *</label>
                  <input type="text" name="listCrop" required value="Groundnut TMV-7" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Quantity (Quintals) *</label>
                    <input type="number" name="listQty" required value="35" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold">
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Expected Rate (₹/Qtl) *</label>
                    <input type="number" name="listRate" required value="7500" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800">
                  </div>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">Farm Location *</label>
                  <input type="text" name="listLocation" required value="Vadipatti, Madurai District" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold">
                </div>

                <div class="pt-2 flex justify-end gap-2">
                  <button type="button" onclick="window.MarketPriceComponent.closeListingModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold">
                    Cancel
                  </button>
                  <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md">
                    Publish Listing & Match Buyers
                  </button>
                </div>
              </form>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  calculateProceeds() {
    const qty = parseFloat(document.getElementById('calcQuantity').value) || 0;
    const rate = parseFloat(document.getElementById('calcRate').value) || 0;
    const gross = qty * rate;
    const net = Math.round(gross * 0.985);
    const box = document.getElementById('calcResultsBox');
    if (box) {
      box.innerHTML = `
        <span class="text-[10px] uppercase font-bold text-emerald-900 block">Estimated Gross Mandi Value:</span>
        <span class="text-2xl font-black text-emerald-800 block">₹${gross.toLocaleString('en-IN')}</span>
        <span class="text-[10px] text-slate-600 block">Net after APMC cess & handling (~1.5%): ₹${net.toLocaleString('en-IN')}</span>
      `;
    }
  },

  openListingModal() {
    this.activeListingModal = true;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  closeListingModal() {
    this.activeListingModal = false;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleListingSubmit(e) {
    e.preventDefault();
    this.activeListingModal = false;
    window.UzhavanApp.showToast("Crop listed for sale! 2 buyers matched in Madurai & Kanpur. View in FarmLingo. 📢", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  updateFilter(type, value) {
    if (type === 'crop') this.selectedCrop = value;
    if (type === 'district') this.selectedDistrict = value;
    if (type === 'search') this.searchQuery = value;

    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.MarketPriceComponent = MarketPriceComponent;
