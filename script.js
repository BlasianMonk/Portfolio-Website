'use strict';

// Project/profile content is kept in content.js — not here.
// You can edit it using editor.html (no coding necessary).
// Keep the rest of the site working even when an old editor exported a string
// for project tools, or the content file is missing / malformed.
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
  server: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="serverGrid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#bdd4b2" stroke-opacity=".09"/></pattern></defs><rect width="550" height="190" fill="url(#serverGrid)"/><circle cx="280" cy="90" r="144" fill="none" stroke="#c4bc8c" opacity=".11"/><circle cx="280" cy="90" r="111" fill="none" stroke="#c4bc8c" opacity=".16" stroke-dasharray="3 7"/><path d="M0 148 90 109 155 130 234 99 348 126 440 100 550 139V190H0Z" fill="#17312c" opacity=".6"/><rect x="210" y="22" width="137" height="150" rx="4" fill="#152a29" stroke="#c1aa7b" stroke-width="2"/><rect x="221" y="35" width="115" height="28" rx="2" fill="#3f5650" stroke="#859481"/><rect x="221" y="72" width="115" height="28" rx="2" fill="#3f5650" stroke="#859481"/><rect x="221" y="109" width="115" height="28" rx="2" fill="#3f5650" stroke="#859481"/><g fill="#d0b878"><circle cx="233" cy="49" r="4"/><circle cx="233" cy="86" r="4"/><circle cx="233" cy="123" r="4"/></g><path d="M248 49h74m-74 37h74m-74 37h74" stroke="#bbc7a2" opacity=".6" stroke-width="3" stroke-dasharray="12 7"/><path d="M280 137v35m-21 0h42" stroke="#b7a077" stroke-width="2"/><g stroke="#dac897" fill="none" opacity=".47"><path d="M210 55h-52v-29h-30M347 83h52v40h35M210 124h-48v29h-32"/><circle cx="127" cy="26" r="5"/><circle cx="435" cy="123" r="5"/><circle cx="129" cy="153" r="5"/></g></svg>`,
  hook: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="hookGrid" width="31" height="31" patternUnits="userSpaceOnUse"><path d="M31 0H0V31" fill="none" stroke="#cedac4" stroke-opacity=".09"/></pattern></defs><rect width="550" height="190" fill="url(#hookGrid)"/><g stroke="#b9b49a" fill="none" opacity=".23"><circle cx="278" cy="95" r="89" stroke-dasharray="4 9"/><circle cx="278" cy="95" r="73"/><path d="M278 3v184M180 95h196"/></g><path d="M75 177q108-14 135-71t82-64" stroke="#d9c38e" stroke-width="3" stroke-dasharray="6 7" fill="none"/><g transform="translate(285 95) rotate(25)"><path d="M-9-61-9 34q-43 7-40 36 4 29 43 18M10-61V34q43 7 40 36-4 29-43 18" fill="none" stroke="#d7c7a6" stroke-width="10" stroke-linecap="round"/><path d="M-10-61 0-79 10-61ZM-6 39 0 48 6 39" fill="#b8935f"/><path d="M-48 87-62 76l13-13M49 87 62 76 49 63" fill="none" stroke="#d7c7a6" stroke-width="8" stroke-linecap="round"/></g><g stroke="#d1ad70" opacity=".5"><path d="M110 23h39M130 11v26M416 146h39M435 126v39"/></g></svg>`,
  web: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#d3c09a" fill="none" opacity=".18"><circle cx="274" cy="95" r="98"/><circle cx="274" cy="95" r="116" stroke-dasharray="4 9"/><path d="M0 30h550M0 159h550"/></g><rect x="145" y="28" width="263" height="137" rx="3" fill="#1c312e" stroke="#e2c591" stroke-width="2"/><rect x="157" y="40" width="239" height="17" fill="#6b755e"/><g fill="#e0c58e"><circle cx="168" cy="48" r="3"/><circle cx="181" cy="48" r="3"/><circle cx="194" cy="48" r="3"/></g><path d="M181 134 238 80l29 31 35-44 76 67Z" fill="#81917c" opacity=".4"/><path d="m181 134 57-54 29 31 35-44 76 67" fill="none" stroke="#ddbe81" stroke-width="2"/><path d="M196 146h148M350 146h29" stroke="#ebcea1" stroke-opacity=".5" stroke-width="3"/><path d="M122 98h-42m364-40h37m-54 93h62" stroke="#b9a67b" opacity=".6"/></svg>`,
  team: `<svg viewBox="0 0 550 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="teamGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#cbd2c0" stroke-opacity=".07"/></pattern></defs><rect width="550" height="190" fill="url(#teamGrid)"/><circle cx="274" cy="98" r="114" fill="none" stroke="#cdbd94" opacity=".1"/><g stroke="#b8bb9d" stroke-width="3" fill="none" opacity=".8"><path d="M274 93 170 49M274 93 383 52M274 93 165 150M274 93 389 144"/></g><g><rect x="231" y="62" width="86" height="67" rx="4" fill="#354b41" stroke="#d5bc8a" stroke-width="2"/><path d="m247 100 13 11 29-32" fill="none" stroke="#e7cea0" stroke-width="5"/><rect x="118" y="23" width="85" height="44" rx="2" fill="#24362e" stroke="#bdac82"/><rect x="348" y="26" width="85" height="44" rx="2" fill="#24362e" stroke="#bdac82"/><rect x="111" y="130" width="90" height="40" rx="2" fill="#24362e" stroke="#bdac82"/><rect x="353" y="127" width="90" height="40" rx="2" fill="#24362e" stroke="#bdac82"/></g><g stroke="#d8c693" stroke-width="3" opacity=".6"><path d="M133 38h48M133 50h33M361 43h51M361 54h32M124 145h62M124 155h45M365 143h64M365 155h43"/></g></svg>`
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const projectGrid = $('#quest-grid');
const dialog = $('#quest-modal');
const modalClose = $('#modal-close');

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function safeProjectImage(project) {
  // Explicit images are optional. Local images should be in assets/.
  const image = String(project.image || '').trim();
  if (/^(assets\/[\w./ ()-]+|https:\/\/[^\s<>\"\']+)$/i.test(image) && !image.includes('..')) {
    return `<img class="quest-image" src="${escapeHtml(image)}" alt="" loading="lazy" />`;
  }
  return ART[project.art] || ART.web;
}

function renderProjects() {
  projectGrid.innerHTML = PORTFOLIO.projects.map((project, index) => `
    <article class="quest-card" data-type="${escapeHtml(project.type)}">
      <div class="quest-art quest-art--${escapeHtml(project.art)}" aria-hidden="true">
        ${safeProjectImage(project)}
        <span class="quest-rank">${escapeHtml(project.rank)}</span>
        <span class="quest-status">${escapeHtml(project.status)}</span>
      </div>
      <div class="quest-body">
        <div class="quest-meta">✦ <span>QUEST ${String(index + 1).padStart(2, '0')}</span> / ${escapeHtml(project.category)}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="quest-description">${escapeHtml(project.summary)}</p>
        <div class="quest-tools">${(project.tools || []).slice(0, 3).map(tool => `<span>${escapeHtml(tool)}</span>`).join('')}</div>
        <button type="button" class="quest-inspect" data-project="${escapeHtml(project.id)}" aria-label="Inspect ${escapeHtml(project.title)}"><span>INSPECT QUEST</span><span aria-hidden="true">↗</span></button>
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

function openProject(id) {
  const project = PORTFOLIO.projects.find(item => item.id === id);
  if (!project) return;
  $('#dialog-index').textContent = `NO. ${String(PORTFOLIO.projects.indexOf(project) + 1).padStart(3, '0')}`;
  $('#dialog-symbol').textContent = project.symbol;
  $('#dialog-category').textContent = project.category;
  $('#dialog-title').textContent = project.title;
  $('#dialog-description').textContent = project.details;
  $('#dialog-tags').replaceChildren(...(project.tools || []).map(tool => {
    const badge = document.createElement('span');
    badge.textContent = tool;
    return badge;
  }));
  const action = $('#dialog-action');
  action.replaceChildren();
  if (/^https:\/\//i.test(project.link)) {
    const a = document.createElement('a');
    a.href = project.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'OPEN PROJECT ↗';
    action.append(a);
  }
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
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
  const subhead = document.createElement('small'); subhead.textContent = 'THE DEVELOPER’S GUILD';
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
    <article class="armory-card reveal is-visible"><div class="armory-icon" aria-hidden="true">${escapeHtml(skill.symbol || '✦')}</div>
    <span class="armory-index">LOADOUT // ${String(index + 1).padStart(2, '0')}</span>
    <h3>${escapeHtml(skill.title || '')}</h3><p>${escapeHtml(skill.description || '')}</p>
    <div class="skill-tags">${(skill.items || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div></article>
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

function makeFireflies() {
  const container = $('#fireflies');
  const places = [[7,62],[13,77],[18,46],[25,70],[35,79],[42,59],[52,84],[62,73],[71,55],[79,79],[88,61],[94,74],[23,29],[81,33],[61,18]];
  container.innerHTML = places.map(([x, y], i) => `<span class="firefly" style="left:${x}%;top:${y}%;--delay:-${(i * 1.6).toFixed(1)}s;--speed:${6 + (i % 5) * 1.6}s"></span>`).join('');
}

function setupEffects() {
  const button = $('#effects-toggle');
  const preferenceKey = 'hunters-codex-reduced-effects';
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { if (localStorage.getItem(preferenceKey) !== null) reduced = localStorage.getItem(preferenceKey) === 'true'; } catch (_) { /* Storage might be blocked. */ }
  const apply = () => {
    document.body.classList.toggle('effects-off', reduced);
    button.setAttribute('aria-pressed', String(reduced));
    $('#effects-label').textContent = `Ambience: ${reduced ? 'Off' : 'On'}`;
    button.title = reduced ? 'Enable ambient effects' : 'Disable ambient effects';
  };
  button.addEventListener('click', () => {
    reduced = !reduced;
    apply();
    try { localStorage.setItem(preferenceKey, String(reduced)); } catch (_) { /* Safe fallback. */ }
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
  modalClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

initialize();
