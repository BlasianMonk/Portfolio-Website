'use strict';
/* PIXEL QUEST: a complete vanilla-JavaScript tile adventure portfolio.
   Edit content in editor.html, not here. No frameworks, CDN sprites, or APIs. */
(() => {
const $ = s => document.querySelector(s);
const html = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raw = window.PORTFOLIO_DATA || {};
const P = {
  ...raw,
  locations: Array.isArray(raw.locations)?raw.locations:[],
  projects: Array.isArray(raw.projects)?raw.projects:[],
  experience: Array.isArray(raw.experience)?raw.experience:[],
  education: Array.isArray(raw.education)?raw.education:[],
  certifications: Array.isArray(raw.certifications)?raw.certifications:[],
  skills: Array.isArray(raw.skills)?raw.skills:[],
  characters: Array.isArray(raw.characters)?raw.characters:[]
};
const T=16,W=54,H=40, viewW=672,viewH=448;
const canvas=$('#world'), ctx=canvas.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=false;
const player={x:27,y:22,rx:27,ry:22,dir:'down',stepTime:0,stepStart:0,fromX:27,fromY:22,walking:false};
const buildings=[
  {id:'home',x:6,y:4,w:10,h:6,roof:'#c66a59',walls:'#f4da9c',icon:'⌂',doorX:11,doorY:11},
  {id:'studio',x:21,y:3,w:12,h:7,roof:'#836dbe',walls:'#eee0a7',icon:'★',doorX:27,doorY:11},
  {id:'lab',x:39,y:4,w:10,h:6,roof:'#568d9a',walls:'#f0d9a6',icon:'⚙',doorX:44,doorY:11},
  {id:'career',x:6,y:24,w:10,h:6,roof:'#ba8353',walls:'#e8cb9b',icon:'▤',doorX:11,doorY:31},
  {id:'academy',x:22,y:24,w:11,h:6,roof:'#5a84ac',walls:'#eee0b6',icon:'✦',doorX:27,doorY:31},
  {id:'contact',x:39,y:24,w:10,h:6,roof:'#a36c92',walls:'#ead3a5',icon:'✉',doorX:44,doorY:31}
];
const npcs=[{id:'guide',x:16,y:19,shirt:'#df9c64',hair:'#78503c'},{id:'builder',x:36,y:20,shirt:'#6b89b5',hair:'#483e49'},{id:'student',x:20,y:32,shirt:'#d694ba',hair:'#463751'}];
const secrets=[{x:17,y:14},{x:37,y:15},{x:21,y:35}];
const positions=new Map(buildings.map(b=>[b.id,b]));
const icons={home:'⌂',studio:'⚔',lab:'⚙',career:'▤',academy:'✦',contact:'✉'};
const state={started:false,pressed:new Set(),touchDir:null,autoPath:[],targetDoor:null,cameraX:0,cameraY:0,lastStep:0,now:0,frame:0,dialogOpen:false,discovered:new Set(),tokens:new Set(),modalLocation:null,toastTimer:null};
try {let save=JSON.parse(localStorage.getItem('pixelquest-world-v1')||'{}');state.discovered=new Set(Array.isArray(save.visited)?save.visited:[]);state.tokens=new Set(Array.isArray(save.tokens)?save.tokens:[]);}catch{}
const save=()=>{try {localStorage.setItem('pixelquest-world-v1',JSON.stringify({visited:[...state.discovered],tokens:[...state.tokens]}));}catch{}};
const locationById=id=>P.locations.find(l=>l.id===id)||({id,label:id,subtitle:'Explore',description:''});
const hex=(v,def)=>/^#[0-9a-f]{6}$/i.test(v)?v:def;
const theme=P.colors||{};['accent','secondary','panel'].forEach(k=>document.documentElement.style.setProperty('--'+(k==='accent'?'gold':k==='secondary'?'mint':'panel'),hex(theme[k],{accent:'#e9bf6a',secondary:'#84c9ab',panel:'#182935'}[k])));
$('#brand-title').textContent=P.siteName||"DANTE'S WORLD";
$('#side-name').textContent=(P.name||'EXPLORER').toUpperCase();
$('#side-role').textContent=P.tagline||P.role||'Developer';
$('#welcome-title').textContent=P.welcomeTitle||'A NEW ADVENTURE AWAITS!';
$('#welcome-message').textContent=P.welcomeText||'Explore the town.';
$('#footer-name').textContent=(P.name||'EXPLORER').toUpperCase();
$('#copyright-year').textContent=String(new Date().getFullYear());
function hash(x,y,seed=0){let n=(x*73856093)^(y*19349663)^(seed*83492791);n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))>>>0)%1000;}
function isRoad(x,y){return ((y>=10&&y<=12&&x>=4&&x<=50)||(y>=18&&y<=21&&x>=4&&x<=50)||(y>=30&&y<=32&&x>=4&&x<=50)||(x>=10&&x<=12&&y>=9&&y<=33)||(x>=26&&x<=28&&y>=9&&y<=33)||(x>=43&&x<=45&&y>=9&&y<=33));}
function isPond(x,y){return x>=32&&x<=36&&y>=14&&y<=17&&((x-34)**2/9+(y-15.5)**2/4)<2.3;}
function isTownBlock(x,y){return buildings.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);}
function hasTree(x,y){if(isRoad(x,y)||isTownBlock(x,y)||isPond(x,y))return false;
  if(x>5&&x<49&&y>4&&y<36) return hash(x,y,11)<30;
  return hash(x,y,9)<275;
}
function isBlocked(x,y){if(x<0||y<0||x>=W||y>=H||isTownBlock(x,y)||isPond(x,y)||hasTree(x,y))return true;
  if(x>=26&&x<=28&&y>=18&&y<=20)return true; // village fountain
  if(npcs.some(n=>n.x===x&&n.y===y))return true;
  return false;
}
const rgba=(color)=>color;
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function text(x,y,str,col,size=7){ctx.save();ctx.font=`bold ${size}px monospace`;ctx.fillStyle=col;ctx.textAlign='center';ctx.fillText(str,Math.round(x),Math.round(y));ctx.restore();}
function drawGround(x,y,sx,sy){const noise=hash(x,y);if(isRoad(x,y)){
  rect(sx,sy,16,16,noise%3===0?'#e6cca0':'#ead3aa');
  if(noise<340)rect(sx+1+(noise%12),sy+2+(noise%10),2,2,'#ceb88f');
  if(x%6===0&&y%3===1){rect(sx+1,sy+14,4,1,'#c8ad86');}
} else if(isPond(x,y)){
  rect(sx,sy,16,16,'#5d9fa8');rect(sx+2,sy+3,10,2,'#80c1b8');rect(sx+4,sy+9,6,1,'#c1e2b5');
} else{
  rect(sx,sy,16,16,noise<300?'#84ba86':noise<680?'#8cc28c':'#7bb17f');
  if(noise<450){rect(sx+4,sy+3,2,3,'#76a773');rect(sx+11,sy+10,2,3,'#a0cb89');}
  if(noise>860){rect(sx+6,sy+6,3,2,hash(x,y,3)%2?'#eee0a1':'#e9a4b0');rect(sx+7,sy+5,1,4,'#e9dec0');}
}}
function drawTree(sx,sy,x,y){const h=hash(x,y,3);
  rect(sx+5,sy+10,6,7,'#795a42');rect(sx+2,sy+4,12,10,'#346d56');rect(sx+4,sy+1,8,12,'#478862');
  rect(sx+1,sy+6,14,4,'#4d9668');rect(sx+4,sy+2,8,3,'#6aa772');
  if(h<400)rect(sx+10,sy+6,2,2,'#b4cb85');
}
function drawBuilding(b,cx,cy){const sx=b.x*T-cx,sy=b.y*T-cy,w=b.w*T,h=b.h*T;
  // drop shadow and stepped roof in deliberately sharp 8-bit geometry
  rect(sx+5,sy+8,w,h-2,'#476350');rect(sx+4,sy+9,w-8,h-13,b.walls);
  rect(sx+7,sy+h-20,w-14,4,'#b98d68');rect(sx+7,sy+h-17,w-14,10,'#debb85');
  rect(sx+4,sy+4,w-8,12,b.roof);rect(sx+9,sy,w-18,7,b.roof);
  rect(sx+2,sy+12,w-4,10,'#3f4f54');rect(sx,sy+20,w,9,b.roof);rect(sx+7,sy+30,w-14,6,'#f9e2b2');
  rect(sx+8,sy+10,6,6,'#ffffff2a');rect(sx+w-19,sy+10,7,4,'#ffffff29');
  for(let win=0;win<2;win++){let wx=sx+22+win*(w-66);rect(wx,sy+39,19,22,'#5c6358');rect(wx+3,sy+42,13,13,'#9bc6aa');rect(wx+8,sy+42,3,13,'#53786b');rect(wx+2,sy+58,15,3,'#f7ebc6');}
  const dx=b.doorX*T-cx;
  rect(dx-10,sy+h-34,20,28,'#665a56');rect(dx-7,sy+h-31,14,24,'#926d51');rect(dx+3,sy+h-18,2,2,'#e6ca89');
  const label=(locationById(b.id).label||b.id).toUpperCase();
  rect(sx+Math.max(7,w/2-48),sy+31,Math.min(96,w-14),14,'#f4e3ba');rect(sx+Math.max(7,w/2-48)+2,sy+33,Math.min(92,w-18),10,'#3f6659');
  ctx.save();ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillStyle='#fff3cf';ctx.fillText(label.length>18?label.slice(0,18):label,sx+w/2,sy+40);ctx.restore();
  // entrance tile glows softly: marker is the tile just outside the building
  let markerY=b.doorY*T-cy;
  rect(dx-7,markerY+3,14,11,'#3f7770');rect(dx-5,markerY+5,10,7,'#b5e7a4');
  rect(dx-2,markerY+7,4,3,'#fef4c4');
}
function drawFountain(cx,cy,t){let x=26*T-cx,y=18*T-cy;
  rect(x-5,y-5,54,52,'#416e69');rect(x,y,48,45,'#98c4ac');rect(x+4,y+4,40,37,'#5aa6b5');
  rect(x+13,y+9,22,20,'#daebc2');rect(x+18,y+7,12,26,'#eef0d0');
  rect(x+22,y+2,4,11,'#fdf3d3');if(Math.floor(t/400)%2===0){rect(x+11,y+17,4,3,'#d6e9d7');rect(x+33,y+21,5,2,'#d5edd0');}}
function drawNPC(n,cx,cy,t){const bob=Math.sin(t/520+n.x)*.6;drawPerson((n.x*T-cx)+0,(n.y*T-cy)+bob,{hair:n.hair,shirt:n.shirt,skin:'#e6bb8d',pants:'#324c61'},'down',true,Math.floor(t/260)%2);}
function drawPerson(px,py,colors,dir='down',npc=false,walkFrame=0){
  // original 16 x 22 sprite, pixel-art proportions
  const x=Math.round(px),y=Math.round(py-6);
  rect(x+3,y+22,11,3,'#415f5580');
  rect(x+4,y+15,4,6,colors.pants||'#364363');rect(x+10,y+15,4,6,colors.pants||'#364363');
  if(walkFrame){rect(x+4,y+18,4,4,colors.pants||'#364363');rect(x+10,y+17,4,3,'#303a52')}
  rect(x+3,y+10,12,8,colors.shirt||'#e85d60');rect(x+1,y+10,3,8,colors.skin||'#e8b990');rect(x+15,y+10,3,8,colors.skin||'#e8b990');
  rect(x+4,y+4,11,9,colors.skin||'#e8b990');rect(x+3,y+2,13,5,colors.hair||'#4e343e');
  if(dir==='up')rect(x+5,y+8,9,4,colors.hair||'#4e343e');
  else if(dir==='left'){rect(x+5,y+8,2,2,'#3b3a3d')}
  else if(dir==='right'){rect(x+12,y+8,2,2,'#3b3a3d')}
  else{rect(x+7,y+9,2,2,'#38393f');rect(x+12,y+9,2,2,'#38393f');}
  if(!npc){rect(x+13,y+12,3,5,'#edd188');rect(x+3,y+12,3,5,'#c97b69');}
}
function drawToken(cx,cy,index,t){const s=secrets[index],x=s.x*T-cx,y=s.y*T-cy;
  if(state.tokens.has(index))return;
  const rise=Math.round(Math.sin(t/270+index)*2);
  rect(x+7,y+1+rise,3,14,'#eab45b');rect(x+2,y+6+rise,14,3,'#eab45b');rect(x+5,y+4+rise,7,7,'#ffe6a3');rect(x+7,y+6+rise,3,3,'#fff9d9');
}
function drawScene(t){ctx.imageSmoothingEnabled=false;
  const visualX=player.walking?player.fromX+(player.x-player.fromX)*Math.min(1,(t-player.stepStart)/140):player.x;
  const visualY=player.walking?player.fromY+(player.y-player.fromY)*Math.min(1,(t-player.stepStart)/140):player.y;
  const camX=Math.max(0,Math.min(W*T-viewW,Math.round((visualX+.5)*T-viewW/2)));
  const camY=Math.max(0,Math.min(H*T-viewH,Math.round((visualY+.5)*T-viewH/2)));
  state.cameraX=camX;state.cameraY=camY;
  const firstX=Math.floor(camX/T),lastX=Math.min(W,Math.ceil((camX+viewW)/T));
  const firstY=Math.floor(camY/T),lastY=Math.min(H,Math.ceil((camY+viewH)/T));
  for(let y=firstY;y<lastY;y++)for(let x=firstX;x<lastX;x++)drawGround(x,y,x*T-camX,y*T-camY);
  for(let y=firstY;y<lastY;y++)for(let x=firstX;x<lastX;x++){
    if(hasTree(x,y))drawTree(x*T-camX,y*T-camY,x,y);
    if(!isRoad(x,y)&&!isPond(x,y)&&hash(x,y,42)>979){rect(x*T-camX+8,y*T-camY+7,2,5,'#5d8b5b');rect(x*T-camX+5,y*T-camY+8,8,2,'#f5d4aa');}
  }
  buildings.forEach(b=>drawBuilding(b,camX,camY));
  drawFountain(camX,camY,t);
  secrets.forEach((_,i)=>drawToken(camX,camY,i,t));
  npcs.forEach(n=>drawNPC(n,camX,camY,t));
  if(state.started){const colors=P.player||{};drawPerson(visualX*T-camX,visualY*T-camY,colors,player.dir,false,player.walking?Math.floor(t/100)%2:0);}
  $('#coord-readout').textContent=`X:${String(player.x).padStart(2,'0')} Y:${String(player.y).padStart(2,'0')}`;
}
function drawAvatar(){const c=$('#avatar-canvas');const a=c.getContext('2d');a.imageSmoothingEnabled=false;a.fillStyle='#afdbaf';a.fillRect(0,0,64,64);a.save();a.translate(6,1);a.scale(3,3);const backup=ctx; // dedicated paint that mirrors the player without changing the main canvas context
  const col=P.player||{};const r=(x,y,w,h,color)=>{a.fillStyle=color;a.fillRect(x,y,w,h)};
  r(3,19,12,2,'#729a81');r(4,15,4,6,col.pants||'#364363');r(10,15,4,6,col.pants||'#364363');r(3,10,12,8,col.shirt||'#e85d60');r(1,10,3,8,col.skin||'#e8b990');r(15,10,3,8,col.skin||'#e8b990');r(4,4,11,9,col.skin||'#e8b990');r(3,2,13,5,col.hair||'#4e343e');r(7,9,2,2,'#38393f');r(12,9,2,2,'#38393f');a.restore();}
// moving and collision
function near(a,b,r=1){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<=r;}
function accessibleDoor(){return buildings.find(b=>Math.abs(player.x-b.doorX)+Math.abs(player.y-b.doorY)<=1);}
function accessibleNPC(){return npcs.find(n=>near(player,n,1));}
function screenHint(){if(!state.started)return;const b=accessibleDoor(),n=accessibleNPC();$('#screen-prompt').innerHTML=b?`<span>▶</span> E: ENTER ${html(locationById(b.id).label).toUpperCase()}`:n?`<span>✦</span> E: TALK TO ${html(characterById(n.id).name).toUpperCase()}`:'<span>✦</span> WALK TO A BUILDING OR TALK TO A FRIEND';}
function characterById(id){return P.characters.find(n=>n.id===id)||({id,name:'Village Friend',line:'Welcome to the village!'});}
function startGame(){if(state.started)return;state.started=true;$('#start-overlay').classList.add('is-hidden');canvas.focus({preventScroll:true});screenHint();}
function showToast(message){const el=$('#toast');el.hidden=false;el.textContent=message;clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>{el.hidden=true},2600);}
function handleSecrets(){secrets.forEach((s,i)=>{if(!state.tokens.has(i)&&Math.abs(player.x-s.x)+Math.abs(player.y-s.y)<2){state.tokens.add(i);save();updateProgress();showToast('★ YOU FOUND A HIDDEN STAR!');}});}
function afterStep(){handleSecrets();screenHint();const building=buildings.find(b=>player.x===b.doorX&&player.y===b.doorY);
  if(building){state.autoPath=[];openLocation(building.id);}
}
function moveTo(x,y,dir){if(isBlocked(x,y)||state.dialogOpen)return false;
  player.fromX=player.x;player.fromY=player.y;player.x=x;player.y=y;player.walking=true;player.stepStart=performance.now();player.dir=dir;afterStep();return true;
}
function moveKey(dir){const offset={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!offset)return false;return moveTo(player.x+offset[0],player.y+offset[1],dir);}
function bfs(tx,ty){if(isBlocked(tx,ty))return [];
  const start=`${player.x},${player.y}`,end=`${tx},${ty}`;const queue=[[player.x,player.y]];const parent=new Map([[start,null]]);let k=0;const ds=[[0,1],[1,0],[-1,0],[0,-1]];
  while(k<queue.length){const [x,y]=queue[k++],key=`${x},${y}`;if(key===end)break;
    for(const [dx,dy] of ds){const nx=x+dx,ny=y+dy,nk=`${nx},${ny}`;
      if(parent.has(nk)||isBlocked(nx,ny))continue;parent.set(nk,key);queue.push([nx,ny]);}
  }
  if(!parent.has(end))return [];
  const path=[];let v=end;while(v!==start){let [x,y]=v.split(',').map(Number);path.push([x,y]);v=parent.get(v);if(v===null)break;}return path.reverse();
}
function travelTo(id,openAtEnd=true){startGame();const b=positions.get(id);if(!b)return;
  // Teleport to an entrance: fast travel is a deliberate accessibility shortcut.
  player.x=b.doorX;player.y=b.doorY+1;player.rx=player.x;player.ry=player.y;player.fromX=player.x;player.fromY=player.y;player.walking=false;player.dir='up';state.autoPath=[];screenHint();
  if(openAtEnd)openLocation(id);else showToast(`ARRIVED AT ${locationById(id).label.toUpperCase()}`);
}
function clickWorld(event){if(!state.started){startGame();return;}if(state.dialogOpen)return;
  const bounds=canvas.getBoundingClientRect();const wx=Math.floor(((event.clientX-bounds.left)/bounds.width*viewW+state.cameraX)/T);const wy=Math.floor(((event.clientY-bounds.top)/bounds.height*viewH+state.cameraY)/T);
  let tx=wx,ty=wy,bd=buildings.find(b=>wx>=b.x-1&&wx<=b.x+b.w&&wy>=b.y-1&&wy<=b.y+b.h+2);
  if(bd){tx=bd.doorX;ty=bd.doorY;}
  else if(isBlocked(tx,ty)){const dirs=[[1,0],[0,1],[-1,0],[0,-1]];const alternative=dirs.map(([dx,dy])=>[tx+dx,ty+dy]).find(([x,y])=>!isBlocked(x,y));if(alternative)[tx,ty]=alternative;}
  const path=bfs(tx,ty);if(path.length){state.autoPath=path;state.targetDoor=bd?.id||null;showToast(bd?`WALKING TO ${locationById(bd.id).label.toUpperCase()}`:'WALKING...');}
}
let previousFrame=0;
function tick(t){const dt=t-previousFrame;previousFrame=t;state.now=t;drawScene(t);
  if(state.started&&!state.dialogOpen){
    if(player.walking&&t-player.stepStart>=140)player.walking=false;
    if(t-state.lastStep>= (state.pressed.has('Shift')?100:160)&&!player.walking){
      let direction=state.touchDir||(['ArrowUp','w','W'].some(k=>state.pressed.has(k))?'up':null)||(['ArrowDown','s','S'].some(k=>state.pressed.has(k))?'down':null)||(['ArrowLeft','a','A'].some(k=>state.pressed.has(k))?'left':null)||(['ArrowRight','d','D'].some(k=>state.pressed.has(k))?'right':null);
      if(direction){state.autoPath=[];moveKey(direction);state.lastStep=t;}
      else if(state.autoPath.length){const [x,y]=state.autoPath.shift();let dir=x>player.x?'right':x<player.x?'left':y>player.y?'down':'up';if(!moveTo(x,y,dir))state.autoPath=[];state.lastStep=t;}
    }
  }
  requestAnimationFrame(tick);
}
// modal / website data
function linkSafe(url){const u=String(url||'').trim();return /^(https:\/\/[^\s<>"']+|mailto:[^\s<>"']+|assets\/[\w.\-\/ ]+\.pdf)$/i.test(u)&&!u.includes('..')?u:'';}
function imageSafe(url){const u=String(url||'').trim();return (/^assets\/[\w.\-\/ ()]+$/i.test(u)||/^https:\/\/[^\s<>"']+$/i.test(u)||/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(u))&&!u.includes('..')?u:'';}
function tags(items){return Array.isArray(items)?items.map(t=>`<span>${html(t)}</span>`).join(''):'';}
function renderProjects(){const groups=[['ACTIVE QUESTS',P.projects.filter(p=>p.status!=='Completed')],['COMPLETED QUESTS',P.projects.filter(p=>p.status==='Completed')]];
  return groups.map(([title,projects])=>`<h3 class="record-eyebrow">${title}</h3><div class="record-grid">${projects.length?projects.map(p=>{
    let image=imageSafe(p.image);let url=linkSafe(p.url);
    return `<article class="record-card">${image?`<img class="dialog-project-image" src="${html(image)}" alt="Screenshot for ${html(p.title)}" loading="lazy" />`:''}<small>${html(p.category||'PROJECT')} · ${html(p.status||'ACTIVE')}</small><h3>${html(p.title)}</h3><p>${html(p.summary)}</p><details><summary>Read the field report</summary><p>${html(p.description)}</p></details><div class="record-tags">${tags(p.tools)}</div>${url?`<a class="record-link" href="${html(url)}" target="_blank" rel="noopener noreferrer">OPEN PROJECT ↗</a>`:''}</article>`;}).join(''):'<p class="muted-note">No entries in this category yet. Add them in the editor.</p>'}</div>`).join('');
}
function contentFor(id){switch(id){
  case 'home':return `<div class="portrait-note"><div class="mini-portrait"><canvas id="modal-avatar" width="64" height="64"></canvas></div><div><p class="record-eyebrow">TRAINER PROFILE / 001</p><h3 style="margin:6px 0;font-size:19px;color:#34574e">${html(P.name)}</h3><p>${html(P.role)}</p></div></div><div class="divider"></div><div class="record-lead"><strong>A LITTLE ABOUT ME</strong><p>${html(P.about)}</p></div><h3 class="record-eyebrow">CURRENT SIDE QUEST</h3><p>${html(P.currentQuest)}</p><h3 class="record-eyebrow">FUN FACT</h3><p>${html(P.funFact)}</p>`;
  case 'studio':return `<div class="record-lead"><strong>WELCOME TO THE GAME STUDIO!</strong><p>Here are projects, experiments, and ideas I'm working on. Each entry can be edited, removed, or expanded in the visual editor.</p></div>${renderProjects()}`;
  case 'lab':return `<div class="record-lead"><strong>THE WORKSHOP IS OPEN</strong><p>${html(P.funFact)}</p></div>${P.skills.map(group=>`<h3 class="record-eyebrow">${html(group.name)}</h3><div class="record-tags">${tags(group.items)}</div>`).join('')}`;
  case 'career':return `<div class="record-lead"><strong>CHRONICLES OF THE ROAD</strong><p>A quick look through my professional experience in software, games, infrastructure, and technical systems.</p></div>${P.experience.map(e=>`<article class="record-row"><span class="meta">${html(e.dates)}</span><h3>${html(e.role)} · ${html(e.company)}</h3><p>${html(e.details)}</p></article>`).join('')}`;
  case 'academy':return `<div class="record-lead"><strong>ALWAYS LEARNING</strong><p>${html(P.currentQuest)}</p></div>${P.education.map(e=>`<article class="record-row"><span class="meta">${html(e.date)}</span><h3>${html(e.title)}</h3><p>${html(e.institution)} — ${html(e.details)}</p></article>`).join('')}<h3 class="record-eyebrow">CERTIFICATIONS & TRAINING</h3>${P.certifications.map(c=>`<span class="pill">${html(c)}</span>`).join('')}`;
  case 'contact':{const email=String(P.email||'').trim(),ln=linkSafe(P.linkedin),gh=linkSafe(P.github),resume=linkSafe(P.resume);
    return `<div class="record-lead"><strong>TRANSMISSION RECEIVED!</strong><p>Interested in collaborating, discussing an opportunity, or saying hello? Here's how to reach me.</p></div>${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?`<a class="big-link" href="mailto:${html(email)}">✉ EMAIL ME ↗</a>`:''}${ln?`<a class="big-link" href="${html(ln)}" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>`:''}${gh?`<a class="big-link" href="${html(gh)}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>`:''}${resume?`<a class="big-link" href="${html(resume)}" target="_blank" rel="noopener noreferrer">DOWNLOAD RÉSUMÉ ↗</a>`:''}<p class="muted-note">All contact links are editable in editor.html. Check your résumé for personal details before publishing it publicly.</p>`;}
  default:return `<p>There's more to discover around town!</p>`;
}}
function showRecord(title,markup,label='FIELD GUIDE'){startGame();state.dialogOpen=true;state.pressed.clear();state.touchDir=null;state.autoPath=[];
  $('#dialog-title').textContent=title;$('#dialog-label').textContent=label;$('#dialog-content').innerHTML=markup;
  const modal=$('#info-dialog');modal.showModal();
  if($('#modal-avatar')){const ac=$('#avatar-canvas');const d=$('#modal-avatar');d.getContext('2d').drawImage(ac,0,0,64,64);d.style.width='64px';d.style.imageRendering='pixelated';}
}
function openLocation(id){const location=locationById(id);state.discovered.add(id);save();updateProgress();showRecord(location.label,contentFor(id),`LOCATION / ${location.subtitle.toUpperCase()}`);}
function openNPC(n){let d=characterById(n.id);showRecord(d.name,`<div class="record-lead"><strong>${html(d.name.toUpperCase())} SAYS:</strong><p>“${html(d.line)}”</p></div><p class="muted-note">Explore a building to learn more about this developer.</p>`,'VILLAGE CONVERSATION');}
function interact(){if(!state.started){startGame();return;}if(state.dialogOpen)return;let b=accessibleDoor();if(b){openLocation(b.id);return;}let n=accessibleNPC();if(n){openNPC(n);return;}showToast('STEP CLOSER TO A DOOR OR VILLAGER');}
function closeInfo(){if($('#info-dialog').open)$('#info-dialog').close();}
function closeMap(){if($('#map-dialog').open)$('#map-dialog').close();}
$('#info-dialog').addEventListener('close',()=>{state.dialogOpen=false;state.modalLocation=null;canvas.focus({preventScroll:true});screenHint();});
$('#map-dialog').addEventListener('close',()=>{state.dialogOpen=false;canvas.focus({preventScroll:true});});
$('#close-dialog').onclick=closeInfo;$('#dialog-done').onclick=closeInfo;
$('#close-map').onclick=closeMap;
$('#info-dialog').onclick=e=>{if(e.target===$('#info-dialog'))closeInfo();};
$('#map-dialog').onclick=e=>{if(e.target===$('#map-dialog'))closeMap();};
function openMap(){startGame();state.dialogOpen=true;state.pressed.clear();state.autoPath=[];$('#map-dialog').showModal();}
function makeTravel(){const travel=$('#travel-list'),grid=$('#quick-grid'),map=$('#map-places'),sketch=$('#map-sketch');
 travel.innerHTML=P.locations.map(loc=>`<button type="button" class="travel-item" data-visit="${html(loc.id)}"><span class="travel-icon">${icons[loc.id]||'✦'}</span><span><strong>${html(loc.label)}</strong><small>${html(loc.subtitle)}</small></span><span class="travel-check" data-check="${html(loc.id)}">○</span></button>`).join('');
 grid.innerHTML=P.locations.map(loc=>`<button type="button" class="quick-card" data-open="${html(loc.id)}"><span class="quick-icon">${icons[loc.id]||'✦'}</span><strong>${html(loc.label)}</strong><small>${html(loc.description)}</small></button>`).join('');
 map.innerHTML=P.locations.map(loc=>`<button type="button" data-visit="${html(loc.id)}">${icons[loc.id]||'✦'} ${html(loc.label)}<span>${html(loc.subtitle)}</span></button>`).join('');
 sketch.innerHTML=buildings.map(b=>`<span class="map-pin" style="left:${b.doorX/W*100}%;top:${b.y/H*100}%">${icons[b.id]}</span>`).join('');
 document.querySelectorAll('[data-visit]').forEach(button=>button.addEventListener('click',()=>{if($('#map-dialog').open)closeMap();travelTo(button.dataset.visit,true);}));
 document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{openLocation(button.dataset.open);}));
 updateProgress();
}
function updateProgress(){let count=buildings.filter(b=>state.discovered.has(b.id)).length;$('#discovered-count').textContent=`${String(count).padStart(2,'0')} / 06`;
 $('#discovered-progress').style.width=(count/6*100)+'%';$('#token-count').textContent=`◇ ${state.tokens.size} / 3 HIDDEN STARS`;
 document.querySelectorAll('[data-check]').forEach(el=>el.textContent=state.discovered.has(el.dataset.check)?'✓':'○');
}
makeTravel();drawAvatar();
$('#begin-game').addEventListener('click',startGame);$('#interact-button').addEventListener('click',interact);$('#mobile-a').addEventListener('click',interact);
[$('#open-map'),$('#mobile-map'),$('#open-map-top')].forEach(el=>el.addEventListener('click',openMap));
$('#help-button').addEventListener('click',()=>showRecord('HOW TO PLAY',`<div class="record-lead"><strong>WELCOME, TRAVELER!</strong><p>Walk with WASD or arrow keys. Interact with E, Enter, or Space when close to an NPC or building. Hold Shift to run.</p></div><p>On phones, use the D-pad and A button. You can also tap the world to walk somewhere, or use the map for instant travel.</p><p>Find three hidden stars in the grass and visit all six buildings to complete the village journal.</p>`,'PLAYER MANUAL'));
$('#contact-direct').addEventListener('click',()=>openLocation('contact'));
$('#return-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
canvas.addEventListener('pointerdown',clickWorld);
function keydown(e){const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;
 if($('#info-dialog').open||$('#map-dialog').open)return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter','w','a','s','d','W','A','S','D','e','E','Shift'].includes(e.key)){e.preventDefault();}
 if(['e','E',' ','Enter'].includes(e.key)){if(!e.repeat)interact();return;}
 if(e.key==='m'||e.key==='M'){openMap();return;}
 state.pressed.add(e.key);if(!state.started&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key))startGame();
}
window.addEventListener('keydown',keydown);window.addEventListener('keyup',e=>state.pressed.delete(e.key));window.addEventListener('blur',()=>{state.pressed.clear();state.touchDir=null;});
for(const control of document.querySelectorAll('[data-dir]')){
  const start=e=>{e.preventDefault();startGame();state.touchDir=control.dataset.dir;control.setPointerCapture?.(e.pointerId);};
  const end=e=>{e.preventDefault();state.touchDir=null;};
  control.addEventListener('pointerdown',start);control.addEventListener('pointerup',end);control.addEventListener('pointercancel',end);control.addEventListener('lostpointercapture',()=>{state.touchDir=null;});
}
// The adventurer can still use direct navigation with no canvas click-to-move support.
requestAnimationFrame(tick);
})();
