import { PriceEvent } from "@shared/schema";

export interface IStorage {
  getPrices(): Promise<PriceEvent[]>;
}

export class AppStorage implements IStorage {
  async getPrices(): Promise<PriceEvent[]> {
    // In a production environment with a real Google Sheets URL, you would fetch it here:
    // const response = await fetch("YOUR_GOOGLE_SHEETS_JSON_URL");
    // return await response.json();
    
    return mockData;
  }
}

export const storage = new AppStorage();

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastYear = new Date(today);
lastYear.setFullYear(lastYear.getFullYear() - 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const generateHistory = (baseEvent: Omit<PriceEvent, "date" | "price">, currentPrice: number, volatility: number) => {
  return [
    { ...baseEvent, date: formatDate(today), price: currentPrice },
    { ...baseEvent, date: formatDate(yesterday), price: currentPrice * (1 + (Math.random() * volatility - volatility/2)) },
    { ...baseEvent, date: formatDate(lastWeek), price: currentPrice * (1 + (Math.random() * volatility - volatility/2)) },
    { ...baseEvent, date: formatDate(lastMonth), price: currentPrice * (1 + (Math.random() * volatility*2 - volatility)) },
    { ...baseEvent, date: formatDate(lastYear), price: currentPrice * (1 + (Math.random() * volatility*3 - volatility*1.5)) },
  ].map(e => ({ ...e, price: Number(e.price.toFixed(2)) }));
};

const mockData: PriceEvent[] = [
  // 1. Metals & Currency
  ...generateHistory({ item_id: "usd_bank", nameAr: "USD (Bank)", category: "🪙 Metals & Currency", unit: "EGP", description: "Official bank exchange rate for USD to EGP." }, 30.9, 0.01),
  ...generateHistory({ item_id: "usd_black_market", nameAr: "USD (Black Market)", category: "🪙 Metals & Currency", unit: "EGP", description: "Parallel market exchange rate for USD to EGP." }, 48.5, 0.05),
  ...generateHistory({ item_id: "gold_21k", nameAr: "Gold 21k", category: "🪙 Metals & Currency", unit: "EGP / Gram", description: "Local price for 21 karat gold per gram." }, 3150, 0.03),
  ...generateHistory({ item_id: "gold_24k", nameAr: "Gold 24k", category: "🪙 Metals & Currency", unit: "EGP / Gram", description: "Local price for 24 karat gold per gram." }, 3600, 0.03),
  
  // 2. Global Benchmarks
  ...generateHistory({ item_id: "global_gold", nameAr: "Global Gold Ounce", category: "🌍 Global Benchmarks", unit: "USD", description: "Global benchmark price for one ounce of gold." }, 2050, 0.02),
  ...generateHistory({ item_id: "brent_crude", nameAr: "Brent Crude Oil", category: "🌍 Global Benchmarks", unit: "USD / Barrel", description: "Global benchmark for crude oil." }, 82.5, 0.04),
  ...generateHistory({ item_id: "btc", nameAr: "Bitcoin (BTC)", category: "🌍 Global Benchmarks", unit: "USD", description: "Current price of Bitcoin." }, 64000, 0.1),

  // 3. Energy & Fuel
  ...generateHistory({ item_id: "gas_95", nameAr: "Gasoline 95", category: "⛽ Energy & Fuel", unit: "EGP / Liter", description: "Regulated price for 95 octane gasoline." }, 13.5, 0.01),
  ...generateHistory({ item_id: "diesel", nameAr: "Diesel", category: "⛽ Energy & Fuel", unit: "EGP / Liter", description: "Regulated price for diesel." }, 10, 0.01),

  // 4. Utilities & Services
  ...generateHistory({ item_id: "elec_slab_1", nameAr: "Electricity (Slab 1: 0-50 kWh)", category: "💡 Utilities & Services", unit: "EGP / kWh", description: "First residential electricity consumption tier." }, 0.58, 0.0),
  ...generateHistory({ item_id: "metro_1_zone", nameAr: "Metro Ticket (1 Zone)", category: "💡 Utilities & Services", unit: "EGP", description: "Standard Cairo Metro ticket for up to 9 stations." }, 6, 0.0),

  // 5. Basic Groceries & Food
  ...generateHistory({ item_id: "sugar_free", nameAr: "Free-market Sugar", category: "🛒 Basic Groceries & Food", unit: "EGP / kg", description: "Price of sugar in the open market." }, 35, 0.05),
  ...generateHistory({ item_id: "poultry", nameAr: "Fresh Poultry", category: "🛒 Basic Groceries & Food", unit: "EGP / kg", description: "Average price of fresh white poultry." }, 95, 0.08),
  ...generateHistory({ item_id: "tomatoes", nameAr: "Tomatoes", category: "🛒 Basic Groceries & Food", unit: "EGP / kg", description: "Average market price for fresh tomatoes." }, 15, 0.1),

  // 6. Tech & Electronics
  ...generateHistory({ item_id: "iphone_15_pro_max", nameAr: "iPhone 15 Pro Max", category: "📱 Tech & Electronics", unit: "EGP", description: "Apple iPhone 15 Pro Max 256GB local market price." }, 65000, 0.03),
  ...generateHistory({ item_id: "ps5", nameAr: "PlayStation 5 Console", category: "📱 Tech & Electronics", unit: "EGP", description: "Sony PlayStation 5 Disc Edition." }, 28000, 0.02),

  // 7. Construction & Agriculture
  ...generateHistory({ item_id: "ezz_steel", nameAr: "Ezz Steel", category: "🏗️ Construction & Agriculture", unit: "EGP / Ton", description: "Price of Ezz steel rebar per ton." }, 46000, 0.04),
  ...generateHistory({ item_id: "suez_cement", nameAr: "Suez Cement", category: "🏗️ Construction & Agriculture", unit: "EGP / Ton", description: "Price of Suez cement per ton." }, 2100, 0.02),

  // 8. Digital Subscriptions
  ...generateHistory({ item_id: "netflix_premium", nameAr: "Netflix (Premium)", category: "🎟️ Digital Subscriptions & Entertainment", unit: "EGP / Month", description: "Monthly subscription for Netflix Premium." }, 165, 0.0),
  ...generateHistory({ item_id: "spotify_individual", nameAr: "Spotify (Individual)", category: "🎟️ Digital Subscriptions & Entertainment", unit: "EGP / Month", description: "Monthly subscription for Spotify." }, 50, 0.0),
];
