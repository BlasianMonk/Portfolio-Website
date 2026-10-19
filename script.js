'use strict';
/* NEON // ARCHIVE — no libraries or build step. All editable site data lives in content.js. */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = v => (typeof v === 'string' || typeof v === 'number') ? String(v) : '';
const tags = v => Array.isArray(v) ? v.map(text).filter(Boolean) : (typeof v === 'string' ? v.split(/[,\n]/).map(s => s.trim()).filter(Boolean) : []);
const source = window.SITE_CONTENT && typeof window.SITE_CONTENT === 'object' ? window.SITE_CONTENT : {};
const P = {
  ...source,
  highlights: Array.isArray(source.highlights) ? source.highlights.filter(x=>x && typeof x === 'object') : [],
  skills: Array.isArray(source.skills) ? source.skills.filter(x=>x && typeof x === 'object').map(x=>({...x, items:tags(x.items)})) : [],
  projects: Array.isArray(source.projects) ? source.projects.filter(x=>x && typeof x === 'object').map(x=>({...x, tools:tags(x.tools), questState:x.questState==='completed'?'completed':'available'})) : []
};
const PAGE_SIZE = 4;
const archives = {
  available:{filter:'all',page:0,entries:[],grid:$('#available-grid'),empty:$('#available-empty'),prev:$('#available-prev'),next:$('#available-next'),label:$('#available-page'),count:$('#available-count')},
  completed:{filter:'all',page:0,entries:[],grid:$('#completed-grid'),empty:$('#completed-empty'),prev:$('#completed-prev'),next:$('#completed-next'),label:$('#completed-page'),count:$('#completed-count')}
};
const ART = {web:'assets/mission-web.svg',server:'assets/mission-server.svg',hook:'assets/mission-game.svg',team:'assets/mission-workflow.svg'};
const allowedImage = path => {
  const value = text(path).trim();
  if (value.includes('..')) return '';
  if (/^assets\/[A-Za-z0-9/_(). -]+$/i.test(value) || /^https:\/\/[^\s<>"']+$/i.test(value) || /^data:image\/(?:png|jpeg|jpg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=\r\n]+$/i.test(value)) return value;
  return '';
};
function fallbackImage(project) {return ART[text(project.art)] || ART.web;}
function imageFor(project) {return allowedImage(project.image) || fallbackImage(project);}
function attachImageFallbacks(root=document) {
  $$('img[data-fallback]',root).forEach(image=>image.addEventListener('error',()=>{
    if (image.src.endsWith(image.dataset.fallback)) return;
    image.src=image.dataset.fallback;
  }, {once:true}));
}
function cardMarkup(project,index,finished){
  const fallback=fallbackImage(project);
  const cover=imageFor(project);
  return `<article class="mission-card${finished?' is-completed':''}">
    <div class="mission-card-art"><img src="${esc(cover)}" alt="" data-fallback="${esc(fallback)}" loading="lazy" /><span class="type-symbol">${finished?'[ ARCHIVED ]':'[ TRANSMISSION '+String(index+1).padStart(2,'0')+' ]'}</span></div>
    <div class="mission-card-body"><span class="mission-meta">${finished?'✓ MISSION COMPLETE':esc(text(project.category)||'PROJECT DOSSIER')}</span>
    <h4>${esc(text(project.title)||'Untitled project')}</h4><p>${esc(text(project.summary))}</p>
    <div class="mission-tags">${project.tools.slice(0,2).map(tool=>`<span>${esc(tool)}</span>`).join('')}</div>
    <button class="mission-open" type="button" data-dossier="${esc(text(project.id)||String(index))}" data-dossier-archive="${finished?'completed':'available'}">OPEN DOSSIER <span>↗</span></button></div>
  </article>`;
}
function matchesArchive(project,which){return project.questState === which;}
function getEntries(which){
  const state=archives[which];
  return P.projects.filter(p=>matchesArchive(p,which) && (state.filter==='all'||text(p.type)===state.filter));
}
function renderArchive(which) {
  const st=archives[which];
  st.entries=getEntries(which);
  const count=st.entries.length;
  const total=Math.max(1,Math.ceil(count/PAGE_SIZE));
  st.page=Math.min(Math.max(st.page,0),total-1);
  st.grid.innerHTML=st.entries.slice(st.page*PAGE_SIZE,(st.page+1)*PAGE_SIZE).map((p,i)=>cardMarkup(p,st.page*PAGE_SIZE+i,which==='completed')).join('');
  st.empty.hidden=count!==0;
  st.grid.hidden=count===0;
  st.grid.classList.toggle('has-pages', count>PAGE_SIZE);
  st.count.textContent=`${String(count).padStart(2,'0')} ENTRIES`;
  st.label.textContent=`PAGE ${String(st.page+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  st.prev.disabled=st.page===0;
  st.next.disabled=st.page===total-1;
  attachImageFallbacks(st.grid);
}
function turnArchive(which,delta){
  const st=archives[which];
  const next=st.page+delta;
  if(next<0||next>=Math.max(1,Math.ceil(st.entries.length/PAGE_SIZE)))return;
  st.page=next;
  // Never scrollIntoView or focus a newly rendered card: prevents unwanted page jumps.
  renderArchive(which);
}
let activeDossier={which:'available',index:0};
function findDossierId(id,which){return archives[which].entries.findIndex(p=>text(p.id)===id);}
function drawDossier() {
  const {which,index}=activeDossier, list=archives[which].entries, project=list[index];
  if(!project)return;
  $('#dossier-number').textContent=`RECORD ${String(index+1).padStart(3,'0')}`;
  $('#dossier-type').textContent=which==='completed'?'✓ COMPLETED PROJECT':text(project.category)||'MISSION DOSSIER';
  $('#dossier-title').textContent=text(project.title)||'Untitled project';
  $('#dossier-summary').textContent=text(project.summary);
  $('#dossier-details').textContent=text(project.details);
  $('#dossier-tags').innerHTML=project.tools.map(tag=>`<span>${esc(tag)}</span>`).join('');
  const link=allowedProjectLink(project.link);
  $('#dossier-link').innerHTML=link?`<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">VIEW PROJECT LINK ↗</a>`:'';
  const fallback=fallbackImage(project);
  $('#dossier-art').innerHTML=`<img src="${esc(imageFor(project))}" data-fallback="${esc(fallback)}" alt="${esc(text(project.title))} artwork" />`;
  attachImageFallbacks($('#dossier-art'));
  $('#dossier-position').textContent=`${String(index+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
  $('#dossier-prev').disabled=index===0;
  $('#dossier-next').disabled=index===list.length-1;
}
function allowedProjectLink(link){return /^https:\/\/\S+$/i.test(text(link))?text(link):'';}
function openDossier(id,which){
  const index=findDossierId(id,which);if(index<0)return;
  activeDossier={which,index};drawDossier();
  const dialog=$('#dossier');
  if(dialog?.showModal){dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
}
function turnDossier(delta){
  const next=activeDossier.index+delta;
  if(next<0||next>=archives[activeDossier.which].entries.length)return;
  activeDossier.index=next;drawDossier();$('#dossier').scrollTop=0;
}
function setText(id,value){const element=$('#'+id);if(element)element.textContent=text(value);}
function setUserArt(id,sourceField,fallback) {
  const image=$('#'+id);if(!image)return;
  image.src=allowedImage(P[sourceField])||fallback;
  image.addEventListener('error',()=>{if(!image.src.endsWith(fallback))image.src=fallback;});
}
function applyIdentity(){
  const binds={'hero-line-one':'heroLineOne','hero-line-two':'heroLineTwo','hero-intro':'heroIntro','profile-name':'name','profile-role':'role','about-line-one':'aboutLineOne','about-line-two':'aboutLineTwo','about-one':'aboutOne','about-two':'aboutTwo','profile-guild':'guild','profile-education':'education','profile-specialty':'specialty','profile-status':'status','contact-intro':'contactIntro'};
  Object.entries(binds).forEach(([id,key])=>{if(P[key]!==undefined)setText(id,P[key]);});
  const brand=$('#brand-name');
  const siteName=text(P.siteTitle)||'NEON // ARCHIVE';
  const parts=siteName.split('//');
  brand.replaceChildren();
  const base=document.createTextNode(parts[0].trim());brand.append(base);
  if(parts.length>1){
    const slash=document.createElement('span');slash.className='brand-slash';slash.textContent='//';
    const secondary=document.createElement('b');secondary.textContent=parts.slice(1).join('//').trim();
    brand.append(slash,secondary);
  }
  const sub=document.createElement('small');sub.textContent='THE DEVELOPER TERMINAL';brand.append(sub);
  setText('footer-title',siteName);
  document.title=`${text(P.name)||'Developer'} | ${text(P.siteTitle)||'NEON // ARCHIVE'}`;
  setText('year',new Date().getFullYear());
  $('#profile-highlights').innerHTML=P.highlights.map(entry=>`<div><span class="icon" aria-hidden="true">${esc(text(entry.symbol)||'◈')}</span><div><strong>${esc(text(entry.title))}</strong><small>${esc(text(entry.description))}</small></div></div>`).join('');
  setUserArt('profile-portrait','portraitImage','assets/operative.svg');
  setUserArt('guild-image','guildImage','assets/cyber-city.svg');
  setUserArt('map-image','mapImage','assets/network-map.svg');
  const c1=text(P.accentColor),c2=text(P.secondaryColor);
  if(/^#[0-9a-f]{6}$/i.test(c1))document.documentElement.style.setProperty('--pink',c1);
  if(/^#[0-9a-f]{6}$/i.test(c2))document.documentElement.style.setProperty('--cyan',c2);
  const mail=text(P.email);
  const mailLink=$('#email-link');
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){mailLink.href=`mailto:${mail}?subject=${encodeURIComponent('Portfolio inquiry')}`;setText('contact-help',mail);}
  else {mailLink.removeAttribute('href');mailLink.addEventListener('click',e=>{e.preventDefault();setText('contact-help','Add your email in editor.html to enable transmissions.');});setText('contact-help','EMAIL SIGNAL NOT CONFIGURED');}
  const linked=text(P.linkedin),linkedin=$('#linkedin-link');
  if(/^https:\/\//.test(linked))linkedin.href=linked;else linkedin.hidden=true;
}
function renderSkills(){
  const host=$('#skill-grid');
  setText('skill-count',String(P.skills.length).padStart(2,'0'));
  host.innerHTML=P.skills.map((s,i)=>`<article class="skill-card"><button class="skill-toggle" type="button" aria-expanded="false" aria-controls="skill-panel-${i}" data-skill="${i}"><span class="skill-symbol" aria-hidden="true">${esc(text(s.symbol)||'◈')}</span><span class="skill-index mono">MODULE_${String(i+1).padStart(2,'0')}</span><strong>${esc(text(s.title)||'Untitled stack')}</strong><span class="skill-desc">${esc(text(s.description))}</span><span class="skill-cta">INSPECT MODULE +</span></button><div class="skill-panel" id="skill-panel-${i}" hidden><div class="tags">${s.items.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></article>`).join('');
  host.addEventListener('click',event=>{
    const btn=event.target.closest('button[data-skill]');if(!btn)return;
    const panel=$('#skill-panel-'+btn.dataset.skill);const open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',String(!open));panel.hidden=open;$('.skill-cta',btn).textContent=open?'INSPECT MODULE +':'COLLAPSE MODULE −';
  });
}
function setup(){
  if(!window.SITE_CONTENT||!Array.isArray(window.SITE_CONTENT.projects)){
    const div=document.createElement('div');div.className='warning';div.setAttribute('role','alert');div.textContent='Cannot load content.js. Verify that content.js is beside index.html and contains a valid window.SITE_CONTENT object.';document.body.prepend(div);
  }
  applyIdentity();renderSkills();renderArchive('available');renderArchive('completed');
  for(const which of ['available','completed']){
    archives[which].prev.addEventListener('click',()=>turnArchive(which,-1));
    archives[which].next.addEventListener('click',()=>turnArchive(which,1));
    archives[which].grid.addEventListener('click',event=>{const btn=event.target.closest('[data-dossier]');if(btn)openDossier(btn.dataset.dossier,which);});
  }
  $('#available-filters').addEventListener('click',event=>{
    const btn=event.target.closest('[data-filter]');if(!btn)return;
    archives.available.filter=btn.dataset.filter;archives.available.page=0;
    $$('#available-filters button').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    renderArchive('available');
  });
  $('#dossier-prev').addEventListener('click',()=>turnDossier(-1));
  $('#dossier-next').addEventListener('click',()=>turnDossier(1));
  $('#dossier-close').addEventListener('click',()=>$('#dossier').close());
  $('#dossier').addEventListener('close',()=>document.body.classList.remove('modal-open'));
  $('#dossier').addEventListener('click',event=>{if(event.target===$('#dossier'))$('#dossier').close();});
  document.addEventListener('keydown',event=>{
    if(!$('#dossier').open)return;
    if(event.key==='ArrowLeft'){event.preventDefault();turnDossier(-1);}
    if(event.key==='ArrowRight'){event.preventDefault();turnDossier(1);}
  });
  // The header is sticky, so an anchor targeting the header itself will not
  // necessarily move the page. Scroll the document explicitly instead.
  $('#back-to-top')?.addEventListener('click', event => {
    event.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top: 0, left: 0, behavior: reducedMotion ? 'instant' : 'smooth'});
  });
  const menu=$('#mobile-menu'),toggle=$('#nav-menu-btn');
  toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));});
  $$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}});
}
setup();
