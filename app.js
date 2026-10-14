/* Position size calculator — USD account, no backend, no API.
   Forex contract = 100,000. Indices contract = 1 ($1 per point per 1.0 lot).
   Gold: 100 oz, pip 0.1 => $10/pip/lot. Silver: 5000 oz, pip 0.01 => $50/pip/lot.
*/

const INSTRUMENTS = [
  // Majors — XXX/USD need no price
  { group: "Majors", code: "EURUSD", name: "EUR/USD", type: "direct", contract: 100000, pip: 0.0001 },
  { group: "Majors", code: "GBPUSD", name: "GBP/USD", type: "direct", contract: 100000, pip: 0.0001 },
  { group: "Majors", code: "AUDUSD", name: "AUD/USD", type: "direct", contract: 100000, pip: 0.0001 },
  { group: "Majors", code: "NZDUSD", name: "NZD/USD", type: "direct", contract: 100000, pip: 0.0001 },
  // Majors — USD/XXX need own price (divide)
  { group: "Majors", code: "USDJPY", name: "USD/JPY", type: "inverse", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Take the live USD/JPY ask from your broker.", defaultPrice: 150 },
  { group: "Majors", code: "USDCHF", name: "USD/CHF", type: "inverse", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CHF price", priceHint: "Take the live USD/CHF ask from your broker.", defaultPrice: 0.88 },
  { group: "Majors", code: "USDCAD", name: "USD/CAD", type: "inverse", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CAD price", priceHint: "Take the live USD/CAD ask from your broker.", defaultPrice: 1.36 },

  // Minors / crosses — need one conversion rate
  { group: "Minors / Crosses", code: "EURGBP", name: "EUR/GBP", type: "cross-multiply", contract: 100000, pip: 0.0001, priceLabel: "Current GBP/USD rate", priceHint: "Converts GBP profit → USD: pip value × GBP/USD.", defaultPrice: 1.27 },
  { group: "Minors / Crosses", code: "EURCHF", name: "EUR/CHF", type: "cross-divide", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CHF price", priceHint: "Converts CHF profit → USD: pip value ÷ USD/CHF.", defaultPrice: 0.88 },
  { group: "Minors / Crosses", code: "EURCAD", name: "EUR/CAD", type: "cross-divide", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CAD price", priceHint: "Converts CAD profit → USD: pip value ÷ USD/CAD.", defaultPrice: 1.36 },
  { group: "Minors / Crosses", code: "EURJPY", name: "EUR/JPY", type: "cross-divide", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Converts JPY profit → USD: pip value ÷ USD/JPY.", defaultPrice: 150 },
  { group: "Minors / Crosses", code: "GBPJPY", name: "GBP/JPY", type: "cross-divide", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Converts JPY profit → USD: pip value ÷ USD/JPY.", defaultPrice: 150 },
  { group: "Minors / Crosses", code: "AUDJPY", name: "AUD/JPY", type: "cross-divide", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Converts JPY profit → USD: pip value ÷ USD/JPY.", defaultPrice: 150 },
  { group: "Minors / Crosses", code: "CHFJPY", name: "CHF/JPY", type: "cross-divide", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Converts JPY profit → USD: pip value ÷ USD/JPY.", defaultPrice: 150 },
  { group: "Minors / Crosses", code: "CADJPY", name: "CAD/JPY", type: "cross-divide", contract: 100000, pip: 0.01, priceLabel: "Current USD/JPY price", priceHint: "Converts JPY profit → USD: pip value ÷ USD/JPY.", defaultPrice: 150 },
  { group: "Minors / Crosses", code: "GBPCAD", name: "GBP/CAD", type: "cross-divide", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CAD price", priceHint: "Converts CAD profit → USD: pip value ÷ USD/CAD.", defaultPrice: 1.36 },
  { group: "Minors / Crosses", code: "AUDCAD", name: "AUD/CAD", type: "cross-divide", contract: 100000, pip: 0.0001, priceLabel: "Current USD/CAD price", priceHint: "Converts CAD profit → USD: pip value ÷ USD/CAD.", defaultPrice: 1.36 },
  { group: "Minors / Crosses", code: "AUDNZD", name: "AUD/NZD", type: "cross-multiply", contract: 100000, pip: 0.0001, priceLabel: "Current NZD/USD rate", priceHint: "Converts NZD profit → USD: pip value × NZD/USD.", defaultPrice: 0.61 },
  { group: "Minors / Crosses", code: "EURNZD", name: "EUR/NZD", type: "cross-multiply", contract: 100000, pip: 0.0001, priceLabel: "Current NZD/USD rate", priceHint: "Converts NZD profit → USD: pip value × NZD/USD.", defaultPrice: 0.61 },
  { group: "Minors / Crosses", code: "GBPAUD", name: "GBP/AUD", type: "cross-multiply", contract: 100000, pip: 0.0001, priceLabel: "Current AUD/USD rate", priceHint: "Converts AUD profit → USD: pip value × AUD/USD.", defaultPrice: 0.66 },

  // Metals
  { group: "Metals", code: "XAUUSD", name: "Gold (XAU/USD)", type: "direct", contract: 100, pip: 0.1, unit: "oz", note: "1 lot = 100 oz. 1 pip = 0.1 ($10/pip/lot)." },
  { group: "Metals", code: "XAGUSD", name: "Silver (XAG/USD)", type: "direct", contract: 5000, pip: 0.01, unit: "oz", note: "1 lot = 5,000 oz. 1 pip = 0.01 ($50/pip/lot)." },

  // Indices — contract size 1, SL in points, no price needed
  { group: "US Indices", code: "US30", name: "US30 (Dow Jones)", type: "index", contract: 1, unit: "contracts" },
  { group: "US Indices", code: "NAS100", name: "NAS100 (Nasdaq 100)", type: "index", contract: 1, unit: "contracts" },
  { group: "US Indices", code: "SP500", name: "SP500 (S&P 500)", type: "index", contract: 1, unit: "contracts" },
];

const $ = (id) => document.getElementById(id);
const pairEl = $("pair"), accountEl = $("account"), riskEl = $("risk"),
  slEl = $("sl"), priceWrap = $("price-wrap"), priceEl = $("price"),
  priceLabel = $("price-label"), priceHint = $("price-hint"),
  pairHint = $("pair-hint"), slLabel = $("sl-label"), riskHint = $("risk-hint"),
  errorEl = $("error");

let riskMode = "pct"; // 'pct' | 'cash'

// Build grouped dropdown
(function buildDropdown() {
  const groups = {};
  INSTRUMENTS.forEach((ins) => {
    (groups[ins.group] = groups[ins.group] || []).push(ins);
  });
  pairEl.innerHTML = "";
  Object.entries(groups).forEach(([g, list]) => {
    const og = document.createElement("optgroup");
    og.label = g;
    list.forEach((ins) => {
      const o = document.createElement("option");
      o.value = ins.code;
      o.textContent = `${ins.code} — ${ins.name}`;
      og.appendChild(o);
    });
    pairEl.appendChild(og);
  });
  pairEl.value = "EURUSD";
})();

function getInstrument(code) {
  return INSTRUMENTS.find((i) => i.code === code);
}

function pipValuePerLot(ins, price) {
  // Returns USD value of 1 pip (FX/metals) or 1 point (indices) for 1.0 lot
  if (ins.type === "direct") return ins.pip * ins.contract; // quote is USD
  if (ins.type === "inverse" || ins.type === "cross-divide") return (ins.pip * ins.contract) / price;
  if (ins.type === "cross-multiply") return ins.pip * ins.contract * price;
  if (ins.type === "index") return ins.contract * 1; // $1 per point per 1.0 lot
  return NaN;
}

function fmtMoney(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function syncUI() {
  const ins = getInstrument(pairEl.value);
  const isIndex = ins.type === "index";

  slLabel.textContent = isIndex ? "Stop loss (points)" : "Stop loss (pips)";

  if (ins.note) {
    pairHint.textContent = ins.note;
  } else if (isIndex) {
    pairHint.textContent = `1.0 lot = contract size ${ins.contract} ($${ins.contract} per point). SL is in index points.`;
  } else if (ins.type === "direct") {
    pairHint.textContent = `1 pip = ${ins.pip}. Pip value fixed at $${(ins.pip * ins.contract).toFixed(2)} / pip / lot. No price needed.`;
  } else {
    pairHint.textContent = `Quote is not USD — enter one conversion price below.`;
  }

  const needsPrice = ins.type !== "direct" && ins.type !== "index";
  priceWrap.hidden = !needsPrice;
  if (needsPrice) {
    priceLabel.textContent = ins.priceLabel;
    priceHint.textContent = ins.priceHint;
    if (!priceEl.value) priceEl.value = ins.defaultPrice;
    priceEl.placeholder = `e.g. ${ins.defaultPrice}`;
  }
  updateRiskHint();
}

function updateRiskHint() {
  const acc = parseFloat(accountEl.value);
  const r = parseFloat(riskEl.value);
  if (riskMode === "pct" && isFinite(acc) && isFinite(r)) {
    riskHint.textContent = `${r}% of ${fmtMoney(acc)} = ${fmtMoney(acc * r / 100)} risk`;
  } else if (riskMode === "cash" && isFinite(r)) {
    const pct = isFinite(acc) && acc > 0 ? ` (${((r / acc) * 100).toFixed(2)}% of account)` : "";
    riskHint.textContent = `${fmtMoney(r)} risk${pct}`;
  } else {
    riskHint.textContent = "";
  }
}

function calculate(e) {
  if (e) e.preventDefault();
  errorEl.hidden = true;

  const ins = getInstrument(pairEl.value);
  const acc = parseFloat(accountEl.value);
  const r = parseFloat(riskEl.value);
  const sl = parseFloat(slEl.value);
  const price = parseFloat(priceEl.value);

  const fail = (msg) => { errorEl.textContent = msg; errorEl.hidden = false; };

  if (!isFinite(acc) || acc <= 0) return fail("Enter an account size greater than 0.");
  if (!isFinite(r) || r <= 0) return fail(riskMode === "pct" ? "Enter a risk percent greater than 0." : "Enter a risk amount greater than 0.");
  if (!isFinite(sl) || sl <= 0) return fail(ins.type === "index" ? "Enter a stop loss in points greater than 0." : "Enter a stop loss in pips greater than 0.");

  const needsPrice = ins.type !== "direct" && ins.type !== "index";
  if (needsPrice && (!isFinite(price) || price <= 0)) return fail(`Enter a valid ${ins.priceLabel.toLowerCase()} greater than 0.`);

  const riskAmount = riskMode === "pct" ? (acc * r) / 100 : r;
  const pvp = pipValuePerLot(ins, price);
  const lotsRaw = riskAmount / (sl * pvp);
  if (!isFinite(lotsRaw) || lotsRaw <= 0) return fail("Could not calculate — check your inputs.");

  const lots = Math.floor(lotsRaw * 100) / 100; // round DOWN to 2dp (safer)
  const unitName = ins.type === "index" ? "contracts" : ins.unit === "oz" ? "oz" : "units";
  const unitQty = ins.type === "index" ? lots * ins.contract
    : ins.unit === "oz" ? lots * ins.contract
    : lots * 100000;

  const unitLabel = ins.type === "index"
    ? `${lots.toFixed(2)} lots ≈ ${unitQty.toFixed(2)} ${unitName}`
    : ins.unit === "oz"
      ? `${lots.toFixed(2)} lots ≈ ${unitQty.toFixed(2)} ${unitName}`
      : `${lots.toFixed(2)} lots ≈ ${Math.round(unitQty).toLocaleString("en-US")} ${unitName}`;

  $("out-lots").textContent = `${lots.toFixed(2)} lots`;
  $("out-units").textContent = unitLabel;
  $("out-risk").textContent = fmtMoney(riskAmount);
  $("out-pip").textContent = ins.type === "index"
    ? `${fmtMoney(pvp)} / point / lot`
    : `${fmtMoney(pvp)} / pip / lot`;
  $("out-sl").textContent = ins.type === "index" ? `${sl} points` : `${sl} pips`;
  $("out-contract").textContent = ins.type === "index"
    ? `${ins.contract}`
    : ins.unit === "oz" ? `${ins.contract} oz` : `${ins.contract.toLocaleString("en-US")} units`;

  const unitWord = ins.type === "index" ? "point" : "pip";
  $("out-formula").textContent =
    `Lots = ${fmtMoney(riskAmount)} ÷ (${sl} ${unitWord}s × ${fmtMoney(pvp)}) = ${lotsRaw.toFixed(4)} → ${lots.toFixed(2)} (rounded down)`;

  // Fluid pulse animation on every successful recalculation
  const main = $("result-main");
  if (main) {
    main.classList.remove("pulse");
    void main.offsetWidth; // restart animation
    main.classList.add("pulse");
  }

  // Warnings
  const warns = [];
  const riskPct = (riskAmount / acc) * 100;
  if (riskPct > 5) warns.push(`High risk: ${riskPct.toFixed(1)}% of account per trade.`);
  if (lotsRaw < 0.01) warns.push("Position is below most brokers' 0.01 minimum — consider a smaller SL or larger risk.");
  if (riskMode === "pct" && r > 2) warns.push("Tip: most traders risk 0.5–2% per trade.");
  const w = $("out-warn");
  if (warns.length) { w.textContent = warns.join(" "); w.hidden = false; }
  else w.hidden = true;

  updateRiskHint();
}

// Events: instant recalc + toggle + dropdown change
$("calc-form").addEventListener("submit", calculate);
[pairEl, accountEl, riskEl, slEl, priceEl].forEach((el) => el.addEventListener("input", () => {
  if (el === pairEl) syncUI();
  updateRiskHint();
  // live update only if form already valid once
  if ($("out-lots").textContent !== "—") calculate();
}));
pairEl.addEventListener("change", () => { syncUI(); calculate(); });

$("mode-pct").addEventListener("click", () => {
  riskMode = "pct";
  $("mode-pct").classList.add("active"); $("mode-cash").classList.remove("active");
  $("mode-pct").setAttribute("aria-pressed", "true"); $("mode-cash").setAttribute("aria-pressed", "false");
  riskEl.value = 1; updateRiskHint(); calculate();
});
$("mode-cash").addEventListener("click", () => {
  riskMode = "cash";
  $("mode-cash").classList.add("active"); $("mode-pct").classList.remove("active");
  $("mode-cash").setAttribute("aria-pressed", "true"); $("mode-pct").setAttribute("aria-pressed", "false");
  riskEl.value = 10; updateRiskHint(); calculate();
});

syncUI();
calculate();
