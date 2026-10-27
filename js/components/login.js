// Uzhavan Hub - Farmer Login Component
// Secure authentication, 1-click sample demo farmer login, and password recovery guidance

const LoginComponent = {
  email: '',
  password: '',
  showPassword: false,
  errorMessage: '',
  showForgotModal: false,
  isSubmitting: false,

  render(container) {
    const isTa = window.UzhavanApp && window.UzhavanApp.currentLang === 'ta';

    container.innerHTML = `
      <div class="max-w-md mx-auto py-10 px-4">
        
        <!-- Brand Badge -->
        <div class="text-center space-y-2 mb-8">
          <div class="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-900/20">
            🌾
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-emerald-950">
            ${isTa ? "உழவர் உள்நுழைவு" : "Farmer Sign In"}
          </h1>
          <p class="text-xs text-slate-600">
            ${isTa ? "உங்கள் உழவன் ஹப் கணக்கில் பாதுகாப்பாக நுழையவும்" : "Sign in to access your farm plots, advisory, and services"}
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-5">
          
          <!-- Error Alert Banner -->
          ${this.errorMessage ? `
            <div class="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <span>⚠️</span>
              <div class="font-semibold">${this.errorMessage}</div>
            </div>
          ` : ''}

          <!-- Form Fields -->
          <form onsubmit="LoginComponent.handleLogin(event)" class="space-y-4">
            
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                ${isTa ? "மின்னஞ்சல் முகவரி" : "Email Address"}
              </label>
              <input type="email" id="login_email" value="${this.email}" 
                     oninput="LoginComponent.email = this.value"
                     required placeholder="e.g. murugan@uzhavan.hub"
                     class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-slate-700">
                  ${isTa ? "கடவுச்சொல்" : "Password"}
                </label>
                <button type="button" onclick="LoginComponent.toggleForgotPassword(true)" class="text-[11px] font-bold text-emerald-700 hover:underline">
                  ${isTa ? "கடவுச்சொல் மறந்துவிட்டதா?" : "Forgot password?"}
                </button>
              </div>
              <div class="relative">
                <input type="${this.showPassword ? 'text' : 'password'}" id="login_password" value="${this.password}" 
                       oninput="LoginComponent.password = this.value"
                       required placeholder="••••••••"
                       class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10" />
                <button type="button" onclick="LoginComponent.togglePasswordVisibility()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                  ${this.showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" ${this.isSubmitting ? 'disabled' : ''}
                    class="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
              ${this.isSubmitting ? `<span>⏳</span> <span>${isTa ? "சரிபார்க்கிறது..." : "Verifying..."}</span>` : `<span>🔓</span> <span>${isTa ? "உள்நுழைக" : "Sign In to Farm"}</span>`}
            </button>

          </form>

          <!-- 1-Click Sample Demo Farmers -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ${isTa ? "முன்னமைக்கப்பட்ட உழவர் கணக்குகள் (1-Click):" : "One-Click Demo Logins:"}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">Password: Farmer@123</span>
            </div>

            <div class="grid grid-cols-1 gap-2">
              <button type="button" onclick="LoginComponent.fillAndLogin('murugan@uzhavan.hub', 'Farmer@123')"
                      class="w-full p-2.5 rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-base">👨‍🌾</span>
                  <div>
                    <strong class="text-emerald-950 block">Murugan P. (Madurai)</strong>
                    <span class="text-[10px] text-slate-500">2 Plots • 5.5 Acres • Red Soil</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-emerald-700">Login →</span>
              </button>

              <button type="button" onclick="LoginComponent.fillAndLogin('anitha@uzhavan.hub', 'Farmer@123')"
                      class="w-full p-2.5 rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-base">👩‍🌾</span>
                  <div>
                    <strong class="text-emerald-950 block">Anitha R. (Thanjavur)</strong>
                    <span class="text-[10px] text-slate-500">1 Plot • 4.0 Acres • Clay Soil</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-emerald-700">Login →</span>
              </button>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center pt-2">
            <p class="text-xs text-slate-600">
              ${isTa ? "கணக்கு இல்லையா?" : "Don't have an account yet?"} 
              <button type="button" onclick="window.UzhavanApp.navigate('registration')" class="font-bold text-emerald-800 hover:underline">
                ${isTa ? "இலவசமாக பதிவு செய்யுங்கள் →" : "Register Free →"}
              </button>
            </p>
          </div>

        </div>

      </div>

      <!-- Forgot Password Modal -->
      ${this.renderForgotModal(isTa)}
    `;
  },

  renderForgotModal(isTa) {
    if (!this.showForgotModal) return '';

    return `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-emerald-100">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-sm font-black text-emerald-950 flex items-center gap-2">
              <span>🔑</span> <span>${isTa ? "கடவுச்சொல் மீட்டெடுப்பு" : "Password Recovery"}</span>
            </h3>
            <button onclick="LoginComponent.toggleForgotPassword(false)" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <div class="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              ${isTa 
                ? "டெமோ கணக்குகளுக்கு (Murugan & Anitha), இயல்புநிலை கடவுச்சொல் <strong class='text-emerald-800 font-mono'>Farmer@123</strong> ஆகும்." 
                : "For demo accounts (Murugan & Anitha), the preset password is <strong class='text-emerald-800 font-mono'>Farmer@123</strong>."
              }
            </p>
            <p>
              ${isTa 
                ? "உங்கள் சொந்த கணக்கின் கடவுச்சொல்லை மீட்டெடுக்க, உழவன் ஹப் ஹெல்ப்லைனை அழைக்கவும் அல்லது உங்கள் கிராம வேளாண்மை அலுவலரை அணுகவும்." 
                : "For registered farmer accounts on local deployments, please reset your password by re-registering or contacting the Uzhavan Hub digital officer."
              }
            </p>
          </div>

          <div class="text-right pt-2 border-t border-slate-100">
            <button onclick="LoginComponent.toggleForgotPassword(false)" class="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs">
              ${isTa ? "சரி" : "Got It"}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.reRender();
  },

  toggleForgotPassword(show) {
    this.showForgotModal = show;
    this.reRender();
  },

  async fillAndLogin(email, password) {
    this.email = email;
    this.password = password;
    this.errorMessage = '';
    this.isSubmitting = true;
    this.reRender();

    const res = await window.UzhavanAuth.login(email, password);
    this.isSubmitting = false;

    if (res.success) {
      if (window.UzhavanApp) {
        window.UzhavanApp.showToast(`🌾 Signed in as ${res.user.profile.full_name}!`, 'success');
        window.UzhavanApp.navigate('dashboard');
      }
    } else {
      this.errorMessage = res.error || "Login failed.";
      this.reRender();
    }
  },

  async handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.isSubmitting = true;
    this.reRender();

    const res = await window.UzhavanAuth.login(this.email.trim(), this.password);
    this.isSubmitting = false;

    if (res.success) {
      if (window.UzhavanApp) {
        window.UzhavanApp.showToast(`🌾 Welcome back, ${res.user.profile.full_name}!`, 'success');
        window.UzhavanApp.navigate('dashboard');
      }
    } else {
      this.errorMessage = res.error || "Invalid email or password.";
      this.reRender();
    }
  },

  reRender() {
    const container = document.getElementById('viewContainer');
    if (container) {
      this.render(container);
    }
  }
};

window.LoginComponent = LoginComponent;
