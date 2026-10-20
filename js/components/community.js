// Uzhavan Hub - Farmer Community & Expert Support Component
// Module 7: Q&A discussions by crop/topic, verified expert badges vs community opinions, expert guidance request, local demo mode

const CommunityComponent = {
  selectedTopic: "All",
  searchQuery: "",
  discussions: [],
  activeExpertModal: false,

  initDiscussions() {
    try {
      const saved = localStorage.getItem('uzhavan_community_posts');
      if (saved) {
        this.discussions = JSON.parse(saved);
      } else {
        this.discussions = [
          {
            id: "POST-201",
            author: "Murugan S",
            location: "Madurai, Vadipatti",
            topic: "Pest Management",
            crop: "Tomato",
            title: "Leaf spots and curling in summer crop – how to manage organically?",
            content: "My 45-day tomato crop is showing concentric brown spots on bottom leaves and slight leaf curling. Looking for effective organic sprays that won't harm ladybird beetles.",
            createdAt: "Yesterday",
            upvotes: 14,
            replies: [
              {
                id: "REP-1",
                author: "Dr. S. Radhakrishnan",
                badge: "Verified Expert",
                affiliation: "Senior Agronomist, TNAU Coimbatore",
                avatar: "👨‍🔬",
                content: "This is typical early blight (Alternaria solani). Apply Pseudomonas fluorescens liquid @ 5ml/litre along with 3% cold-pressed neem oil during evening hours. Avoid overhead sprinkler irrigation to keep leaf canopy dry.",
                time: "20 hours ago"
              },
              {
                id: "REP-2",
                author: "Karthik V",
                badge: "Fellow Farmer",
                affiliation: "Organic Farmer, Dindigul",
                avatar: "👨‍🌾",
                content: "Sour buttermilk spray (500ml in 10L water fermented for 5 days) worked wonders in my field last season. Try it on 2-3 rows first.",
                time: "15 hours ago"
              }
            ]
          },
          {
            id: "POST-202",
            author: "Selvamurugan K",
            location: "Thanjavur, Orathanadu",
            topic: "Crop Advisory",
            crop: "Rice",
            title: "Shortage of transplanting labour – is direct seeded rice (DSR) viable here?",
            content: "Facing acute farm labour crunch in Thanjavur for Samba transplanting. What are the key weed management precautions if I switch to drum seeder or direct seeding?",
            createdAt: "2 days ago",
            upvotes: 22,
            replies: [
              {
                id: "REP-3",
                author: "Uzhavan AI",
                badge: "AI Guidance",
                affiliation: "Automated Agronomic Advisory",
                avatar: "🤖",
                content: "DSR saves 30-40% irrigation water and ₹4,000/acre in nursery labour. Crucial rule: apply pre-emergence herbicide Pyrazosulfuron-ethyl 10% WP within 3 days of sowing followed by one hand weeding at 25-30 DAS.",
                time: "2 days ago"
              },
              {
                id: "REP-4",
                author: "Palanisamy K",
                badge: "Verified Expert",
                affiliation: "KVK Rice Specialist, Needamangalam",
                avatar: "👨‍🔬",
                content: "Ensure laser land levelling before DSR. Stagnant water pockets will rot germinating seeds while high spots will suffer from severe weed flushes.",
                time: "1 day ago"
              }
            ]
          },
          {
            id: "POST-203",
            author: "Anitha R",
            location: "Coimbatore, Pollachi",
            topic: "Market Tips",
            crop: "Coconut",
            title: "FPO collective selling vs local copra mandi rates comparison",
            content: "Pollachi mandi is offering ₹28/kg raw nut. Our local coconut producer company offers ₹32/kg for dried copra. Any experiences with drying loss calculations?",
            createdAt: "3 days ago",
            upvotes: 19,
            replies: [
              {
                id: "REP-5",
                author: "Subramanian T",
                badge: "Fellow Farmer",
                affiliation: "FPO Director, Pollachi",
                avatar: "👨‍🌾",
                content: "1000 raw nuts yield ~140-150 kg dried copra (6% moisture). After factoring drying labour (₹800/1000 nuts), FPO route yields an additional ₹2,400 net profit per thousand nuts.",
                time: "2 days ago"
              }
            ]
          }
        ];
        this.saveDiscussions();
      }
    } catch (e) {
      console.error("Discussions error", e);
    }
  },

  saveDiscussions() {
    try {
      localStorage.setItem('uzhavan_community_posts', JSON.stringify(this.discussions));
    } catch (e) {
      console.error("Discussions save error", e);
    }
  },

  render(container) {
    if (this.discussions.length === 0) this.initDiscussions();
    const isTa = window.UzhavanApp.currentLang === 'ta';
    const profile = window.UzhavanApp.userProfile || { name: "Farmer", location: "Madurai" };

    const topics = [
      "All", "Crop Advisory", "Pest Management", "Organic Practices",
      "Machinery & Labour", "Market Tips", "Govt Schemes"
    ];

    const filtered = this.discussions.filter(p => {
      const matchTopic = (this.selectedTopic === "All") || (p.topic.toLowerCase() === this.selectedTopic.toLowerCase());
      const matchSearch = !this.searchQuery.trim() ||
        p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.crop.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchTopic && matchSearch;
    });

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>👥</span> ${isTa ? "விவசாயிகள் சமூகம் & வல்லுநர் உதவி" : "Farmer Community & Agronomist Network"}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-emerald-950">
              ${isTa ? "உழவர் களம் (Farmer Community & Expert Q&A)" : "Farmer Community & Expert Q&A"}
            </h1>
            <p class="text-xs md:text-sm text-slate-700">
              ${isTa 
                ? "பயிர் சாகுபடி சந்தேகங்களை கேளுங்கள்; TNAU / KVK வேளாண் வல்லுநர்கள் மற்றும் சக விவசாயிகளிடம் இருந்து வழிகாட்டல் பெறுங்கள்." 
                : "Ask agronomy questions, share farming experiences, and receive answers verified by agricultural university scientists."
              }
            </p>
          </div>

          <div class="flex items-center gap-2 self-start md:self-auto">
            <button onclick="window.CommunityComponent.openExpertRequestModal()" class="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
              <span>👨‍🔬</span>
              <span>${isTa ? "வல்லுநரை அழைக்கவும்" : "Request Expert Guidance"}</span>
            </button>
          </div>
        </div>

        <!-- LOCAL DEMONSTRATION NOTICE BANNER -->
        <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-sm">
          <span class="text-base flex-shrink-0">⚠️</span>
          <div>
            <strong class="font-bold text-amber-900">${isTa ? "உள்ளூர் மாதிரி அறிவிப்பு:" : "Local Demonstration Notice:"}</strong>
            <span class="block mt-0.5">${isTa ? "இந்த கலந்துரையாடல் பலகை முன்மாதிரி பரிசோதனைக்காக உங்கள் உலாவியில் மட்டுமே இயங்குகிறது. பகிரப்படும் தகவல்கள் பொது இணைய சேவையகங்களில் பதிவேற்றப்படவில்லை." : "This discussion board operates in local demonstration mode. Posts and responses are preserved in your local browser cache for prototype demonstration."}</span>
          </div>
        </div>

        <!-- SEARCH & TOPIC PILLS -->
        <div class="agri-card p-4 md:p-5 rounded-2xl space-y-4">
          <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div class="relative w-full sm:w-80">
              <input type="text" placeholder="${isTa ? 'கேள்விகளை தேடுக...' : 'Search discussions by crop or question...'}"
                value="${this.searchQuery}"
                oninput="window.CommunityComponent.handleSearch(this.value)"
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600">
              <span class="absolute left-3 top-2.5 text-slate-700 text-xs">🔍</span>
            </div>
            <span class="text-xs text-slate-700 font-bold self-end sm:self-auto">${filtered.length} Discussions</span>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
            ${topics.map(t => `
              <button onclick="window.CommunityComponent.handleTopic('${t}')"
                class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${this.selectedTopic.toLowerCase() === t.toLowerCase() ? 'bg-emerald-800 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                ${t}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT: POST A QUESTION FORM (4 COLS) -->
          <div class="lg:col-span-4 space-y-4">
            <form onsubmit="window.CommunityComponent.handlePostQuestion(event)" class="agri-card p-5 rounded-2xl space-y-3.5 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span>✍️</span> ${isTa ? "புதிய கேள்வி கேட்க" : "Ask a Question"}
                </h3>
                <span class="text-[10px] text-emerald-800 font-bold">Free Advice</span>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Your Crop *</label>
                <input type="text" name="postCrop" required placeholder="e.g. Tomato, Groundnut, Rice" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-600">
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Topic Category *</label>
                <select name="postTopic" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white focus:ring-2 focus:ring-emerald-600">
                  <option value="Crop Advisory">Crop Advisory</option>
                  <option value="Pest Management">Pest & Disease Management</option>
                  <option value="Organic Practices">Organic & Natural Farming</option>
                  <option value="Machinery & Labour">Machinery & Labour</option>
                  <option value="Market Tips">Market Prices & Selling</option>
                  <option value="Govt Schemes">Government Schemes & Loans</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Question Title *</label>
                <input type="text" name="postTitle" required placeholder="Brief summary of your question" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600">
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
                <textarea name="postContent" required rows="3" placeholder="Describe symptoms, soil conditions, acreage, and previous treatments..." class="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-600"></textarea>
              </div>

              <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md transition-all flex items-center justify-center gap-1.5">
                <span>🚀</span>
                <span>Publish to Community</span>
              </button>
            </form>
          </div>

          <!-- RIGHT: DISCUSSION FEED (8 COLS) -->
          <div class="lg:col-span-8 space-y-5">
            ${filtered.map(post => `
              <div class="agri-card p-6 rounded-2xl space-y-4 hover:border-emerald-300 transition-all">
                
                <!-- Post Author & Topic Badge -->
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg font-bold text-emerald-900">
                      👨‍🌾
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="font-extrabold text-slate-900 text-sm">${post.author}</h4>
                        <span class="text-[10px] text-slate-700">📍 ${post.location}</span>
                      </div>
                      <span class="text-[10px] text-slate-700">${post.createdAt}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ${post.crop}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      ${post.topic}
                    </span>
                  </div>
                </div>

                <!-- Post Title & Content -->
                <div>
                  <h3 class="text-base font-black text-slate-900 leading-snug">
                    ${post.title}
                  </h3>
                  <p class="text-xs text-slate-700 leading-relaxed mt-1 font-medium">
                    ${post.content}
                  </p>
                </div>

                <!-- Upvote & Replies Count Bar -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button onclick="window.CommunityComponent.upvotePost('${post.id}')" class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 transition-all">
                    <span>👍 Helpful</span>
                    <span class="font-extrabold text-emerald-800">${post.upvotes}</span>
                  </button>
                  <span class="text-xs text-slate-700 font-semibold">${post.replies.length} Responses</span>
                </div>

                <!-- Replies Thread -->
                <div class="space-y-3 pt-2">
                  ${post.replies.map(rep => `
                    <div class="p-3.5 rounded-xl border ${rep.badge === 'Verified Expert' ? 'border-emerald-300 bg-emerald-50/50' : rep.badge === 'AI Guidance' ? 'border-sky-300 bg-sky-50/40' : 'border-slate-200 bg-slate-50'} space-y-1.5 text-xs">
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-base">${rep.avatar || '💬'}</span>
                          <strong class="font-extrabold text-slate-900">${rep.author}</strong>
                          <span class="px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${rep.badge === 'Verified Expert' ? 'bg-emerald-700 text-white' : rep.badge === 'AI Guidance' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}">
                            ${rep.badge}
                          </span>
                        </div>
                        <span class="text-[10px] text-slate-700">${rep.time}</span>
                      </div>

                      <div class="text-[10px] text-slate-700 font-medium pl-6 -mt-1">
                        ${rep.affiliation}
                      </div>

                      <p class="text-xs text-slate-800 pl-6 leading-relaxed font-medium">
                        ${rep.content}
                      </p>
                    </div>
                  `).join('')}
                </div>

                <!-- Quick Reply Input -->
                <form onsubmit="window.CommunityComponent.handleReply(event, '${post.id}')" class="flex gap-2 pt-1">
                  <input type="text" name="replyContent" required placeholder="Write a helpful response or follow-up question..." class="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600">
                  <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs">
                    Reply
                  </button>
                </form>

              </div>
            `).join('')}
          </div>

        </div>

        <!-- MODAL: REQUEST 1-ON-1 EXPERT GUIDANCE -->
        ${this.activeExpertModal ? `
          <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-base font-black text-slate-900">Request TNAU / KVK Agronomist Consultation</h3>
                <button onclick="window.CommunityComponent.closeExpertRequestModal()" class="text-slate-700 hover:text-slate-900 text-lg font-bold">✕</button>
              </div>

              <p class="text-xs text-slate-700 leading-relaxed">
                Connect directly with your district's designated Assistant Agricultural Officer (AAO) or Krishi Vigyan Kendra specialist for an on-field or telephonic consultation.
              </p>

              <form onsubmit="window.CommunityComponent.handleExpertSubmit(event)" class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">Farmer Name *</label>
                  <input type="text" name="farmerName" required value="${profile.name}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <input type="tel" name="farmerPhone" required value="+91 94431 10000" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1">Field Issue / Reason *</label>
                  <textarea name="issueReason" required rows="2" placeholder="e.g. Unidentified wilt in cotton field, need field inspection" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"></textarea>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                  <button type="button" onclick="window.CommunityComponent.closeExpertRequestModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold">
                    Cancel
                  </button>
                  <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  handleTopic(topic) {
    this.selectedTopic = topic;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleSearch(query) {
    this.searchQuery = query;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handlePostQuestion(e) {
    e.preventDefault();
    const form = e.target;
    const profile = window.UzhavanApp.userProfile || { name: "Farmer", location: "Madurai" };

    const newPost = {
      id: "POST-" + Math.floor(100 + Math.random() * 900),
      author: profile.name || "Farmer",
      location: profile.location || "Tamil Nadu",
      topic: form.postTopic.value,
      crop: form.postCrop.value,
      title: form.postTitle.value,
      content: form.postContent.value,
      createdAt: "Just now",
      upvotes: 1,
      replies: [
        {
          id: "REP-AI-" + Math.floor(100 + Math.random() * 900),
          author: "Uzhavan AI",
          badge: "AI Guidance",
          affiliation: "Instant Agronomic Screening",
          avatar: "🤖",
          content: "Thank you for posting! Based on your question regarding " + form.postCrop.value + ", check our Fertilizer Guide and Disease Scanner for instant dosage recommendations. University experts will review your post shortly.",
          time: "Just now"
        }
      ]
    };

    this.discussions.unshift(newPost);
    this.saveDiscussions();
    window.UzhavanApp.showToast("Your question was posted to the community! 🌾", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleReply(e, postId) {
    e.preventDefault();
    const form = e.target;
    const profile = window.UzhavanApp.userProfile || { name: "Farmer" };
    const post = this.discussions.find(p => p.id === postId);
    if (!post) return;

    post.replies.push({
      id: "REP-" + Math.floor(100 + Math.random() * 900),
      author: profile.name || "Farmer",
      badge: "Fellow Farmer",
      affiliation: profile.location || "Tamil Nadu",
      avatar: "👨‍🌾",
      content: form.replyContent.value,
      time: "Just now"
    });

    this.saveDiscussions();
    window.UzhavanApp.showToast("Reply added to thread! 💬", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  upvotePost(postId) {
    const post = this.discussions.find(p => p.id === postId);
    if (post) {
      post.upvotes += 1;
      this.saveDiscussions();
      const container = document.getElementById('viewContainer');
      if (container) this.render(container);
    }
  },

  openExpertRequestModal() {
    this.activeExpertModal = true;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  closeExpertRequestModal() {
    this.activeExpertModal = false;
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  },

  handleExpertSubmit(e) {
    e.preventDefault();
    this.activeExpertModal = false;
    window.UzhavanApp.showToast("Expert consultation request submitted! KVK officer will contact you within 24 hours. 📞", "success");
    const container = document.getElementById('viewContainer');
    if (container) this.render(container);
  }
};

window.CommunityComponent = CommunityComponent;