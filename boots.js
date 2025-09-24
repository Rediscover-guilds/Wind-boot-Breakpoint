
const $ = s => document.querySelector(s);
const num = id => parseFloat($(id).value||0);
const fmt = n => Number.isFinite(n) ? Math.round(n).toLocaleString() : '—';
const fmtPct = f => Number.isFinite(f) ? (f*100).toFixed(2)+'%' : '—';

let demonOn = false;

function msTotal(){
  const parts = [
    num('#msEquip'), num('#msRune'), num('#msTech'), num('#msPet'), num('#msPetGear'),
    num('#msMedal'), num('#msCostume'), num('#msBuilding'), num('#msUlt')
  ];
  let total = parts.reduce((a,b)=>a+b,0);
  if (demonOn) total += 200;
  return total;
}

function finalNoBoots(){
  const direct = num('#finalNoBoots');
  if (direct > 0) return direct;
  const base = num('#base');
  const atkPct = num('#atkPct');
  return base * (1 + atkPct/100);
}

function compute(){
  const chaosAtk = num('#chaosAtk');   // e.g., 51
  const abyssAtk = num('#abyssAtk');   // e.g., 51
  const windRoll = num('#windRoll');   // 1..10 typical
  const windCap  = num('#windCap');    // 30 or 40
  const windAtk  = num('#windAtkLine');// 0 or 26
  const atkPctNoBoots = num('#atkPct');

  const F0 = finalNoBoots();
  const MS = msTotal();
  $('#msTotal').textContent = MS.toFixed(2) + '%';
  $('#outMS').textContent   = $('#msTotal').textContent;
  $('#outNoBoots').textContent = fmt(F0);

  // Chaos / Abyss finals (flat % boots)
  const chaosF = F0 * ((1 + chaosAtk/100) / (1 + 0)); // because F0 already includes no-boots ATK%
  const abyssF = F0 * ((1 + abyssAtk/100) / (1 + 0));

  // Wind final
  const amp = Math.min((windRoll/100) * (MS/100), windCap/100); // fraction
  // If Wind also has +26% ATK line, we need to multiply F0 by 1.26 relative to no-boots? Careful:
  // F0 = Base * (1 + ATK%_noBoots). Adding +26% ATK means multiplier (1 + (ATK%+26)/100)/(1 + ATK%/100) = (1 + (A+26)/100)/(1 + A/100).
  const A = atkPctNoBoots/100;
  const windAtkMul = windAtk>0 ? ((1 + (A + windAtk/100)) / (1 + A)) : 1;
  const windF = F0 * windAtkMul * (1 + amp);

  $('#outChaos').textContent = fmt(chaosF);
  $('#outAbyss').textContent = fmt(abyssF);
  $('#outWind').textContent  = fmt(windF);

  // Winner
  const arr = [
    ['Wind', windF],
    ['Chaos', chaosF],
    ['Abyss', abyssF]
  ].sort((a,b)=>b[1]-a[1]);
  $('#outWinner').textContent = arr[0][0] + ' — ' + fmt(arr[0][1]);

  // Breakpoints (required amp vs flat % boots)
  const reqAmpChaos = (chaosAtk/100) / (1 + A + (windAtk>0 ? windAtk/100 : 0));  // fraction needed over Wind's ATK stack
  const reqAmpAbyss = (abyssAtk/100) / (1 + A + (windAtk>0 ? windAtk/100 : 0));

  const reqRollChaos = (reqAmpChaos>0) ? (reqAmpChaos / (MS/100)) * 10000 : Infinity; // percent roll
  const reqRollAbyss = (reqAmpAbyss>0) ? (reqAmpAbyss / (MS/100)) * 10000 : Infinity;

  const capOK = (windCap/100 >= reqAmpChaos) || (windCap/100 >= reqAmpAbyss);

  $('#bpAmpChaos').textContent  = fmtPct(reqAmpChaos);
  $('#bpAmpAbyss').textContent  = fmtPct(reqAmpAbyss);
  $('#bpRollChaos').textContent = Number.isFinite(reqRollChaos) ? reqRollChaos.toFixed(2)+'% roll' : '—';
  $('#bpRollAbyss').textContent = Number.isFinite(reqRollAbyss) ? reqRollAbyss.toFixed(2)+'% roll' : '—';
  $('#bpCapOK').textContent     = capOK ? 'Cap sufficient for at least one matchup' : 'Cap too low';
}

function wire(){
  ['input','change'].forEach(evt=>document.addEventListener(evt, e=>{
    if(e.target.matches('input, select')) compute();
  }));
  $('#demonOn').addEventListener('click', ()=>{ demonOn=true; $('#demonOn').classList.add('is-active'); $('#demonOff').classList.remove('is-active'); compute(); });
  $('#demonOff').addEventListener('click', ()=>{ demonOn=false; $('#demonOff').classList.add('is-active'); $('#demonOn').classList.remove('is-active'); compute(); });
  compute();
}

document.addEventListener('DOMContentLoaded', wire);
