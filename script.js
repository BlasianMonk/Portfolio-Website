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
    'email','linkedin','contactIntro'];
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
    tools: asTags(x.tools), link: safeText(x.link)
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
function renderProjects() {
  projectGrid.innerHTML = PORTFOLIO.projects.map((project, index) => `
    <article class="quest-card reveal is-visible" data-type="${escapeHtml(project.type)}">
      <div class="quest-art quest-art--${escapeHtml(project.art)}" aria-hidden="true">
        ${safeProjectImageMarkup(project)}
        <span class="quest-rank">${escapeHtml(project.rank)}</span>
        <span class="quest-status">${escapeHtml(project.status)}</span>
      </div>
      <div class="quest-body">
        <div class="quest-meta">✦ <span>ENTRY ${String(index + 1).padStart(2, '0')}</span> / ${escapeHtml(project.category)}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="quest-description">${escapeHtml(project.summary)}</p>
        <div class="quest-tools">${(project.tools || []).slice(0, 3).map(tool => `<span>${escapeHtml(tool)}</span>`).join('')}</div>
        <button type="button" class="quest-inspect" data-project="${escapeHtml(project.id)}" aria-label="Open journal entry for ${escapeHtml(project.title)}"><span>OPEN JOURNAL ENTRY</span><span aria-hidden="true">↗</span></button>
      </div>
    </article>`).join('');
  updateFilter('all');
}
function updateFilter(type) {
  let visible = 0;
  $$('.quest-card').forEach(card => {
    const show = type === 'all' || card.dataset.type === type;
    card.hidden = !show;
    if (show) visible++;
  });
  $$('.filter-button').forEach(button => {
    const active = button.dataset.filter === type;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#quest-count').textContent = `${String(visible).padStart(2, '0')} POSTED`;
  const total = $('.filter-button[data-filter="all"] span');
  if (total) total.textContent = String(PORTFOLIO.projects.length).padStart(2, '0');
}
function buildProjectAction(project) {
  if (!project.link || !/^https:\/\//i.test(project.link)) return '';
  return `<a href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">View related link ↗</a>`;
}
function openJournalEntry(payload) {
  if (!dialog) return;
  $('#dialog-kind').textContent = payload.kind || 'FIELD DOSSIER';
  $('#dialog-index').textContent = payload.index || 'NO. 001';
  $('#dialog-badge').textContent = payload.badge || 'ARCHIVE';
  $('#dialog-symbol').textContent = payload.symbol || '✦';
  $('#dialog-category').textContent = payload.category || '';
  $('#dialog-title').textContent = payload.title || '';
  $('#dialog-summary').textContent = payload.summary || '';
  $('#dialog-description').textContent = payload.details || '';
  $('#dialog-tags-heading').textContent = payload.tagsHeading || 'TOOLS & EQUIPMENT';
  const tags = $('#dialog-tags');
  tags.replaceChildren(...(payload.tags || []).map(tool => {
    const pill = document.createElement('span');
    pill.textContent = tool;
    return pill;
  }));
  const action = $('#dialog-action');
  action.innerHTML = payload.actionHtml || '';
  action.hidden = !payload.actionHtml;
  $('#dialog-illustration').innerHTML = payload.illustration || '';
  dialog.dataset.entryType = payload.entryType || 'quest';
  dialog.classList.remove('is-opening');
  void dialog.offsetWidth;
  dialog.classList.add('is-opening');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
}
function openProject(id) {
  const project = PORTFOLIO.projects.find(item => item.id === id);
  if (!project) return;
  openJournalEntry({
    kind: 'QUEST DOSSIER',
    index: `ENTRY ${String(PORTFOLIO.projects.indexOf(project) + 1).padStart(2, '0')}`,
    badge: project.status || 'QUEST',
    symbol: project.symbol,
    category: project.category,
    title: project.title,
    summary: project.summary,
    details: project.details,
    tagsHeading: 'TOOLS & EQUIPMENT',
    tags: project.tools || [],
    actionHtml: buildProjectAction(project),
    illustration: safeProjectImageMarkup(project),
    entryType: 'quest'
  });
}
function openSkill(index) {
  const skill = PORTFOLIO.skills[index];
  if (!skill) return;
  openJournalEntry({
    kind: 'LOADOUT ENTRY',
    index: `LOADOUT ${String(index + 1).padStart(2, '0')}`,
    badge: 'TOOLBOX',
    symbol: skill.symbol || '✦',
    category: 'ARMORY CATALOGUE',
    title: skill.title || 'Untitled Loadout',
    summary: skill.description || 'A collection of tools and techniques.',
    details: skill.description || 'A collection of tools and techniques.',
    tagsHeading: 'TOOLS ON THIS PAGE',
    tags: skill.items || [],
    actionHtml: '',
    illustration: `<div class="journal-sigil" aria-hidden="true"><span>${escapeHtml(skill.symbol || '✦')}</span></div>`,
    entryType: 'toolbox'
  });
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

  $$('.filter-button').forEach(button => button.addEventListener('click', () => updateFilter(button.dataset.filter)));
  projectGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-project]');
    if (button) openProject(button.dataset.project);
  });
  $('#armory-grid')?.addEventListener('click', event => {
    const button = event.target.closest('[data-skill-index]');
    if (button) openSkill(Number(button.dataset.skillIndex));
  });
  modalClose?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialog.classList.remove('is-opening');
  });
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
initialize();
