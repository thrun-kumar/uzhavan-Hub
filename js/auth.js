// Uzhavan Hub - Client-Side Authentication & Multi-Plot State Manager
// Seamlessly connects to Python/SQLite backend with robust offline & GitHub Pages fallback

(function () {
  class UzhavanAuthManager {
    constructor() {
      this.token = localStorage.getItem('uzhavan_token') || null;
      this.user = null;
      this.activePlotId = localStorage.getItem('uzhavan_active_plot_id') ? parseInt(localStorage.getItem('uzhavan_active_plot_id')) : null;
      this.listeners = [];
      this.apiBase = window.location.origin;
    }

    async init() {
      // If we have a token, attempt to validate session with server
      if (this.token) {
        try {
          const res = await fetch(`${this.apiBase}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              this.setUser(data.user);
              return;
            }
          }
        } catch (e) {
          console.warn('[UzhavanAuth] API unavailable or offline mode, falling back to cached user', e);
        }
      }

      // Check cached user in localStorage
      const cached = localStorage.getItem('uzhavan_cached_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.setUser(parsed, false);
          return;
        } catch (e) {
          console.error('[UzhavanAuth] Cached user parse error', e);
        }
      }

      // Default demo initial state: Murugan
      this.loadDemoMurugan();
    }

    loadDemoMurugan() {
      const demoUser = {
        id: 1,
        email: "murugan@uzhavan.hub",
        profile: {
          full_name: "Murugan P.",
          mobile_number: "9876543210",
          preferred_language: "ta",
          state: "Tamil Nadu",
          district: "Madurai",
          village: "Vadipatti",
          farmer_type: "Owner",
          farming_experience: 15,
          primary_activity: "Oilseed & Pulses Farming"
        },
        plots: [
          {
            id: 1,
            plot_name: "Vadipatti North Field",
            state: "Tamil Nadu",
            district: "Madurai",
            village: "Vadipatti",
            location_address: "Survey No. 42/B, North Block",
            area: 3.0,
            area_unit: "acres",
            area_acres: 3.0,
            ownership_status: "owned",
            soil_type: "Red Soil",
            soil_ph: "6.8",
            irrigation_source: "Borewell",
            water_availability: "Moderate",
            current_crop: "Groundnut",
            previous_crop: "Cotton",
            planned_crop: "Groundnut TMV-7",
            planting_date: "2026-10-15",
            farming_budget: 60000
          },
          {
            id: 2,
            plot_name: "Vaigai Riverbank Plot",
            state: "Tamil Nadu",
            district: "Madurai",
            village: "Sholavandan",
            location_address: "River Road Canal Basin",
            area: 2.5,
            area_unit: "acres",
            area_acres: 2.5,
            ownership_status: "owned",
            soil_type: "Alluvial Soil",
            soil_ph: "7.2",
            irrigation_source: "Canal",
            water_availability: "Abundant / Year-round",
            current_crop: "Paddy",
            previous_crop: "Banana",
            planned_crop: "Ponni Rice",
            planting_date: "2026-11-01",
            farming_budget: 50000
          }
        ],
        total_acres: 5.5,
        plots_count: 2
      };
      this.setUser(demoUser, false);
    }

    setUser(userData, saveCache = true) {
      this.user = userData;
      if (saveCache && userData) {
        localStorage.setItem('uzhavan_cached_user', JSON.stringify(userData));
      }

      // Set active plot
      if (this.user && this.user.plots && this.user.plots.length > 0) {
        if (!this.activePlotId || !this.user.plots.some(p => p.id === this.activePlotId)) {
          this.activePlotId = this.user.plots[0].id;
          localStorage.setItem('uzhavan_active_plot_id', this.activePlotId);
        }
      } else {
        this.activePlotId = null;
        localStorage.removeItem('uzhavan_active_plot_id');
      }

      // Synchronize with existing UzhavanApp user profile structure
      this.syncWithApp();
      this.notifyListeners();
    }

    syncWithApp() {
      if (!this.user || !window.UzhavanApp) return;

      const prof = this.user.profile || {};
      const activePlot = this.getActivePlot();

      const synced = {
        id: `user_${this.user.id}`,
        name: prof.full_name || "Farmer",
        nameTa: prof.full_name || "உழவர்",
        location: prof.district ? `${prof.district}, Tamil Nadu` : "Madurai, Tamil Nadu",
        farmerType: prof.farmer_type || "Owner",
        landArea: activePlot ? activePlot.area_acres : (this.user.total_acres || 0),
        soilType: activePlot ? activePlot.soil_type : "Red Soil",
        waterSource: activePlot ? activePlot.irrigation_source : "Borewell",
        currentCrop: activePlot ? activePlot.current_crop : "Paddy",
        budget: activePlot ? activePlot.farming_budget : 50000,
        experience: prof.farming_experience || 10,
        language: prof.preferred_language || "ta"
      };

      window.UzhavanApp.userProfile = synced;
      localStorage.setItem('uzhavan_profile', JSON.stringify(synced));
      if (typeof window.UzhavanApp.renderNavigation === 'function') {
        window.UzhavanApp.renderNavigation();
      }
    }

    isAuthenticated() {
      return !!this.user && !!this.token;
    }

    getActivePlot() {
      if (!this.user || !this.user.plots || this.user.plots.length === 0) {
        return null;
      }
      if (this.activePlotId) {
        const found = this.user.plots.find(p => p.id === this.activePlotId);
        if (found) return found;
      }
      return this.user.plots[0];
    }

    setActivePlot(plotId) {
      this.activePlotId = parseInt(plotId);
      localStorage.setItem('uzhavan_active_plot_id', this.activePlotId);
      this.syncWithApp();
      this.notifyListeners();
      if (window.UzhavanApp) {
        const p = this.getActivePlot();
        window.UzhavanApp.showToast(`Switched active plot: ${p ? p.plot_name : 'Default'} 🌾`, 'info');
      }
    }

    async register(payload) {
      try {
        const res = await fetch(`${this.apiBase}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.token = data.token;
          localStorage.setItem('uzhavan_token', this.token);
          this.setUser(data.user);
          return { success: true, user: data.user, message: data.message };
        } else {
          return { success: false, error: data.error || "Registration could not be completed." };
        }
      } catch (err) {
        // Fallback for static GitHub Pages without Python server
        console.warn("[UzhavanAuth] Server registration unreachable, using local fallback store", err);
        return this.localRegisterFallback(payload);
      }
    }

    localRegisterFallback(payload) {
      const mockId = Date.now();
      const mockToken = "local_tok_" + Math.random().toString(36).substring(2);
      const plots = (payload.plots || []).map((p, idx) => {
        const area = parseFloat(p.area || 1.0);
        const unit = p.area_unit || 'acres';
        let area_acres = area;
        if (unit.toLowerCase().includes('hectare')) area_acres = +(area * 2.47105).toFixed(2);
        else if (unit.toLowerCase().includes('cent')) area_acres = +(area * 0.01).toFixed(2);
        return {
          id: idx + 10,
          user_id: mockId,
          plot_name: p.plot_name || `Plot ${idx + 1}`,
          state: payload.state || 'Tamil Nadu',
          district: payload.district || 'Madurai',
          village: payload.village || '',
          area: area,
          area_unit: unit,
          area_acres: area_acres,
          ownership_status: p.ownership_status || 'owned',
          soil_type: p.soil_type || 'Red Soil',
          soil_ph: p.soil_ph || 'Unknown',
          irrigation_source: p.irrigation_source || 'Borewell',
          water_availability: p.water_availability || 'Moderate',
          current_crop: p.current_crop || '',
          previous_crop: p.previous_crop || '',
          planned_crop: p.planned_crop || '',
          planting_date: p.planting_date || '',
          farming_budget: parseFloat(p.farming_budget || 50000)
        };
      });

      const total_acres = +(plots.reduce((acc, curr) => acc + curr.area_acres, 0)).toFixed(2);

      const user = {
        id: mockId,
        email: payload.email,
        profile: {
          full_name: payload.full_name,
          mobile_number: payload.mobile_number,
          preferred_language: payload.preferred_language || 'ta',
          state: payload.state || 'Tamil Nadu',
          district: payload.district || 'Madurai',
          village: payload.village || '',
          farmer_type: payload.farmer_type || 'Owner',
          farming_experience: parseInt(payload.farming_experience || 0),
          primary_activity: payload.primary_activity || 'Agriculture',
          profile_photo: payload.profile_photo || ''
        },
        plots: plots,
        total_acres: total_acres,
        plots_count: plots.length
      };

      this.token = mockToken;
      localStorage.setItem('uzhavan_token', this.token);
      this.setUser(user);
      return { success: true, user: user, message: "Registered successfully (Local mode)" };
    }

    async login(email, password) {
      try {
        const res = await fetch(`${this.apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.token = data.token;
          localStorage.setItem('uzhavan_token', this.token);
          this.setUser(data.user);
          return { success: true, user: data.user, message: data.message };
        } else {
          return { success: false, error: data.error || "Invalid email or password." };
        }
      } catch (err) {
        console.warn("[UzhavanAuth] Server login unreachable, checking local demo accounts", err);
        if (email.toLowerCase().includes('anitha')) {
          this.loadDemoAnitha();
          return { success: true, user: this.user, message: "Logged in as Anitha R. (Demo)" };
        } else if (email.toLowerCase().includes('murugan') || password === 'Farmer@123') {
          this.loadDemoMurugan();
          return { success: true, user: this.user, message: "Logged in as Murugan P. (Demo)" };
        }
        return { success: false, error: "Unable to connect to server and no offline account matched." };
      }
    }

    loadDemoAnitha() {
      const demoUser = {
        id: 2,
        email: "anitha@uzhavan.hub",
        profile: {
          full_name: "Anitha R.",
          mobile_number: "9842109876",
          preferred_language: "ta",
          state: "Tamil Nadu",
          district: "Thanjavur",
          village: "Kumbakonam",
          farmer_type: "Both (Owner & Tenant)",
          farming_experience: 8,
          primary_activity: "Paddy & Horticulture Cultivation"
        },
        plots: [
          {
            id: 3,
            plot_name: "Delta Paddy Fields",
            state: "Tamil Nadu",
            district: "Thanjavur",
            village: "Kumbakonam",
            location_address: "Kallanai Canal Feeder Basin",
            area: 4.0,
            area_unit: "acres",
            area_acres: 4.0,
            ownership_status: "owned",
            soil_type: "Clay Soil",
            soil_ph: "7.0",
            irrigation_source: "Canal",
            water_availability: "Abundant / Year-round",
            current_crop: "Rice",
            previous_crop: "Blackgram",
            planned_crop: "Samba Paddy",
            planting_date: "2026-10-20",
            farming_budget: 75000
          }
        ],
        total_acres: 4.0,
        plots_count: 1
      };
      this.setUser(demoUser, false);
    }

    async logout() {
      if (this.token) {
        try {
          await fetch(`${this.apiBase}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (e) {
          // ignore error on logout
        }
      }
      this.token = null;
      this.user = null;
      this.activePlotId = null;
      localStorage.removeItem('uzhavan_token');
      localStorage.removeItem('uzhavan_cached_user');
      localStorage.removeItem('uzhavan_active_plot_id');
      this.loadDemoMurugan();
      if (window.UzhavanApp) {
        window.UzhavanApp.showToast("Signed out successfully 🌾", "info");
        window.UzhavanApp.navigate('landing');
      }
    }

    async addPlot(plotData) {
      if (!this.user) return { success: false, error: "Must be logged in to add a plot" };

      try {
        const res = await fetch(`${this.apiBase}/api/plots`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(plotData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.user) {
            this.setUser(data.user);
          }
          return { success: true, plot: data.plot };
        } else {
          return { success: false, error: data.error || "Failed to add plot" };
        }
      } catch (err) {
        // Local fallback
        const area = parseFloat(plotData.area || 1.0);
        const unit = plotData.area_unit || 'acres';
        let area_acres = area;
        if (unit.toLowerCase().includes('hectare')) area_acres = +(area * 2.47105).toFixed(2);
        else if (unit.toLowerCase().includes('cent')) area_acres = +(area * 0.01).toFixed(2);

        const newPlot = {
          id: Date.now(),
          user_id: this.user.id,
          ...plotData,
          area: area,
          area_acres: area_acres
        };
        this.user.plots = this.user.plots || [];
        this.user.plots.push(newPlot);
        this.user.total_acres = +(this.user.plots.reduce((acc, p) => acc + p.area_acres, 0)).toFixed(2);
        this.user.plots_count = this.user.plots.length;
        this.setUser(this.user);
        return { success: true, plot: newPlot };
      }
    }

    async updatePlot(plotId, plotData) {
      try {
        const res = await fetch(`${this.apiBase}/api/plots/${plotId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(plotData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.user) this.setUser(data.user);
          return { success: true, plot: data.plot };
        } else {
          return { success: false, error: data.error || "Failed to update plot" };
        }
      } catch (err) {
        // Local fallback
        const idx = this.user.plots.findIndex(p => p.id === plotId);
        if (idx !== -1) {
          this.user.plots[idx] = { ...this.user.plots[idx], ...plotData };
          this.setUser(this.user);
          return { success: true, plot: this.user.plots[idx] };
        }
        return { success: false, error: "Plot not found" };
      }
    }

    async deletePlot(plotId) {
      try {
        const res = await fetch(`${this.apiBase}/api/plots/${plotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.user) this.setUser(data.user);
          return { success: true };
        } else {
          return { success: false, error: data.error || "Failed to delete plot" };
        }
      } catch (err) {
        this.user.plots = (this.user.plots || []).filter(p => p.id !== plotId);
        this.user.total_acres = +(this.user.plots.reduce((acc, p) => acc + p.area_acres, 0)).toFixed(2);
        this.user.plots_count = this.user.plots.length;
        this.setUser(this.user);
        return { success: true };
      }
    }

    subscribe(listener) {
      if (typeof listener === 'function') {
        this.listeners.push(listener);
      }
    }

    notifyListeners() {
      this.listeners.forEach(fn => {
        try {
          fn(this.user, this.getActivePlot());
        } catch (e) {
          console.error('[UzhavanAuth] Listener error:', e);
        }
      });
    }
  }

  window.UzhavanAuth = new UzhavanAuthManager();
})();
