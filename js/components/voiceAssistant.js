// Uzhavan Hub - "Uzhavan AI" Bilingual Voice Assistant Component

const VoiceAssistantComponent = {
  isListening: false,
  isSpeaking: false,
  recognition: null,
  chatHistory: [
    {
      sender: "ai",
      textEn: "Vanakkam! I am Uzhavan AI, your digital farming assistant. You can speak or type in Tamil or English. How can I help with your crops, weather, fertilizers, market prices, labour, machinery, veterinary care, or loan schemes today?",
      textTa: "வணக்கம்! நான் உழவன் AI. உங்கள் விவசாய சந்தேகங்களை குரல் மூலமாகவோ அல்லது தட்டச்சு செய்தோ கேட்கலாம். பயிர் பரிந்துரை, வானிலை, உரம், சந்தை விலை, வாடகை ஆட்கள், டிராக்டர், கால்நடை மருத்துவம் அல்லது அரசு கடன்கள் குறித்து கேட்கலாம்."
    }
  ],

  initSpeech() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech recognition not supported in this browser environment");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      window.UzhavanApp.showToast("Listening... Please speak into microphone 🎙️", "info");
      this.updateUI();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      this.handleUserInput(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech error", event);
      this.isListening = false;
      window.UzhavanApp.showToast("Voice not captured clearly. Please try again or type below.", "warning");
      this.updateUI();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateUI();
    };
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile;

    if (!this.recognition) {
      this.initSpeech();
    }

    const sampleQuestions = isTa ? [
      "மணல் பாங்கான நிலத்திற்கு எந்த பயிர் ஏற்றது?",
      "டிராக்டர் வாடகைக்கு கிடைக்குமா?",
      "அறுவடைக்கு ஆட்கள் வேண்டும்",
      "இன்றைய சந்தை விலையை எங்கே பார்க்கலாம்?",
      "என் மாட்டுக்கு உடம்பு சரியில்லை",
      "நிலக்கடலைக்கு எந்த உரம் ஏற்றது?",
      "குறைந்த மழைப்பொழிவிற்கு எந்த பயிர் ஏற்றது?",
      "என்னென்ன விவசாய கடன் திட்டங்கள் உள்ளன?"
    ] : [
      "Which crop is suitable for sandy soil?",
      "I need a tractor. Where can I rent one?",
      "I need workers for harvesting.",
      "Where can I check today's market price?",
      "My cow is sick. Where can I find a veterinary service?",
      "What fertilizer is suitable for groundnut?",
      "Which crop is suitable for this rainfall?",
      "What agricultural loan schemes are available?"
    ];

    container.innerHTML = `
      <div class="space-y-6 max-w-4xl mx-auto pb-10">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🎙️</span> ${isTa ? "குரல் & உரை உதவியாளர்" : "Bilingual Smart Assistant"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950 flex items-center gap-2">
              <span>🤖</span> Uzhavan AI (உழவன் AI)
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa ? "தமிழ் மற்றும் ஆங்கிலத்தில் இயங்கும் AI விவசாய ஆலோசகர். 30+ மாதிரி கேள்விகளுக்கான உடனடி பதில்கள்." : "AI agricultural companion supporting English and Tamil queries across 9 core farming domains."}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo Data – For Prototype Testing
            </span>
          </div>
        </div>

        <!-- QUICK QUESTION CHIPS (SECTION 9 SPECIFICATIONS) -->
        <div class="agri-card p-4 rounded-2xl bg-white space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              ${isTa ? "மாதிரி கேள்விகள் (கிளிக் செய்து உடனடியாக கேட்கலாம்):" : "Sample Questions (Click to Ask Instantly):"}
            </span>
            <span class="text-[11px] text-emerald-800 font-semibold">
              32 Bilingual Patterns
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${sampleQuestions.map(q => `
              <button onclick="window.VoiceAssistantComponent.handleUserInput('${q}')" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-200 transition-all hover:scale-105 text-left">
                💬 "${q}"
              </button>
            `).join('')}
          </div>
        </div>

        <!-- CHAT CONVERSATION VIEWPORT -->
        <div class="agri-card rounded-2xl overflow-hidden flex flex-col h-[480px] bg-slate-50/60">
          
          <!-- Message history -->
          <div id="chatMessages" class="flex-1 p-5 overflow-y-auto space-y-4">
            ${this.chatHistory.map(msg => `
              <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5">
                ${msg.sender === 'ai' ? `
                  <div class="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🤖
                  </div>
                ` : ''}

                <div class="max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-emerald-800 text-white rounded-br-none' : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'}">
                  <div>${isTa ? (msg.textTa || msg.textEn) : (msg.textEn || msg.textTa)}</div>
                  ${msg.actionUrl ? `
                    <div class="mt-2.5 pt-2 border-t border-slate-100">
                      <button onclick="window.VoiceAssistantComponent.handleActionNav('${msg.actionUrl}')" class="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold">
                        Open Related Module →
                      </button>
                    </div>
                  ` : ''}
                </div>

                ${msg.sender === 'user' ? `
                  <div class="w-8 h-8 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    👨‍🌾
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- INPUT FORM & MIC BAR -->
          <div class="p-4 bg-white border-t border-slate-200">
            <form onsubmit="window.VoiceAssistantComponent.handleSubmit(event)" class="flex items-center gap-2">
              
              <!-- Microphone Button -->
              <button type="button" onclick="window.VoiceAssistantComponent.toggleSpeech()" class="p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${this.isListening ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'}" title="${isTa ? 'குரல் மூலம் பேசுங்கள்' : 'Speak into microphone'}">
                <span class="text-lg">🎙️</span>
              </button>

              <!-- Text Input -->
              <input type="text" id="assistantInput" placeholder="${isTa ? 'உங்கள் விவசாய கேள்வியை கேளுங்கள் (தமிழ் அல்லது ஆங்கிலம்)...' : 'Ask your farming question in English or Tamil...'}" 
                class="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs md:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none">

              <!-- Send Button -->
              <button type="submit" class="py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-1.5">
                <span>கேட்க</span>
                <span>➤</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    `;
  },

  handleActionNav(url) {
    if (url.includes('decision-engine')) window.UzhavanApp.navigate('decisionEngine');
    else if (url.includes('machinery-rental')) window.UzhavanApp.navigate('machineryRental');
    else if (url.includes('farm-labour')) window.UzhavanApp.navigate('farmLabour');
    else if (url.includes('market-prices') || url.includes('market')) window.UzhavanApp.navigate('marketPrice');
    else if (url.includes('veterinary-care') || url.includes('veterinary')) window.UzhavanApp.navigate('veterinaryCare');
    else if (url.includes('fertilizer')) window.UzhavanApp.navigate('fertilizer');
    else if (url.includes('weather')) window.UzhavanApp.navigate('weather');
    else if (url.includes('schemes') || url.includes('agri-loans')) window.UzhavanApp.navigate('schemes');
    else if (url.includes('crop-health')) window.UzhavanApp.navigate('cropHealth');
    else window.UzhavanApp.navigate('dashboard');
  },

  toggleSpeech() {
    if (!this.recognition) {
      this.initSpeech();
      if (!this.recognition) {
        window.UzhavanApp.showToast("Speech recognition not supported in this browser.", "warning");
        return;
      }
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateUI();
    } else {
      const isTa = window.UzhavanApp.currentLang === 'ta';
      this.recognition.lang = isTa ? 'ta-IN' : 'en-IN';
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Speech start error:", e);
      }
    }
  },

  handleSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('assistantInput');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    this.handleUserInput(text);
  },

  handleUserInput(text) {
    // Append user message
    this.chatHistory.push({
      sender: "user",
      textEn: text,
      textTa: text
    });

    this.updateUI();

    // Process intelligent answer
    setTimeout(() => {
      const response = this.generateAIResponse(text);
      this.chatHistory.push({
        sender: "ai",
        textEn: response.en,
        textTa: response.ta,
        actionUrl: response.actionUrl
      });
      this.updateUI();

      // Read aloud using Text-to-Speech
      this.speakResponse(window.UzhavanApp.currentLang === 'ta' ? response.ta : response.en);
    }, 400);
  },

  generateAIResponse(query) {
    const q = query.toLowerCase().trim();
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const faqs = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.VOICE_FAQ) || [];

    // 1. Direct Pattern Match from 32 Voice FAQ Records
    for (const faq of faqs) {
      // Check English patterns
      if (faq.queryPatternsEn && faq.queryPatternsEn.some(p => q.includes(p.toLowerCase()) || p.toLowerCase().includes(q))) {
        return { en: faq.answerEn, ta: faq.answerTa, actionUrl: faq.actionUrl };
      }
      // Check Tamil patterns
      if (faq.queryPatternsTa && faq.queryPatternsTa.some(p => q.includes(p.toLowerCase()) || p.toLowerCase().includes(q))) {
        return { en: faq.answerEn, ta: faq.answerTa, actionUrl: faq.actionUrl };
      }
    }

    // 2. Keyword-based Semantic Fallback Matching
    if (q.includes("sandy") || q.includes("மணல்")) {
      const f = faqs.find(x => x.id === "faq-sandy-soil");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("tractor") || q.includes("டிராக்டர்") || (q.includes("rent") && q.includes("one"))) {
      const f = faqs.find(x => x.id === "faq-rent-tractor");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("harvest") || q.includes("அறுவடை") || q.includes("workers") || q.includes("ஆட்கள்")) {
      const f = faqs.find(x => x.id === "faq-harvesting-workers");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("mandi") || q.includes("market") || q.includes("சந்தை") || q.includes("விலை") || q.includes("price")) {
      const f = faqs.find(x => x.id === "faq-market-price");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("cow") || q.includes("sick") || q.includes("மாடு") || q.includes("vet") || q.includes("மருத்துவமனை")) {
      const f = faqs.find(x => x.id === "faq-cow-sick");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("groundnut") && (q.includes("fertilizer") || q.includes("உரம்") || q.includes("gypsum") || q.includes("ஜிப்சம்"))) {
      const f = faqs.find(x => x.id === "faq-groundnut-fertilizer");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("rain") || q.includes("மழை") || q.includes("drought") || q.includes("மானாவாரி")) {
      const f = faqs.find(x => x.id === "faq-rainfall-crop");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("loan") || q.includes("கடன்") || q.includes("kcc") || q.includes("credit")) {
      const f = faqs.find(x => x.id === "faq-agri-loan");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    if (q.includes("scheme") || q.includes("திட்டம்") || q.includes("subsidy") || q.includes("மானியம்")) {
      const f = faqs.find(x => x.id === "faq-solar-pump-subsidy" || x.category === "Government schemes");
      if (f) return { en: f.answerEn, ta: f.answerTa, actionUrl: f.actionUrl };
    }

    // Default intelligent response
    const profile = window.UzhavanApp.userProfile;
    return {
      en: `I noted your question about "${query}". In ${profile.location}, I can help you with crop suitability, agro-weather advisories, fertilizer recommendations, hiring workers, tractor rental, veterinary hospitals, or crop loan schemes. What specific topic would you like?`,
      ta: `"${query}" பற்றிய உங்கள் கேள்விக்கு நன்றி. ${profile.location} பகுதியில் பயிர் தேர்வு, வானிலை எச்சரிக்கை, உர அளவு, விவசாய ஆட்கள் வாடகை, டிராக்டர் வாடகை, கால்நடை மருத்துவம் அல்லது பயிர்க்கடன் பற்றி உதவ முடியும். எதை அறிய விரும்புகிறீர்கள்?`
    };
  },

  speakResponse(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = window.UzhavanApp.currentLang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  },

  updateUI() {
    window.VoiceAssistantComponent.render(document.getElementById('viewContainer'));
    // auto-scroll
    setTimeout(() => {
      const chat = document.getElementById('chatMessages');
      if (chat) chat.scrollTop = chat.scrollHeight;
    }, 100);
  }
};

window.VoiceAssistantComponent = VoiceAssistantComponent;
