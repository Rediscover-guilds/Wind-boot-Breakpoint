
const $=s=>document.querySelector(s);
let demon=false;
const num=id=>parseFloat($(id).value||0);
const fmt=n=>Number.isFinite(n)?Math.round(n).toLocaleString():'—';
const fmtPct=f=>Number.isFinite(f)?(f*100).toFixed(2)+'%':'—';

function msTotal(){
  let ms=num('#msEquip')+num('#msRune')+num('#msTech')+num('#msPet')+num('#msPetGear')+num('#msMedal')+num('#msCostume')+num('#msBuilding')+num('#msUlt');
  if(demon) ms+=200;
  return ms;
}

function finalNoBoots(){
  const direct=num('#finalNoBoots');
  if(direct>0) return direct;
  const base=num('#base'), atkPct=num('#atkPct');
  return base*(1+atkPct/100);
}

function compute(){
  const A=num('#atkPct')/100;
  const F0=finalNoBoots();
  const MS=msTotal();
  $('#msTotal').textContent=MS.toFixed(2)+'%';
  $('#outNoBoots').textContent=fmt(F0);

  const chaosPct=num('#chaosAtk')/100, abyssPct=num('#abyssAtk')/100;
  const chaosF=F0*((1+(A+chaosPct))/(1+A));
  const abyssF=F0*((1+(A+abyssPct))/(1+A));

  const roll=num('#windRoll')/100, cap=num('#windCap')/100;
  const amp=Math.min(roll*MS/100,cap);
  const atkLine=num('#windAtkLine').value==='26'?0.26:0;
  const windMul=(1+(A+atkLine))/(1+A);
  const windF=F0*windMul*(1+amp);

  $('#outChaos').textContent=fmt(chaosF);
  $('#outAbyss').textContent=fmt(abyssF);
  $('#outWind').textContent=fmt(windF);

  let arr=[['Chaos',chaosF],['Abyss',abyssF],['Wind',windF]];
  arr.sort((a,b)=>b[1]-a[1]);
  $('#outWinner').textContent=arr[0][0]+' — '+fmt(arr[0][1]);

  const reqAmpChaos=(chaosPct)/(1+A+atkLine);
  const reqAmpAbyss=(abyssPct)/(1+A+atkLine);
  const reqRollChaos=(reqAmpChaos/(MS/100))*10000;
  const reqRollAbyss=(reqAmpAbyss/(MS/100))*10000;
  $('#bpAmpChaos').textContent=fmtPct(reqAmpChaos);
  $('#bpAmpAbyss').textContent=fmtPct(reqAmpAbyss);
  $('#bpRollChaos').textContent=Number.isFinite(reqRollChaos)?reqRollChaos.toFixed(2)+'% roll':'—';
  $('#bpRollAbyss').textContent=Number.isFinite(reqRollAbyss)?reqRollAbyss.toFixed(2)+'% roll':'—';
}

function wire(){
  ['input','change','click'].forEach(evt=>
    document.addEventListener(evt,e=>{if(e.target.matches('input,select,button')) compute();})
  );
  $('#demonOn').addEventListener('click',()=>{demon=true;$('#demonOn').classList.add('is-active');$('#demonOff').classList.remove('is-active');compute();});
  $('#demonOff').addEventListener('click',()=>{demon=false;$('#demonOff').classList.add('is-active');$('#demonOn').classList.remove('is-active');compute();});
  compute();
}
document.addEventListener('DOMContentLoaded',wire);
