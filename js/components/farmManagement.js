// Uzhavan Hub - Farm Management & Field Calendar Component
// Module 10: Farmer profile persistence, calendar tasks, crop history, pre-filling AI Decision Engine

const FarmManagementComponent = {
  isEditingProfile: false,
  tasks: [],

  initTasks() {
    try {
      const saved = localStorage.getItem('uzhavan_farm_tasks');
      if (saved) {
        this.tasks = JSON.parse(saved);
      } else {
        this.tasks = [
          { id: "TSK-1", title: "Basal Fertilizer Application (DAP + Gypsum)", crop: "Groundnut", dueDate: "Tomorrow", completed: true },
          { id: "TSK-2", title: "First Mechanical Weeding / Intercultivation", crop: "Groundnut", dueDate: "In 4 days", completed: false },
          { id: "TSK-3", title: "Pegging stage soil earthing up & Gypsum 100kg", crop: "Groundnut", dueDate: "In 18 days", completed: false },
          { id: "TSK-4", title: "Pre-harvest pod sampling & irrigation withholding", crop: "Groundnut", dueDate: "In 65 days", completed: false }
        ];
        this.saveTasks();
      }
    } catch (e) {
      console.error("Tasks error", e);
    }
  },

  saveTasks() {
    try {
      localStorage.setItem('uzhavan_farm_tasks', JSON.stringify(this.tasks));
    } catch (e) {
      console.error("Tasks save error", e);
    }
  },

  render(container) {
    if (this.tasks.length === 0) this.initTasks();
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile || {
      name: "Murugan",
      nameTa: "முருகன்",
      location: "Madurai District",
      landArea: 3.0,
      soilType: "Red Soil",
      waterSource: "Borewell",
      budget: 60000,
      currentCrop: "Groundnut",
      previousCrop: "Paddy"
    };

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>📋</span> ${isTa ? "பண்ணை மேலாண்மை & காலண்டர்" : "Farm Profile & Operational Calendar"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "பண்ணை மேலாண்மை (Farm Management)" : "Farm Profile & Field Calendar"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa 
                ? "உங்கள் பண்ணை விவரங்களை நிர்வகியுங்கள்; விதைப்பு முதல் அறுவடை வரையிலான பணிகளை அட்டவணைப்படுத்துங்கள்." 
                : "Manage your farm holdings, field calendar tasks, and automatically prefill the AI Farming Decision Engine."
              }
            </p>
          </div>

          <!-- Quick Action: Prefill Decision Engine -->
          <button onclick="window.FarmManagementComponent.applyToDecisionEngine()" class="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto">
            <span>🤖</span>
            <span>${isTa ? "AI முடிவு எஞ்சினுக்கு அனுப்புக" : "Sync Profile to AI Decision Engine"}</span>
          </button>
        </div>

        <!-- PRIVACY PRACTICE DISCLAIMER -->
        <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5 shadow-sm">
          <span class="text-base flex-shrink-0">🔒</span>
          <div>
            <strong class="font-bold text-emerald-900">${isTa ? "தனியுரிமை & தரவு சேமிப்பு:" : "Sensible Privacy Practices:"}</strong>
            <span class="block mt-0.5">${isTa ? "உங்கள் பண்ணை மற்றும் தனிப்பட்ட தகவல்கள் உலாவியின் உள் சேமிப்பகத்தில் மட்டுமே சேமிக்கப்படுகின்றன. வெளிப்புற தரவுத்தளங்களுக்கு பகிரப்படாது." : "All farmer profile parameters and operational calendar schedules are persisted locally in your browser. No private personal data is exposed or transmitted to external advertising networks."}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT: FARMER PROFILE EDITOR CARD (5 COLS) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="agri-card p-6 rounded-2xl space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-900 shadow-inner">
                    👨‍🌾
                  </div>
                  <div>
                    <h3 class="font-extrabold text-slate-900 text-base">${profile.name}</h3>
                    <span class="text-xs text-slate-700">📍 ${profile.location}</span>
                  </div>
                </div>

                <button onclick="window.FarmManagementComponent.toggleEditProfile()" class="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700">
                  ${this.isEditingProfile ? (isTa ? "மூடு" : "Close") : (isTa ? "திருத்து" : "Edit Profile")}
                </button>
              </div>

              ${this.isEditingProfile ? `
                <!-- EDIT PROFILE FORM -->
                <form onsubmit="window.FarmManagementComponent.handleSaveProfile(event)" class="space-y-3 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Farmer Name *</label>
                    <input type="text" name="farmerName" required value="${profile.name}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">District / Location *</label>
                    <input type="text" name="location" required value="${profile.location}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Land Area (Acres) *</label>
                      <input type="number" step="0.1" min="0.5" name="landArea" required value="${profile.landArea}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Farming Budget (₹) *</label>
                      <input type="number" step="1000" min="5000" name="budget" required value="${profile.budget}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Soil Type *</label>
                      <select name="soilType" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                        <option value="Red Soil" ${profile.soilType === 'Red Soil' ? 'selected' : ''}>Red Soil</option>
                        <option value="Black Soil" ${profile.soilType === 'Black Soil' ? 'selected' : ''}>Black Soil</option>
                        <option value="Alluvial Soil" ${profile.soilType === 'Alluvial Soil' ? 'selected' : ''}>Alluvial Soil</option>
                        <option value="Clay Soil" ${profile.soilType === 'Clay Soil' ? 'selected' : ''}>Clay Soil</option>
                        <option value="Sandy Soil" ${profile.soilType === 'Sandy Soil' ? 'selected' : ''}>Sandy Soil</option>
                      </select>
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Water Source *</label>
                      <select name="waterSource" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                        <option value="Borewell" ${profile.waterSource === 'Borewell' ? 'selected' : ''}>Borewell</option>
                        <option value="Canal" ${profile.waterSource === 'Canal' ? 'selected' : ''}>Canal</option>
                        <option value="Well" ${profile.waterSource === 'Well' ? 'selected' : ''}>Open Well</option>
                        <option value="Rain-fed" ${profile.waterSource === 'Rain-fed' ? 'selected' : ''}>Rain-fed</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Current Standing Crop</label>
                      <input type="text" name="currentCrop" value="${profile.currentCrop || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold">
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">Previous Season Crop</label>
                      <input type="text" name="previousCrop" value="${profile.previousCrop || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold">
                    </div>
                  </div>

                  <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md mt-2">
                    Save Profile Updates
                  </button>
                </form>
              ` : `
                <!-- VIEW PROFILE DETAILS -->
                <div class="space-y-2.5 text-xs">
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Holding Size:</span>
                    <strong class="text-slate-900 font-black">${profile.landArea} Acres</strong>
                  </div>
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Dominant Soil Type:</span>
                    <strong class="text-emerald-900 font-bold">${profile.soilType}</strong>
                  </div>
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Primary Irrigation:</span>
                    <strong class="text-slate-900 font-bold">${profile.waterSource}</strong>
                  </div>
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Operating Budget:</span>
                    <strong class="text-slate-900 font-black">₹${profile.budget ? profile.budget.toLocaleString('en-IN') : '60,000'}</strong>
                  </div>
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Current Crop:</span>
                    <strong class="text-emerald-800 font-bold">${profile.currentCrop || 'None'}</strong>
                  </div>
                  <div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="text-slate-700 font-medium">Previous Crop:</span>
                    <strong class="text-slate-900 font-medium">${profile.previousCrop || 'Paddy'}</strong>
                  </div>
                </div>
              `}

              <!-- Crop History Log -->
              <div class="pt-4 border-t border-slate-100 space-y-2">
                <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider">
                  ${isTa ? "முந்தைய பயிர் வரலாறு (Past Outcomes):" : "Past Seasons Yield & Revenue History:"}
                </h4>
                <div class="space-y-1.5 text-[11px]">
                  <div class="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 flex justify-between">
                    <div>
                      <strong class="text-slate-900 block">Kharif 2025: Groundnut (3.0 ac)</strong>
                      <span class="text-slate-700">Yield: 3,450 kg • Clean harvest</span>
                    </div>
                    <span class="font-extrabold text-emerald-800 self-center">₹2,41,500</span>
                  </div>
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                    <div>
                      <strong class="text-slate-900 block">Samba 2024: Paddy CR-1009 (2.5 ac)</strong>
                      <span class="text-slate-700">Yield: 6,100 kg • Mill direct</span>
                    </div>
                    <span class="font-bold text-slate-800 self-center">₹1,34,200</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- RIGHT: FIELD CALENDAR & TASK REMINDERS (7 COLS) -->
          <div class="lg:col-span-7 space-y-5">
            <div class="agri-card p-6 rounded-2xl space-y-5">
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 class="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>📅</span> ${isTa ? "பண்ணை பணிகளின் காலண்டர்" : "Field Calendar & Scheduled Tasks"}
                  </h3>
                  <span class="text-xs text-slate-700">Track agronomic timings from sowing to harvest</span>
                </div>

                <span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                  ${this.tasks.filter(t => !t.completed).length} Pending Tasks
                </span>
              </div>

              <!-- Add New Task Form -->
              <form onsubmit="window.FarmManagementComponent.handleAddTask(event)" class="flex gap-2 text-xs">
                <input type="text" name="taskTitle" required placeholder="Add new task (e.g. Schedule drip fertigation on Monday)..." class="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
                <input type="text" name="taskDue" placeholder="Due date / days" class="w-32 px-3 py-2 rounded-xl border border-slate-300 font-medium">
                <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs whitespace-nowrap">
                  + Add
                </button>
              </form>

              <!-- Task List -->
              <div class="space-y-2.5">
                ${this.tasks.map(t => `
                  <div class="p-3.5 rounded-xl border ${t.completed ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-emerald-200 bg-emerald-50/30'} flex items-center justify-between gap-3 text-xs transition-all">
                    <div class="flex items-center gap-3">
                      <input type="checkbox" ${t.completed ? 'checked' : ''} 
                        onchange="window.FarmManagementComponent.toggleTask('${t.id}')"
                        class="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer">
                      <div>
                        <span class="font-bold ${t.completed ? 'line-through text-slate-700' : 'text-slate-900'} block">
                          ${t.title}
                        </span>
                        <div class="flex items-center gap-2 mt-0.5 text-[10px] text-slate-700">
                          <span class="font-semibold text-emerald-800">🌱 ${t.crop}</span>
                          <span>•</span>
                          <span>🕒 ${t.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <button onclick="window.FarmManagementComponent.deleteTask('${t.id}')" class="text-slate-400 hover:text-rose-600 font-bold p-1">
                      ✕
                    </button>
                  </div>
                `).join('')}
              </div>

              <!-- Weekly Action Plan Link -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="text-slate-700">Need a comprehensive 12-week schedule?</span>
                <button onclick="window.UzhavanApp.navigate('actionPlan')" class="font-bold text-emerald-800 hover:underline">
                  Open 12-Week Farming Action Plan →
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    `;
  },

  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleSaveProfile(e) {
    e.preventDefault();
    const form = e.target;
    const updated = {
      name: form.farmerName.value,
      location: form.location.value,
      landArea: parseFloat(form.landArea.value) || 2.5,
      budget: parseFloat(form.budget.value) || 50000,
      soilType: form.soilType.value,
      waterSource: form.waterSource.value,
      currentCrop: form.currentCrop.value,
      previousCrop: form.previousCrop.value
    };

    window.UzhavanApp.saveProfile(updated);
    this.isEditingProfile = false;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  applyToDecisionEngine() {
    const profile = window.UzhavanApp.userProfile;
    window.UzhavanApp.navigate('decisionEngine', {
      selectedCrop: profile.currentCrop ? profile.currentCrop.toLowerCase() : null
    });
    window.UzhavanApp.showToast("Profile applied! AI Farming Decision Engine calibrated. 🌾", "success");
  },

  handleAddTask(e) {
    e.preventDefault();
    const form = e.target;
    const profile = window.UzhavanApp.userProfile || { currentCrop: "Farm" };
    const newTask = {
      id: "TSK-" + Math.floor(100 + Math.random() * 900),
      title: form.taskTitle.value,
      crop: profile.currentCrop || "Standing Crop",
      dueDate: form.taskDue.value || "Soon",
      completed: false
    };

    this.tasks.push(newTask);
    this.saveTasks();
    form.reset();
    window.UzhavanApp.showToast("Task added to calendar! 📅", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  toggleTask(taskId) {
    const t = this.tasks.find(item => item.id === taskId);
    if (t) {
      t.completed = !t.completed;
      this.saveTasks();
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
    }
  },

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.FarmManagementComponent = FarmManagementComponent;
// Also alias to ProfileComponent for backwards compatibility
window.ProfileComponent = FarmManagementComponent;