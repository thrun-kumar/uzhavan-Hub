// Uzhavan Hub - Farming Action Calendar ("My Farming Plan")

const ActionPlanComponent = {
  selectedCropId: "groundnut",
  completedTasks: new Set([1, 2]),

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const crops = window.UZHAVAN_DATA.CROPS_DATA || [];
    const crop = crops.find(c => c.id === this.selectedCropId) || crops[0] || {
      id: "groundnut",
      name: "Groundnut",
      nameTa: "நிலக்கடலை",
      icon: "🥜",
      durationDays: 105
    };

    const defaultWeeklyPlan = [
      { week: 1, titleEn: "Soil Preparation & Basal Manure", titleTa: "நிலம் தயாரித்தல் & இயற்கை உரம்", phase: "Preparation", icon: "🚜", descEn: `Deep ploughing followed by incorporating 5 tons FYM/acre for ${crop.name}.`, descTa: `${crop.nameTa || crop.name} பயிருக்கான கோடை உழவு மற்றும் ஏக்கருக்கு 5 டன் மக்கிய தொழுவுரம் இடுதல்.` },
      { week: 2, titleEn: "Seed Treatment & Sowing", titleTa: "விதை நேர்த்தி & விதைப்பு", phase: "Sowing", icon: "🌱", descEn: "Treat certified seeds with bio-inoculant Trichoderma viride and sow at proper spacing.", descTa: "சான்றளிக்கப்பட்ட விதைகளை ட்ரைக்கோடெர்மா கொண்டு விதை நேர்த்தி செய்து விதைக்கவும்." },
      { week: 4, titleEn: "First Irrigation & Weeding", titleTa: "முதல் பாசனம் & களையெடுத்தல்", phase: "Vegetative", icon: "💧", descEn: "Carry out hand weeding; regulate irrigation moisture.", descTa: "கைக்களை எடுத்தல் மற்றும் பாசன ஈரப்பதத்தை சீராக்குதல்." },
      { week: 6, titleEn: "Top Dressing & Nutrient Spray", titleTa: "மேலுரம் & நுண்ணூட்ட தெளிப்பு", phase: "Nutrient", icon: "🧪", descEn: "Apply secondary nitrogen and potassium fertilizers calibrated for crop stage.", descTa: "பயிரின் வளர்ச்சி நிலைக்கு ஏற்ப இரண்டாம் கட்ட உரமிடுதல்." },
      { week: 9, titleEn: "Pest & Disease Scouting", titleTa: "பூச்சி & நோய் கண்காணிப்பு", phase: "Protection", icon: "🐛", descEn: "Scout underside of leaves for pests; spray neem extract as preventive.", descTa: "பூச்சி தாக்குதல் குறித்து இலைகளை ஆய்வு செய்து இயற்கை பூச்சி விரட்டி தெளித்தல்." },
      { week: 12, titleEn: "Maturity Check & Harvesting", titleTa: "அறுவடை & களம் சேகரிப்பு", phase: "Harvest", icon: "🌾", descEn: "Assess field maturity indicators; conduct harvest and transport to threshing yard.", descTa: "முதிர்ச்சி அறிகுறிகளை உறுதி செய்து அறுவடை செய்தல்." }
    ];

    const weeklyPlan = (Array.isArray(crop.weeklyPlan) && crop.weeklyPlan.length) ? crop.weeklyPlan : defaultWeeklyPlan;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>📅</span> ${isTa ? "பயிர் சாகுபடி காலண்டர்" : "Cultivation Timeline"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "என் விவசாய திட்டம் (My Farming Plan)" : "My Farming Plan – Phased Action Calendar"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "விதைப்பு முதல் அறுவடை வரை வாரம் வாரியாக செய்ய வேண்டிய பணிகள் மற்றும் நினைவூட்டல்கள்." : "Week-by-week field protocol covering land prep, basal inputs, weeding, and harvest indicators."}
            </p>
          </div>

          <!-- Crop Switcher -->
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-700 uppercase">${isTa ? "பயிர்:" : "Active Crop:"}</label>
            <select onchange="window.ActionPlanComponent.changeCrop(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none">
              ${crops.map(c => `
                <option value="${c.id}" ${c.id === crop.id ? 'selected' : ''}>${c.name} (${c.nameTa})</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- TIMELINE CONTAINER -->
        <div class="agri-card p-6 md:p-8 rounded-2xl">
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-3xl">${crop.icon}</span>
              <div>
                <h2 class="text-lg font-bold text-emerald-950">${crop.name} (${crop.nameTa}) Cultivation Plan</h2>
                <span class="text-xs text-slate-700">${crop.durationDays} Days Lifecycle • ${weeklyPlan.length} Key Milestones</span>
              </div>
            </div>

            <button onclick="window.UzhavanApp.showToast('All weekly task reminders scheduled to SMS & WhatsApp! 📲', 'success')" class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
              <span>🔔</span>
              <span>${isTa ? "அனைத்து நினைவூட்டல்களையும் அமை" : "Enable All Reminders"}</span>
            </button>
          </div>

          <!-- WEEKLY ACTIVITIES LIST -->
          <div class="relative pl-6 md:pl-10 space-y-6 before:content-[''] before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
            ${weeklyPlan.map((act) => {
              const isDone = this.completedTasks.has(act.week);
              return `
                <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${isDone ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}">
                  
                  <!-- Timeline Node Dot -->
                  <div class="absolute -left-6 md:-left-10 top-5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isDone ? 'bg-emerald-700' : 'bg-slate-400'} ring-4 ring-white">
                    ${isDone ? '✓' : act.week}
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'}">
                        Week ${act.week} • ${act.phase}
                      </span>
                      <span class="text-base">${act.icon}</span>
                    </div>
                    <h3 class="text-base font-extrabold text-slate-900">
                      ${isTa ? act.titleTa : act.titleEn}
                    </h3>
                    <p class="text-xs text-slate-700 max-w-2xl leading-relaxed">
                      ${isTa && act.descTa ? act.descTa : act.descEn}
                    </p>
                  </div>

                  <!-- Actions / Toggles -->
                  <div class="flex items-center gap-2 self-start md:self-auto">
                    <button onclick="window.ActionPlanComponent.toggleTask(${act.week})" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDone ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                      ${isDone ? (isTa ? '✓ முடிந்தது' : '✓ Completed') : (isTa ? 'முடிந்ததாகக் குறி' : 'Mark Done')}
                    </button>
                    <button onclick="window.UzhavanApp.showToast('Reminder set for Week ${act.week}: ${act.titleEn}! ⏰', 'info')" class="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200" title="Set Reminder">
                      🔔
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>

        </div>

      </div>
    `;
  },

  changeCrop(cropId) {
    this.selectedCropId = cropId;
    window.ActionPlanComponent.render(document.getElementById('viewContainer'));
  },

  toggleTask(week) {
    if (this.completedTasks.has(week)) {
      this.completedTasks.delete(week);
      window.UzhavanApp.showToast(`Task for Week ${week} marked as pending`, 'info');
    } else {
      this.completedTasks.add(week);
      window.UzhavanApp.showToast(`Week ${week} task completed! Well done! 🌱`, 'success');
    }
    window.ActionPlanComponent.render(document.getElementById('viewContainer'));
  }
};

window.ActionPlanComponent = ActionPlanComponent;
