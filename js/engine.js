// Uzhavan Hub - AI Farming Decision Engine
// Core intelligent synthesis algorithm combining Farmer Profile, Soil, Weather, Water, Season, Budget, and Market Dynamics.

class DecisionEngine {
  constructor(cropsData, marketData) {
    this.crops = cropsData || (window.UZHAVAN_DATA ? window.UZHAVAN_DATA.CROPS_DATA : []);
    this.market = marketData || (window.UZHAVAN_DATA ? window.UZHAVAN_DATA.MARKET_PRICES : []);
  }

  getCrops() {
    return (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_DATA && window.UZHAVAN_DATA.CROPS_DATA.length > 0)
      ? window.UZHAVAN_DATA.CROPS_DATA
      : this.crops;
  }

  getMarket() {
    return (window.UZHAVAN_DATA && window.UZHAVAN_DATA.MARKET_PRICES && window.UZHAVAN_DATA.MARKET_PRICES.length > 0)
      ? window.UZHAVAN_DATA.MARKET_PRICES
      : this.market;
  }

  analyzeFarm(params) {
    const {
      location = "Madurai District",
      landArea = 3.0,
      soilType = "Red Soil",
      waterSource = "Borewell",
      season = "Kharif (Monsoon)",
      budget = 60000,
      preferredCrop = ""
    } = params;

    const acres = Math.max(0.5, parseFloat(landArea) || 1.0);
    const totalBudget = Math.max(5000, parseFloat(budget) || 30000);
    const budgetPerAcre = totalBudget / acres;
    const allCrops = this.getCrops();
    const marketPrices = this.getMarket();
    const detailedRecs = (window.UZHAVAN_DATA && window.UZHAVAN_DATA.CROPS_RECOMMENDATIONS) || [];

    // Extract district keyword for localized matching
    const districtKey = location.replace(/ District/i, "").trim().toLowerCase();

    // Check for missing inputs and calculate confidence discount
    const missingInputs = [];
    if (!params.soilType || params.soilType === "Other") missingInputs.push("Soil pH / Soil Test Data");
    if (!params.waterSource) missingInputs.push("Water Source Capacity");
    if (!params.location) missingInputs.push("Local District / Weather Station");

    // Score all crops in database using transparent multi-criteria agronomic weights
    const scoredCrops = allCrops.map(crop => {
      let score = 40; // baseline agronomic score
      const scoreReasons = [];
      const riskFactors = [];

      // 1. Soil Compatibility (Weight: 25 pts)
      const soilMatch = crop.soilTypes.some(s => s.toLowerCase() === soilType.toLowerCase() || soilType.toLowerCase().includes(s.toLowerCase()));
      if (soilMatch) {
        score += 25;
        scoreReasons.push(`Highly compatible with ${soilType}`);
      } else if (crop.soilTypes.some(s => s.toLowerCase().includes("alluvial") || s.toLowerCase().includes("red") || s.toLowerCase().includes("loam"))) {
        score += 14;
        scoreReasons.push(`Moderately adaptable to ${soilType}`);
      } else {
        score += 4;
        riskFactors.push(`Soil texture ${soilType} suboptimal for root development`);
      }

      // 2. Water Availability Compatibility (Weight: 20 pts)
      const isRainfed = waterSource.toLowerCase().includes("rain");
      const isAbundant = waterSource.toLowerCase().includes("canal") || waterSource.toLowerCase().includes("borewell");
      
      if (crop.waterNeed === "High") {
        if (isAbundant) {
          score += 20;
          scoreReasons.push(`Adequate irrigation available for high water requirement`);
        } else if (isRainfed) {
          score -= 15;
          riskFactors.push(`High drought risk under rain-fed cultivation`);
        } else {
          score += 8;
          riskFactors.push(`Requires strict water budgeting`);
        }
      } else if (crop.waterNeed === "Moderate") {
        if (isAbundant) {
          score += 18;
          scoreReasons.push(`Optimal water supply assured`);
        } else if (isRainfed) {
          score += 10;
          scoreReasons.push(`Can tolerate intermittent dry spells`);
        } else {
          score += 18;
        }
      } else { // Low water need
        score += 20;
        scoreReasons.push(`Excellent drought resilience & minimal water need`);
        if (isRainfed) score += 5;
      }

      // 3. Season Compatibility (Weight: 15 pts)
      const seasonMatch = crop.suitableSeasons.some(s => 
        season.toLowerCase().includes(s.toLowerCase().split(" ")[0]) ||
        s.toLowerCase().includes(season.toLowerCase().split(" ")[0])
      );
      if (seasonMatch) {
        score += 15;
        scoreReasons.push(`Ideal growing window for ${season}`);
      } else {
        score += 6;
        riskFactors.push(`Off-season thermal/photoperiod stress possible`);
      }

      // 4. Budget Feasibility (Weight: 15 pts)
      const requiredPerAcre = crop.investmentPerAcre;
      if (budgetPerAcre >= requiredPerAcre) {
        score += 15;
        scoreReasons.push(`Within available budget (₹${budgetPerAcre.toLocaleString()}/acre vs ₹${requiredPerAcre.toLocaleString()} req.)`);
      } else if (budgetPerAcre >= requiredPerAcre * 0.75) {
        score += 8;
        riskFactors.push(`Budget is tight; working capital support may be needed`);
      } else {
        score -= 12;
        riskFactors.push(`Requires ₹${requiredPerAcre.toLocaleString()}/acre, exceeding allocated budget`);
      }

      // 5. Market Demand & Mandi Price Momentum (Weight: 15 pts)
      const marketItem = marketPrices.find(m => m.cropId === crop.id && (!districtKey || m.district.toLowerCase().includes(districtKey))) ||
                         marketPrices.find(m => m.cropId === crop.id);
      if (marketItem) {
        if (marketItem.trend === "up") {
          score += 15;
          scoreReasons.push(`Positive mandi price momentum (+${marketItem.modalPrice ? '₹' + marketItem.modalPrice : 'bullish'})`);
        } else if (marketItem.trend === "stable") {
          score += 10;
          scoreReasons.push(`Stable market prices in regional APMC mandis`);
        } else {
          score += 4;
          riskFactors.push(`Market prices showing downward trend`);
        }
      } else {
        score += 8;
      }

      // 6. User Preferred Crop Bonus (Transparent, Non-Overriding)
      let preferenceBonus = 0;
      let preferenceWarning = null;
      const isSelected = preferredCrop && (
        crop.id.toLowerCase() === preferredCrop.toLowerCase() ||
        crop.name.toLowerCase() === preferredCrop.toLowerCase()
      );
      if (isSelected) {
        // Safe preference bonus - does NOT override severe agronomic risk or budget shortfall
        if (budgetPerAcre < requiredPerAcre * 0.6) {
          preferenceBonus = 10;
          preferenceWarning = "Selected as preferred crop, but required investment exceeds current budget. Consider micro-finance or allied credit.";
        } else if (isRainfed && crop.waterNeed === "High") {
          preferenceBonus = 10;
          preferenceWarning = "Selected as preferred crop, but high water requirement poses drought risk under rain-fed conditions.";
        } else {
          preferenceBonus = 35;
          scoreReasons.push(`Matched farmer's preferred crop interest`);
        }
      }

      score += preferenceBonus;

      // Deduct confidence if critical farm parameters were missing
      let confidencePenalty = missingInputs.length * 5;
      score = Math.max(30, score - confidencePenalty);

      // Find granular record from 270 dataset for this crop & district
      const matchedRec = detailedRecs.find(r => 
        r.cropId === crop.id && 
        r.district.toLowerCase().includes(districtKey)
      ) || detailedRecs.find(r => r.cropId === crop.id) || null;

      // Realistic suitability percentage (capped between 45% and 98%)
      const finalSuitability = Math.min(98, Math.max(45, Math.round(score)));

      // Scaled financials for given land area - exact formulas
      // investment = cost_per_acre * land_area
      // yield = yield_per_acre * land_area
      // revenue = yield * market_price
      // profit = revenue - investment
      // roi = (profit / investment) * 100
      const unitCost = matchedRec ? matchedRec.investmentPerAcre : crop.investmentPerAcre;
      const unitYield = matchedRec ? matchedRec.yieldPerAcre : crop.yieldPerAcre;
      const unitPrice = matchedRec ? matchedRec.marketPrice : crop.marketPrice;

      const estimatedInvestment = Math.round(unitCost * acres);
      const expectedYield = Math.round(unitYield * acres);
      const expectedRevenue = Math.round(expectedYield * unitPrice);
      const estimatedProfit = Math.round(expectedRevenue - estimatedInvestment);
      const roiPercent = estimatedInvestment > 0 ? Math.round((estimatedProfit / estimatedInvestment) * 100) : 0;

      // Synthesized risk level
      let riskLevel = crop.riskLevel;
      if (isRainfed && crop.waterNeed === "High") riskLevel = "HIGH";
      if (budgetPerAcre < unitCost * 0.8 && riskLevel === "LOW") riskLevel = "MEDIUM";
      if (riskFactors.length >= 2) riskLevel = "HIGH";

      return {
        ...crop,
        suitabilityScore: finalSuitability,
        estimatedInvestment,
        expectedYield,
        marketPrice: unitPrice,
        expectedRevenue,
        estimatedProfit,
        roiPercent,
        calculatedRisk: riskLevel,
        scoreReasons,
        riskFactors,
        preferenceWarning,
        marketItem: marketItem || null,
        detailedRecord: matchedRec,
        soilPH: matchedRec ? matchedRec.soilPH : "6.0 - 7.5",
        nitrogen: matchedRec ? matchedRec.nitrogen : "45 kg/acre",
        phosphorus: matchedRec ? matchedRec.phosphorus : "25 kg/acre",
        potassium: matchedRec ? matchedRec.potassium : "25 kg/acre",
        rainfall: matchedRec ? matchedRec.rainfall : "650 mm",
        temperature: matchedRec ? matchedRec.temperature : "25 - 32°C",
        humidity: matchedRec ? matchedRec.humidity : "65 - 75%",
        recommendedFertilizer: matchedRec ? matchedRec.recommendedFertilizer : (crop.fertilizer ? crop.fertilizer.npk : "Balanced NPK"),
        irrigationAdvice: matchedRec ? matchedRec.irrigationAdvice : "Provide scheduled irrigation at critical flowering and root formation stages.",
        diseaseRiskPrevention: matchedRec ? matchedRec.diseaseRiskPrevention : "Scout weekly for foliar spots and manage with recommended bio-pesticides.",
        fertilizerSchedule: matchedRec ? matchedRec.fertilizerSchedule : (crop.weeklyPlan ? {} : null),
        dataStatus: "Demo Data – For Prototype Testing"
      };
    });

    // Sort descending by suitability score
    scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    const primaryCrop = scoredCrops[0];
    const alternativeCrops = scoredCrops.slice(1, 5);

    return {
      primaryCrop,
      alternativeCrops,
      allRecommendations: scoredCrops,
      queryMeta: {
        location,
        landArea: acres,
        soilType,
        waterSource,
        season,
        budget: totalBudget,
        preferredCrop,
        missingInputs,
        analyzedAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      },
      disclaimer: "Profit, yield, and market price values are AI-assisted estimates/demo predictions based on agro-climatic models and historical mandi rates. Actual results depend on field management and weather conditions."
    };
  }

  // Quick 5-step wizard evaluator
  evaluateQuickWizard(answers) {
    const {
      location = "Madurai",
      soilType = "Red Soil",
      waterLevel = "Moderate",
      budgetRange = "50000",
      season = "Kharif (Monsoon)"
    } = answers;

    let waterSourceMapped = "Borewell";
    if (waterLevel.toLowerCase().includes("rain")) waterSourceMapped = "Rain-fed";
    else if (waterLevel.toLowerCase().includes("high") || waterLevel.toLowerCase().includes("canal")) waterSourceMapped = "Canal";
    else if (waterLevel.toLowerCase().includes("low")) waterSourceMapped = "Well";

    return this.analyzeFarm({
      location: location.includes("District") ? location : `${location} District`,
      landArea: 2.5,
      soilType,
      waterSource: waterSourceMapped,
      season,
      budget: parseFloat(budgetRange) || 50000
    });
  }
}

// Global initialization
window.UzhavanDecisionEngine = new DecisionEngine();
