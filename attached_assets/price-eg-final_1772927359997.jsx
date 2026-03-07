import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ─── FONTS ──────────────────────────────────────────────────────────────── */
const _f = document.createElement("link");
_f.rel = "stylesheet";
_f.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&family=Cairo+Play:wght@300;400;500;600;700;900&display=swap";
document.head.appendChild(_f);

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const _s = document.createElement("style");
_s.textContent = `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #fff; color: #0a0a0a; font-family: 'Cairo', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #f5f5f5; }
  ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
  input, button { font-family: 'Cairo', sans-serif; }

  @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  .row-enter { animation: fadeUp .3s ease both; }
  .row-1 { animation-delay: .04s; }
  .row-2 { animation-delay: .08s; }
  .row-3 { animation-delay: .12s; }
  .row-4 { animation-delay: .16s; }
  .row-5 { animation-delay: .20s; }
`;
document.head.appendChild(_s);

/* ─── TOKENS ─────────────────────────────────────────────────────────────── */
const T = {
  white:   "#ffffff",
  black:   "#0a0a0a",
  red:     "#D72638",
  redSoft: "rgba(215,38,56,.08)",
  redMid:  "rgba(215,38,56,.14)",
  gray50:  "#fafafa",
  gray100: "#f4f4f4",
  gray200: "#e8e8e8",
  gray300: "#d0d0d0",
  gray400: "#a0a0a0",
  gray500: "#6b6b6b",
  gray700: "#333333",
  green:   "#1a7f4b",
  greenSoft:"rgba(26,127,75,.08)",
};

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const RAW = [
  ["cur_usd_bank","دولار (بنك)","Dollar (Bank)","currencies","ج / $","2025-01-10",31.0,"سعر الدولار الرسمي في البنوك المصرية","Official USD rate in Egyptian banks"],
  ["cur_usd_bank","دولار (بنك)","Dollar (Bank)","currencies","ج / $","2025-03-20",30.5,"سعر الدولار الرسمي في البنوك المصرية","Official USD rate in Egyptian banks"],
  ["cur_usd_bank","دولار (بنك)","Dollar (Bank)","currencies","ج / $","2025-06-15",30.75,"سعر الدولار الرسمي في البنوك المصرية","Official USD rate in Egyptian banks"],
  ["cur_usd_parallel","دولار (موازي)","Dollar (Parallel)","currencies","ج / $","2025-01-10",33.5,"سعر الدولار في السوق الموازي","USD rate in the parallel (informal) market"],
  ["cur_usd_parallel","دولار (موازي)","Dollar (Parallel)","currencies","ج / $","2025-04-10",32.8,"سعر الدولار في السوق الموازي","USD rate in the parallel (informal) market"],
  ["cur_usd_parallel","دولار (موازي)","Dollar (Parallel)","currencies","ج / $","2025-06-15",32.1,"سعر الدولار في السوق الموازي","USD rate in the parallel (informal) market"],
  ["cur_eur","يورو","Euro","currencies","ج / €","2025-01-10",33.5,"سعر اليورو مقابل الجنيه","Euro rate vs Egyptian Pound"],
  ["cur_eur","يورو","Euro","currencies","ج / €","2025-04-10",33.8,"سعر اليورو مقابل الجنيه","Euro rate vs Egyptian Pound"],
  ["cur_eur","يورو","Euro","currencies","ج / €","2025-06-15",34.1,"سعر اليورو مقابل الجنيه","Euro rate vs Egyptian Pound"],
  ["cur_sar","ريال سعودي","Saudi Riyal","currencies","ج / ﷼","2025-03-01",8.25,"سعر الريال السعودي","Saudi Riyal vs Egyptian Pound"],
  ["cur_sar","ريال سعودي","Saudi Riyal","currencies","ج / ﷼","2025-06-15",8.3,"سعر الريال السعودي","Saudi Riyal vs Egyptian Pound"],
  ["cur_aed","درهم إماراتي","UAE Dirham","currencies","ج / د.إ","2025-03-01",8.45,"سعر الدرهم الإماراتي","UAE Dirham vs Egyptian Pound"],
  ["cur_aed","درهم إماراتي","UAE Dirham","currencies","ج / د.إ","2025-06-15",8.4,"سعر الدرهم الإماراتي","UAE Dirham vs Egyptian Pound"],
  ["cur_gbp","جنيه إسترليني","British Pound","currencies","ج / £","2025-03-01",39.2,"سعر الجنيه الإسترليني","GBP vs Egyptian Pound"],
  ["cur_gbp","جنيه إسترليني","British Pound","currencies","ج / £","2025-06-15",39.8,"سعر الجنيه الإسترليني","GBP vs Egyptian Pound"],
  ["cur_kwd","دينار كويتي","Kuwaiti Dinar","currencies","ج / د.ك","2025-03-01",100.5,"سعر الدينار الكويتي","Kuwaiti Dinar vs Egyptian Pound"],
  ["cur_kwd","دينار كويتي","Kuwaiti Dinar","currencies","ج / د.ك","2025-06-15",101.2,"سعر الدينار الكويتي","Kuwaiti Dinar vs Egyptian Pound"],
  ["crypto_btc","بيتكوين","Bitcoin (BTC)","crypto","EGP","2025-01-10",3200000,"سعر البيتكوين بالجنيه المصري","Bitcoin price in Egyptian Pounds"],
  ["crypto_btc","بيتكوين","Bitcoin (BTC)","crypto","EGP","2025-03-15",3500000,"سعر البيتكوين بالجنيه المصري","Bitcoin price in Egyptian Pounds"],
  ["crypto_btc","بيتكوين","Bitcoin (BTC)","crypto","EGP","2025-06-15",3750000,"سعر البيتكوين بالجنيه المصري","Bitcoin price in Egyptian Pounds"],
  ["crypto_eth","إيثريوم","Ethereum (ETH)","crypto","EGP","2025-01-10",98000,"سعر الإيثريوم بالجنيه","Ethereum price in Egyptian Pounds"],
  ["crypto_eth","إيثريوم","Ethereum (ETH)","crypto","EGP","2025-04-10",110000,"سعر الإيثريوم بالجنيه","Ethereum price in Egyptian Pounds"],
  ["crypto_eth","إيثريوم","Ethereum (ETH)","crypto","EGP","2025-06-15",105000,"سعر الإيثريوم بالجنيه","Ethereum price in Egyptian Pounds"],
  ["crypto_usdt","تيثر USDT","Tether (USDT)","crypto","ج / $","2025-03-01",31.1,"سعر التيثر بالجنيه","USDT price in Egyptian Pounds"],
  ["crypto_usdt","تيثر USDT","Tether (USDT)","crypto","ج / $","2025-06-15",30.9,"سعر التيثر بالجنيه","USDT price in Egyptian Pounds"],
  ["crypto_sol","سولانا","Solana (SOL)","crypto","EGP","2025-03-01",5800,"سعر سولانا بالجنيه","Solana price in Egyptian Pounds"],
  ["crypto_sol","سولانا","Solana (SOL)","crypto","EGP","2025-06-15",6200,"سعر سولانا بالجنيه","Solana price in Egyptian Pounds"],
  ["metal_gold21","ذهب عيار 21","Gold 21K","metals","ج / جرام","2025-01-10",3412,"سعر جرام الذهب عيار 21","Gold price per gram — 21 karat"],
  ["metal_gold21","ذهب عيار 21","Gold 21K","metals","ج / جرام","2025-04-10",3600,"سعر جرام الذهب عيار 21","Gold price per gram — 21 karat"],
  ["metal_gold21","ذهب عيار 21","Gold 21K","metals","ج / جرام","2025-06-15",3806,"سعر جرام الذهب عيار 21","Gold price per gram — 21 karat"],
  ["metal_gold24","ذهب عيار 24","Gold 24K","metals","ج / جرام","2025-01-10",3900,"سعر جرام الذهب عيار 24","Gold price per gram — 24 karat"],
  ["metal_gold24","ذهب عيار 24","Gold 24K","metals","ج / جرام","2025-03-15",4100,"سعر جرام الذهب عيار 24","Gold price per gram — 24 karat"],
  ["metal_gold24","ذهب عيار 24","Gold 24K","metals","ج / جرام","2025-06-15",4350,"سعر جرام الذهب عيار 24","Gold price per gram — 24 karat"],
  ["metal_gold18","ذهب عيار 18","Gold 18K","metals","ج / جرام","2025-03-01",2925,"سعر جرام الذهب عيار 18","Gold price per gram — 18 karat"],
  ["metal_gold18","ذهب عيار 18","Gold 18K","metals","ج / جرام","2025-06-15",3263,"سعر جرام الذهب عيار 18","Gold price per gram — 18 karat"],
  ["metal_goldpound","جنيه ذهب","Gold Pound","metals","جنيه / قطعة","2025-03-01",31200,"سعر الجنيه الذهب المصري","Egyptian Gold Pound (8g, 21K)"],
  ["metal_goldpound","جنيه ذهب","Gold Pound","metals","جنيه / قطعة","2025-06-15",30450,"سعر الجنيه الذهب المصري","Egyptian Gold Pound (8g, 21K)"],
  ["metal_silver","فضة 925","Silver 925","metals","ج / جرام","2025-03-01",55,"سعر الفضة 925","Silver price per gram — 925"],
  ["metal_silver","فضة 925","Silver 925","metals","ج / جرام","2025-06-15",58,"سعر الفضة 925","Silver price per gram — 925"],
  ["metal_gold_oz","أونصة ذهب","Gold Ounce","metals","$ / oz","2025-01-10",2030,"سعر أونصة الذهب عالمياً","Global gold price per troy ounce"],
  ["metal_gold_oz","أونصة ذهب","Gold Ounce","metals","$ / oz","2025-06-15",2320,"سعر أونصة الذهب عالمياً","Global gold price per troy ounce"],
  ["fuel_95","بنزين 95","Petrol 95","fuel","ج / لتر","2025-01-10",14.75,"سعر لتر بنزين 95 أوكتان","Petrol 95 octane per litre"],
  ["fuel_95","بنزين 95","Petrol 95","fuel","ج / لتر","2025-06-15",15.0,"سعر لتر بنزين 95 أوكتان","Petrol 95 octane per litre"],
  ["fuel_92","بنزين 92","Petrol 92","fuel","ج / لتر","2025-01-10",13.75,"سعر لتر بنزين 92","Petrol 92 octane per litre"],
  ["fuel_92","بنزين 92","Petrol 92","fuel","ج / لتر","2025-06-15",14.0,"سعر لتر بنزين 92","Petrol 92 octane per litre"],
  ["fuel_80","بنزين 80","Petrol 80","fuel","ج / لتر","2025-01-10",11.75,"سعر لتر بنزين 80","Petrol 80 octane per litre"],
  ["fuel_80","بنزين 80","Petrol 80","fuel","ج / لتر","2025-06-15",12.0,"سعر لتر بنزين 80","Petrol 80 octane per litre"],
  ["fuel_diesel","سولار","Diesel","fuel","ج / لتر","2025-01-10",12.25,"سعر لتر السولار","Diesel price per litre"],
  ["fuel_diesel","سولار","Diesel","fuel","ج / لتر","2025-06-15",12.5,"سعر لتر السولار","Diesel price per litre"],
  ["fuel_gas","بوتاجاز منزلي","Home Gas","fuel","ج / أسطوانة","2025-01-10",100,"سعر أسطوانة البوتاجاز 12.5 كجم","Home gas cylinder 12.5kg"],
  ["fuel_gas","بوتاجاز منزلي","Home Gas","fuel","ج / أسطوانة","2025-06-15",100,"سعر أسطوانة البوتاجاز 12.5 كجم","Home gas cylinder 12.5kg"],
  ["fuel_brent","نفط برنت","Brent Crude","fuel","$ / barrel","2025-01-10",79,"سعر برميل برنت عالمياً","Brent crude oil — global market"],
  ["fuel_brent","نفط برنت","Brent Crude","fuel","$ / barrel","2025-06-15",82,"سعر برميل برنت عالمياً","Brent crude oil — global market"],
  ["elec_slab1","كهرباء 0–50 ك.و","Electricity 0–50 kWh","electricity","قرش / ك.و","2025-01-10",36,"الشريحة الأولى السكنية","Residential slab 1"],
  ["elec_slab2","كهرباء 51–100 ك.و","Electricity 51–100 kWh","electricity","قرش / ك.و","2025-01-10",60,"الشريحة الثانية","Residential slab 2"],
  ["elec_slab3","كهرباء 101–200 ك.و","Electricity 101–200 kWh","electricity","قرش / ك.و","2025-01-10",77,"الشريحة الثالثة","Residential slab 3"],
  ["elec_slab4","كهرباء 201–350 ك.و","Electricity 201–350 kWh","electricity","قرش / ك.و","2025-01-10",100,"الشريحة الرابعة","Residential slab 4"],
  ["elec_slab5","كهرباء 351–650 ك.و","Electricity 351–650 kWh","electricity","قرش / ك.و","2025-01-10",145,"الشريحة الخامسة","Residential slab 5"],
  ["elec_commercial","كهرباء تجاري","Commercial Electricity","electricity","قرش / ك.و","2025-01-10",185,"تعريفة الكهرباء التجارية","Commercial electricity tariff"],
  ["elec_industrial","كهرباء صناعي","Industrial Electricity","electricity","قرش / ك.و","2025-01-10",170,"تعريفة الكهرباء الصناعية","Industrial electricity tariff"],
  ["veg_tomato","طماطم","Tomatoes","vegetables","ج / كيلو","2025-03-01",4.5,"سعر الطماطم","Tomato price per kg"],
  ["veg_tomato","طماطم","Tomatoes","vegetables","ج / كيلو","2025-04-10",5.5,"سعر الطماطم","Tomato price per kg"],
  ["veg_tomato","طماطم","Tomatoes","vegetables","ج / كيلو","2025-06-15",7.0,"سعر الطماطم","Tomato price per kg"],
  ["veg_onion","بصل","Onions","vegetables","ج / كيلو","2025-03-01",8.0,"سعر البصل","Onion price per kg"],
  ["veg_onion","بصل","Onions","vegetables","ج / كيلو","2025-06-15",9.5,"سعر البصل","Onion price per kg"],
  ["veg_potato","بطاطس","Potatoes","vegetables","ج / كيلو","2025-03-01",7.0,"سعر البطاطس","Potato price per kg"],
  ["veg_potato","بطاطس","Potatoes","vegetables","ج / كيلو","2025-06-15",8.5,"سعر البطاطس","Potato price per kg"],
  ["veg_lemon","ليمون","Lemons","vegetables","ج / كيلو","2025-03-01",12,"سعر الليمون","Lemon price per kg"],
  ["veg_lemon","ليمون","Lemons","vegetables","ج / كيلو","2025-06-15",15,"سعر الليمون","Lemon price per kg"],
  ["veg_banana","موز","Bananas","vegetables","ج / كيلو","2025-03-01",18,"سعر الموز","Banana price per kg"],
  ["veg_banana","موز","Bananas","vegetables","ج / كيلو","2025-06-15",20,"سعر الموز","Banana price per kg"],
  ["veg_orange","برتقال","Oranges","vegetables","ج / كيلو","2025-03-01",10,"سعر البرتقال","Orange price per kg"],
  ["veg_orange","برتقال","Oranges","vegetables","ج / كيلو","2025-06-15",12,"سعر البرتقال","Orange price per kg"],
  ["sub_netflix","نتفليكس","Netflix","subscriptions","ج / شهر","2025-01-10",129,"اشتراك نتفليكس في مصر","Netflix subscription in Egypt"],
  ["sub_netflix","نتفليكس","Netflix","subscriptions","ج / شهر","2025-06-15",149,"اشتراك نتفليكس في مصر","Netflix subscription in Egypt"],
  ["sub_spotify","سبوتيفاي","Spotify","subscriptions","ج / شهر","2025-01-10",59,"اشتراك سبوتيفاي","Spotify subscription in Egypt"],
  ["sub_spotify","سبوتيفاي","Spotify","subscriptions","ج / شهر","2025-06-15",69,"اشتراك سبوتيفاي","Spotify subscription in Egypt"],
  ["sub_youtube","يوتيوب بريميوم","YouTube Premium","subscriptions","ج / شهر","2025-01-10",69,"اشتراك يوتيوب بريميوم","YouTube Premium in Egypt"],
  ["sub_youtube","يوتيوب بريميوم","YouTube Premium","subscriptions","ج / شهر","2025-06-15",79,"اشتراك يوتيوب بريميوم","YouTube Premium in Egypt"],
  ["sub_yango","يانجو بلاي","Yango Play","subscriptions","ج / شهر","2025-03-01",39,"اشتراك يانجو بلاي","Yango Play subscription"],
  ["sub_yango","يانجو بلاي","Yango Play","subscriptions","ج / شهر","2025-06-15",49,"اشتراك يانجو بلاي","Yango Play subscription"],
  ["sub_shahid","شاهد VIP","Shahid VIP","subscriptions","ج / شهر","2025-03-01",69,"اشتراك شاهد VIP","Shahid VIP subscription"],
  ["sub_shahid","شاهد VIP","Shahid VIP","subscriptions","ج / شهر","2025-06-15",79,"اشتراك شاهد VIP","Shahid VIP subscription"],
  ["sub_watchit","Watch IT","Watch IT","subscriptions","ج / شهر","2025-03-01",45,"اشتراك Watch IT","Watch IT subscription"],
  ["sub_watchit","Watch IT","Watch IT","subscriptions","ج / شهر","2025-06-15",55,"اشتراك Watch IT","Watch IT subscription"],
  ["trans_metro1","مترو — منطقة ١","Metro Zone 1","transport","ج / رحلة","2025-01-10",8,"تذكرة مترو المنطقة الأولى","Cairo Metro Zone 1 ticket"],
  ["trans_metro1","مترو — منطقة ١","Metro Zone 1","transport","ج / رحلة","2025-06-15",10,"تذكرة مترو المنطقة الأولى","Cairo Metro Zone 1 ticket"],
  ["trans_metro2","مترو — منطقة ٢","Metro Zone 2","transport","ج / رحلة","2025-01-10",12,"تذكرة مترو المنطقة الثانية","Cairo Metro Zone 2 ticket"],
  ["trans_metro2","مترو — منطقة ٢","Metro Zone 2","transport","ج / رحلة","2025-06-15",15,"تذكرة مترو المنطقة الثانية","Cairo Metro Zone 2 ticket"],
  ["trans_metro3","مترو — منطقة ٣","Metro Zone 3","transport","ج / رحلة","2025-01-10",15,"تذكرة مترو المنطقة الثالثة","Cairo Metro Zone 3 ticket"],
  ["trans_metro3","مترو — منطقة ٣","Metro Zone 3","transport","ج / رحلة","2025-06-15",20,"تذكرة مترو المنطقة الثالثة","Cairo Metro Zone 3 ticket"],
  ["trans_uber","أوبر","Uber","transport","ج / كم","2025-03-01",4.5,"سعر الكيلومتر في أوبر","Uber base rate per km"],
  ["trans_uber","أوبر","Uber","transport","ج / كم","2025-06-15",5.2,"سعر الكيلومتر في أوبر","Uber base rate per km"],
  ["trans_microbus","ميكروباص","Microbus","transport","ج / رحلة","2025-03-01",5,"متوسط تعريفة الميكروباص","Average microbus fare"],
  ["trans_microbus","ميكروباص","Microbus","transport","ج / رحلة","2025-06-15",7,"متوسط تعريفة الميكروباص","Average microbus fare"],
  ["trans_railway","قطار","Railway","transport","ج / ١٠٠كم","2025-03-01",25,"سعر تذكرة القطار","Train ticket per 100km"],
  ["trans_railway","قطار","Railway","transport","ج / ١٠٠كم","2025-06-15",28,"سعر تذكرة القطار","Train ticket per 100km"],
  ["tob_cleo","كليوباترا","Cleopatra","tobacco","ج / علبة","2025-01-10",26,"سجائر كليوباترا","Cleopatra cigarettes pack"],
  ["tob_cleo","كليوباترا","Cleopatra","tobacco","ج / علبة","2025-06-15",28,"سجائر كليوباترا","Cleopatra cigarettes pack"],
  ["tob_lm","LM","LM","tobacco","ج / علبة","2025-01-10",48,"سجائر LM","LM cigarettes pack"],
  ["tob_lm","LM","LM","tobacco","ج / علبة","2025-06-15",52,"سجائر LM","LM cigarettes pack"],
  ["tob_marlboro","مارلبورو","Marlboro","tobacco","ج / علبة","2025-01-10",55,"سجائر مارلبورو","Marlboro cigarettes pack"],
  ["tob_marlboro","مارلبورو","Marlboro","tobacco","ج / علبة","2025-06-15",60,"سجائر مارلبورو","Marlboro cigarettes pack"],
  ["tob_merit","ميريت","Merit","tobacco","ج / علبة","2025-01-10",45,"سجائر ميريت","Merit cigarettes pack"],
  ["tob_merit","ميريت","Merit","tobacco","ج / علبة","2025-06-15",50,"سجائر ميريت","Merit cigarettes pack"],
  ["tob_heets","HEETS — IQOS","HEETS IQOS","tobacco","ج / علبة","2025-03-01",85,"HEETS لأجهزة IQOS","HEETS for IQOS devices"],
  ["tob_heets","HEETS — IQOS","HEETS IQOS","tobacco","ج / علبة","2025-06-15",95,"HEETS لأجهزة IQOS","HEETS for IQOS devices"],
  ["com_sugar","سكر حر","Sugar","commodities","ج / كيلو","2025-01-10",28,"سعر السكر الحر","Free-market sugar price per kg"],
  ["com_sugar","سكر حر","Sugar","commodities","ج / كيلو","2025-06-15",30,"سعر السكر الحر","Free-market sugar price per kg"],
  ["com_rice","أرز","Rice","commodities","ج / كيلو","2025-01-10",22,"سعر الأرز","Rice price per kg"],
  ["com_rice","أرز","Rice","commodities","ج / كيلو","2025-06-15",24,"سعر الأرز","Rice price per kg"],
  ["com_flour","دقيق","Flour","commodities","ج / كيلو","2025-01-10",15,"سعر الدقيق","Flour price per kg"],
  ["com_flour","دقيق","Flour","commodities","ج / كيلو","2025-06-15",17,"سعر الدقيق","Flour price per kg"],
  ["com_oil","زيت ذرة","Corn Oil","commodities","ج / لتر","2025-01-10",55,"سعر زيت الذرة","Corn oil price per litre"],
  ["com_oil","زيت ذرة","Corn Oil","commodities","ج / لتر","2025-06-15",60,"سعر زيت الذرة","Corn oil price per litre"],
  ["com_chicken","دواجن","Chicken","commodities","ج / كيلو","2025-01-10",85,"سعر الدواجن الطازجة","Fresh chicken price per kg"],
  ["com_chicken","دواجن","Chicken","commodities","ج / كيلو","2025-04-10",95,"سعر الدواجن الطازجة","Fresh chicken price per kg"],
  ["com_chicken","دواجن","Chicken","commodities","ج / كيلو","2025-06-15",100,"سعر الدواجن الطازجة","Fresh chicken price per kg"],
  ["com_meat","لحم أحمر","Red Meat","commodities","ج / كيلو","2025-01-10",350,"سعر اللحم الأحمر","Red meat (veal) price per kg"],
  ["com_meat","لحم أحمر","Red Meat","commodities","ج / كيلو","2025-06-15",380,"سعر اللحم الأحمر","Red meat (veal) price per kg"],
  ["com_eggs","بيض","Eggs","commodities","ج / ٣٠ بيضة","2025-01-10",95,"سعر كرتونة البيض","Eggs — tray of 30"],
  ["com_eggs","بيض","Eggs","commodities","ج / ٣٠ بيضة","2025-04-10",110,"سعر كرتونة البيض","Eggs — tray of 30"],
  ["com_eggs","بيض","Eggs","commodities","ج / ٣٠ بيضة","2025-06-15",105,"سعر كرتونة البيض","Eggs — tray of 30"],
  ["auto_economy","سيارة اقتصادية","Economy Car","automotive","مليون ج","2025-01-10",0.38,"متوسط سعر السيارات الاقتصادية","Average economy car price"],
  ["auto_economy","سيارة اقتصادية","Economy Car","automotive","مليون ج","2025-06-15",0.42,"متوسط سعر السيارات الاقتصادية","Average economy car price"],
  ["auto_midrange","سيارة متوسطة","Mid-Range Car","automotive","مليون ج","2025-01-10",1.1,"متوسط سعر السيارات المتوسطة","Average mid-range car price"],
  ["auto_midrange","سيارة متوسطة","Mid-Range Car","automotive","مليون ج","2025-06-15",1.25,"متوسط سعر السيارات المتوسطة","Average mid-range car price"],
  ["auto_luxury","سيارة فاخرة","Luxury Car","automotive","مليون ج","2025-01-10",3.5,"متوسط سعر السيارات الفاخرة","Average luxury car price"],
  ["auto_luxury","سيارة فاخرة","Luxury Car","automotive","مليون ج","2025-06-15",4.0,"متوسط سعر السيارات الفاخرة","Average luxury car price"],
  ["auto_license","ترخيص سيارة","Car License","automotive","ج / سنة","2025-03-01",1500,"رسوم تجديد الترخيص","Annual car license renewal fees"],
  ["auto_license","ترخيص سيارة","Car License","automotive","ج / سنة","2025-06-15",1800,"رسوم تجديد الترخيص","Annual car license renewal fees"],
  ["tech_iphone16pm","iPhone 16 Pro Max","iPhone 16 Pro Max","tech","EGP","2025-01-10",75000,"سعر آيفون ١٦ برو ماكس","iPhone 16 Pro Max price in Egypt"],
  ["tech_iphone16pm","iPhone 16 Pro Max","iPhone 16 Pro Max","tech","EGP","2025-06-15",78000,"سعر آيفون ١٦ برو ماكس","iPhone 16 Pro Max price in Egypt"],
  ["tech_s25ultra","Samsung S25 Ultra","Samsung S25 Ultra","tech","EGP","2025-01-10",65000,"سعر سامسونج S25 Ultra","Samsung S25 Ultra price in Egypt"],
  ["tech_s25ultra","Samsung S25 Ultra","Samsung S25 Ultra","tech","EGP","2025-06-15",67000,"سعر سامسونج S25 Ultra","Samsung S25 Ultra price in Egypt"],
  ["tech_ps5","PlayStation 5","PlayStation 5","tech","EGP","2025-01-10",22000,"سعر بلايستيشن ٥","PlayStation 5 price in Egypt"],
  ["tech_ps5","PlayStation 5","PlayStation 5","tech","EGP","2025-06-15",20000,"سعر بلايستيشن ٥","PlayStation 5 price in Egypt"],
  ["tech_macbook","MacBook Pro 14\"","MacBook Pro 14\"","tech","EGP","2025-01-10",95000,"سعر ماك بوك برو","MacBook Pro 14\" price in Egypt"],
  ["tech_macbook","MacBook Pro 14\"","MacBook Pro 14\"","tech","EGP","2025-06-15",98000,"سعر ماك بوك برو","MacBook Pro 14\" price in Egypt"],
  ["gov_passport","جواز السفر","Passport","govservices","EGP","2025-01-10",900,"رسوم استخراج جواز السفر","Passport issuance fees"],
  ["gov_passport","جواز السفر","Passport","govservices","EGP","2025-06-15",1000,"رسوم استخراج جواز السفر","Passport issuance fees"],
  ["gov_id","بطاقة رقم قومي","National ID","govservices","EGP","2025-01-10",35,"رسوم تجديد البطاقة","National ID renewal fees"],
  ["gov_id","بطاقة رقم قومي","National ID","govservices","EGP","2025-06-15",50,"رسوم تجديد البطاقة","National ID renewal fees"],
  ["gov_marriage","عقد زواج","Marriage Contract","govservices","EGP","2025-03-01",200,"رسوم توثيق عقد الزواج","Marriage contract documentation fees"],
  ["gov_marriage","عقد زواج","Marriage Contract","govservices","EGP","2025-06-15",250,"رسوم توثيق عقد الزواج","Marriage contract documentation fees"],
  ["gov_drivinglicense","رخصة قيادة","Driving License","govservices","EGP","2025-03-01",300,"رسوم استخراج رخصة القيادة","Driving license issuance fees"],
  ["gov_drivinglicense","رخصة قيادة","Driving License","govservices","EGP","2025-06-15",350,"رسوم استخراج رخصة القيادة","Driving license issuance fees"],
  ["stock_egx30","EGX30","EGX30 Index","stocks","نقطة","2025-01-10",28000,"مؤشر البورصة المصرية","Egyptian Stock Exchange main index"],
  ["stock_egx30","EGX30","EGX30 Index","stocks","نقطة","2025-03-15",29500,"مؤشر البورصة المصرية","Egyptian Stock Exchange main index"],
  ["stock_egx30","EGX30","EGX30 Index","stocks","نقطة","2025-06-15",31200,"مؤشر البورصة المصرية","Egyptian Stock Exchange main index"],
  ["stock_cib","CIB","CIB Bank","stocks","ج / سهم","2025-01-10",68,"سهم البنك التجاري الدولي","Commercial International Bank stock"],
  ["stock_cib","CIB","CIB Bank","stocks","ج / سهم","2025-06-15",75,"سهم البنك التجاري الدولي","Commercial International Bank stock"],
  ["stock_hermes","هيرمس","Hermes","stocks","ج / سهم","2025-01-10",42,"سهم مجموعة هيرمس","EFG Hermes stock"],
  ["stock_hermes","هيرمس","Hermes","stocks","ج / سهم","2025-06-15",45,"سهم مجموعة هيرمس","EFG Hermes stock"],
  ["stock_tmt","طلعت مصطفى","Talaat Moustafa","stocks","ج / سهم","2025-01-10",28,"سهم طلعت مصطفى","Talaat Moustafa Group stock"],
  ["stock_tmt","طلعت مصطفى","Talaat Moustafa","stocks","ج / سهم","2025-06-15",32,"سهم طلعت مصطفى","Talaat Moustafa Group stock"],
  ["bank_corridor","كوريدور المركزي","CBE Corridor","bankrates","% سنوي","2025-01-10",27.25,"سعر الفائدة الرسمي","Central Bank of Egypt corridor rate"],
  ["bank_corridor","كوريدور المركزي","CBE Corridor","bankrates","% سنوي","2025-06-15",25.0,"سعر الفائدة الرسمي","Central Bank of Egypt corridor rate"],
  ["bank_cert1y","شهادة سنوية","1-Year Certificate","bankrates","% سنوي","2025-01-10",23.5,"عائد الشهادات البنكية","Bank certificate annual yield"],
  ["bank_cert1y","شهادة سنوية","1-Year Certificate","bankrates","% سنوي","2025-06-15",21.0,"عائد الشهادات البنكية","Bank certificate annual yield"],
  ["bank_savings","فائدة التوفير","Savings Rate","bankrates","% سنوي","2025-01-10",12.0,"معدل فائدة التوفير","Savings account interest rate"],
  ["bank_savings","فائدة التوفير","Savings Rate","bankrates","% سنوي","2025-06-15",10.5,"معدل فائدة التوفير","Savings account interest rate"],
  ["build_ezz","حديد عز","Ezz Steel","construction","ج / طن","2025-01-10",28000,"سعر حديد التسليح عز","Ezz Steel rebar price per ton"],
  ["build_ezz","حديد عز","Ezz Steel","construction","ج / طن","2025-04-10",29500,"سعر حديد التسليح عز","Ezz Steel rebar price per ton"],
  ["build_ezz","حديد عز","Ezz Steel","construction","ج / طن","2025-06-15",30200,"سعر حديد التسليح عز","Ezz Steel rebar price per ton"],
  ["build_cement","أسمنت سويس","Suez Cement","construction","ج / طن","2025-01-10",1800,"سعر طن الأسمنت","Suez cement price per ton"],
  ["build_cement","أسمنت سويس","Suez Cement","construction","ج / طن","2025-06-15",1950,"سعر طن الأسمنت","Suez cement price per ton"],
  ["build_bricks","طوب أحمر","Red Bricks","construction","ج / ألف","2025-01-10",2800,"سعر الألف طوبة حمراء","Red bricks price per 1000 units"],
  ["build_bricks","طوب أحمر","Red Bricks","construction","ج / ألف","2025-06-15",3000,"سعر الألف طوبة حمراء","Red bricks price per 1000 units"],
  ["build_paint","دهان داخلي","Interior Paint","construction","ج / لتر","2025-03-01",95,"سعر لتر الدهان الداخلي","Interior paint price per litre"],
  ["build_paint","دهان داخلي","Interior Paint","construction","ج / لتر","2025-06-15",105,"سعر لتر الدهان الداخلي","Interior paint price per litre"],
  ["re_newcairo","القاهرة الجديدة","New Cairo","realestate","ج / م²","2025-01-10",28000,"متوسط سعر المتر المربع","Average price per m² in New Cairo"],
  ["re_newcairo","القاهرة الجديدة","New Cairo","realestate","ج / م²","2025-06-15",32000,"متوسط سعر المتر المربع","Average price per m² in New Cairo"],
  ["re_admincapital","العاصمة الإدارية","Admin. Capital","realestate","ج / م²","2025-01-10",35000,"متوسط سعر المتر المربع","Average price per m² in Admin Capital"],
  ["re_admincapital","العاصمة الإدارية","Admin. Capital","realestate","ج / م²","2025-06-15",42000,"متوسط سعر المتر المربع","Average price per m² in Admin Capital"],
  ["re_sheikh","الشيخ زايد","Sheikh Zayed","realestate","ج / م²","2025-01-10",22000,"متوسط سعر المتر المربع","Average price per m² in Sheikh Zayed"],
  ["re_sheikh","الشيخ زايد","Sheikh Zayed","realestate","ج / م²","2025-06-15",25000,"متوسط سعر المتر المربع","Average price per m² in Sheikh Zayed"],
  ["re_october","مدينة أكتوبر","6th of October","realestate","ج / م²","2025-01-10",18000,"متوسط سعر المتر المربع","Average price per m² in 6th October"],
  ["re_october","مدينة أكتوبر","6th of October","realestate","ج / م²","2025-06-15",21000,"متوسط سعر المتر المربع","Average price per m² in 6th October"],
  ["mar_hall","قاعة أفراح","Wedding Hall","marriage","ج / ليلة","2025-01-10",25000,"متوسط إيجار قاعة الأفراح","Average wedding hall rental per night"],
  ["mar_hall","قاعة أفراح","Wedding Hall","marriage","ج / ليلة","2025-06-15",30000,"متوسط إيجار قاعة الأفراح","Average wedding hall rental per night"],
  ["mar_furniture","طقم أثاث كامل","Furniture Set","marriage","EGP","2025-01-10",180000,"متوسط تكلفة طقم الأثاث","Average full furniture set cost"],
  ["mar_furniture","طقم أثاث كامل","Furniture Set","marriage","EGP","2025-06-15",220000,"متوسط تكلفة طقم الأثاث","Average full furniture set cost"],
  ["mar_appliances","ثلاجة + غسالة","Fridge + Washer","marriage","EGP","2025-01-10",55000,"متوسط سعر حزمة الأجهزة","Average appliance bundle cost"],
  ["mar_appliances","ثلاجة + غسالة","Fridge + Washer","marriage","EGP","2025-06-15",68000,"متوسط سعر حزمة الأجهزة","Average appliance bundle cost"],
  ["mnt_plumber","سباك","Plumber","maintenance","ج / يوم","2025-01-10",600,"أجر السباك اليومي","Daily plumber rate in Cairo"],
  ["mnt_plumber","سباك","Plumber","maintenance","ج / يوم","2025-06-15",750,"أجر السباك اليومي","Daily plumber rate in Cairo"],
  ["mnt_electrician","كهربائي","Electrician","maintenance","ج / يوم","2025-01-10",700,"أجر الكهربائي اليومي","Daily electrician rate in Cairo"],
  ["mnt_electrician","كهربائي","Electrician","maintenance","ج / يوم","2025-06-15",850,"أجر الكهربائي اليومي","Daily electrician rate in Cairo"],
  ["mnt_painter","دهان","Painter","maintenance","ج / يوم","2025-01-10",550,"أجر الدهان اليومي","Daily painter rate in Cairo"],
  ["mnt_painter","دهان","Painter","maintenance","ج / يوم","2025-06-15",650,"أجر الدهان اليومي","Daily painter rate in Cairo"],
  ["mnt_ac","صيانة تكييف","AC Service","maintenance","ج / زيارة","2025-03-01",350,"تكلفة صيانة التكييف","Air conditioning service visit"],
  ["mnt_ac","صيانة تكييف","AC Service","maintenance","ج / زيارة","2025-06-15",400,"تكلفة صيانة التكييف","Air conditioning service visit"],
  ["free_cowork","Co-working","Co-working","freelancing","ج / يوم","2025-01-10",250,"مساحة عمل مشترك اليومي","Daily co-working space pass"],
  ["free_cowork","Co-working","Co-working","freelancing","ج / يوم","2025-06-15",300,"مساحة عمل مشترك اليومي","Daily co-working space pass"],
  ["free_chatgpt","ChatGPT Plus","ChatGPT Plus","freelancing","ج / شهر","2025-01-10",620,"اشتراك ChatGPT Plus","ChatGPT Plus monthly in EGP"],
  ["free_chatgpt","ChatGPT Plus","ChatGPT Plus","freelancing","ج / شهر","2025-06-15",640,"اشتراك ChatGPT Plus","ChatGPT Plus monthly in EGP"],
  ["free_fiber","فايبر 140 جيجا","Fiber 140GB","freelancing","ج / شهر","2025-01-10",399,"إنترنت فايبر 140 جيجا","Fiber internet 140GB plan"],
  ["free_fiber","فايبر 140 جيجا","Fiber 140GB","freelancing","ج / شهر","2025-06-15",449,"إنترنت فايبر 140 جيجا","Fiber internet 140GB plan"],
];

const CATS = [
  { id:"currencies",    ar:"عملات",            en:"Currencies"     },
  { id:"crypto",        ar:"عملات رقمية",      en:"Crypto"         },
  { id:"metals",        ar:"ذهب ومعادن",        en:"Metals"         },
  { id:"fuel",          ar:"وقود وطاقة",        en:"Fuel & Energy"  },
  { id:"electricity",   ar:"كهرباء",            en:"Electricity"    },
  { id:"vegetables",    ar:"خضار وفاكهة",       en:"Produce"        },
  { id:"subscriptions", ar:"اشتراكات رقمية",   en:"Subscriptions"  },
  { id:"transport",     ar:"مواصلات",           en:"Transport"      },
  { id:"tobacco",       ar:"سجائر",             en:"Tobacco"        },
  { id:"commodities",   ar:"سلع أساسية",        en:"Commodities"    },
  { id:"automotive",    ar:"سيارات",            en:"Automotive"     },
  { id:"tech",          ar:"هواتف وتقنية",      en:"Tech & Gadgets" },
  { id:"govservices",   ar:"خدمات حكومية",      en:"Gov Services"   },
  { id:"stocks",        ar:"أسهم البورصة",      en:"Stocks"         },
  { id:"bankrates",     ar:"فوائد البنوك",      en:"Bank Rates"     },
  { id:"construction",  ar:"مواد البناء",       en:"Construction"   },
  { id:"realestate",    ar:"عقارات",            en:"Real Estate"    },
  { id:"marriage",      ar:"تكاليف الزواج",     en:"Marriage Costs" },
  { id:"maintenance",   ar:"صنايعية",           en:"Maintenance"    },
  { id:"freelancing",   ar:"العمل الحر",        en:"Freelancing"    },
];

/* ─── PROCESS DATA ───────────────────────────────────────────────────────── */
function buildMap(raw) {
  const map = {};
  raw.forEach(([id, nameAr, nameEn, category, unit, date, price, descAr, descEn]) => {
    if (!map[id]) map[id] = { id, nameAr, nameEn, category, unit, descAr, descEn, entries: [] };
    map[id].entries.push({ date, price: parseFloat(price) });
  });
  Object.values(map).forEach(item => {
    item.entries.sort((a, b) => a.date.localeCompare(b.date));
    item.latest = item.entries.at(-1);
    item.prev   = item.entries.length > 1 ? item.entries.at(-2) : null;
    item.change = item.prev ? ((item.latest.price - item.prev.price) / item.prev.price * 100) : 0;
  });
  return map;
}
const ITEM_MAP = buildMap(RAW);

/* ─── UTILS ──────────────────────────────────────────────────────────────── */
function fmt(p) {
  if (p == null) return "—";
  if (p >= 1_000_000) return (p / 1_000_000).toFixed(2) + "M";
  if (p >= 1_000)     return Number(p).toLocaleString("en-EG");
  if (p < 1)          return p.toFixed(4);
  return Number(p).toLocaleString("en-EG", { maximumFractionDigits: 2 });
}

/* ─── SPARKLINE ──────────────────────────────────────────────────────────── */
function Spark({ entries, change }) {
  if (!entries || entries.length < 2) return <div style={{ width: 64 }} />;
  const prices = entries.map(e => e.price);
  const min = Math.min(...prices), range = Math.max(...prices) - min || 1;
  const W = 64, H = 28;
  const pts = prices.map((p, i) =>
    `${(i / (prices.length - 1)) * W},${H - 2 - ((p - min) / range) * (H - 5)}`
  ).join(" ");
  const col = change > 0 ? T.green : change < 0 ? T.red : T.gray300;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── CANVAS CHART ───────────────────────────────────────────────────────── */
function Chart({ item, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !item) return;
    const cv = ref.current;
    const dpr = window.devicePixelRatio || 1;
    cv.width  = cv.clientWidth  * dpr;
    cv.height = cv.clientHeight * dpr;
    const ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    const W = cv.clientWidth, H = cv.clientHeight;
    const P = { t: 16, r: 16, b: 40, l: 72 };
    const iW = W - P.l - P.r, iH = H - P.t - P.b;
    const prices = item.entries.map(e => e.price);
    const minV = Math.min(...prices) * .97, maxV = Math.max(...prices) * 1.03, rng = maxV - minV || 1;
    const tx = i => P.l + (i / (prices.length - 1)) * iW;
    const ty = v => P.t + (1 - (v - minV) / rng) * iH;
    const lc  = item.change >= 0 ? T.green : T.red;
    ctx.clearRect(0, 0, W, H);
    // gridlines
    [0, .25, .5, .75, 1].forEach(t => {
      const y = P.t + t * iH;
      ctx.strokeStyle = T.gray200; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(P.l + iW, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = T.gray400; ctx.font = "11px Cairo"; ctx.textAlign = "right";
      ctx.fillText(fmt(maxV - t * rng), P.l - 6, y + 4);
    });
    // x labels
    const step = Math.max(1, Math.floor(item.entries.length / 5));
    ctx.fillStyle = T.gray400; ctx.font = "10px Cairo"; ctx.textAlign = "center";
    item.entries.forEach((e, i) => { if (i % step === 0) ctx.fillText(e.date.slice(5), tx(i), H - 8); });
    // fill
    const g = ctx.createLinearGradient(0, P.t, 0, P.t + iH);
    g.addColorStop(0, lc + "22"); g.addColorStop(1, lc + "00");
    ctx.beginPath();
    prices.forEach((p, i) => i === 0 ? ctx.moveTo(tx(i), ty(p)) : ctx.lineTo(tx(i), ty(p)));
    ctx.lineTo(tx(prices.length - 1), P.t + iH); ctx.lineTo(P.l, P.t + iH);
    ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    // line
    ctx.beginPath(); ctx.strokeStyle = lc; ctx.lineWidth = 2; ctx.lineJoin = "round";
    prices.forEach((p, i) => i === 0 ? ctx.moveTo(tx(i), ty(p)) : ctx.lineTo(tx(i), ty(p)));
    ctx.stroke();
    // dots
    prices.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(tx(i), ty(p), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = lc; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    });
  }, [item]);
  return <canvas ref={ref} style={{ width: "100%", height: 200, display: "block" }} />;
}

/* ─── TICKER ──────────────────────────────────────────────────────────────── */
function Ticker({ lang }) {
  const [paused, setPaused] = useState(false);
  const items = Object.values(ITEM_MAP).slice(0, 30);
  const doubled = [...items, ...items];
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ background: T.black, color: T.white, height: 34, display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      <div style={{
        background: T.red, padding: "0 16px", height: "100%",
        display: "flex", alignItems: "center",
        fontSize: 11, fontWeight: 700, letterSpacing: ".1em", flexShrink: 0,
      }}>
        {lang === "ar" ? "مباشر" : "LIVE"}
      </div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          animation: paused ? "none" : "tickerScroll 100s linear infinite",
        }}>
          {doubled.map((item, i) => {
            const up = item.change > 0, dn = item.change < 0;
            return (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 22px", fontSize: 12 }}>
                <span style={{ color: "rgba(255,255,255,.45)" }}>{lang === "ar" ? item.nameAr : item.nameEn}</span>
                <span style={{ color: T.white, fontWeight: 600 }}>{fmt(item.latest.price)}</span>
                <span style={{ color: up ? "#6fcf97" : dn ? "#ff8080" : "rgba(255,255,255,.3)", fontSize: 11 }}>
                  {up ? "▲" : dn ? "▼" : "—"}{Math.abs(item.change).toFixed(1)}%
                </span>
                <span style={{ color: "rgba(255,255,255,.12)" }}>|</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── SEARCH ──────────────────────────────────────────────────────────────── */
function Search({ lang, onSelect }) {
  const [q, setQ]       = useState("");
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const isAr = lang === "ar";

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return Object.values(ITEM_MAP)
      .filter(i => i.nameAr.includes(q) || i.nameEn.toLowerCase().includes(q.toLowerCase()) || i.category.includes(q.toLowerCase()))
      .slice(0, 8);
  }, [q]);

  useEffect(() => {
    const h = e => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrap} style={{ position: "relative", width: "100%", maxWidth: 340 }}>
      <input
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={isAr ? "ابحث عن سعر..." : "Search prices..."}
        style={{
          width: "100%", background: T.gray100,
          border: `1.5px solid ${T.gray200}`, borderRadius: 8,
          padding: "9px 14px", color: T.black, fontSize: 13, outline: "none",
          transition: "border-color .18s",
          direction: isAr ? "rtl" : "ltr",
        }}
        onFocus={e  => e.target.style.borderColor = T.red}
        onBlur={e   => e.target.style.borderColor = T.gray200}
      />
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)",
          left: 0, right: 0, background: T.white,
          border: `1.5px solid ${T.gray200}`, borderRadius: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,.10)", zIndex: 400, overflow: "hidden",
        }}>
          {results.map(item => (
            <div key={item.id}
              onClick={() => { onSelect(item); setQ(""); setOpen(false); }}
              style={{
                padding: "10px 16px", cursor: "pointer", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                borderBottom: `1px solid ${T.gray100}`, transition: "background .1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.gray50}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.black }}>
                  {isAr ? item.nameAr : item.nameEn}
                </div>
                <div style={{ fontSize: 11, color: T.gray400, marginTop: 1 }}>{item.unit}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.black }}>{fmt(item.latest.price)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MODAL ───────────────────────────────────────────────────────────────── */
function Modal({ item, lang, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!item) return null;
  const isAr  = lang === "ar";
  const up    = item.change > 0, dn = item.change < 0;
  const chgC  = up ? T.green : dn ? T.red : T.gray400;
  const sorted = [...item.entries].reverse();
  const cat    = CATS.find(c => c.id === item.category);

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,10,.55)",
      backdropFilter: "blur(6px)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "overlayIn .2s ease",
      direction: isAr ? "rtl" : "ltr",
    }}>
      <div style={{
        background: T.white, borderRadius: 16, width: "100%", maxWidth: 660,
        maxHeight: "90vh", overflowY: "auto",
        animation: "modalIn .25s ease",
        boxShadow: "0 32px 80px rgba(0,0,0,.15)",
        border: `1px solid ${T.gray200}`,
      }}>
        {/* header stripe */}
        <div style={{
          background: T.black, padding: "16px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderRadius: "16px 16px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 20, background: T.red, borderRadius: 2 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontWeight: 500, letterSpacing: ".08em" }}>
              {isAr ? cat?.ar : cat?.en}
            </span>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%",
            color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.red}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.08)"}
          >✕</button>
        </div>

        <div style={{ padding: "28px 28px 32px" }}>
          {/* name */}
          <div style={{ fontSize: 30, fontWeight: 700, color: T.black, marginBottom: 4, lineHeight: 1.2 }}>
            {isAr ? item.nameAr : item.nameEn}
          </div>
          <div style={{ fontSize: 12, color: T.gray400, marginBottom: 22 }}>
            {item.unit} · {isAr ? "آخر تحديث" : "Last update"}: {item.latest.date}
          </div>

          {/* price + change */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: T.black, lineHeight: 1 }}>
              {fmt(item.latest.price)}
            </div>
            <div style={{ fontSize: 13, color: T.gray400 }}>{item.unit}</div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: chgC,
              background: up ? T.greenSoft : dn ? T.redSoft : T.gray100,
              border: `1px solid ${up ? T.green : dn ? T.red : T.gray200}20`,
              padding: "4px 14px", borderRadius: 20,
            }}>
              {up ? "▲" : dn ? "▼" : "—"} {Math.abs(item.change).toFixed(2)}%
            </div>
          </div>

          {/* chart */}
          <div style={{
            border: `1.5px solid ${T.gray200}`, borderRadius: 10,
            padding: "18px 18px 12px", marginBottom: 22, background: T.gray50,
          }}>
            <div style={{ fontSize: 11, color: T.gray400, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>
              {isAr ? "سجل الأسعار" : "Price History"}
            </div>
            <Chart item={item} lang={lang} />
          </div>

          {/* desc */}
          {(isAr ? item.descAr : item.descEn) && (
            <div style={{
              borderRight: isAr ? `3px solid ${T.red}` : "none",
              borderLeft:  !isAr ? `3px solid ${T.red}` : "none",
              paddingRight: isAr ? 14 : 0,
              paddingLeft:  !isAr ? 14 : 0,
              marginBottom: 22,
              fontSize: 13, color: T.gray500, lineHeight: 1.8,
            }}>
              {isAr ? item.descAr : item.descEn}
            </div>
          )}

          {/* history */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: T.gray400, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
              {isAr ? "آخر التحديثات" : "Recent Updates"}
            </div>
            {sorted.slice(0, 6).map((e, i) => {
              const prev = sorted[i + 1];
              const chg  = prev ? ((e.price - prev.price) / prev.price * 100) : null;
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 0", borderBottom: `1px solid ${T.gray100}`,
                }}>
                  <span style={{ fontSize: 12, color: T.gray400, fontVariantNumeric: "tabular-nums" }}>{e.date}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.black }}>{fmt(e.price)}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: chg == null ? T.gray300 : chg > 0 ? T.green : chg < 0 ? T.red : T.gray300,
                  }}>
                    {chg == null ? "—" : `${chg > 0 ? "▲" : "▼"} ${Math.abs(chg).toFixed(2)}%`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ad slots */}
          {[
            { t: isAr ? "📢 مساحة إعلانية — شريك معنا" : "📢 Advertising Slot — Partner With Us" },
            { t: isAr ? "🤝 كن شريك بيانات موثوق"       : "🤝 Become a Data Partner" },
          ].map((s, i) => (
            <div key={i} style={{
              border: `1.5px dashed ${T.gray200}`, borderRadius: 10,
              padding: "16px 20px", display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 10,
            }}>
              <span style={{ fontSize: 13, color: T.gray500 }}>{s.t}</span>
              <button style={{
                padding: "7px 18px", background: T.red, color: T.white,
                border: "none", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "opacity .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >{isAr ? "تواصل" : "Contact"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ITEM ROW ────────────────────────────────────────────────────────────── */
function ItemRow({ item, lang, onSelect, idx }) {
  const [hov, setHov] = useState(false);
  const isAr = lang === "ar";
  const up   = item.change > 0, dn = item.change < 0;
  const chgC = up ? T.green : dn ? T.red : T.gray300;

  return (
    <div
      className={`row-enter row-${Math.min(idx + 1, 5)}`}
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 12px",
        borderBottom: `1px solid ${T.gray100}`,
        cursor: "pointer",
        background: hov ? T.gray50 : "transparent",
        borderRadius: hov ? 6 : 0,
        transition: "background .12s",
      }}
    >
      {/* idx */}
      <div style={{ fontSize: 11, color: T.gray300, width: 24, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
        {String(idx + 1).padStart(2, "0")}
      </div>

      {/* name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.black, lineHeight: 1.3 }}>
          {isAr ? item.nameAr : item.nameEn}
        </div>
        <div style={{ fontSize: 11, color: T.gray400, marginTop: 1 }}>{item.unit}</div>
      </div>

      {/* spark */}
      <Spark entries={item.entries} change={item.change} />

      {/* badge */}
      <div style={{
        fontSize: 12, fontWeight: 700, color: chgC,
        background: up ? T.greenSoft : dn ? T.redSoft : T.gray100,
        padding: "3px 10px", borderRadius: 20, flexShrink: 0,
        minWidth: 68, textAlign: "center", fontVariantNumeric: "tabular-nums",
      }}>
        {up ? "▲" : dn ? "▼" : "—"} {Math.abs(item.change).toFixed(1)}%
      </div>

      {/* price */}
      <div style={{
        fontSize: 18, fontWeight: 900, color: T.black,
        minWidth: 88, textAlign: isAr ? "left" : "right",
        flexShrink: 0, fontVariantNumeric: "tabular-nums",
      }}>
        {fmt(item.latest.price)}
      </div>

      {/* arrow */}
      <div style={{
        color: hov ? T.red : T.gray300,
        fontSize: 14, transition: "color .15s, transform .15s",
        transform: hov ? (isAr ? "translateX(-3px)" : "translateX(3px)") : "none",
      }}>
        {isAr ? "←" : "→"}
      </div>
    </div>
  );
}

/* ─── SIDEBAR ─────────────────────────────────────────────────────────────── */
function Sidebar({ active, setActive, lang, collapsed, setCollapsed }) {
  const isAr = lang === "ar";
  return (
    <aside style={{
      width: collapsed ? 52 : 220,
      flexShrink: 0,
      borderRight: isAr ? "none" : `1px solid ${T.gray200}`,
      borderLeft:  isAr ? `1px solid ${T.gray200}` : "none",
      height: "calc(100vh - 34px - 64px)",
      position: "sticky",
      top: 98,
      overflowY: "auto",
      overflowX: "hidden",
      transition: "width .22s ease",
      scrollbarWidth: "none",
      background: T.white,
    }}>
      {/* collapse toggle */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-end",
          padding: "12px 14px", cursor: "pointer", borderBottom: `1px solid ${T.gray100}`,
        }}
      >
        <div style={{
          width: 24, height: 24, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", gap: 4,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              height: 1.5, background: T.gray400, borderRadius: 2,
              width: i === 1 ? (collapsed ? 14 : 10) : 14,
              transition: "width .2s",
            }} />
          ))}
        </div>
      </div>

      {CATS.map(cat => {
        const isA = cat.id === active;
        return (
          <div
            key={cat.id}
            onClick={() => setActive(cat.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "13px 0" : "11px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              cursor: "pointer",
              background: isA ? T.black : "transparent",
              borderRight: (!isAr && isA) ? `3px solid ${T.red}` : "none",
              borderLeft:  (isAr  && isA) ? `3px solid ${T.red}` : "none",
              transition: "background .12s",
              position: "relative",
            }}
            onMouseEnter={e => { if (!isA) e.currentTarget.style.background = T.gray50; }}
            onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}
          >
            {collapsed && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: isA ? T.white : T.gray500,
                letterSpacing: ".05em",
              }}>
                {(isAr ? cat.ar : cat.en).slice(0, 2).toUpperCase()}
              </span>
            )}
            {!collapsed && (
              <span style={{
                fontSize: 13, fontWeight: isA ? 700 : 400,
                color: isA ? T.white : T.gray700,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {isAr ? cat.ar : cat.en}
              </span>
            )}
            {!collapsed && isA && (
              <div style={{
                marginRight: isAr ? "auto" : undefined,
                marginLeft:  !isAr ? "auto" : undefined,
                width: 6, height: 6, borderRadius: "50%", background: T.red, flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </aside>
  );
}

/* ─── MAIN APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [lang,      setLang]      = useState("ar");
  const [activeCat, setActiveCat] = useState("currencies");
  const [selected,  setSelected]  = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const isAr     = lang === "ar";
  const catItems = useMemo(() => Object.values(ITEM_MAP).filter(i => i.category === activeCat), [activeCat]);
  const featured = catItems[0] || null;
  const cat      = CATS.find(c => c.id === activeCat);

  const handleSelect = useCallback(item => {
    setSelected(item);
    setActiveCat(item.category);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.white, direction: isAr ? "rtl" : "ltr" }}>

      <Ticker lang={lang} />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,.97)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.gray200}`,
      }}>
        <div style={{
          maxWidth: "100%", padding: "0 28px", height: 64,
          display: "flex", alignItems: "center", gap: 24,
        }}>
          {/* LOGO */}
          <div style={{ flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            onClick={() => setActiveCat("currencies")}>
            <div style={{
              width: 32, height: 32, background: T.black, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: T.red, fontSize: 16, fontWeight: 900 }}>₳</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: T.black, lineHeight: 1 }}>
                Price<span style={{ color: T.red }}>.eg</span>
              </div>
              <div style={{ fontSize: 10, color: T.gray400, fontWeight: 400 }}>
                {isAr ? "أسعار مصر" : "Egypt Prices"}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* SEARCH */}
          <Search lang={lang} onSelect={handleSelect} />

          {/* LANG TOGGLE */}
          <div style={{
            display: "flex", borderRadius: 8,
            border: `1.5px solid ${T.gray200}`, overflow: "hidden", flexShrink: 0,
          }}>
            {["ar","en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "6px 14px", background: lang === l ? T.black : "transparent",
                color: lang === l ? T.white : T.gray500,
                border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                transition: "background .15s, color .15s",
              }}>
                {l === "ar" ? "ع" : "EN"}
              </button>
            ))}
          </div>

          {/* LIVE DOT */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: T.green,
              display: "inline-block", animation: "blink 2s infinite",
            }} />
            <span style={{ fontSize: 11, color: T.gray400, fontWeight: 500 }}>
              {isAr ? "مباشر" : "Live"}
            </span>
          </div>
        </div>
      </header>

      {/* ── BODY: SIDEBAR + CONTENT ── */}
      <div style={{ display: "flex", maxWidth: "100%", minHeight: "calc(100vh - 98px)" }}>

        <Sidebar
          active={activeCat} setActive={setActiveCat}
          lang={lang} collapsed={collapsed} setCollapsed={setCollapsed}
        />

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* HERO SECTION */}
          <div style={{
            padding: "48px 36px 36px",
            borderBottom: `1px solid ${T.gray200}`,
          }}>
            {/* overline */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: T.black, color: T.white,
              padding: "4px 12px", borderRadius: 4,
              fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
              marginBottom: 20,
            }}>
              <span style={{ color: T.red }}>■</span>
              {isAr ? cat?.ar : cat?.en}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              {/* big number */}
              {featured && (
                <div>
                  <div style={{ fontSize: 12, color: T.gray400, marginBottom: 6, fontWeight: 500 }}>
                    {isAr ? featured.nameAr : featured.nameEn}
                  </div>
                  <div
                    onClick={() => setSelected(featured)}
                    style={{
                      fontSize: "clamp(52px,7vw,80px)", fontWeight: 900,
                      color: T.black, lineHeight: 1, cursor: "pointer",
                      letterSpacing: "-2px",
                      transition: "color .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = T.red}
                    onMouseLeave={e => e.currentTarget.style.color = T.black}
                  >
                    {fmt(featured.latest.price)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <span style={{ fontSize: 13, color: T.gray400 }}>{featured.unit}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: featured.change > 0 ? T.green : featured.change < 0 ? T.red : T.gray400,
                      background: featured.change > 0 ? T.greenSoft : featured.change < 0 ? T.redSoft : T.gray100,
                      padding: "3px 12px", borderRadius: 20,
                    }}>
                      {featured.change > 0 ? "▲" : featured.change < 0 ? "▼" : "—"} {Math.abs(featured.change).toFixed(2)}%
                    </span>
                    <span style={{ fontSize: 11, color: T.gray300 }}>
                      {isAr ? `vs ${featured.prev?.date}` : `vs ${featured.prev?.date}`}
                    </span>
                  </div>
                </div>
              )}

              {/* top 3 mini boxes */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {catItems.slice(1, 4).map(item => (
                  <div key={item.id} onClick={() => setSelected(item)} style={{
                    border: `1.5px solid ${T.gray200}`, borderRadius: 10,
                    padding: "14px 18px", cursor: "pointer",
                    transition: "border-color .15s, transform .15s",
                    minWidth: 110,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.gray200; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ fontSize: 11, color: T.gray400, marginBottom: 6, fontWeight: 500 }}>
                      {isAr ? item.nameAr : item.nameEn}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: T.black }}>{fmt(item.latest.price)}</div>
                    <div style={{
                      fontSize: 11, marginTop: 4, fontWeight: 700,
                      color: item.change > 0 ? T.green : item.change < 0 ? T.red : T.gray300,
                    }}>
                      {item.change > 0 ? "▲" : item.change < 0 ? "▼" : "—"}{Math.abs(item.change).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div style={{ padding: "0 36px 60px" }}>
            {catItems.length === 0 ? (
              <div style={{ padding: "64px 0", textAlign: "center" }}>
                <div style={{
                  display: "inline-block",
                  border: `1.5px dashed ${T.gray200}`,
                  borderRadius: 12, padding: "40px 48px",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: T.black, marginBottom: 8 }}>
                    {isAr ? "قريباً" : "Coming Soon"}
                  </div>
                  <div style={{ fontSize: 13, color: T.gray400, lineHeight: 1.8, maxWidth: 300, margin: "0 auto 20px" }}>
                    {isAr ? "نعمل على توفير بيانات هذا القسم." : "We're working on data for this section."}
                  </div>
                  <button style={{
                    padding: "9px 24px", background: T.red, color: T.white,
                    border: "none", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>
                    {isAr ? "كن شريك بيانات" : "Become a Data Partner"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* table header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 12px", borderBottom: `2px solid ${T.black}`,
                  fontSize: 10, color: T.gray400, fontWeight: 700,
                  letterSpacing: ".1em", textTransform: "uppercase",
                }}>
                  <div style={{ width: 24 }}>#</div>
                  <div style={{ flex: 1 }}>{isAr ? "البند" : "Item"}</div>
                  <div style={{ width: 64, textAlign: "center" }}>{isAr ? "الحركة" : "Trend"}</div>
                  <div style={{ width: 68, textAlign: "center" }}>{isAr ? "تغيير" : "Change"}</div>
                  <div style={{ width: 88, textAlign: isAr ? "left" : "right" }}>{isAr ? "السعر" : "Price"}</div>
                  <div style={{ width: 20 }} />
                </div>
                {catItems.map((item, i) => (
                  <ItemRow key={item.id} item={item} lang={lang} onSelect={setSelected} idx={i} />
                ))}
              </>
            )}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${T.gray200}`, padding: "24px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12, direction: isAr ? "rtl" : "ltr",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: T.black, borderRadius: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: T.red, fontSize: 13, fontWeight: 900 }}>₳</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.black }}>
            Price<span style={{ color: T.red }}>.eg</span>
          </span>
          <span style={{ fontSize: 12, color: T.gray400 }}>
            {isAr ? "— أسعار مصر للأغراض المعلوماتية" : "— Egyptian market prices, for reference only"}
          </span>
        </div>
        <div style={{ fontSize: 11, color: T.gray300 }}>© 2025</div>
      </footer>

      {selected && <Modal item={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}
