import { PriceEvent } from "@shared/schema";

export interface IStorage {
  getPrices(): Promise<PriceEvent[]>;
}

export class AppStorage implements IStorage {
  async getPrices(): Promise<PriceEvent[]> {
    return mockData;
  }
}

export const storage = new AppStorage();

const mockData: PriceEvent[] = [
  // Currencies
  { item_id: "cur_usd_bank", nameAr: "دولار (بنك)", category: "💱 العملات", unit: "ج / $", date: "2026-03-06", price: 30.75, description: "سعر الدولار الرسمي" },
  { item_id: "cur_usd_parallel", nameAr: "دولار (موازي)", category: "💱 العملات", unit: "ج / $", date: "2026-03-06", price: 32.1, description: "سعر الدولار بالسوق الموازي" },
  { item_id: "cur_eur", nameAr: "يورو", category: "💱 العملات", unit: "ج / €", date: "2026-03-06", price: 34.1, description: "سعر اليورو" },
  { item_id: "cur_gbp", nameAr: "جنيه إسترليني", category: "💱 العملات", unit: "ج / £", date: "2026-03-06", price: 39.8, description: "سعر الجنيه الإسترليني" },
  { item_id: "cur_sar", nameAr: "ريال سعودي", category: "💱 العملات", unit: "ج / ﷼", date: "2026-03-06", price: 8.3, description: "سعر الريال السعودي" },
  { item_id: "cur_aed", nameAr: "درهم إماراتي", category: "💱 العملات", unit: "ج / د.إ", date: "2026-03-06", price: 8.4, description: "سعر الدرهم الإماراتي" },
  { item_id: "cur_kwd", nameAr: "دينار كويتي", category: "💱 العملات", unit: "ج / د.ك", date: "2026-03-06", price: 101.2, description: "سعر الدينار الكويتي" },

  // Crypto
  { item_id: "crypto_btc", nameAr: "بيتكوين", category: "₿ العملات الرقمية", unit: "EGP", date: "2026-03-06", price: 3750000, description: "سعر البيتكوين" },
  { item_id: "crypto_eth", nameAr: "إيثريوم", category: "₿ العملات الرقمية", unit: "EGP", date: "2026-03-06", price: 105000, description: "سعر الإيثريوم" },
  { item_id: "crypto_usdt", nameAr: "تيثر USDT", category: "₿ العملات الرقمية", unit: "ج / $", date: "2026-03-06", price: 30.9, description: "سعر التيثر" },
  { item_id: "crypto_sol", nameAr: "سولانا", category: "₿ العملات الرقمية", unit: "EGP", date: "2026-03-06", price: 6200, description: "سعر سولانا" },

  // Metals
  { item_id: "metal_gold21", nameAr: "ذهب عيار 21", category: "🥇 المعادن", unit: "ج / جرام", date: "2026-03-06", price: 3806, description: "سعر الذهب عيار 21" },
  { item_id: "metal_gold24", nameAr: "ذهب عيار 24", category: "🥇 المعادن", unit: "ج / جرام", date: "2026-03-06", price: 4350, description: "سعر الذهب عيار 24" },
  { item_id: "metal_gold18", nameAr: "ذهب عيار 18", category: "🥇 المعادن", unit: "ج / جرام", date: "2026-03-06", price: 3263, description: "سعر الذهب عيار 18" },
  { item_id: "metal_goldpound", nameAr: "جنيه ذهب", category: "🥇 المعادن", unit: "ج / قطعة", date: "2026-03-06", price: 30450, description: "سعر الجنيه الذهب" },
  { item_id: "metal_silver", nameAr: "فضة 925", category: "🥇 المعادن", unit: "ج / جرام", date: "2026-03-06", price: 58, description: "سعر الفضة" },
  { item_id: "metal_gold_oz", nameAr: "أونصة ذهب عالمية", category: "🥇 المعادن", unit: "$ / oz", date: "2026-03-06", price: 2320, description: "سعر أونصة الذهب عالمياً" },

  // Fuel
  { item_id: "fuel_95", nameAr: "بنزين 95", category: "⛽ الوقود", unit: "ج / لتر", date: "2026-03-06", price: 15.0, description: "سعر البنزين 95 أوكتان" },
  { item_id: "fuel_92", nameAr: "بنزين 92", category: "⛽ الوقود", unit: "ج / لتر", date: "2026-03-06", price: 14.0, description: "سعر البنزين 92 أوكتان" },
  { item_id: "fuel_80", nameAr: "بنزين 80", category: "⛽ الوقود", unit: "ج / لتر", date: "2026-03-06", price: 12.0, description: "سعر البنزين 80" },
  { item_id: "fuel_diesel", nameAr: "سولار", category: "⛽ الوقود", unit: "ج / لتر", date: "2026-03-06", price: 12.5, description: "سعر السولار" },
  { item_id: "fuel_gas", nameAr: "بوتاجاز منزلي", category: "⛽ الوقود", unit: "ج / أسطوانة", date: "2026-03-06", price: 100, description: "سعر أسطوانة البوتاجاز" },
  { item_id: "fuel_brent", nameAr: "نفط برنت", category: "⛽ الوقود", unit: "$ / barrel", date: "2026-03-06", price: 82, description: "سعر برميل برنت عالمياً" },

  // Electricity
  { item_id: "elec_slab1", nameAr: "كهرباء 0–50 ك.و", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 36, description: "الشريحة الأولى السكنية" },
  { item_id: "elec_slab2", nameAr: "كهرباء 51–100 ك.و", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 60, description: "الشريحة الثانية" },
  { item_id: "elec_slab3", nameAr: "كهرباء 101–200 ك.و", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 77, description: "الشريحة الثالثة" },
  { item_id: "elec_slab4", nameAr: "كهرباء 201–350 ك.و", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 100, description: "الشريحة الرابعة" },
  { item_id: "elec_slab5", nameAr: "كهرباء 351–650 ك.و", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 145, description: "الشريحة الخامسة" },
  { item_id: "elec_commercial", nameAr: "كهرباء تجاري", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 185, description: "تعريفة الكهرباء التجارية" },
  { item_id: "elec_industrial", nameAr: "كهرباء صناعي", category: "💡 الكهرباء", unit: "قرش / ك.و", date: "2026-03-06", price: 170, description: "تعريفة الكهرباء الصناعية" },

  // Vegetables
  { item_id: "veg_tomato", nameAr: "طماطم", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 7.0, description: "سعر الطماطم الطازجة" },
  { item_id: "veg_onion", nameAr: "بصل", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 9.5, description: "سعر البصل" },
  { item_id: "veg_potato", nameAr: "بطاطس", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 8.5, description: "سعر البطاطس" },
  { item_id: "veg_lemon", nameAr: "ليمون", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 15, description: "سعر الليمون" },
  { item_id: "veg_banana", nameAr: "موز", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 20, description: "سعر الموز" },
  { item_id: "veg_orange", nameAr: "برتقال", category: "🥬 الخضار", unit: "ج / كيلو", date: "2026-03-06", price: 12, description: "سعر البرتقال" },

  // Subscriptions
  { item_id: "sub_netflix", nameAr: "نتفليكس", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 149, description: "اشتراك نتفليكس" },
  { item_id: "sub_spotify", nameAr: "سبوتيفاي", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 69, description: "اشتراك سبوتيفاي" },
  { item_id: "sub_youtube", nameAr: "يوتيوب بريميوم", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 79, description: "اشتراك يوتيوب" },
  { item_id: "sub_yango", nameAr: "يانجو بلاي", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 49, description: "اشتراك يانجو بلاي" },
  { item_id: "sub_shahid", nameAr: "شاهد VIP", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 79, description: "اشتراك شاهد" },
  { item_id: "sub_watchit", nameAr: "Watch IT", category: "📺 الاشتراكات", unit: "ج / شهر", date: "2026-03-06", price: 55, description: "اشتراك Watch IT" },

  // Transport
  { item_id: "trans_metro1", nameAr: "مترو — منطقة ١", category: "🚇 المواصلات", unit: "ج / رحلة", date: "2026-03-06", price: 10, description: "تذكرة مترو المنطقة الأولى" },
  { item_id: "trans_metro2", nameAr: "مترو — منطقة ٢", category: "🚇 المواصلات", unit: "ج / رحلة", date: "2026-03-06", price: 15, description: "تذكرة مترو المنطقة الثانية" },
  { item_id: "trans_metro3", nameAr: "مترو — منطقة ٣", category: "🚇 المواصلات", unit: "ج / رحلة", date: "2026-03-06", price: 20, description: "تذكرة مترو المنطقة الثالثة" },
  { item_id: "trans_uber", nameAr: "أوبر", category: "🚇 المواصلات", unit: "ج / كم", date: "2026-03-06", price: 5.2, description: "سعر الكيلومتر في أوبر" },
  { item_id: "trans_microbus", nameAr: "ميكروباص", category: "🚇 المواصلات", unit: "ج / رحلة", date: "2026-03-06", price: 7, description: "متوسط تعريفة الميكروباص" },
  { item_id: "trans_railway", nameAr: "قطار", category: "🚇 المواصلات", unit: "ج / ١٠٠كم", date: "2026-03-06", price: 28, description: "سعر تذكرة القطار" },

  // Tobacco
  { item_id: "tob_cleo", nameAr: "كليوباترا", category: "🚬 التبغ", unit: "ج / علبة", date: "2026-03-06", price: 28, description: "سجائر كليوباترا" },
  { item_id: "tob_lm", nameAr: "LM", category: "🚬 التبغ", unit: "ج / علبة", date: "2026-03-06", price: 52, description: "سجائر LM" },
  { item_id: "tob_marlboro", nameAr: "مارلبورو", category: "🚬 التبغ", unit: "ج / علبة", date: "2026-03-06", price: 60, description: "سجائر مارلبورو" },
  { item_id: "tob_merit", nameAr: "ميريت", category: "🚬 التبغ", unit: "ج / علبة", date: "2026-03-06", price: 50, description: "سجائر ميريت" },
  { item_id: "tob_heets", nameAr: "HEETS IQOS", category: "🚬 التبغ", unit: "ج / علبة", date: "2026-03-06", price: 95, description: "HEETS لأجهزة IQOS" },

  // Commodities
  { item_id: "com_sugar", nameAr: "سكر حر", category: "🛒 السلع الأساسية", unit: "ج / كيلو", date: "2026-03-06", price: 30, description: "سعر السكر الحر" },
  { item_id: "com_rice", nameAr: "أرز", category: "🛒 السلع الأساسية", unit: "ج / كيلو", date: "2026-03-06", price: 24, description: "سعر الأرز" },
  { item_id: "com_flour", nameAr: "دقيق", category: "🛒 السلع الأساسية", unit: "ج / كيلو", date: "2026-03-06", price: 17, description: "سعر الدقيق" },
  { item_id: "com_oil", nameAr: "زيت ذرة", category: "🛒 السلع الأساسية", unit: "ج / لتر", date: "2026-03-06", price: 60, description: "سعر زيت الذرة" },
  { item_id: "com_chicken", nameAr: "دواجن", category: "🛒 السلع الأساسية", unit: "ج / كيلو", date: "2026-03-06", price: 100, description: "سعر الدواجن الطازجة" },
  { item_id: "com_meat", nameAr: "لحم أحمر", category: "🛒 السلع الأساسية", unit: "ج / كيلو", date: "2026-03-06", price: 380, description: "سعر اللحم الأحمر" },
  { item_id: "com_eggs", nameAr: "بيض", category: "🛒 السلع الأساسية", unit: "ج / ٣٠ بيضة", date: "2026-03-06", price: 105, description: "سعر كرتونة البيض" },

  // Automotive
  { item_id: "auto_economy", nameAr: "سيارة اقتصادية", category: "🚗 السيارات", unit: "مليون ج", date: "2026-03-06", price: 0.42, description: "متوسط سعر السيارات الاقتصادية" },
  { item_id: "auto_midrange", nameAr: "سيارة متوسطة", category: "🚗 السيارات", unit: "مليون ج", date: "2026-03-06", price: 1.25, description: "متوسط سعر السيارات المتوسطة" },
  { item_id: "auto_luxury", nameAr: "سيارة فاخرة", category: "🚗 السيارات", unit: "مليون ج", date: "2026-03-06", price: 4.0, description: "متوسط سعر السيارات الفاخرة" },
  { item_id: "auto_license", nameAr: "ترخيص سيارة", category: "🚗 السيارات", unit: "ج / سنة", date: "2026-03-06", price: 1800, description: "رسوم تجديد الترخيص" },

  // Tech
  { item_id: "tech_iphone16pm", nameAr: "iPhone 16 Pro Max", category: "📱 التكنولوجيا", unit: "EGP", date: "2026-03-06", price: 78000, description: "سعر آيفون ١٦ برو ماكس" },
  { item_id: "tech_s25ultra", nameAr: "Samsung S25 Ultra", category: "📱 التكنولوجيا", unit: "EGP", date: "2026-03-06", price: 67000, description: "سعر سامسونج S25 Ultra" },
  { item_id: "tech_ps5", nameAr: "PlayStation 5", category: "📱 التكنولوجيا", unit: "EGP", date: "2026-03-06", price: 20000, description: "سعر بلايستيشن ٥" },
  { item_id: "tech_macbook", nameAr: "MacBook Pro 14", category: "📱 التكنولوجيا", unit: "EGP", date: "2026-03-06", price: 98000, description: "سعر ماك بوك برو" },

  // Government Services
  { item_id: "gov_passport", nameAr: "جواز السفر", category: "🏛️ الخدمات الحكومية", unit: "EGP", date: "2026-03-06", price: 1000, description: "رسوم استخراج جواز السفر" },
  { item_id: "gov_id", nameAr: "بطاقة رقم قومي", category: "🏛️ الخدمات الحكومية", unit: "EGP", date: "2026-03-06", price: 50, description: "رسوم تجديد البطاقة" },
  { item_id: "gov_marriage", nameAr: "عقد زواج", category: "🏛️ الخدمات الحكومية", unit: "EGP", date: "2026-03-06", price: 250, description: "رسوم توثيق عقد الزواج" },
  { item_id: "gov_drivinglicense", nameAr: "رخصة قيادة", category: "🏛️ الخدمات الحكومية", unit: "EGP", date: "2026-03-06", price: 350, description: "رسوم استخراج رخصة القيادة" },

  // Stocks
  { item_id: "stock_egx30", nameAr: "EGX30", category: "📈 البورصة", unit: "نقطة", date: "2026-03-06", price: 31200, description: "مؤشر البورصة المصرية" },
  { item_id: "stock_cib", nameAr: "CIB", category: "📈 البورصة", unit: "ج / سهم", date: "2026-03-06", price: 75, description: "سهم البنك التجاري الدولي" },
  { item_id: "stock_hermes", nameAr: "هيرمس", category: "📈 البورصة", unit: "ج / سهم", date: "2026-03-06", price: 45, description: "سهم مجموعة هيرمس" },
  { item_id: "stock_tmt", nameAr: "طلعت مصطفى", category: "📈 البورصة", unit: "ج / سهم", date: "2026-03-06", price: 32, description: "سهم طلعت مصطفى" },

  // Bank Rates
  { item_id: "bank_corridor", nameAr: "كوريدور المركزي", category: "🏦 أسعار الفائدة", unit: "% سنوي", date: "2026-03-06", price: 25.0, description: "سعر الفائدة الرسمي" },
  { item_id: "bank_cert1y", nameAr: "شهادة سنوية", category: "🏦 أسعار الفائدة", unit: "% سنوي", date: "2026-03-06", price: 21.0, description: "عائد الشهادات البنكية" },
  { item_id: "bank_savings", nameAr: "فائدة التوفير", category: "🏦 أسعار الفائدة", unit: "% سنوي", date: "2026-03-06", price: 10.5, description: "معدل فائدة التوفير" },

  // Construction
  { item_id: "build_ezz", nameAr: "حديد عز", category: "🏗️ البناء", unit: "ج / طن", date: "2026-03-06", price: 30200, description: "سعر حديد التسليح عز" },
  { item_id: "build_cement", nameAr: "إسمنت", category: "🏗️ البناء", unit: "ج / طن", date: "2026-03-06", price: 2100, description: "سعر الإسمنت" },
  { item_id: "build_sand", nameAr: "رمل", category: "🏗️ البناء", unit: "ج / م³", date: "2026-03-06", price: 150, description: "سعر الرمل" },
  { item_id: "build_brick", nameAr: "طوب أحمر", category: "🏗️ البناء", unit: "ج / 1000 طوبة", date: "2026-03-06", price: 1200, description: "سعر الطوب الأحمر" },
];
