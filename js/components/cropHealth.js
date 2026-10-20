// Uzhavan Hub - Crop Health & AI Disease Diagnostic Scanner Component
// Module 2: AI Crop Doctor with photo upload validation, symptom checklist, and simulated prototype workflow

const CropHealthComponent = {
  selectedCrop: "Tomato",
  activeDiseaseId: "tomato-early-blight",
  isScanning: false,
  uploadedImageSrc: null,
  uploadFileName: null,
  uploadError: null,
  selectedSymptoms: ["Leaf Spots", "Yellowing"],
  symptomNotes: "",

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const diseases = window.UZHAVAN_DATA.SAMPLE_DISEASES || [];
    const currentDisease = diseases.find(d => d.id === this.activeDiseaseId) || diseases[0] || {
      id: "demo",
      crop: "Tomato",
      diseaseName: "Early Blight (Alternaria solani)",
      diseaseNameTa: "இலை கருகல் நோய்",
      confidence: "94.2%",
      symptomsEn: "Concentric dark brown rings on older lower leaves progressing upwards with yellow halos.",
      symptomsTa: "முதிர்ந்த இலைகளில் அடர் பழுப்பு நிற வளைய வடிவ புள்ளிகள் தோன்றி பின்னர் இலைகள் மஞ்சள் நிறமாக மாறும்.",
      organicRemedyEn: "Spray Trichoderma viride or Pseudomonas fluorescens @ 5g/litre. Apply 3% Neem oil emulsion every 10 days.",
      organicRemedyTa: "சூடோமோனாஸ் அல்லது டிரைக்கோடெர்மா 5 கிராம்/லிட்டர் நீரில் கலந்து தெளிக்கவும். 3% வேப்பெண்ணெய் கரைசல் தெளிக்கவும்.",
      chemicalControlEn: "If infection exceeds 15% leaf area, apply Mancozeb 75% WP @ 2g/litre under expert supervision.",
      chemicalControlTa: "தீவிர தாக்குதலுக்கு வேளாண் அலுவலர் ஆலோசனைப்படி மேன்கோசெப் 2 கிராம்/லிட்டர் தெளிக்கவும்."
    };

    const commonSymptoms = [
      { id: "Leaf Spots", en: "Brown / Dark Spots", ta: "பழுப்பு / கரும் புள்ளிகள்" },
      { id: "Yellowing", en: "Leaf Yellowing (Chlorosis)", ta: "இலை மஞ்சள் நிறமாதல்" },
      { id: "Wilting", en: "Wilting / Drooping Vines", ta: "இலை வாடல் / சாய்வு" },
      { id: "Leaf Curling", en: "Curling / Puckering", ta: "இலை சுருட்டுதல்" },
      { id: "Powdery Growth", en: "Powdery White Mildew", ta: "வெள்ளை மாவு போன்ற பூச்சு" },
      { id: "Stem Rot", en: "Stem Girdling / Collar Rot", ta: "தண்டு அழுகல்" }
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🐛</span> ${isTa ? "பயிர் நலம் & நோய் பரிசோதனை" : "AI Crop Doctor & Pathology Scanner"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "பயிர் நல பரிசோதனை (AI Crop Doctor)" : "AI Crop Doctor & Disease Diagnostic"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa 
                ? "இலையின் புகைப்படத்தை பதிவேற்றி அல்லது மாதிரி இலையை தேர்வு செய்து நோய் அறிகுறி பகுப்பாய்வு பெறுங்கள்." 
                : "Upload a leaf specimen photograph, enter observed field symptoms, and get organic/safe management advisories."
              }
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Simulated Prototype Flow
            </span>
          </div>
        </div>

        <!-- SIMULATED PROTOTYPE NOTICE BANNER (SECTION 4 CRITICAL REQUIREMENT) -->
        <div class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
          <span class="text-xl flex-shrink-0">⚠️</span>
          <div class="space-y-1">
            <strong class="font-bold text-amber-900 block text-sm">
              ${isTa ? "மாதிரி செயல்முறை அறிவிப்பு (Simulated Prototype Flow):" : "Simulated Prototype Engine Disclaimer:"}
            </strong>
            <p class="leading-relaxed">
              ${isTa
                ? "இந்த முன்மாதிரியில் நேரடி கிளவுட் விஷன் AI சர்வர் இணைக்கப்படவில்லை. நோய் அறிகுறிகள் மற்றும் மேலாண்மை ஆலோசனைகள் மாதிரி விவசாய தரவுத்தளத்தின் மூலம் செயல்முறைப்படுத்தப்படுகின்றன. கடுமையான நோய் தாக்குதலுக்கு அருகிலுள்ள வேளாண்மை அறிவியல் மையம் (KVK) அல்லது உதவி வேளாண்மை அலுவலரை நேரில் அணுகவும்."
                : "This prototype runs an educational simulation based on verified TNAU/ICAR crop pathology reference guides. No live cloud neural vision API is connected. Never spray hazardous unapproved chemicals. Always consult your local Krishi Vigyan Kendra (KVK) officer for confirmatory field diagnosis."
              }
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT: SPECIMEN UPLOAD & SYMPTOMS ENTRY (5 COLS) -->
          <div class="lg:col-span-5 space-y-5">
            
            <!-- Upload Box with strict client-side validation -->
            <div class="agri-card p-5 rounded-2xl space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <span>📸</span> ${isTa ? "1. இலை படம் பதிவேற்றவும்:" : "1. Upload Leaf Photograph:"}
                </h3>
                <span class="text-[10px] text-slate-700 font-semibold">Max 5MB (JPG, PNG, WEBP)</span>
              </div>

              <!-- Upload Drag/Click Zone -->
              <div>
                <label class="w-full py-5 px-4 rounded-xl border-2 border-dashed ${this.uploadError ? 'border-rose-400 bg-rose-50/50' : 'border-emerald-300 hover:border-emerald-600 bg-emerald-50/40'} cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all text-center">
                  <span class="text-3xl">📷</span>
                  <span class="text-xs font-bold text-emerald-950">
                    ${this.uploadFileName ? `Selected: ${this.uploadFileName}` : (isTa ? "கேமரா அல்லது கோப்பிலிருந்து தேர்ந்தெடுக்கவும்" : "Click to take photo or choose file")}
                  </span>
                  <span class="text-[10px] text-slate-700">JPEG, PNG, WEBP format supported • Max 5MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" onchange="window.CropHealthComponent.handleFileUpload(event)">
                </label>

                <!-- Validation Error Message if any -->
                ${this.uploadError ? `
                  <div class="mt-2 p-2.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2">
                    <span>❌</span>
                    <span>${this.uploadError}</span>
                  </div>
                ` : ''}
              </div>

              <!-- Sample Specimens Carousel / Quick Buttons -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[11px] font-bold uppercase text-slate-700">
                    ${isTa ? "அல்லது மாதிரி இலையைத் தேர்ந்தெடுக்கவும்:" : "Or select verified specimen:"}
                  </span>
                  <span class="text-[10px] text-emerald-800 font-bold">6 Reference Cases</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  ${diseases.map(d => `
                    <button onclick="window.CropHealthComponent.selectSample('${d.id}')" 
                      class="p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${d.id === this.activeDiseaseId && !this.uploadedImageSrc ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}">
                      <div class="truncate">${d.crop}</div>
                      <div class="text-[10px] font-normal text-slate-700 truncate">${d.diseaseName.split(' ')[0]}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Interactive Symptoms Checklist -->
              <div class="pt-2 border-t border-slate-100 space-y-2">
                <span class="text-[11px] font-bold uppercase text-slate-700 block">
                  ${isTa ? "2. கவனிக்கப்பட்ட அறிகுறிகள்:" : "2. Select Observed Symptoms:"}
                </span>
                <div class="grid grid-cols-2 gap-1.5 text-xs">
                  ${commonSymptoms.map(sym => `
                    <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 cursor-pointer">
                      <input type="checkbox" value="${sym.id}" 
                        ${this.selectedSymptoms.includes(sym.id) ? 'checked' : ''}
                        onchange="window.CropHealthComponent.toggleSymptom('${sym.id}')"
                        class="rounded text-emerald-700 focus:ring-emerald-500">
                      <span class="text-[11px] font-medium text-slate-800">${isTa ? sym.ta : sym.en}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- Scanner Viewport with Simulated Neural Beam -->
              <div class="scanner-container h-52 bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden border-2 border-slate-700">
                ${this.isScanning ? '<div class="scanner-beam"></div>' : ''}
                
                <div class="w-full h-full flex items-center justify-center p-4">
                  ${this.uploadedImageSrc ? `
                    <img src="${this.uploadedImageSrc}" alt="Uploaded Leaf" class="max-h-full max-w-full object-contain rounded-lg">
                  ` : `
                    <div class="text-center text-slate-400">
                      ${currentDisease.sampleImage || '<span class="text-6xl">🍃</span>'}
                    </div>
                  `}
                </div>

                <!-- Bounding Box / Neural Reticle Overlay -->
                <div class="absolute inset-5 border-2 border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div class="flex justify-between text-[9px] font-mono font-bold text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                    <span>PATHOLOGY_SCANNER</span>
                    <span>TISSUE_TARGET</span>
                  </div>
                  <div class="flex justify-between text-[9px] font-mono font-bold text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                    <span>STATUS: ${this.isScanning ? 'SEGMENTING...' : 'DIAGNOSED'}</span>
                    <span>CONF: ${currentDisease.confidence}</span>
                  </div>
                </div>
              </div>

              <!-- Scan Trigger Button -->
              <button onclick="window.CropHealthComponent.triggerScan()" 
                class="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider shadow-md transition-all flex items-center justify-center gap-2">
                <span>🔍</span>
                <span>${this.isScanning ? (isTa ? "பகுப்பாய்வு நடக்கிறது..." : "ANALYZING SPECIMEN...") : (isTa ? "AI நோய் கண்டறிதல் இயக்கு" : "RUN AI PATHOLOGY SCREENING")}</span>
              </button>

            </div>
          </div>

          <!-- RIGHT: DIAGNOSTIC REPORT & ADVISORY (7 COLS) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="agri-card p-6 md:p-8 rounded-2xl space-y-6">
              
              <!-- Result Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    PATHOLOGY SCREENING REPORT
                  </span>
                  <h2 class="text-2xl font-black text-slate-900 mt-1.5">
                    ${isTa ? currentDisease.diseaseNameTa : currentDisease.diseaseName}
                  </h2>
                  <span class="text-xs text-slate-700">Identified in <strong>${currentDisease.crop}</strong> field specimen</span>
                </div>

                <div class="text-left sm:text-right bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                  <span class="text-[10px] font-bold text-emerald-900 uppercase block">Model Confidence</span>
                  <span class="text-2xl font-black text-emerald-800">${currentDisease.confidence}</span>
                </div>
              </div>

              <!-- Symptoms Observed -->
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <span>🔬</span> ${isTa ? "கள அறிகுறிகள் & நோயியல் பண்புகள்:" : "Identified Pathological Symptoms:"}
                </h3>
                <p class="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  ${isTa ? currentDisease.symptomsTa : currentDisease.symptomsEn}
                </p>
              </div>

              <!-- Recommended Management Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Organic / Bio-control -->
                <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
                  <span class="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <span>🌿</span> ${isTa ? "இயற்கை / உயிரியல் தீர்வு (Organic):" : "Organic / Biological Control:"}
                  </span>
                  <p class="text-xs text-emerald-950 font-medium leading-relaxed">
                    ${isTa ? currentDisease.organicRemedyTa : currentDisease.organicRemedyEn}
                  </p>
                </div>

                <!-- Preventive Agronomy -->
                <div class="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-2">
                  <span class="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <span>🛡️</span> ${isTa ? "முன்னெச்சரிக்கை மேலாண்மை:" : "Preventive Field Management:"}
                  </span>
                  <p class="text-xs text-blue-950 font-medium leading-relaxed">
                    ${isTa ? currentDisease.chemicalControlTa : currentDisease.chemicalControlEn}
                  </p>
                </div>
              </div>

              <!-- WHEN PROFESSIONAL ASSISTANCE IS NEEDED (SECTION 4 CRITICAL REQUIREMENT) -->
              <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                <span class="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <span>🚨</span> ${isTa ? "எப்போது வேளாண் அதிகாரியை அணுக வேண்டும்?" : "When to Seek Professional Agricultural Assistance:"}
                </span>
                <ul class="text-xs text-rose-950 space-y-1 list-disc list-inside font-medium">
                  <li>Infection spreads to more than 15% of your standing crop within 48 hours.</li>
                  <li>Unusual stem blackening, vascular browning, or bacterial oozing occurs.</li>
                  <li>Insects or caterpillars show resistance to standard organic bio-pesticides.</li>
                  <li>Nearby farms report quarantine alerts (e.g., Fall Armyworm, Viral mosaic outbreaks).</li>
                </ul>
                <div class="pt-2 text-right">
                  <button onclick="window.UzhavanApp.navigate('veterinaryCare')" class="text-xs font-bold text-rose-800 hover:underline">
                    View Emergency Contacts & 1962 Helpline →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    `;
  },

  selectSample(diseaseId) {
    this.activeDiseaseId = diseaseId;
    this.uploadedImageSrc = null;
    this.uploadFileName = null;
    this.uploadError = null;
    this.triggerScan();
  },

  toggleSymptom(symId) {
    if (this.selectedSymptoms.includes(symId)) {
      this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symId);
    } else {
      this.selectedSymptoms.push(symId);
    }
  },

  triggerScan() {
    this.isScanning = true;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);

    setTimeout(() => {
      this.isScanning = false;
      const c = document.getElementById('viewContainer');
      if (c) this.render(c);
      window.UzhavanApp.showToast("Specimen Scan Complete! Pathology Match Found 🔬", "success");
    }, 1000);
  },

  handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    this.uploadError = null;

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.uploadError = "Invalid file type. Only JPG, PNG, and WEBP formats are accepted.";
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
      return;
    }

    // Validate File Size (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.uploadError = `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 5MB limit. Please upload a smaller image.`;
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
      return;
    }

    this.uploadFileName = file.name;

    // Read image as base64 preview
    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedImageSrc = event.target.result;
      window.UzhavanApp.showToast(`Uploaded "${file.name}" successfully. Analyzing tissue...`, "info");
      this.triggerScan();
    };
    reader.onerror = () => {
      this.uploadError = "Failed to read image file. Please try another image.";
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
    };
    reader.readAsDataURL(file);
  }
};

window.CropHealthComponent = CropHealthComponent;