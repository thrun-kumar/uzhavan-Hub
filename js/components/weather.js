// Uzhavan Hub - Weather & Farming Action Component

const WeatherComponent = {
  selectedDistrict: "Madurai",
  selectedCondition: "All",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;
    const allRecords = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.WEATHER_RECORDS) || [];

    const districts = [
      "Coimbatore", "Tiruppur", "Erode", "Salem", "Namakkal",
      "Thanjavur", "Madurai", "Dindigul", "Trichy", "Karur",
      "Dharmapuri", "Krishnagiri", "Villupuram", "Cuddalore", "Tirunelveli"
    ];

    const conditions = ["All", "Sunny", "Partly Cloudy", "Cloudy", "Rain", "Heavy Rain"];

    // Default selected district to profile district if not set
    if (!this.selectedDistrict && profile.location) {
      const match = districts.find(d => profile.location.includes(d));
      if (match) this.selectedDistrict = match;
    }

    // Filter records
    const districtRecords = allRecords.filter(r => r.district.toLowerCase() === this.selectedDistrict.toLowerCase());
    const displayRecords = districtRecords.filter(r => {
      if (this.selectedCondition === "All") return true;
      return r.weatherCondition.toLowerCase() === this.selectedCondition.toLowerCase();
    });

    const activeRecord = districtRecords[0] || allRecords[0] || {
      district: this.selectedDistrict,
      date: "2026-10-06",
      temperature: 31,
      humidity: 68,
      rainfall: 12.0,
      windSpeed: 14,
      weatherCondition: "Partly Cloudy",
      rainProbability: 60,
      farmingRisk: "Moderate",
      advisory: "Favorable for standard field maintenance; hold chemical sprays if rain clouds intensify."
    };

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🌦️</span> ${isTa ? "வேளாண் வானிலை & விவசாய ஆலோசனைகள்" : "Agro-Weather & Farming Action"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "வானிலை முன்னறிவிப்பு & பண்ணை எச்சரிக்கைகள்" : "Agro-Weather Forecast & Field Advisories"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "வானிலை மாற்றங்களை மட்டும் பார்க்காமல், அதற்கேற்ப உங்கள் பண்ணையில் செய்ய வேண்டிய முன்னெச்சரிக்கை நடவடிக்கைகள்." : "Translating real-time weather forecasts directly into actionable agronomic field advisories."}
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo Data – For Prototype Testing
            </span>
          </div>
        </div>

        <!-- DISTRICT & CONDITION FILTER BAR -->
        <div class="agri-card p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              📍 ${isTa ? "மாவட்டம் தேர்வு செய்க (15 மாவட்டங்கள்):" : "Select District (15 Tamil Nadu Districts):"}
            </label>
            <select id="weatherDistrictSelect" onchange="window.WeatherComponent.handleDistrictChange(this.value)"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${districts.map(d => `
                <option value="${d}" ${d.toLowerCase() === this.selectedDistrict.toLowerCase() ? 'selected' : ''}>${d} District</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              ⛅ ${isTa ? "வானிலை நிலை வடிகட்டி:" : "Weather Condition Filter:"}
            </label>
            <select id="weatherConditionSelect" onchange="window.WeatherComponent.handleConditionChange(this.value)"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${conditions.map(c => `
                <option value="${c}" ${c === this.selectedCondition ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- DYNAMIC WEATHER ALERT & ADVISORY BANNER -->
        <div class="bg-gradient-to-r ${activeRecord.farmingRisk === 'High' ? 'from-rose-600 to-amber-600' : activeRecord.farmingRisk === 'Moderate' ? 'from-amber-500 to-orange-500' : 'from-emerald-700 to-teal-800'} text-white p-6 md:p-7 rounded-2xl shadow-xl relative overflow-hidden">
          <div class="relative z-10 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${activeRecord.weatherCondition.includes('Rain') ? '🌧️' : activeRecord.weatherCondition.includes('Cloudy') ? '⛅' : '☀️'}</span>
                <span class="px-3 py-0.5 rounded-full bg-black/30 text-white text-xs font-black uppercase tracking-wider">
                  ${activeRecord.district} Agro-Advisory • Risk: ${activeRecord.farmingRisk}
                </span>
              </div>
              <span class="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                Rain Probability: ${activeRecord.rainProbability}%
              </span>
            </div>

            <div>
              <h2 class="text-2xl md:text-3xl font-black tracking-tight">
                ${activeRecord.district}: ${activeRecord.weatherCondition} (${activeRecord.temperature}°C)
              </h2>
              <p class="text-xs md:text-sm text-white/95 mt-1 max-w-3xl font-medium leading-relaxed">
                ${activeRecord.advisory}
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div class="bg-black/25 backdrop-blur-sm p-3 rounded-xl">
                <span class="text-[10px] uppercase text-white/80 block">Precipitation</span>
                <strong class="text-base font-bold">${activeRecord.rainfall} mm</strong>
              </div>
              <div class="bg-black/25 backdrop-blur-sm p-3 rounded-xl">
                <span class="text-[10px] uppercase text-white/80 block">Humidity</span>
                <strong class="text-base font-bold">${activeRecord.humidity}%</strong>
              </div>
              <div class="bg-black/25 backdrop-blur-sm p-3 rounded-xl">
                <span class="text-[10px] uppercase text-white/80 block">Wind Velocity</span>
                <strong class="text-base font-bold">${activeRecord.windSpeed} km/h</strong>
              </div>
              <div class="bg-black/25 backdrop-blur-sm p-3 rounded-xl">
                <span class="text-[10px] uppercase text-white/80 block">Risk Category</span>
                <strong class="text-base font-bold text-amber-200">${activeRecord.farmingRisk}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 7-DAY FORECAST FOR SELECTED DISTRICT -->
        <div class="agri-card p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-emerald-950">
                ${activeRecord.district} ${isTa ? "7-நாள் விரிவான வேளாண் வானிலை அட்டவணை" : "7-Day Detailed Agro-Weather Schedule"}
              </h3>
              <p class="text-xs text-slate-700">
                ${displayRecords.length} records available for this filter
              </p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
              Updated Hourly
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th class="py-3 px-3">Date & Day</th>
                  <th class="py-3 px-3">Condition</th>
                  <th class="py-3 px-3">Temperature</th>
                  <th class="py-3 px-3">Humidity</th>
                  <th class="py-3 px-3">Rainfall (mm)</th>
                  <th class="py-3 px-3">Wind Speed</th>
                  <th class="py-3 px-3">Rain Chance</th>
                  <th class="py-3 px-3">Farming Risk</th>
                  <th class="py-3 px-3">Agro Advisory</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
                ${displayRecords.map(r => `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <strong class="text-slate-900 block">${r.date}</strong>
                      <span class="text-[10px] text-slate-700 font-semibold">${r.dayName}</span>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 font-bold ${r.weatherCondition.includes('Rain') ? 'text-blue-700' : r.weatherCondition.includes('Cloud') ? 'text-slate-700' : 'text-amber-600'}">
                        <span>${r.weatherCondition.includes('Heavy Rain') ? '⛈️' : r.weatherCondition.includes('Rain') ? '🌧️' : r.weatherCondition.includes('Cloud') ? '⛅' : '☀️'}</span>
                        <span>${r.weatherCondition}</span>
                      </span>
                    </td>
                    <td class="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      ${r.temperature}°C <span class="text-[10px] text-slate-700 block font-normal">${r.tempRange || ''}</span>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap text-sky-800 font-bold">
                      ${r.humidity}%
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap font-bold ${r.rainfall > 10 ? 'text-blue-700' : 'text-slate-700'}">
                      ${r.rainfall} mm
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap text-slate-700">
                      ${r.windSpeed} km/h
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap font-bold ${r.rainProbability >= 70 ? 'text-blue-800' : 'text-slate-700'}">
                      ${r.rainProbability}%
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${r.farmingRisk === 'Low' ? 'bg-emerald-100 text-emerald-800' : r.farmingRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                        ${r.farmingRisk}
                      </span>
                    </td>
                    <td class="py-3.5 px-3 text-[11px] text-slate-700 min-w-[200px]">
                      ${r.advisory}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  handleDistrictChange(district) {
    this.selectedDistrict = district;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
    window.UzhavanApp.showToast(`Switched weather forecast to ${district} District! 🌦️`, "info");
  },

  handleConditionChange(cond) {
    this.selectedCondition = cond;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.WeatherComponent = WeatherComponent;
