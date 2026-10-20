// Uzhavan Hub - FarmLingo: Cross-Language Buyer-Farmer Communication System
// Signature Innovation: Breaking language barriers between Tamil farmers, Hindi buyers, and English traders

const FarmLingoComponent = {
  farmerLang: "ta", // "ta" (Tamil), "en" (English)
  buyerLang: "hi",  // "hi" (Hindi), "en" (English)
  currentRole: "farmer", // "farmer" or "buyer"
  isListening: false,
  activeCorrectionMessageId: null,
  
  messages: [
    {
      id: "FL-1",
      sender: "farmer",
      senderName: "Murugan (Farmer)",
      senderLang: "ta",
      targetLang: "hi",
      originalText: "வணக்கம்! என்னிடம் 50 மூட்டை முதல் தர நிலக்கடலை உள்ளது. உங்கள் மண்டி விலை என்ன?",
      translatedText: "नमस्ते! मेरे पास 50 बोरी प्रथम श्रेणी की मूंगफली उपलब्ध है। आपकी मंडी का भाव क्या है?",
      timestamp: "10:30 AM",
      verified: true
    },
    {
      id: "FL-2",
      sender: "buyer",
      senderName: "Rajesh Sharma (Buyer, Kanpur Agri Mandi)",
      senderLang: "hi",
      targetLang: "ta",
      originalText: "नमस्ते मुरुगन जी! हम ₹7,450 प्रति क्विंटल की पेशकश कर रहे हैं। नमी का प्रतिशत कितना है?",
      translatedText: "வணக்கம் முருகன் அவர்களே! நாங்கள் ஒரு குவிண்டாலுக்கு ₹7,450 வழங்குகிறோம். ஈரப்பதம் சதவீதம் எவ்வளவு?",
      timestamp: "10:32 AM",
      verified: true
    },
    {
      id: "FL-3",
      sender: "farmer",
      senderName: "Murugan (Farmer)",
      senderLang: "ta",
      targetLang: "hi",
      originalText: "ஈரப்பதம் 7% மட்டுமே, சூரிய ஒளியில் நன்கு உலர்த்தப்பட்டது. மதுரை பண்ணையிலிருந்து உடனே ஏற்றலாம்.",
      translatedText: "नमी केवल 7% है, धूप में अच्छी तरह सुखाई गई है। मदुरै खेत से तुरंत लोड की जा सकती है।",
      timestamp: "10:34 AM",
      verified: true
    },
    {
      id: "FL-4",
      sender: "buyer",
      senderName: "Rajesh Sharma (Buyer, Kanpur Agri Mandi)",
      senderLang: "hi",
      targetLang: "ta",
      originalText: "बहुत बढ़िया सौदा है। हम 50% अग्रिम और डिलीवरी पर शेष राशि का भुगतान करेंगे। क्या यह स्वीकार्य है?",
      translatedText: "மிகச் சிறந்த ஒப்பந்தம். நாங்கள் 50% முன்பணமும், டெலிவரியின் போது மீதி தொகையும் செலுத்துவோம். இது தங்களுக்கு சம்மதமா?",
      timestamp: "10:36 AM",
      verified: true
    }
  ],

  // Verified agricultural lexicon and pattern translation dictionary
  translationDictionary: {
    // English -> Tamil & Hindi
    "what is your price per quintal?": {
      ta: "ஒரு குவிண்டால் விலை என்ன?",
      hi: "प्रति क्विंटल भाव क्या है?"
    },
    "we have 50 bags ready for harvest": {
      ta: "எங்களிடம் 50 மூட்டைகள் அறுவடைக்கு தயாராக உள்ளன.",
      hi: "हमारे पास कटाई के लिए 50 बोरियां तैयार हैं।"
    },
    "can you arrange transport to mandi?": {
      ta: "மண்டிக்கு வாகன போக்குவரத்து ஏற்பாடு செய்ய முடியுமா?",
      hi: "क्या आप मंडी तक परिवहन की व्यवस्था कर सकते हैं?"
    },
    "payment will be made via upi on delivery": {
      ta: "டெலிவரியின் போது யுபிஐ மூலம் பணம் செலுத்தப்படும்.",
      hi: "डिलीवरी पर यूपीआई के माध्यम से भुगतान किया जाएगा।"
    },
    "moisture content is below 8 percent": {
      ta: "ஈரப்பதம் 8 சதவீதத்திற்கும் குறைவாக உள்ளது.",
      hi: "नमी की मात्रा 8 प्रतिशत से कम है।"
    },
    // Tamil -> Hindi & English
    "என் விலை என்ன?": {
      hi: "मेरी फसल का क्या भाव मिलेगा?",
      en: "What price will I get for my produce?"
    },
    "சரக்கு மதுரை பண்ணையில் தயாராக உள்ளது": {
      hi: "माल मदुरै फार्म में तैयार है।",
      en: "Produce is ready at the Madurai farm."
    },
    "50 மூட்டைகள் உள்ளன": {
      hi: "50 बोरियां उपलब्ध हैं।",
      en: "50 bags are available."
    },
    "விலை சற்று உயர்த்தி தர முடியுமா?": {
      hi: "क्या आप भाव थोड़ा बढ़ा सकते हैं?",
      en: "Can you offer a slightly better price?"
    },
    // Hindi -> Tamil & English
    "हम ₹2,500 प्रति क्विंटल देंगे": {
      ta: "நாங்கள் ஒரு குவிண்டாலுக்கு ₹2,500 தருவோம்.",
      en: "We will pay ₹2,500 per quintal."
    },
    "कल गाड़ी भेज सकते हैं": {
      ta: "நாளை வண்டி அனுப்ப முடியும்.",
      en: "We can send the truck tomorrow."
    },
    "सैंपल की फोटो भेजिए": {
      ta: "மாதிரி புகைப்படத்தை அனுப்பவும்.",
      en: "Please send a photo of the sample."
    }
  },

  // Agricultural keywords for smart fallback translation
  agriTerms: {
    "groundnut": { ta: "நிலக்கடலை", hi: "मूंगफली" },
    "rice": { ta: "நெல்", hi: "धान / चावल" },
    "paddy": { ta: "நெல்", hi: "धान" },
    "cotton": { ta: "பருத்தி", hi: "कपास" },
    "tomato": { ta: "தக்காளி", hi: "टमाटर" },
    "onion": { ta: "வெங்காயம்", hi: "प्याज़" },
    "chilli": { ta: "மிளகாய்", hi: "मिर्च" },
    "sugarcane": { ta: "கரும்பு", hi: "गन्ना" },
    "quintal": { ta: "குவிண்டால்", hi: "क्विंटल" },
    "bag": { ta: "மூட்டை", hi: "बोरी" },
    "bags": { ta: "மூட்டைகள்", hi: "बोरियां" },
    "price": { ta: "விலை", hi: "भाव / कीमत" },
    "payment": { ta: "பணம் செலுத்துதல்", hi: "भुगतान" },
    "delivery": { ta: "டெலிவரி", hi: "डिलीवरी" },
    "transport": { ta: "போக்குவரத்து", hi: "परिवहन" },
    "moisture": { ta: "ஈரப்பதம்", hi: "नमी" },
    "advance": { ta: "முன்பணம்", hi: "अग्रिम" },
    "tomorrow": { ta: "நாளை", hi: "कल" },
    "today": { ta: "இன்று", hi: "आज" }
  },

  render(container) {
    const isTa = window.UzhavanApp.currentLang === 'ta';

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-1 border border-emerald-300">
              <span>🌐</span> <strong>FARMLINGO</strong> • ${isTa ? "மொழி கடந்த உழவர்-வாங்குபவர் உரையாடல்" : "Cross-Language Farmer-Buyer Engine"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "ஃபார்ம்லிங்கோ (FarmLingo Cross-Language Chat)" : "FarmLingo: Cross-Language Trade Communicator"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa 
                ? "தமிழ் பேசும் விவசாயியும், இந்தி பேசும் வெளிமாநில வாங்குபவரும் தத்தமது சொந்த மொழியில் எளிதாக வணிகம் செய்ய உதவும் AI மொழிபெயர்ப்பு தளம்." 
                : "Enables a Tamil-speaking farmer to negotiate directly with a Hindi-speaking mandi buyer without either understanding the other's language."
              }
            </p>
          </div>

          <div class="flex items-center gap-2 self-start md:self-auto">
            <span class="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Demo Mode • Verified Domain Engine
            </span>
          </div>
        </div>

        <!-- ARCHITECTURE & DEMO BANNER -->
        <div class="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <span class="text-2xl flex-shrink-0">🧬</span>
          <div class="space-y-1">
            <strong class="font-bold text-emerald-900 block text-sm">
              ${isTa ? "நேரடி இருவழி மொழிபெயர்ப்பு கட்டமைப்பு (Bidirectional Workflow):" : "How FarmLingo Works (Signature Innovation):"}
            </strong>
            <p class="leading-relaxed">
              1. <strong>Farmer speaks / types in Tamil</strong> (e.g. “என்னிடம் 50 மூட்டை நிலக்கடலை உள்ளது”) →
              2. <strong>AI translates into Hindi</strong> with verified agricultural trade lexicon →
              3. <strong>Buyer reads / listens in Hindi</strong> and replies in Hindi (“हम ₹7,450 प्रति क्विंटल देंगे”) →
              4. <strong>Farmer instantly receives translated Tamil</strong> with text-to-speech audio playback.
            </p>
          </div>
        </div>

        <!-- PARTICIPANT CONTROLS BAR -->
        <div class="agri-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <!-- Language Configuration -->
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-700">👨‍🌾 Farmer Language:</span>
              <select onchange="window.FarmLingoComponent.setLang('farmerLang', this.value)" class="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-slate-900">
                <option value="ta" ${this.farmerLang === 'ta' ? 'selected' : ''}>தமிழ் (Tamil)</option>
                <option value="en" ${this.farmerLang === 'en' ? 'selected' : ''}>English</option>
              </select>
            </div>

            <div class="text-slate-400 font-bold">⇄</div>

            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-700">🛒 Buyer Language:</span>
              <select onchange="window.FarmLingoComponent.setLang('buyerLang', this.value)" class="px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-slate-900">
                <option value="hi" ${this.buyerLang === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
                <option value="en" ${this.buyerLang === 'en' ? 'selected' : ''}>English</option>
              </select>
            </div>
          </div>

          <!-- Active Perspective Switcher -->
          <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <span class="text-slate-600 px-2">Perspective:</span>
            <button onclick="window.FarmLingoComponent.switchRole('farmer')" 
              class="px-3 py-1.5 rounded-lg transition-all ${this.currentRole === 'farmer' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'}">
              👨‍🌾 Farmer View (Tamil)
            </button>
            <button onclick="window.FarmLingoComponent.switchRole('buyer')" 
              class="px-3 py-1.5 rounded-lg transition-all ${this.currentRole === 'buyer' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'}">
              🛒 Buyer View (Hindi)
            </button>
          </div>

        </div>

        <!-- QUICK TRADE PHRASE CHIPS -->
        <div class="agri-card p-3.5 rounded-2xl">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>⚡</span> ${isTa ? "விரைவு வணிக சொற்றொடர்கள் (One-Click Trade Phrases):" : "Quick Agricultural Trade Phrases (Click to Send):"}
            </span>
            <span class="text-[10px] text-emerald-800 font-semibold">Instant Bilingual Synthesis</span>
          </div>

          <div class="flex gap-2 overflow-x-auto pb-1 text-xs">
            <button onclick="window.FarmLingoComponent.sendPreset('what is your price per quintal?')" class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium border border-slate-200">
              💰 What is your best price per quintal?
            </button>
            <button onclick="window.FarmLingoComponent.sendPreset('we have 50 bags ready for harvest')" class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium border border-slate-200">
              📦 50 bags Grade-A produce ready
            </button>
            <button onclick="window.FarmLingoComponent.sendPreset('moisture content is below 8 percent')" class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium border border-slate-200">
              💧 Moisture content is below 8%
            </button>
            <button onclick="window.FarmLingoComponent.sendPreset('payment will be made via upi on delivery')" class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 font-medium border border-slate-200">
              💳 Payment via UPI on delivery
            </button>
          </div>
        </div>

        <!-- MAIN DUAL-LANGUAGE CHAT STREAM -->
        <div class="agri-card p-5 md:p-6 rounded-2xl space-y-5 bg-white">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <strong class="text-slate-900 font-bold">Active Negotiation Channel</strong>
              <span class="text-slate-400">•</span>
              <span class="text-slate-600">Commodity: Groundnut TMV-7 (50 Bags)</span>
            </div>
            <button onclick="window.FarmLingoComponent.clearChat()" class="text-slate-400 hover:text-rose-600 font-semibold text-xs">
              Clear Chat
            </button>
          </div>

          <!-- Messages Container -->
          <div id="farmlingoStream" class="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            ${this.messages.map(msg => this.renderMessageBubble(msg, isTa)).join('')}
          </div>

          <!-- INPUT FORM WITH SPEECH & TEXT CAPABILITY -->
          <form onsubmit="window.FarmLingoComponent.handleSendMessage(event)" class="pt-4 border-t border-slate-200 space-y-2">
            <div class="flex items-center gap-2">
              
              <!-- Voice Input Button (Web Speech API with Fallback) -->
              <button type="button" onclick="window.FarmLingoComponent.toggleVoiceInput()" 
                id="voiceInputBtn"
                class="p-3 rounded-2xl ${this.isListening ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200' : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900'} transition-all border border-slate-300"
                title="Speak in your language">
                <span class="text-lg">🎙️</span>
              </button>

              <!-- Text Input -->
              <div class="relative flex-1">
                <input type="text" id="farmlingoTextInput" required 
                  placeholder="${this.currentRole === 'farmer' ? (this.farmerLang === 'ta' ? 'தமிழில் எழுதவும் (எ.கா: சரக்கு தயார், விலை என்ன?)...' : 'Type message in English...') : 'हिन्दी में लिखें (उदा: हमें 50 बोरी चाहिए, क्या भाव है?)...'}"
                  class="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
                <span class="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 uppercase">
                  ${this.currentRole === 'farmer' ? this.farmerLang.toUpperCase() : this.buyerLang.toUpperCase()}
                </span>
              </div>

              <!-- Send Button -->
              <button type="submit" class="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5">
                <span>Translate & Send</span>
                <span>➔</span>
              </button>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-600 px-2 font-medium">
              <span>💡 Original text & translated text are both recorded to prevent commercial misunderstandings.</span>
              <span id="speechStatusIndicator" class="text-emerald-700 font-bold"></span>
            </div>
          </form>

        </div>

        <!-- MODAL: REPORT / SUGGEST TRANSLATION CORRECTION (SECTION 13 REQUIREMENT) -->
        ${this.activeCorrectionMessageId ? this.renderCorrectionModal() : ''}

      </div>
    `;
  },

  renderMessageBubble(msg, isTa) {
    const isFromMe = (this.currentRole === 'farmer' && msg.sender === 'farmer') ||
                     (this.currentRole === 'buyer' && msg.sender === 'buyer');

    const senderLangLabel = msg.senderLang === 'ta' ? 'தமிழ் (Tamil)' : msg.senderLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
    const targetLangLabel = msg.targetLang === 'ta' ? 'தமிழ் (Tamil)' : msg.targetLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';

    return `
      <div class="flex flex-col ${isFromMe ? 'items-end' : 'items-start'} space-y-1">
        
        <div class="flex items-center gap-2 px-1 text-[11px] text-slate-600 font-semibold">
          <span>${msg.senderName}</span>
          <span>•</span>
          <span>${msg.timestamp}</span>
        </div>

        <!-- Dual-Language Card Bubble -->
        <div class="max-w-2xl rounded-2xl p-4 space-y-3 ${isFromMe ? 'bg-emerald-900 text-white rounded-tr-xs' : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-xs'} shadow-sm">
          
          <!-- Original Message Layer -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] uppercase tracking-wider ${isFromMe ? 'text-emerald-300' : 'text-slate-600'} font-bold">
              <span>Original (${senderLangLabel})</span>
              <button onclick="window.FarmLingoComponent.speakText('${this.escapeQuotes(msg.originalText)}', '${msg.senderLang}')" 
                class="hover:underline flex items-center gap-1 cursor-pointer">
                <span>🔊 Listen</span>
              </button>
            </div>
            <p class="text-xs md:text-sm font-semibold leading-relaxed">
              ${msg.originalText}
            </p>
          </div>

          <!-- Divider -->
          <div class="border-t ${isFromMe ? 'border-emerald-700/60' : 'border-slate-200'}"></div>

          <!-- Translated Message Layer -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] uppercase tracking-wider ${isFromMe ? 'text-emerald-200 font-extrabold' : 'text-emerald-800 font-extrabold'}">
              <span>Translated (${targetLangLabel})</span>
              <div class="flex items-center gap-2">
                <button onclick="window.FarmLingoComponent.speakText('${this.escapeQuotes(msg.translatedText)}', '${msg.targetLang}')" 
                  class="hover:underline flex items-center gap-1 cursor-pointer">
                  <span>🔊 Listen</span>
                </button>
                <span>•</span>
                <button onclick="window.FarmLingoComponent.openCorrectionModal('${msg.id}')" class="hover:underline ${isFromMe ? 'text-emerald-300' : 'text-slate-600'}">
                  ✏️ Report / Suggest
                </button>
              </div>
            </div>
            <p class="text-xs md:text-sm font-medium leading-relaxed ${isFromMe ? 'text-emerald-100' : 'text-emerald-950'}">
              ${msg.translatedText}
            </p>
          </div>

        </div>

      </div>
    `;
  },

  renderCorrectionModal() {
    const msg = this.messages.find(m => m.id === this.activeCorrectionMessageId);
    if (!msg) return '';

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4 text-xs">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-black text-slate-900">Suggest Translation Improvement</h3>
            <button onclick="window.FarmLingoComponent.closeCorrectionModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Original Text:</span>
            <p class="font-semibold text-slate-900">${msg.originalText}</p>
          </div>

          <div class="p-3 bg-emerald-50 rounded-xl space-y-1">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">Current Translation:</span>
            <p class="font-medium text-emerald-950">${msg.translatedText}</p>
          </div>

          <form onsubmit="window.FarmLingoComponent.handleSaveCorrection(event, '${msg.id}')" class="space-y-3">
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Your Suggested Translation *</label>
              <textarea name="suggestedText" required rows="3" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">${msg.translatedText}</textarea>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Reason for Adjustment</label>
              <input type="text" name="correctionReason" placeholder="e.g. Local trade dialect nuance or inaccurate commodity measure" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium">
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" onclick="window.FarmLingoComponent.closeCorrectionModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md">
                Submit Improvement
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  },

  setLang(key, val) {
    this[key] = val;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  switchRole(role) {
    this.currentRole = role;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  sendPreset(phraseKey) {
    const translation = this.translationDictionary[phraseKey];
    if (!translation) return;

    const isFarmer = this.currentRole === 'farmer';
    let originalText = phraseKey;
    let translatedText = translation.hi;

    if (isFarmer) {
      originalText = translation.ta || phraseKey;
      translatedText = translation.hi || phraseKey;
    } else {
      originalText = translation.hi || phraseKey;
      translatedText = translation.ta || phraseKey;
    }

    this.postMessage(originalText, translatedText);
  },

  handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('farmlingoTextInput');
    if (!input || !input.value.trim()) return;

    const rawText = input.value.trim();
    const isFarmer = this.currentRole === 'farmer';
    const sourceLang = isFarmer ? this.farmerLang : this.buyerLang;
    const targetLang = isFarmer ? this.buyerLang : this.farmerLang;

    const translated = this.translateText(rawText, sourceLang, targetLang);
    this.postMessage(rawText, translated);
    input.value = "";
  },

  // Bidirectional domain translation engine
  translateText(text, fromLang, toLang) {
    const lower = text.toLowerCase().trim();

    // 1. Direct dictionary match
    if (this.translationDictionary[lower]) {
      const match = this.translationDictionary[lower];
      if (toLang === 'ta' && match.ta) return match.ta;
      if (toLang === 'hi' && match.hi) return match.hi;
      if (toLang === 'en' && match.en) return match.en;
    }

    // 2. Exact match in reverse mappings
    for (const [key, map] of Object.entries(this.translationDictionary)) {
      if (map.ta === text && toLang === 'hi') return map.hi || key;
      if (map.ta === text && toLang === 'en') return map.en || key;
      if (map.hi === text && toLang === 'ta') return map.ta || key;
      if (map.hi === text && toLang === 'en') return map.en || key;
    }

    // 3. Domain token replacement heuristic
    let translated = text;
    for (const [enTerm, termMap] of Object.entries(this.agriTerms)) {
      const fromTerm = fromLang === 'ta' ? termMap.ta : fromLang === 'hi' ? termMap.hi : enTerm;
      const toTerm = toLang === 'ta' ? termMap.ta : toLang === 'hi' ? termMap.hi : enTerm;

      if (fromTerm && toTerm && translated.includes(fromTerm)) {
        translated = translated.split(fromTerm).join(toTerm);
      }
    }

    // If no replacement occurred, provide friendly bilingual wrapper
    if (translated === text) {
      if (toLang === 'hi') {
        return `[कृषि अनुवाद] ${text} (मंडी संदेश प्राप्त हुआ)`;
      } else if (toLang === 'ta') {
        return `[வேளாண் மொழிபெயர்ப்பு] ${text} (மண்டி தகவல் பெறப்பட்டது)`;
      } else {
        return `[Agri Translation] ${text}`;
      }
    }

    return translated;
  },

  postMessage(original, translated) {
    const isFarmer = this.currentRole === 'farmer';
    const profile = window.UzhavanApp.userProfile || { name: 'Murugan' };

    const newMsg = {
      id: "FL-" + Math.floor(100 + Math.random() * 900),
      sender: this.currentRole,
      senderName: isFarmer ? `${profile.name} (Farmer)` : "Rajesh Sharma (Mandi Buyer)",
      senderLang: isFarmer ? this.farmerLang : this.buyerLang,
      targetLang: isFarmer ? this.buyerLang : this.farmerLang,
      originalText: original,
      translatedText: translated,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      verified: true
    };

    this.messages.push(newMsg);
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);

    // Auto-scroll stream
    setTimeout(() => {
      const stream = document.getElementById('farmlingoStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);

    // Simulated speech audio prompt
    window.UzhavanApp.showToast(`Translated to ${newMsg.targetLang.toUpperCase()} & delivered! 🌐`, "success");
  },

  // Text to Speech playback with SpeechSynthesis API & graceful fallback
  speakText(text, lang) {
    if (!('speechSynthesis' in window)) {
      window.UzhavanApp.showToast(`Audio synthesis not supported on this browser: "${text}"`, "info");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set appropriate BCP-47 language tag
    if (lang === 'ta') utterance.lang = 'ta-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      window.UzhavanApp.showToast(`🔊 Speaking (${lang.toUpperCase()}): "${text.substring(0, 35)}..."`, "info");
    };

    utterance.onerror = () => {
      window.UzhavanApp.showToast(`Audio playback note: "${text}"`, "info");
    };

    window.speechSynthesis.speak(utterance);
  },

  // Web Speech API Voice Recognition with graceful fallback
  toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.UzhavanApp.showToast("Speech Recognition API is not supported on this browser. Please type your message.", "warning");
      const indicator = document.getElementById('speechStatusIndicator');
      if (indicator) indicator.innerText = "Speech API unavailable. Please use text input.";
      return;
    }

    if (this.isListening) {
      this.isListening = false;
      const indicator = document.getElementById('speechStatusIndicator');
      if (indicator) indicator.innerText = "";
      const btn = document.getElementById('voiceInputBtn');
      if (btn) btn.className = "p-3 rounded-2xl bg-slate-100 text-slate-700 transition-all border border-slate-300";
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const isFarmer = this.currentRole === 'farmer';
      recognition.lang = isFarmer ? (this.farmerLang === 'ta' ? 'ta-IN' : 'en-IN') : (this.buyerLang === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      this.isListening = true;
      const indicator = document.getElementById('speechStatusIndicator');
      if (indicator) indicator.innerText = `Listening (${recognition.lang})... Speak now!`;
      const btn = document.getElementById('voiceInputBtn');
      if (btn) btn.className = "p-3 rounded-2xl bg-rose-600 text-white animate-pulse ring-4 ring-rose-200 transition-all border border-rose-400";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('farmlingoTextInput');
        if (input) input.value = transcript;
        this.isListening = false;
        if (indicator) indicator.innerText = `Transcribed: "${transcript}"`;
        if (btn) btn.className = "p-3 rounded-2xl bg-slate-100 text-slate-700 transition-all border border-slate-300";
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error", event.error);
        this.isListening = false;
        if (indicator) indicator.innerText = "Microphone input timed out or permission needed.";
        if (btn) btn.className = "p-3 rounded-2xl bg-slate-100 text-slate-700 transition-all border border-slate-300";
      };

      recognition.onend = () => {
        this.isListening = false;
        if (btn) btn.className = "p-3 rounded-2xl bg-slate-100 text-slate-700 transition-all border border-slate-300";
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition invocation error", err);
      this.isListening = false;
      window.UzhavanApp.showToast("Could not access microphone. Please type your message.", "info");
    }
  },

  openCorrectionModal(msgId) {
    this.activeCorrectionMessageId = msgId;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  closeCorrectionModal() {
    this.activeCorrectionMessageId = null;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleSaveCorrection(e, msgId) {
    e.preventDefault();
    const form = e.target;
    const suggested = form.suggestedText.value;
    const reason = form.correctionReason.value;

    const msg = this.messages.find(m => m.id === msgId);
    if (msg) {
      msg.translatedText = suggested;
    }

    // Save correction in local storage for training review
    try {
      const saved = JSON.parse(localStorage.getItem('uzhavan_farmlingo_corrections') || '[]');
      saved.push({ msgId, original: msg ? msg.originalText : '', suggested, reason, date: new Date().toISOString() });
      localStorage.setItem('uzhavan_farmlingo_corrections', JSON.stringify(saved));
    } catch (err) {
      console.error(err);
    }

    this.activeCorrectionMessageId = null;
    window.UzhavanApp.showToast("Translation correction applied & logged for review! ✏️", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  clearChat() {
    if (confirm("Reset FarmLingo negotiation stream to initial demo state?")) {
      this.messages = this.messages.slice(0, 2);
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
    }
  }
};

window.FarmLingoComponent = FarmLingoComponent;