/* ================= EDIT THIS SECTION ================= */
const NAME = "Anusuya";
const FINALE_TEXT = "তুমি আমার কবিতার সেই ছন্দ যাকে আমি করি পছন্দ";
const CHAPTERS = [
  { num:"I",   title:"Beauty",           mode:"petals",  line:"I don't know the secret behind your beauty's formation<br>But I can say for sure that even the creators got amazed by their creation",
    photos:["images/beauty-1.jpeg","images/beauty-2.jpeg","images/beauty-3.jpeg"] },
  { num:"II",  title:"Brain",            mode:"network", line:"There is someone special aka the Beauty with brains<br>She is the only one responsible for her achievements and gains",
    photos:["images/brain-1.jpeg","images/brain-2.jpeg","images/brain-3.jpeg"] },
  { num:"III", title:"Grace and Divine", mode:"halo",    line:"There is nothing like her grace and she is divine<br>This is why in her life she will always shine", theme:"light",
    photos:["images/grace-1.jpeg","images/grace-2.jpeg","images/grace-3.jpeg"] },
  { num:"IV",  title:"Chaotic Good",     mode:"chaos",   line:"There is no comparison for her chaotic good<br>God bless you and for you i will always say touch wood",
    photos:["images/chaotic-1.jpeg","images/chaotic-2.jpeg","images/chaotic-3.jpeg"] },
  { num:"V",   title:"The Leader",       mode:"embers",  line:"When in need you lead and for us it's very obvious<br>Cause this quality is what makes you very precious",
    photos:["images/leader-1.jpeg","images/leader-2.jpeg","images/leader-3.jpeg"] }
];
/* ================= END OF EDIT SECTION ================= */

const $ = s => document.querySelector(s);
const R = (a,b) => a + Math.random()*(b-a);
const EASE = 'cubic-bezier(.7,0,.2,1)';
const story=$('#story'), bgs=$('#bgs'), dotsEl=$('#dots'), curtain=$('#curtain');
const SCENES = [...CHAPTERS, {finale:true, num:"♥", title:"Forever", mode:"halo"}];

$('#introName').textContent = NAME;
$('#brand').textContent = NAME;
document.title = NAME + " — a story";

/* ---------- text splitters ---------- */
function letters(t){
  let i=0;
  return t.split(' ').map(w =>
    '<span class="wd">' + [...w].map(c => `<span class="l" style="animation-delay:${600+(i++)*50}ms">${c}</span>`).join('') + '</span>'
  ).join(' ');
}
// function words(t,start){
//   return t.split(' ').map((w,i)=>`<span class="w" style="animation-delay:${start+i*65}ms">${w}</span>`).join(' ');
// }
function words(t,start){
  const blocks = t.split(/<br\s*\/?>|\n/);

  return blocks.map((block, blockIndex) => {
    const rendered = block.trim()
      ? block.split(' ').map((w, i) =>
          `<span class="w" style="animation-delay:${start + (blockIndex * 140) + i * 65}ms">${w}</span>`
        ).join(' ')
      : '';

    return rendered + (blockIndex < blocks.length - 1 ? '<br>' : '');
  }).join('');
}

/* ---------- lightbox ---------- */
const lb=$('#lb'), lbImg=$('#lbImg');
let lbOpen=false, lbScene=null, lbList=[], lbPos=0;
function showLB(){ lbImg.src = lbScene.photos[lbList[lbPos]]; }
function openLB(s,i){
  lbScene=s;
  lbList=s.photos.map((_,k)=>k).filter(k=>s.ok[k]);
  lbPos=Math.max(0,lbList.indexOf(i));
  showLB(); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); lbOpen=true;
}
function closeLB(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); lbOpen=false; }
function stepLB(d){ lbPos=(lbPos+d+lbList.length)%lbList.length; showLB(); }
$('#lbClose').onclick=closeLB;
$('#lbPrev').onclick=()=>stepLB(-1);
$('#lbNext').onclick=()=>stepLB(1);
lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });

/* ---------- photo gallery (all photos visible) ---------- */
function makeGallery(s){
  const stage=document.createElement('div'); stage.className='stage';
  const g=document.createElement('div'); g.className='gallery';
  g.innerHTML='<div class="ring"></div><div class="ring r2"></div>';
  const DY=['-5svh','5svh','-1svh'], ROT=['-4deg','3deg','-2deg'];
  s.ok=[];
  s.photos.forEach((src,i)=>{
    const fw=document.createElement('div'); fw.className='fw';
    fw.style.cssText=`--i:${i};--dy:${DY[i%3]};--rot:${ROT[i%3]}`;
    fw.innerHTML=`<div class="fl"><div class="fr"><div class="ph"></div><span class="cap">${s.title} · ${i+1}</span></div></div>`;
    const fr=fw.querySelector('.fr'), ph=fw.querySelector('.ph');
    const img=new Image(); img.alt=`${s.title} ${i+1}`;
    img.onload=()=>{ s.ok[i]=true; };
    img.onerror=()=>{ fr.classList.add('missing'); img.remove(); };
    img.src=src; ph.appendChild(img);
    fr.addEventListener('click',()=>{ if(s.ok[i]) openLB(s,i); });
    fr.addEventListener('pointermove',e=>{
      const r=fr.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      fr.style.setProperty('--ry',(x*18)+'deg'); fr.style.setProperty('--rx',(-y*18)+'deg');
    });
    fr.addEventListener('pointerleave',()=>{ fr.style.setProperty('--ry','0deg'); fr.style.setProperty('--rx','0deg'); });
    g.appendChild(fw);
  });
  const hint=document.createElement('div'); hint.className='hint'; hint.textContent='tap a photo to enlarge ✦';
  stage.append(g,hint);
  return stage;
}

/* ---------- build scenes ---------- */
const scenes = SCENES.map((s,i)=>{
  const sec=document.createElement('section');
  sec.className='chapter'+(s.theme==='light'?' light':'')+(s.finale?' finale':'');
  if(s.finale){
    const keys=CHAPTERS.map(c=>c.title).join(' ✦ ');
    sec.innerHTML=`<div class="fin">
      <p class="script">and the story goes on…</p>
      <h2 class="title">${letters(NAME)}</h2>
      <p class="keys">${keys}</p>
      <p class="line">${words(FINALE_TEXT,2000)}</p>
      <div class="btns"><button class="btn" data-a="love">Send love ♥</button><button class="btn" data-a="replay">Replay ↺</button></div>
    </div>`;
    sec.querySelector('[data-a=love]').onclick=hearts;
    sec.querySelector('[data-a=replay]').onclick=()=>go(0);
  } else {
    sec.innerHTML=`<div class="txt"><div class="num">Chapter ${s.num}</div><h2 class="title">${letters(s.title)}</h2><div class="rule"></div><p class="line">${words(s.line,1500)}</p></div>`;
    sec.appendChild(makeGallery(s));
  }
  story.appendChild(sec);
  const bg=document.createElement('div'); bg.className='bg b'+i; bgs.appendChild(bg);
  const d=document.createElement('button'); d.dataset.label=s.title; d.setAttribute('aria-label',s.title); d.onclick=()=>go(i); dotsEl.appendChild(d);
  return {sec,bg,d};
});

/* ---------- navigation ---------- */
let cur=-1, busy=true;
function swap(i){
  scenes.forEach((o,k)=>{o.sec.classList.toggle('active',k===i); o.bg.classList.toggle('on',k===i); o.d.classList.toggle('on',k===i);});
  cur=i; setMode(SCENES[i].mode);
  $('#count').textContent=SCENES[i].num;
  $('#bar').style.width=((i+1)/SCENES.length*100)+'%';
}
function go(i){
  if(lbOpen||busy||cur<0||i===cur||i<0||i>=scenes.length) return;
  busy=true; const dir=i>cur?1:-1;
  curtain.animate([{transform:`translateX(${-100*dir}%)`},{transform:'translateX(0)'}],{duration:650,easing:EASE,fill:'forwards'}).finished
    .then(()=>{swap(i); return curtain.animate([{transform:'translateX(0)'},{transform:`translateX(${100*dir}%)`}],{duration:650,easing:EASE,fill:'forwards'}).finished;})
    .then(()=>{busy=false;});
}
$('#prev').onclick=()=>go(cur-1);
$('#next').onclick=()=>go(cur+1);
addEventListener('keydown',e=>{
  if(lbOpen){
    if(e.key==='Escape') closeLB();
    else if(e.key==='ArrowRight') stepLB(1);
    else if(e.key==='ArrowLeft') stepLB(-1);
    return;
  }
  if(cur<0) return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault(); go(cur+1);}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault(); go(cur-1);}
});
let lastWheel=0;
addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<20||Date.now()-lastWheel<1200) return;
  lastWheel=Date.now(); e.deltaY>0?go(cur+1):go(cur-1);
},{passive:true});
let tx=0,ty=0;
addEventListener('touchstart',e=>{tx=e.touches[0].clientX; ty=e.touches[0].clientY;},{passive:true});
addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
  if(Math.max(Math.abs(dx),Math.abs(dy))<60) return;
  const d=Math.abs(dx)>Math.abs(dy)?dx:dy;
  d<0?go(cur+1):go(cur-1);
},{passive:true});

/* ---------- intro ---------- */
$('#begin').onclick=()=>{
  const intro=$('#intro');
  intro.animate([{opacity:1},{opacity:0}],{duration:900,fill:'forwards'}).finished.then(()=>{intro.remove(); swap(0); busy=false;});
};

/* ---------- hearts ---------- */
function hearts(){
  for(let i=0;i<28;i++){
    const h=document.createElement('span'); h.className='heart'; h.textContent=['♥','✦','❀'][i%3];
    h.style.cssText=`left:${R(5,95)}vw;font-size:${R(16,42)}px;animation-duration:${R(3,6)}s;animation-delay:${R(0,1.2)}s`;
    document.body.appendChild(h); setTimeout(()=>h.remove(),8000);
  }
}

/* ---------- particles ---------- */
const cv=$('#fx'), cx=cv.getContext('2d'); let W,H,parts=[],mode='petals',t=0; const mouse={x:-999,y:-999};
function resize(){const d=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight; cv.width=W*d; cv.height=H*d; cx.setTransform(d,0,0,d,0,0);}
const PAL={petals:['#e88aa0','#f2c6cf','#c04b62','#f2e3c9'],chaos:['#d9ad55','#f2e3c9','#ff7a59','#e84a7a','#ffffff']};
function spawn(m,init){
  const p={m};
  if(m==='petals') Object.assign(p,{x:R(0,W),y:init?R(0,H):-20,r:R(6,14),vy:R(.6,1.6),sw:R(.5,1.5),ph:R(0,6.3),rot:R(0,6.3),vr:R(-.03,.03),c:PAL.petals[Math.random()*4|0],a:R(.5,.9)});
  else if(m==='network') Object.assign(p,{x:R(0,W),y:R(0,H),vx:R(-.35,.35),vy:R(-.35,.35),r:R(1.2,2.4)});
  else if(m==='halo') Object.assign(p,{x:R(0,W),y:init?R(0,H):H+10,r:R(1,4.5),vy:R(.2,.7),ph:R(0,6.3)});
  else if(m==='chaos') Object.assign(p,{x:R(0,W),y:R(0,H),vx:R(-3,3),vy:R(-3,3),s:R(6,13),rot:R(0,6.3),vr:R(-.12,.12),c:PAL.chaos[Math.random()*5|0],shape:Math.random()*3|0});
  else Object.assign(p,{x:R(0,W),y:init?R(0,H):H+10,r:R(1,3),vy:R(.8,2.6),ph:R(0,6.3)});
  return p;
}
function setMode(m){mode=m; const n=Math.min(m==='network'?90:70,Math.floor(W/14)); parts=Array.from({length:n},()=>spawn(m,true));}
addEventListener('resize',()=>{resize(); setMode(mode);});
addEventListener('pointermove',e=>{mouse.x=e.clientX; mouse.y=e.clientY; $('#glow').style.transform=`translate(${e.clientX-200}px,${e.clientY-200}px)`;});

function loop(){
  t+=.016; cx.clearRect(0,0,W,H); cx.globalCompositeOperation='source-over'; cx.shadowBlur=0;
  if(mode==='embers') cx.globalCompositeOperation='lighter';
  for(const p of parts){
    if(p.m==='petals'){
      p.y+=p.vy; p.x+=Math.sin(t*p.sw+p.ph)*.8; p.rot+=p.vr;
      if(p.y>H+20) Object.assign(p,spawn('petals'));
      cx.save(); cx.translate(p.x,p.y); cx.rotate(p.rot); cx.globalAlpha=p.a; cx.fillStyle=p.c;
      cx.beginPath(); cx.ellipse(0,0,p.r,p.r*.55,0,0,6.283); cx.fill(); cx.restore();
    } else if(p.m==='network'){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
      cx.globalAlpha=.9; cx.fillStyle='#d9ad55'; cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283); cx.fill();
    } else if(p.m==='halo'){
      p.y-=p.vy; p.x+=Math.sin(t+p.ph)*.3;
      if(p.y<-10) Object.assign(p,spawn('halo'));
      cx.globalAlpha=.35+.35*Math.sin(t*2+p.ph); cx.fillStyle='#d9a93f'; cx.shadowColor='#d9a93f'; cx.shadowBlur=14;
      cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283); cx.fill(); cx.shadowBlur=0;
    } else if(p.m==='chaos'){
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
      cx.save(); cx.translate(p.x,p.y); cx.rotate(p.rot); cx.globalAlpha=.85; cx.fillStyle=p.c; cx.beginPath();
      if(p.shape===0) cx.rect(-p.s/2,-p.s/4,p.s,p.s/2);
      else if(p.shape===1) cx.arc(0,0,p.s/2.5,0,6.283);
      else {cx.moveTo(0,-p.s/2); cx.lineTo(p.s/2,p.s/2); cx.lineTo(-p.s/2,p.s/2); cx.closePath();}
      cx.fill(); cx.restore();
    } else {
      p.y-=p.vy; p.x+=Math.sin(t*2+p.ph)*.6;
      if(p.y<-10) Object.assign(p,spawn('embers'));
      cx.globalAlpha=Math.max(0,p.y/H)*.9; cx.fillStyle='#ffb347';
      cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283); cx.fill();
    }
  }
  if(mode==='network'){
    cx.lineWidth=1;
    for(let i=0;i<parts.length;i++){
      const a=parts[i];
      for(let j=i+1;j<parts.length;j++){
        const b=parts[j], d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){cx.globalAlpha=(1-d/120)*.45; cx.strokeStyle='#d9ad55'; cx.beginPath(); cx.moveTo(a.x,a.y); cx.lineTo(b.x,b.y); cx.stroke();}
      }
      const dm=Math.hypot(a.x-mouse.x,a.y-mouse.y);
      if(dm<170){cx.globalAlpha=(1-dm/170)*.8; cx.strokeStyle='#f2e3c9'; cx.beginPath(); cx.moveTo(a.x,a.y); cx.lineTo(mouse.x,mouse.y); cx.stroke();}
    }
  }
  requestAnimationFrame(loop);
}
resize(); setMode('petals'); loop();