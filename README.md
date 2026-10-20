# Uzhavan Hub – Your Digital Farming Companion 🌾
*(உழவன் ஹப் – உங்கள் டிஜிட்டல் விவசாய தோழன்)*

**Uzhavan Hub** is an AI-powered all-in-one digital farming platform that helps farmers make better farming decisions and easily access agricultural services, resources, skilled workers, machinery, and livestock healthcare.

---

## 🌟 The 5 Pillars of Uzhavan Hub (Value Proposition)

```
                       🌾 UZHAVAN HUB ECOSYSTEM
                                  │
    ┌──────────────┬──────────────┼──────────────┬──────────────┐
    ▼              ▼              ▼              ▼              ▼
1. 🌱 FARM    2. 🛠️ FARM    3. 🐄 LIVESTOCK 4. 💰 FARM    5. 🎙️ FARMER
   DECISION      SERVICES        CARE           FINANCE        ASSISTANCE
   ────────      ─────────       ────────       ───────        ──────────
   • AI Engine   • Farm Workers  • Vet Hospital • Mandi Prices • Tamil & English
   • Weather     • Tractors      • Vet Doctors  • Govt Schemes   Voice Assistant
   • Fertilizer  • Harvesters    • Cattle Health• Agri Credit  • Context-Aware
   • Crop Health • Rotavators    • 24/7 Helpline• 4% KCC Loans • Hands-Free Mic
   • Profits     • Sprayers        (Dial 1962)
```

1. **🌱 FARM DECISION**: AI crop recommendation, agro-weather alerts, soil health, fertilizer scheduling, crop health scanner, and net profit predictions.
2. **🛠️ FARM SERVICES**: Farm worker booking (planting, harvesting, weeding) and machinery rental (tractors, combine harvesters, rotavators, sprayers).
3. **🐄 LIVESTOCK CARE**: Nearby veterinary hospitals, doctors, cattle health guides (cow, buffalo, goat, sheep, poultry), and 24/7 emergency assistance (1962).
4. **💰 FARM FINANCE**: Wholesale mandi spot prices with "Sell or Wait?" trend insights, PM-KISAN & solar pump schemes, and 4% KCC crop credit.
5. **🎙️ FARMER ASSISTANCE**: Bilingual "Uzhavan AI" voice assistant supporting spoken Tamil (தமிழ்) and English Speech-to-Text and audio synthesis grounded in the farmer's actual profile.

---

## 🏗️ System Architecture & Block Diagram

```
Farmer Profile (Name, Location, Land Area, Budget)
      ↓
Farm Data (Soil Type, Water Source, Season, Current Crop)
      ↓
┌───────────────────────────────────────────────┐
│         🤖 AI FARMING DECISION ENGINE          │
└───────────────────────────────────────────────┘
      ↓
┌───────────────┬────────────────┬──────────────┐
│  Soil Data    │  Weather Data  │  Market Data │
│ (NPK, Texture)│ (Forecast,Rain)│ (Mandi Price)│
└───────────────┴────────────────┴──────────────┘
      ↓
Personalized Synthesis & Unified Service Routing
      ↓
┌───────────────┬────────────────┬──────────────┐
│ 1. DECISION   │ 2. SERVICES    │ 3. LIVESTOCK │
│ Crop/Profit   │ Workers/Tractor│ Vet Care/Cows│
├───────────────┼────────────────┼──────────────┤
│ 4. FINANCE    │ 5. ASSISTANCE  │ 6. CALENDAR  │
│ Mandi/Schemes │ Uzhavan Voice  │ Weekly Action│
└───────────────┴────────────────┴──────────────┘
      ↓
Farmer (Better Decisions, Lower Costs, High Yield)
```

---

## 🚜 New Modules Detailed

### 1. 👨‍🌾 Farm Labour Rental / Farm Worker Booking
- **Find Farm Workers**: Verified profiles showing Worker Name, Photo Avatar, Location, Distance from farmer's farm, Type of Work, Experience, Daily Wage, Rating, and Availability.
- **7 Work Categories**: 🌱 Planting, 🌾 Harvesting, 🧹 Weeding, 💧 Irrigation work, 🧪 Fertilizer application, 🐄 Livestock care, and 🚜 General farm work.
- **Filter By**: Distance (5 km, 10 km, any), Work type, Daily wage (Under ₹650, ₹650–₹750, Above ₹750), Availability (Today / Tomorrow), and Experience.
- **Interactive Booking Form**: Select Work Type, Farm Location, Required Workers, Date, Working Hours (Full day / Half day), and Auto-calculated Daily Wage Total.
- **Booking Status Management**: Real-time status tracking for *Pending*, *Confirmed*, *Completed*, and *Cancelled* jobs.

### 2. 🚜 Agricultural Machinery Rental
- **Rent Machinery**: Rent high-capital equipment at low hourly or daily rates.
- **8 Equipment Types**: 🚜 Tractor (John Deere, Mahindra 45-50 HP), 🌾 Track Combine Harvester, 🌱 9-Row Seed Drill, 💧 5HP Diesel High-Pressure Water Pump, 🌾 Multi-crop Thresher, 🧪 Battery/Power Sprayer, 🚜 6-Ft Rotavator, and 🌱 9-Tyne Cultivator.
- **Machine Cards**: Image, Machine Name, Owner/Provider, Location, Distance, Rental Price (Per Day / Per Hour), Availability, and Rating.
- **Duration Modes**: Per Hour, Per Day, and Multiple Days with automatic rental cost estimation.
- **Rental Confirmation Flow**: Schedule date, duration quantity, delivery farm location, field purpose, and booking tracker.

### 3. 🛠️ Combined "Farm Services" Hub
- Overview dashboard with 2 prominent cards:
  - `[ 👨‍🌾 HIRE FARM WORKERS ]`
  - `[ 🚜 RENT FARM MACHINERY ]`
- **Smart Location Proximity Radar**: Ranks nearby workers (e.g., Selvamani at 2.4 km) and machinery (e.g., Mahindra Tractor at 3.2 km) relative to the farmer's district.

### 4. 🐄 Nearby Veterinary Care & Cattle Health
- **🚨 24/7 Veterinary Emergency Dispatch**: Direct 1-click connection to the Animal Emergency Helpline (Toll-Free 1962) and mobile emergency veterinary ambulance.
- **Nearby Veterinary Facilities**: 60 Government Veterinary Polyclinics and Dispensaries across 15 districts with distance, hours, phone numbers, and ratings.
- **Cattle & Livestock Health Guide**: Interactive species selector for Cow, Buffalo, Goat, Sheep, and Poultry with symptoms, preventive guidance, and veterinarian consultation notices.
- **Mandatory Medical Disclaimer**: Explicitly states that AI is educational and advises consulting a qualified veterinarian immediately for severe conditions.

### 5. 🌐 FarmLingo: Cross-Language Buyer-Farmer Communication (Signature Innovation)
- **Bidirectional Negotiation**: Allows a Tamil-speaking farmer to chat with a Hindi-speaking mandi buyer without either understanding the other's language.
- **Side-by-Side Dual Display**: Retains both original message and translated message to eliminate commercial misunderstandings.
- **Web Speech & Audio Playback**: Audio playback with SpeechSynthesis (`ta-IN`, `hi-IN`, `en-IN`) and microphone speech input with graceful keyboard fallback.
- **Verified Agricultural Lexicon**: Precision trade mappings for crops, moisture, quintals, bags, delivery, advance payments, and quality grades.
- **Translation Correction Workflow**: Allows users to suggest translation improvements and logs corrections locally for continuous training review.

### 6. 📊 Farm Finance & Cultivation Cost Calculator
- **Itemized Cultivation Cost Calculator**: Simulates exact expenses for seeds, fertilizers, labour, irrigation, harvesting, and transport across 18 crops and customized acreage.
- **Local Operating Cashflow Ledger**: Record income and expenses with running balance stored in local browser cache.
- **Break-Even Estimator**: Calculates minimum break-even yield (kg/acre) and minimum break-even mandi price (₹/kg).

### 7. 👥 Farmer Community & Expert Support
- **Crop-wise Discussion Boards**: Community Q&A feed categorized by Crop Advisory, Pest Management, Organic Practices, and Market Tips.
- **Clear Response Identification**: Visually distinguishes `[Verified Expert]` (TNAU/KVK scientists) from `[Fellow Farmer]` (community opinion) and `[Uzhavan AI]` (instant screening).
- **1-on-1 Consultation Request**: Direct appointment request for on-field visits by Assistant Agricultural Officers.

### 8. 📋 Farm Management & Field Calendar
- **Farmer Profile Storage**: Holds farm holding acreage, soil type, irrigation capacity, budget, current crops, and past harvest outcomes.
- **One-Click Prefill**: Automatically synchronizes saved profile parameters into the AI Farming Decision Engine.
- **Operational Task Calendar**: Track weekly field operations from sowing to harvest with completion checkboxes.

---

## 🚀 How to Run the Application

### Option A: One-Click Windows Batch File
Double-click `start_app.bat` inside this folder. It will start the local Python web server and launch your default web browser at `http://localhost:8000`.

### Option B: Command Line
```powershell
cd C:\Users\Tharunkumar\.gemini\antigravity\scratch\uzhavan-hub
py server.py --open
```

Navigate to:
```
http://localhost:8000
```

---

## 🧪 Automated Verification
Run the comprehensive verification suite testing all 25 files, datasets, calculations, and server routes:
```powershell
py verify.py
```
