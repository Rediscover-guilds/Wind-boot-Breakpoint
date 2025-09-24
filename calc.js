
const $=s=>document.querySelector(s);
let demon=false, glacial=false;
function num(id){return parseFloat($(id).value)||0;}
function fmt(n){return Number.isFinite(n)?Math.round(n).toLocaleString():'—';}
function msTotal(){let ms=num('#msEquip')+num('#msRune')+num('#msTech')+num('#msPet')+num('#msPetGear')+num('#msMedal')+num('#msCostume')+num('#msBuilding')+num('#msUlt');if(demon) ms+=200;if(glacial) ms+=80;return ms;}
function finalNoBoots(){const over=num('#finalNoBoots');if(over>0) return over;let A=num('#atkPct');if(demon) A+=30;return num('#base')*(1+A/100);}
function chaosFinal(F0,A0){let lines=parseInt($('#chaosLines').value);let bonus=26*lines;let A=A0+(demon?30:0);return F0*((1+(A+bonus)/100)/(1+A/100));}
function abyssFinal(F0,A0){let lines=parseInt($('#abyssLines').value);let bonus=29*lines;let A=A0+(demon?30:0);return F0*((1+(A+bonus)/100)/(1+A/100));}
function windFinal(F0,A0,line,cap){let roll=num('#windRoll');let MS=msTotal();let amp=Math.min((roll*MS)/100,cap)/100;let A=A0+(demon?30:0);let mul=(1+(A+line)/100)/(1+A/100);return F0*mul*(1+amp);}
function compute(){let A0=num('#atkPct');let F0=finalNoBoots();let MS=msTotal();$('#outNoBoots').textContent=fmt(F0);$('#outMS').textContent=MS.toFixed(2)+'%';let chaos=chaosFinal(F0,A0);let abyss=abyssFinal(F0,A0);let wind30=windFinal(F0,A0,parseFloat($('#windAtk').value),30);let wind40=windFinal(F0,A0,parseFloat($('#truthAtk').value),40);$('#outChaos').textContent=fmt(chaos);$('#outAbyss').textContent=fmt(abyss);$('#outWind30').textContent=fmt(wind30);$('#outWind40').textContent=fmt(wind40);let arr=[['Chaos',chaos],['Abyss',abyss],['Wind',wind30],['Truthful',wind40]].sort((a,b)=>b[1]-a[1]);$('#outWinner').textContent=arr[0][0]+' — '+fmt(arr[0][1]);}
function wire(){['input','change','click'].forEach(evt=>document.addEventListener(evt,e=>{if(e.target.matches('input,select,button')) compute();}));$('#demonOn').addEventListener('click',()=>{demon=true;$('#demonOn').classList.add('is-active');$('#demonOff').classList.remove('is-active');compute();});$('#demonOff').addEventListener('click',()=>{demon=false;$('#demonOff').classList.add('is-active');$('#demonOn').classList.remove('is-active');compute();});$('#glacialOn').addEventListener('click',()=>{glacial=true;$('#glacialOn').classList.add('is-active');$('#glacialOff').classList.remove('is-active');compute();});$('#glacialOff').addEventListener('click',()=>{glacial=false;$('#glacialOff').classList.add('is-active');$('#glacialOn').classList.remove('is-active');compute();});compute();}
document.addEventListener('DOMContentLoaded',wire);
