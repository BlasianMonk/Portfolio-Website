'use strict';

function safeText(value, fallback = '') {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}
function asTags(value) {
  if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  return [];
}
function normalizePortfolio(data) {
  const p = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const fields = ['siteTitle','name','role','heroLineOne','heroLineTwo','heroIntro','guild',
    'education','specialty','status','aboutLineOne','aboutLineTwo','aboutOne','aboutTwo',
    'email','linkedin','contactIntro','portraitImage','guildImage','mapImage'];
  const profile = {};
  for (const field of fields) profile[field] = safeText(p[field]);
  profile.siteTitle ||= "Hunter's Codex";
  profile.name ||= 'Portfolio';
  profile.highlights = Array.isArray(p.highlights) ? p.highlights.filter(x => x && typeof x === 'object').map(x => ({
    symbol: safeText(x.symbol), title: safeText(x.title), description: safeText(x.description)
  })) : [];
  profile.skills = Array.isArray(p.skills) ? p.skills.filter(x => x && typeof x === 'object').map(x => ({
    symbol: safeText(x.symbol), title: safeText(x.title), description: safeText(x.description), items: asTags(x.items)
  })) : [];
  profile.projects = Array.isArray(p.projects) ? p.projects.filter(x => x && typeof x === 'object').map((x, i) => ({
    id: safeText(x.id, `quest-${i}`), title: safeText(x.title, 'Untitled Quest'),
    type: safeText(x.type,'other'), category: safeText(x.category), rank: safeText(x.rank),
    status: safeText(x.status), art: safeText(x.art,'web'), symbol: safeText(x.symbol,'✦'),
    image: safeText(x.image), summary: safeText(x.summary), details: safeText(x.details),
    tools: asTags(x.tools), link: safeText(x.link),
    questState: (x.questState === 'completed' || x.completed === true) ? 'completed' : 'available' 
  })) : [];
  return profile;
}
const PORTFOLIO = normalizePortfolio(window.SITE_CONTENT);
const ART = {
  server: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="srvBg" x1="0" x2="1"><stop offset="0" stop-color="#4b3929"/><stop offset="1" stop-color="#6e5134"/></linearGradient></defs><rect width="550" height="190" fill="url(#srvBg)"/><path d="M0 149c52-30 115-42 186-30 65 10 112-21 169-21 66 0 123 18 195 42v41H0Z" fill="#241a12" opacity=".55"/><path d="M280 20 331 43v27h-22v87c0 12-10 22-22 22h-46c-12 0-22-10-22-22V70h-22V43Z" fill="#2e241b" stroke="#e0c18f" stroke-width="4"/><rect x="236" y="66" width="88" height="84" rx="8" fill="#4b6253" stroke="#d8bc8c" stroke-width="3"/><path d="M252 85h56M252 108h56M252 131h56" stroke="#ebdcb7" stroke-width="4" stroke-linecap="round" opacity=".7"/><g fill="#e8cb94"><circle cx="247" cy="85" r="4"/><circle cx="247" cy="108" r="4"/><circle cx="247" cy="131" r="4"/></g><path d="M161 154h228" stroke="#d2b27c" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10" opacity=".6"/><g stroke="#e6d3ab" stroke-opacity=".35" fill="none"><circle cx="117" cy="56" r="18"/><circle cx="429" cy="46" r="12"/><path d="M92 56h50M117 31v50M412 46h34M429 29v34"/></g></svg>`,
  hook: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="550" height="190" fill="#5b432e"/><path d="M0 160h550" stroke="#e4c896" stroke-width="2" opacity=".25"/><g stroke="#e9d5a7" fill="none" opacity=".45"><circle cx="274" cy="95" r="88"/><circle cx="274" cy="95" r="112" stroke-dasharray="4 9"/></g><path d="M108 153c97-25 147-73 211-116" stroke="#e0c28c" stroke-width="3" stroke-dasharray="7 8" fill="none"/><g transform="translate(290 95) rotate(24)"><path d="M-9-70V38c-34 5-49 18-49 37 0 24 19 34 42 26M9-70V38c34 5 49 18 49 37 0 24-19 34-42 26" stroke="#eddcb6" stroke-width="11" stroke-linecap="round"/><path d="M-9-70 0-87 9-70ZM-7 44 0 54 7 44" fill="#be8b58" stroke="none"/><path d="M-55 95-69 82l13-14M55 95 69 82 56 68" stroke="#eddcb6" stroke-width="8" stroke-linecap="round"/></g><path d="M413 35q18 4 26 18-17 5-31-3z" fill="#e7ca93" opacity=".7"/><path d="M145 42q-7 13-25 18 2-20 19-29z" fill="#e7ca93" opacity=".55"/></svg>`,
  web: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="550" height="190" fill="#70523a"/><path d="M47 28h456v134H47z" fill="#2d2118" stroke="#e3c993" stroke-width="4"/><path d="M68 47h414v95H68z" fill="#f1e2be" opacity=".12" stroke="#d8bc8a"/><path d="M95 64h120M95 83h173M95 102h129M95 121h165" stroke="#ead9b4" stroke-width="4" stroke-linecap="round" opacity=".65"/><path d="m292 116 34-41 30 23 48-47 51 56" fill="none" stroke="#efcf92" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="355" cy="65" r="10" fill="#efcf92" opacity=".7"/><path d="M47 157h456" stroke="#e4c896" stroke-width="3" opacity=".35"/><g stroke="#e2cfab" stroke-opacity=".35" fill="none"><path d="M20 34h40M490 35h41M265 20v31"/></g></svg>`,
  team: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="550" height="190" fill="#624530"/><path d="M0 150c76-45 146-59 214-43 43 10 82 7 116-12 41-22 105-20 220 16v79H0Z" fill="#2e221a" opacity=".48"/><g fill="#f1deba" opacity=".35"><circle cx="274" cy="52" r="16"/><circle cx="192" cy="91" r="12"/><circle cx="356" cy="91" r="12"/><circle cx="135" cy="133" r="12"/><circle cx="414" cy="133" r="12"/></g><g stroke="#e2ca99" stroke-width="4" stroke-linecap="round"><path d="M274 52 192 91 135 133M274 52 356 91 414 133M192 91h164"/></g><path d="M238 43h72v29h-72z" fill="#3e2d21" stroke="#e1c38e" stroke-width="3"/><path d="M179 82h26v19h-26zm166 0h26v19h-26zM122 123h26v19h-26zm279 0h26v19h-26z" fill="#3e2d21" stroke="#e1c38e" stroke-width="3"/></svg>`
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const projectGrid = $('#quest-grid');
const dialog = $('#quest-modal');
const modalClose = $('#modal-close');
const QUESTS_PER_PAGE = 4;
let archivePage = 0;
let archiveFilter = 'all';
let completedPage = 0;
let archiveAnimating = false;
let completedAnimating = false;
let journalCollection = 'available';
let activeJournal = {kind:'quest', index:0};
let journalTurning = false;


function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
function isProjectImageSource(image) {
  return /^(assets\/[\w./ ()-]+|https:\/\/[^\s<>"']+|data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\n\r]+)$/i.test(image) && !image.includes('..');
}
function safeProjectImageMarkup(project) {
  const image = String(project.image || '').trim();
  if (isProjectImageSource(image)) {
    return `<img class="quest-image" src="${escapeHtml(image)}" alt="" loading="lazy" />`;
  }
  return ART[project.art] || ART.web;
}
function projectCard(project) {
  const index = PORTFOLIO.projects.indexOf(project);
  const isCompleted = project.questState === 'completed';
  return `
    <article class="quest-card reveal is-visible ${isCompleted ? 'is-completed' : ''}" data-type="${escapeHtml(project.type)}" data-quest-id="${escapeHtml(project.id)}">
      <div class="quest-art quest-art--${escapeHtml(project.art)}" aria-hidden="true">
        ${safeProjectImageMarkup(project)}
        <span class="quest-rank">${escapeHtml(project.rank)}</span>
        <span class="quest-status">${escapeHtml(isCompleted ? 'QUEST COMPLETE' : project.status)}</span>
      </div>
      <div class="quest-body">
        <div class="quest-meta">${isCompleted ? '✥' : '✦'} <span>ENTRY ${String(index + 1).padStart(2, '0')}</span> / ${escapeHtml(project.category)}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="quest-description">${escapeHtml(project.summary)}</p>
        <div class="quest-tools">${(project.tools || []).slice(0, 3).map(tool => `<span>${escapeHtml(tool)}</span>`).join('')}</div>
        <button type="button" class="quest-inspect" data-project="${escapeHtml(project.id)}" data-collection="${isCompleted ? 'completed' : 'available'}" aria-label="Open journal entry for ${escapeHtml(project.title)}"><span>OPEN JOURNAL ENTRY</span><span aria-hidden="true">↗</span></button>
      </div>
    </article>`;
}
function boardProjects(collection) {
  return PORTFOLIO.projects.filter(p => (p.questState === 'completed' ? 'completed' : 'available') === collection);
}
function getFilteredProjects(collection = 'available') {
  const list = boardProjects(collection);
  return collection === 'completed' || archiveFilter === 'all' ? list : list.filter(p => p.type === archiveFilter);
}
function renderProjects() {
  projectGrid.innerHTML = boardProjects('available').map(projectCard).join('');
  $('#completed-grid').innerHTML = boardProjects('completed').map(projectCard).join('');
  archivePage = 0;
  completedPage = 0;
  updateFilter('all');
  updateCompletedBoard();
}
function boardUpdate(collection) {
  const completed = collection === 'completed';
  const list = getFilteredProjects(collection);
  const pages = Math.max(1, Math.ceil(list.length / QUESTS_PER_PAGE));
  let page = completed ? completedPage : archivePage;
  page = Math.min(Math.max(page,0), pages-1);
  if (completed) completedPage = page; else archivePage = page;
  const visible = new Set(list.slice(page * QUESTS_PER_PAGE, (page + 1) * QUESTS_PER_PAGE).map(p => p.id));
  const container = completed ? $('#completed-grid') : projectGrid;
  container.classList.toggle('has-multiple-folios', pages > 1);
  $$('.quest-card', container).forEach(card => { card.hidden = !visible.has(card.dataset.questId); });
  const key = completed ? 'completed' : 'quest';
  $(`#${key}-page-label`).textContent = list.length ? `FOLIO ${page + 1} / ${pages}` : 'NO FOLIOS';
  $(`#${key}-prev`).disabled = page === 0;
  $(`#${key}-next`).disabled = page >= pages - 1;
  $(`#${completed ? 'completed' : 'available'}-empty`).hidden = list.length > 0;
  container.hidden = list.length === 0;
  if (completed) {
    $('#completed-count').textContent = `${String(list.length).padStart(2,'0')} SEALED`;
    $('#completed-pagination').hidden = list.length <= QUESTS_PER_PAGE;
  } else {
    $('#quest-count').textContent = `${String(list.length).padStart(2,'0')} POSTED`;
    const total = $('.filter-button[data-filter="all"] span');
    if (total) total.textContent = String(boardProjects('available').length).padStart(2,'0');
    $$('.filter-button').forEach(button => {
      const active = button.dataset.filter === archiveFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('.quest-pagination').hidden = list.length <= QUESTS_PER_PAGE;
  }
}
function updateFilter(type = 'all') {
  if (type !== archiveFilter) { archiveFilter = type; archivePage = 0; }
  boardUpdate('available');
}
function updateCompletedBoard() { boardUpdate('completed'); }
function turnArchivePage(direction, collection = 'available') {
  const completed = collection === 'completed';
  if (completed ? completedAnimating : archiveAnimating) return;
  const page = completed ? completedPage : archivePage;
  const nextPage = page + direction;
  const maxPage = Math.max(0,Math.ceil(getFilteredProjects(collection).length / QUESTS_PER_PAGE)-1);
  if (nextPage < 0 || nextPage > maxPage) return;
  const container = completed ? $('#completed-grid') : projectGrid;
  const nav = completed ? $('#completed-pagination') : $('.quest-pagination');
  // Keep the folio under the user's mouse/finger as content changes.
  // In particular, avoid browser scroll anchoring when a last leaf has fewer cards.
  const preserveNavPosition = () => {
    const position = nav.getBoundingClientRect().top;
    if (completed) { completedPage = nextPage; updateCompletedBoard(); }
    else { archivePage = nextPage; updateFilter(archiveFilter); }
    const difference = nav.getBoundingClientRect().top - position;
    if (Math.abs(difference) > 1) window.scrollBy({top:difference,behavior:'instant'});
    // If the clicked arrow becomes disabled on the last/first leaf, move keyboard
    // focus to the opposite arrow without scrolling the document.
    if (nextPage === maxPage && direction > 0) {
      (completed ? $('#completed-prev') : $('#quest-prev')).focus({preventScroll:true});
    } else if (nextPage === 0 && direction < 0) {
      (completed ? $('#completed-next') : $('#quest-next')).focus({preventScroll:true});
    }
  };
  const animate = !document.body.classList.contains('effects-off') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animate) { preserveNavPosition(); return; }
  if (completed) completedAnimating = true; else archiveAnimating = true;
  container.classList.add(direction > 0 ? 'folio-turn-forward':'folio-turn-backward');
  window.setTimeout(preserveNavPosition, 220);
  window.setTimeout(() => {
    container.classList.remove('folio-turn-forward','folio-turn-backward');
    if (completed) completedAnimating = false; else archiveAnimating = false;
  }, 490);
}

function buildProjectAction(project) {
  if (!project.link || !/^https:\/\//i.test(project.link)) return '';
  return `<a href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">View related link ↗</a>`;
}
function setJournalPage(payload) {
  $('#dialog-kind').textContent = payload.kind || 'FIELD DOSSIER';
  $('#dialog-index').textContent = payload.index || 'NO. 001';
  $('#dialog-badge').textContent = payload.badge || 'ARCHIVE';
  $('#dialog-symbol').textContent = payload.symbol || '✦';
  $('#dialog-category').textContent = payload.category || '';
  $('#dialog-title').textContent = payload.title || '';
  $('#dialog-summary').textContent = payload.summary || '';
  $('#dialog-description').textContent = payload.details || '';
  $('#dialog-tags-heading').textContent = payload.tagsHeading || 'TOOLS & EQUIPMENT';
  $('#dialog-tags').replaceChildren(...(payload.tags || []).map(tool => {
    const pill = document.createElement('span');
    pill.textContent = tool;
    return pill;
  }));
  const action = $('#dialog-action');
  action.innerHTML = payload.actionHtml || '';
  action.hidden = !payload.actionHtml;
  $('#dialog-illustration').innerHTML = payload.illustration || '';
  dialog.dataset.entryType = payload.entryType || 'quest';
}
function journalList() {
  return activeJournal.kind === 'quest' ? getFilteredProjects(journalCollection) : PORTFOLIO.skills;
}
function renderActiveJournal() {
  const list = journalList();
  const entry = list[activeJournal.index];
  if (!entry) return;
  if (activeJournal.kind === 'quest') {
    const project = entry;
    setJournalPage({
      kind: 'QUEST DOSSIER', index: `ENTRY ${String(PORTFOLIO.projects.indexOf(project) + 1).padStart(2,'0')}`,
      badge: project.questState === 'completed' ? 'QUEST COMPLETE' : (project.status || 'QUEST'), symbol: project.symbol,
      category: project.category, title: project.title, summary: project.summary,
      details: project.details, tagsHeading: 'TOOLS & EQUIPMENT', tags: project.tools || [],
      actionHtml: buildProjectAction(project), illustration: safeProjectImageMarkup(project), entryType: 'quest'
    });
  } else {
    const skill = entry;
    setJournalPage({
      kind: 'LOADOUT ENTRY', index: `LOADOUT ${String(activeJournal.index + 1).padStart(2,'0')}`,
      badge: 'TOOLBOX', symbol: skill.symbol || '✦', category: 'ARMORY CATALOGUE',
      title: skill.title || 'Untitled Loadout', summary: skill.description || 'A collection of tools and techniques.',
      details: skill.description || 'A collection of tools and techniques.',
      tagsHeading: 'TOOLS ON THIS PAGE', tags: skill.items || [], actionHtml: '',
      illustration: `<div class="journal-sigil" aria-hidden="true"><span>${escapeHtml(skill.symbol || '✦')}</span></div>`,
      entryType: 'toolbox'
    });
  }
  $('#journal-page-count').textContent = `${activeJournal.kind === 'quest' ? 'QUEST' : 'LOADOUT'} ${activeJournal.index + 1} / ${list.length}`;
  $('#journal-prev').disabled = activeJournal.index === 0;
  $('#journal-next').disabled = activeJournal.index >= list.length - 1;
  dialog.scrollTop = 0;
  $('#dialog-description').scrollTop = 0;
}
function openJournal(kind, index) {
  activeJournal = {kind, index};
  renderActiveJournal();
  dialog.classList.remove('is-opening');
  void dialog.offsetWidth;
  dialog.classList.add('is-opening');
  if (!dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
  document.body.classList.add('modal-open');
}
function turnJournalPage(direction) {
  if (journalTurning || !dialog.open) return;
  const next = activeJournal.index + direction;
  if (next < 0 || next >= journalList().length) return;
  const animate = !document.body.classList.contains('effects-off') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animate) { activeJournal.index = next; renderActiveJournal(); return; }
  journalTurning = true;
  dialog.classList.remove('is-opening');
  dialog.classList.add(direction > 0 ? 'page-turn-next' : 'page-turn-prev');
  window.setTimeout(() => { if (dialog.open) { activeJournal.index = next; renderActiveJournal(); } }, 330);
  window.setTimeout(() => {
    dialog.classList.remove('page-turn-next','page-turn-prev');
    journalTurning = false;
  }, 650);
}
function openProject(id, collection = 'available') {
  journalCollection = collection;
  const index = getFilteredProjects(collection).findIndex(item => item.id === id);
  if (index >= 0) openJournal('quest',index);
}
function openSkill(index) {
  if (PORTFOLIO.skills[index]) openJournal('skill',index);
}

function configureIdentity() {
  const binding = {
    '#profile-name': 'name', '#profile-role': 'role',
    '#hero-line-one': 'heroLineOne', '#hero-line-two': 'heroLineTwo',
    '#hero-intro': 'heroIntro', '#profile-guild': 'guild',
    '#profile-education': 'education', '#profile-specialty': 'specialty',
    '#profile-status': 'status', '#about-line-one': 'aboutLineOne',
    '#about-line-two': 'aboutLineTwo', '#about-one': 'aboutOne',
    '#about-two': 'aboutTwo', '#contact-intro': 'contactIntro'
  };
  Object.entries(binding).forEach(([selector, field]) => {
    if ($(selector)) $(selector).textContent = String(PORTFOLIO[field] || '');
  });
  document.title = `${PORTFOLIO.name} | ${PORTFOLIO.siteTitle}`;
  const brandName = String(PORTFOLIO.siteTitle || 'Hunter’s Codex').trim();
  const words = brandName.split(/\s+/);
  const finalWord = words.pop();
  const brand = $('#brand-name');
  brand.replaceChildren();
  brand.append(document.createTextNode(words.join(' ') + (words.length ? ' ' : '')));
  const accent = document.createElement('span'); accent.textContent = finalWord;
  const subhead = document.createElement('small'); subhead.textContent = 'THE ARCHIVIST’S JOURNAL';
  brand.append(accent, subhead);
  $('#footer-site-name').textContent = brandName;
  brand.closest('a').setAttribute('aria-label', `${brandName}, return to top`);

  const highlights = $('#hunter-highlights');
  highlights.replaceChildren(...(PORTFOLIO.highlights || []).map(entry => {
    const wrap = document.createElement('div');
    const symbol = document.createElement('span'); symbol.className = 'highlight-symbol'; symbol.textContent = entry.symbol || '✦';
    const words = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = entry.title || '';
    const small = document.createElement('small'); small.textContent = entry.description || '';
    words.append(strong, small); wrap.append(symbol, words); return wrap;
  }));

  $('#armory-grid').innerHTML = (PORTFOLIO.skills || []).map((skill, index) => `
    <article class="armory-card reveal is-visible">
      <div class="armory-icon" aria-hidden="true">${escapeHtml(skill.symbol || '✦')}</div>
      <span class="armory-index">LOADOUT // ${String(index + 1).padStart(2, '0')}</span>
      <h3>${escapeHtml(skill.title || '')}</h3>
      <p>${escapeHtml(skill.description || '')}</p>
      <div class="skill-tags">${(skill.items || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      <button type="button" class="armory-inspect" data-skill-index="${index}"><span>TURN TO THIS PAGE</span><span aria-hidden="true">↗</span></button>
    </article>
  `).join('');

  const placements = [
    ['portraitImage','#profile-portrait','#character-art-slot'],
    ['guildImage','#guild-custom-art','#guild-art-slot'],
    ['mapImage','#map-custom-art','#map-art-slot']
  ];
  placements.forEach(([field,imgSelector,slotSelector]) => {
    const img = $(imgSelector), slot = $(slotSelector), value = String(PORTFOLIO[field] || '').trim();
    if (!img || !slot || !isProjectImageSource(value)) return;
    img.src = value;
    img.hidden = false;
    slot.classList.add('has-custom-art');
  });

  $('#copyright-year').textContent = String(new Date().getFullYear());
  const linkedin = $('#linkedin-link');
  if (/^https:\/\//i.test(PORTFOLIO.linkedin)) linkedin.href = PORTFOLIO.linkedin; else linkedin.hidden = true;
  const emailLink = $('#email-link');
  const contactHelp = $('#contact-help');
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PORTFOLIO.email)) {
    emailLink.href = `mailto:${PORTFOLIO.email}?subject=${encodeURIComponent('A new quest / portfolio inquiry')}`;
    contactHelp.textContent = PORTFOLIO.email;
  } else {
    contactHelp.textContent = 'Add your email using editor.html to enable this button.';
    emailLink.addEventListener('click', event => {
      event.preventDefault();
      contactHelp.textContent = 'Open editor.html, add your email, download content.js and replace the old file.';
      contactHelp.setAttribute('role', 'status');
    });
  }
}
function fitHeroHeadline() {
  const heading = $('#hero-title');
  if (!heading) return;
  const lines = [$('#hero-line-one'), $('#hero-line-two')].filter(Boolean);
  const availableWidth = heading.clientWidth - 8;
  if (availableWidth <= 0) return;
  lines.forEach(line => { line.style.fontSize = ''; line.style.whiteSpace = 'nowrap'; });
  const baseSize = parseFloat(getComputedStyle(heading).fontSize);
  if (!Number.isFinite(baseSize)) return;
  const fits = () => lines.every(line => line.scrollWidth <= availableWidth);
  if (fits()) return;
  const minimum = Math.min(baseSize, window.innerWidth <= 680 ? 33 : 36);
  const setSize = size => lines.forEach(line => { line.style.fontSize = `${size}px`; });
  setSize(minimum);
  if (!fits()) {
    lines.forEach(line => { line.style.whiteSpace = 'normal'; });
    return;
  }
  let low = minimum; let high = baseSize;
  for (let i = 0; i < 11; i++) {
    const middle = (low + high) / 2;
    setSize(middle);
    if (fits()) low = middle; else high = middle;
  }
  setSize(Math.max(minimum, Math.floor(low - 1)));
}
function setupHeroHeadlineSizing() {
  let pendingFrame = 0;
  const refresh = () => {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; fitHeroHeadline(); });
  };
  fitHeroHeadline();
  window.addEventListener('resize', refresh, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh).catch(() => {});
}
function makeFireflies() {
  const container = $('#fireflies');
  const places = [[7,62],[13,77],[18,46],[25,70],[35,79],[42,59],[52,84],[62,73],[71,55],[79,79],[88,61],[94,74],[23,29],[81,33],[61,18]];
  container.innerHTML = places.map(([x, y], i) => `<span class="firefly" style="left:${x}%;top:${y}%;--delay:-${(i * 1.6).toFixed(1)}s;--speed:${6 + (i % 5) * 1.6}s"></span>`).join('');
}
function setupEffects() {
  const button = $('#effects-toggle');
  const preferenceKey = 'hunters-codex-reduced-effects';
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { if (localStorage.getItem(preferenceKey) !== null) reduced = localStorage.getItem(preferenceKey) === 'true'; } catch (_) {}
  const apply = () => {
    document.body.classList.toggle('effects-off', reduced);
    button.setAttribute('aria-pressed', String(reduced));
    $('#effects-label').textContent = `Ambience: ${reduced ? 'Off' : 'On'}`;
    button.title = reduced ? 'Enable ambient effects' : 'Disable ambient effects';
  };
  button.addEventListener('click', () => {
    reduced = !reduced;
    apply();
    try { localStorage.setItem(preferenceKey, String(reduced)); } catch (_) {}
  });
  apply();
}
function setupNavigation() {
  const header = $('.site-header');
  const progress = $('#scroll-progress');
  let framePending = false;
  const refreshScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 26);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
    framePending = false;
  };
  window.addEventListener('scroll', () => {
    if (!framePending) { framePending = true; requestAnimationFrame(refreshScroll); }
  }, { passive: true });
  refreshScroll();

  const toggle = $('#mobile-nav-toggle');
  const nav = $('#mobile-nav');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(nav.hidden));
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 850) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  const choices = $$('.hero-menu .menu-choice');
  choices.forEach((choice, index) => choice.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      choices[(index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length].focus();
    }
  }));
}
function setupReveals() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(element => element.classList.add('is-visible'));
    return;
  }
  document.body.classList.add('js-reveal-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px 30px 0px' });
  $$('.reveal').forEach(element => observer.observe(element));
}
function setupBookIntro() {
  const overlay = $('#book-intro');
  const open = $('#open-journal');
  const skip = $('#skip-intro');
  if (!overlay || !open || !skip) return;
  const key = 'hunters-codex-intro-visited-v1';
  try { if (sessionStorage.getItem(key) === 'yes') return; } catch (_) {}
  const close = animate => {
    if (overlay.hidden || overlay.classList.contains('is-opening')) return;
    try { sessionStorage.setItem(key,'yes'); } catch (_) {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('effects-off');
    if (animate && !reduced) {
      overlay.classList.add('is-opening');
      window.setTimeout(() => { overlay.hidden = true; overlay.classList.remove('is-opening'); document.body.classList.remove('intro-locked'); }, 1050);
    } else { overlay.hidden = true; document.body.classList.remove('intro-locked'); }
  };
  open.addEventListener('click', () => close(true));
  skip.addEventListener('click', () => close(false));
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(false); }
    if (event.key === 'Tab') {
      const controls = [open,skip];
      const i = controls.indexOf(document.activeElement);
      if (event.shiftKey && i === 0) {event.preventDefault(); skip.focus();}
      if (!event.shiftKey && i === 1) {event.preventDefault(); open.focus();}
    }
  });
  overlay.hidden = false;
  document.body.classList.add('intro-locked');
  open.focus({preventScroll:true});
}
function initialize() {
  if (!window.SITE_CONTENT || !Array.isArray(window.SITE_CONTENT.projects)) {
    const warning = document.createElement('div');
    warning.className = 'content-warning';
    warning.setAttribute('role', 'alert');
    warning.textContent = 'Portfolio content could not be loaded. Make sure content.js is beside index.html and contains a valid window.SITE_CONTENT object.';
    document.body.prepend(warning);
  }
  configureIdentity();
  setupHeroHeadlineSizing();
  renderProjects();
  makeFireflies();
  setupEffects();
  setupNavigation();
  setupReveals();
  setupBookIntro();

  $$('.filter-button').forEach(button => button.addEventListener('click', () => updateFilter(button.dataset.filter)));
  $('#quest-prev').addEventListener('click', () => turnArchivePage(-1));
  $('#quest-next').addEventListener('click', () => turnArchivePage(1));
  $('#completed-prev').addEventListener('click', () => turnArchivePage(-1, 'completed'));
  $('#completed-next').addEventListener('click', () => turnArchivePage(1, 'completed'));
  $('#journal-prev').addEventListener('click', () => turnJournalPage(-1));
  $('#journal-next').addEventListener('click', () => turnJournalPage(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {event.preventDefault(); turnJournalPage(-1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); turnJournalPage(1);}
  });
  for (const grid of [projectGrid, $('#completed-grid')]) {
    grid.addEventListener('click', event => {
      const button = event.target.closest('[data-project]');
      if (button) openProject(button.dataset.project, button.dataset.collection);
    });
  }
  $('#armory-grid')?.addEventListener('click', event => {
    const button = event.target.closest('[data-skill-index]');
    if (button) openSkill(Number(button.dataset.skillIndex));
  });
  modalClose?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialog.classList.remove('is-opening','page-turn-next','page-turn-prev');
    journalTurning = false;
  });
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
initialize();
